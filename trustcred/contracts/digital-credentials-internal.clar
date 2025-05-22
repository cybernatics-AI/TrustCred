;; TrustCred: Digital Credentials Internal (digital-credentials-internal.clar)
;; Stage 3: Complete implementation with advanced access control and utility integration

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u103))

;; These functions are internal and should only be called by other TrustCred contracts

;; Create a credential (internal)
(define-public (create-credential 
                (credential-id (buff 32))
                (issuer principal)
                (recipient principal)
                (schema-id (buff 32))
                (data-hash (buff 32))
                (metadata-uri (string-utf8 256))
                (expires-at (optional uint)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Store the credential
    (map-set .digital-credentials credentials
      { credential-id: credential-id }
      {
        issuer: issuer,
        recipient: recipient,
        schema-id: schema-id,
        issued-at: block-height,
        expires-at: expires-at,
        revoked: false,
        data-hash: data-hash,
        metadata-uri: metadata-uri
      }
    )
    
    (ok true)
  )
)

;; Revoke a credential (internal)
(define-public (revoke-credential (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Get current credential data
    (match (map-get? .digital-credentials credentials { credential-id: credential-id })
      credential-data
        ;; Update the credential to set revoked flag
        (map-set .digital-credentials credentials
          { credential-id: credential-id }
          (merge credential-data { revoked: true })
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Update credential recipient (internal)
(define-public (update-credential-recipient (credential-id (buff 32)) (new-recipient principal))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Get current credential data
    (match (map-get? .digital-credentials credentials { credential-id: credential-id })
      credential-data
        ;; Update the credential's recipient
        (map-set .digital-credentials credentials
          { credential-id: credential-id }
          (merge credential-data { recipient: new-recipient })
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Update credential metadata (internal)
(define-public (update-credential-metadata (credential-id (buff 32)) (new-metadata-uri (string-utf8 256)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Get current credential data
    (match (map-get? .digital-credentials credentials { credential-id: credential-id })
      credential-data
        ;; Update the credential's metadata URI
        (map-set .digital-credentials credentials
          { credential-id: credential-id }
          (merge credential-data { metadata-uri: new-metadata-uri })
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Add credential to recipient's list (internal)
(define-public (add-recipient-credential (recipient principal) (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Add credential to recipient's list
    (match (map-get? .digital-credentials recipient-credentials { recipient: recipient })
      existing-data 
        (map-set .digital-credentials recipient-credentials
          { recipient: recipient }
          { credential-ids: (unwrap! (as-max-len? 
                                       (append (get credential-ids existing-data) credential-id)
                                       u100)
                                    (err u108)) }
        )
      ;; No existing credentials for this recipient
      (map-set .digital-credentials recipient-credentials
        { recipient: recipient }
        { credential-ids: (list credential-id) }
      )
    )
    
    (ok true)
  )
)

;; Remove credential from recipient's list (internal)
(define-public (remove-recipient-credential (recipient principal) (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Remove credential from recipient's list
    (match (map-get? .digital-credentials recipient-credentials { recipient: recipient })
      existing-data 
        (let ((updated-list (contract-call? .utilities remove-buff 
                                          (get credential-ids existing-data) 
                                          credential-id)))
          (map-set .digital-credentials recipient-credentials
            { recipient: recipient }
            { credential-ids: updated-list }
          )
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Add credential to issuer's list (internal)
(define-public (add-issuer-credential (issuer principal) (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Add credential to issuer's list
    (match (map-get? .digital-credentials issuer-credentials { issuer: issuer })
      existing-data 
        (map-set .digital-credentials issuer-credentials
          { issuer: issuer }
          { credential-ids: (unwrap! (as-max-len? 
                                       (append (get credential-ids existing-data) credential-id)
                                       u100)
                                    (err u108)) }
        )
      ;; No existing credentials for this issuer
      (map-set .digital-credentials issuer-credentials
        { issuer: issuer }
        { credential-ids: (list credential-id) }
      )
    )
    
    (ok true)
  )
)

;; Helper function to check if caller is an authorized contract
(define-read-only (is-authorized-contract (contract principal))
  (or
    (is-eq contract (as-contract tx-sender))
    (is-eq contract (as-contract .digital-credentials))
    (is-eq contract (as-contract .credential-operations))
    (is-eq contract (as-contract .issuer-management))
    (is-eq contract .digital-credentials)
    (is-eq contract .credential-operations)
    (is-eq contract .issuer-management)
  )
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)