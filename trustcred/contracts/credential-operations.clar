;; Credential Operations (credential-operations.clar)
;; This contract handles operations related to credentials including
;; issuance, revocation, and updates.

;; Error codes
(define-constant err-unauthorized (err u102))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u103))
(define-constant err-invalid-input (err u106))
(define-constant err-revoked (err u105))
(define-constant err-expired (err u104))

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
    
    ;; Issue the credential
    (try! (contract-call? .digital-credentials-internal create-credential 
                          credential-id
                          issuer
                          recipient
                          schema-id
                          data-hash
                          metadata-uri
                          expires-at))
    
    ;; Add credential to recipient's list
    (try! (contract-call? .digital-credentials-internal add-recipient-credential recipient credential-id))
    
    ;; Add credential to issuer's list
    (try! (contract-call? .digital-credentials-internal add-issuer-credential issuer credential-id))
    
    ;; Log the issuance event
    (try! (contract-call? .event-module log-event "credential-issued" 
                          credential-id 
                          issuer 
                          recipient))
    
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
          
          ;; Revoke the credential
          (try! (contract-call? .digital-credentials-internal revoke-credential credential-id))
          
          ;; Log the revocation event
          (try! (contract-call? .event-module log-event "credential-revoked" 
                                credential-id 
                                caller 
                                none))
          
          ;; Include reason in the event log
          (print { event: "revocation-reason", credential-id: credential-id, reason: reason })
          
          (ok true)
        )
      (err err-not-found)
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
          
          ;; Update the metadata
          (try! (contract-call? .digital-credentials-internal update-credential-metadata 
                                credential-id 
                                new-metadata-uri))
          
          ;; Log the metadata update event
          (try! (contract-call? .event-module log-event "credential-metadata-updated" 
                                credential-id 
                                caller 
                                none))
          
          (ok true)
        )
      (err err-not-found)
    )
  )
)

;; Check if a credential is valid
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (contract-call? .digital-credentials is-credential-valid credential-id)
)