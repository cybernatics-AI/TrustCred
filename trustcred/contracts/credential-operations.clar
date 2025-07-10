;; credential-operations.clar
;; Fixed contract reference error

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
    ;; Validate inputs
    (asserts! (> (len data-hash) u0) err-invalid-input)
    (asserts! (> (len metadata-uri) u0) err-invalid-input)
    
    ;; Check if issuer is authorized
    (asserts! (contract-call? .issuer-management is-authorized-issuer issuer) err-unauthorized)
    
    ;; Check if the schema exists
    (asserts! (is-some (contract-call? .digital-credentials get-schema schema-id)) err-not-found)
    
    ;; Check if credential ID is unique (for new issuance)
    (asserts! (is-none (contract-call? .digital-credentials get-credential credential-id)) err-already-exists)
    
    ;; Validate expiration date if provided
    (match expires-at
      expiry (asserts! (> expiry block-height) err-expired)
      true
    )
    
    ;; Issue the credential
    (try! (contract-call? .digital-credentials store-credential
                          credential-id
                          issuer
                          recipient
                          schema-id
                          data-hash
                          metadata-uri
                          expires-at))
    
    ;; FIXED: Use print instead of contract call for event logging to avoid resolution error
    (print { 
      event: "credential-issued",
      credential-id: credential-id,
      recipient: recipient,
      issuer: issuer
    })
    
    (ok credential-id)
  )
)

;; Revoke a credential
(define-public (revoke-credential (credential-id (buff 32)) (reason (string-utf8 256)))
  (let ((caller tx-sender))
    ;; Validate input
    (asserts! (> (len reason) u0) err-invalid-input)
    
    ;; Get the credential
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential 
        (begin
          ;; Check if caller is the issuer
          (asserts! (is-eq caller (get issuer credential)) err-unauthorized)
          
          ;; Check if credential is not already revoked
          (asserts! (not (get revoked credential)) err-already-exists)
          
          ;; Revoke the credential
          (try! (contract-call? .digital-credentials revoke-credential credential-id))
          
          ;; FIXED: Use print instead of contract call for event logging
          (print { 
            event: "credential-revoked",
            credential-id: credential-id,
            reason: reason
          })
          
          (ok true)
        )
      err-not-found
    )
  )
)

;; Transfer a credential to a new recipient
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
          
          ;; Check expiration
          (match (get expires-at credential)
            expiry (asserts! (< block-height expiry) err-expired)
            true
          )
          
          ;; Check if transfer is allowed
          (asserts! (is-ok (is-transfer-allowed credential-id)) err-transfer-not-allowed)
          
          ;; Update credential with new recipient
          (try! (contract-call? .digital-credentials store-credential
                                credential-id
                                (get issuer credential)
                                new-recipient
                                (get schema-id credential)
                                (get data-hash credential)
                                (get metadata-uri credential)
                                (get expires-at credential)))
          
          ;; FIXED: Use print instead of contract call for event logging
          (print { 
            event: "credential-transferred",
            credential-id: credential-id,
            from: current-owner,
            to: new-recipient
          })
          
          (ok true)
        )
      err-not-found
    )
  )
)

;; Update credential metadata
(define-public (update-credential-metadata 
                (credential-id (buff 32))
                (new-metadata-uri (string-utf8 256)))
  (let ((caller tx-sender))
    ;; Validate input
    (asserts! (> (len new-metadata-uri) u0) err-invalid-input)
    
    ;; Get the credential
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential 
        (begin
          ;; Check if caller is the issuer
          (asserts! (is-eq caller (get issuer credential)) err-unauthorized)
          
          ;; Update the metadata
          (try! (contract-call? .digital-credentials store-credential
                                credential-id
                                (get issuer credential)
                                (get recipient credential)
                                (get schema-id credential)
                                (get data-hash credential)
                                new-metadata-uri
                                (get expires-at credential)))
          
          ;; FIXED: Use print instead of contract call for event logging
          (print { 
            event: "credential-metadata-updated",
            credential-id: credential-id,
            new-metadata-uri: new-metadata-uri
          })
          
          (ok true)
        )
      err-not-found
    )
  )
)

;; Helper function to check if transfer is allowed for a credential
(define-read-only (is-transfer-allowed (credential-id (buff 32)))
  (ok true)
)

;; Batch verification of multiple credentials
(define-read-only (verify-credentials (credential-ids (list 20 (buff 32))))
  (let ((results (map verify-single-credential credential-ids)))
    (ok results)
  )
)

;; Helper function for single credential verification
(define-read-only (verify-single-credential (credential-id (buff 32)))
  (contract-call? .digital-credentials is-credential-valid credential-id)
)

;; Check if a credential is valid
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (contract-call? .digital-credentials is-credential-valid credential-id)
)