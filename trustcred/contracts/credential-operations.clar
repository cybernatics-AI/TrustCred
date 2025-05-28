;; TrustCred: Credential Operations (credential-operations.clar)
;; This contract handles all operations related to credentials including

;; Error codes
(define-constant err-unauthorized (err u102))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u103))
(define-constant err-invalid-input (err u106))
(define-constant err-revoked (err u105))
(define-constant err-expired (err u104))
(define-constant err-transfer-not-allowed (err u107))

;; Issue a new credential
(define-public (issue-credential 
                (credential-id (buff 32))
                (recipient principal)
                (schema-id (buff 32))
                (data-hash (buff 32))
                (metadata-uri (string-utf8 256))
                (expires-at (optional uint)))
  (let ((issuer tx-sender))
    ;; Check if issuer is authorized
    (asserts! (contract-call? .issuer-management is-authorized-issuer issuer) err-unauthorized)
    
    ;; Check if the schema exists
    (asserts! (is-some (contract-call? .digital-credentials get-schema schema-id)) err-not-found)
    
    ;; Check if credential ID is unique
    (asserts! (is-none (contract-call? .digital-credentials get-credential credential-id)) err-already-exists)
    
    ;; Issue the credential directly using the main contract
    (try! (contract-call? .digital-credentials store-credential
                          credential-id
                          issuer
                          recipient
                          schema-id
                          data-hash
                          metadata-uri
                          expires-at))
    
    ;; Log the issuance event
    (try! (contract-call? .event-module log-event u"credential-issued" 
                          credential-id 
                          (some recipient)))
    
    (ok credential-id)
  )
)

;; Revoke a credential
(define-public (revoke-credential (credential-id (buff 32)) (reason (string-utf8 256)))
  (let ((caller tx-sender))
    ;; Get the credential
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential 
        (begin
          ;; Check if caller is the issuer
          (asserts! (is-eq caller (get issuer credential)) err-unauthorized)
          
          ;; Check if credential is not already revoked
          (asserts! (not (get revoked credential)) err-already-exists)
          
          ;; Revoke the credential using try! to handle the response properly
          (try! (contract-call? .digital-credentials revoke-credential credential-id))
          
          ;; Log the revocation event using try! to handle response
          (try! (contract-call? .event-module log-event u"credential-revoked" credential-id none))
          
          ;; Include reason in the event log
          (print { event: "revocation-reason", credential-id: credential-id, reason: reason })
          
          ;; Return success
          (ok true)
        )
      ;; Return error if credential not found - Fixed: return consistent error type
      err-not-found
    )
  )
)

;; Transfer a credential to a new recipient - Simplified version
(define-public (transfer-credential (credential-id (buff 32)) (new-recipient principal))
  (let ((current-owner tx-sender))
    ;; Get the credential
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential 
        (begin
          ;; Check if caller is the current recipient
          (asserts! (is-eq current-owner (get recipient credential)) err-unauthorized)
          
          ;; Check if credential is valid (not revoked, not expired)
          (asserts! (not (get revoked credential)) err-revoked)
          
          (match (get expires-at credential)
            expiry (asserts! (< block-height expiry) err-expired)
            true
          )
          
          ;; Check schema to see if transfer is allowed
          (try! (is-transfer-allowed credential-id))
          
          ;; Create a new credential with updated recipient (simplified approach)
          (try! (contract-call? .digital-credentials store-credential
                                credential-id
                                (get issuer credential)
                                new-recipient
                                (get schema-id credential)
                                (get data-hash credential)
                                (get metadata-uri credential)
                                (get expires-at credential)))
          
          ;; Log the transfer event
          (try! (contract-call? .event-module log-event u"credential-transferred" 
                                credential-id 
                                (some new-recipient)))
          
          (ok true)
        )
      err-not-found
    )
  )
)

;; Update credential metadata (only issuer can do this)
(define-public (update-credential-metadata 
                (credential-id (buff 32))
                (new-metadata-uri (string-utf8 256)))
  (let ((caller tx-sender))
    ;; Get the credential
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential 
        (begin
          ;; Check if caller is the issuer
          (asserts! (is-eq caller (get issuer credential)) err-unauthorized)
          
          ;; Update the metadata by creating a new credential entry
          (try! (contract-call? .digital-credentials store-credential
                                credential-id
                                (get issuer credential)
                                (get recipient credential)
                                (get schema-id credential)
                                (get data-hash credential)
                                new-metadata-uri
                                (get expires-at credential)))
          
          ;; Log the metadata update event
          (try! (contract-call? .event-module log-event u"credential-metadata-updated" 
                                credential-id 
                                none))
          
          (ok true)
        )
      err-not-found
    )
  )
)

;; Helper function to check if transfer is allowed for a credential
(define-read-only (is-transfer-allowed (credential-id (buff 32)))
  ;; In Phase 1, we'll implement a simple version where all credentials
  ;; are transferable. In later phases, this will be enhanced with more
  ;; sophisticated transfer policies based on schema rules.
  (ok true)
)

;; Batch verification of multiple credentials
(define-read-only (verify-credentials (credential-ids (list 20 (buff 32))))
  (let ((results (map is-credential-valid credential-ids)))
    (ok results)
  )
)

;; Check if a credential is valid
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (contract-call? .digital-credentials is-credential-valid credential-id)
)