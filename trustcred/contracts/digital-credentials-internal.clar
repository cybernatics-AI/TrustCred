;; TrustCred: Digital Credentials Internal (digital-credentials-internal.clar)
;; Stage 2: Enhanced with schema support, expiration, metadata, and basic access control

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u103))

;; Enhanced credential storage with schema and metadata
(define-map credentials
  { credential-id: (buff 32) }
  {
    issuer: principal,
    recipient: principal,
    schema-id: (buff 32),
    issued-at: uint,
    expires-at: (optional uint),
    revoked: bool,
    data-hash: (buff 32),
    metadata-uri: (string-utf8 256)
  }
)

;; Track credentials by recipient
(define-map recipient-credentials
  { recipient: principal }
  { credential-ids: (list 50 (buff 32)) }
)

;; Track credentials by issuer
(define-map issuer-credentials
  { issuer: principal }
  { credential-ids: (list 50 (buff 32)) }
)

;; Authorized contracts list
(define-map authorized-contracts
  { contract: principal }
  { authorized: bool }
)

;; Create a credential (enhanced version)
(define-public (create-credential 
                (credential-id (buff 32))
                (issuer principal)
                (recipient principal)
                (schema-id (buff 32))
                (data-hash (buff 32))
                (metadata-uri (string-utf8 256))
                (expires-at (optional uint)))
  (begin
    ;; Basic authorization check
    (asserts! (or (is-eq tx-sender contract-owner) 
                  (is-authorized-contract tx-sender)) err-unauthorized)
    
    ;; Check if credential already exists
    (asserts! (is-none (map-get? credentials { credential-id: credential-id })) err-already-exists)
    
    ;; Store the credential
    (map-set credentials
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
    
    ;; Add to recipient's list
    (unwrap! (add-recipient-credential recipient credential-id) (err u200))
    
    ;; Add to issuer's list
    (unwrap! (add-issuer-credential issuer credential-id) (err u201))
    
    (ok true)
  )
)

;; Revoke a credential
(define-public (revoke-credential (credential-id (buff 32)))
  (begin
    ;; Check authorization
    (asserts! (or (is-eq tx-sender contract-owner) 
                  (is-authorized-contract tx-sender)) err-unauthorized)
    
    ;; Get current credential data
    (match (map-get? credentials { credential-id: credential-id })
      credential-data
        ;; Update the credential to set revoked flag
        (map-set credentials
          { credential-id: credential-id }
          (merge credential-data { revoked: true })
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Update credential recipient
(define-public (update-credential-recipient (credential-id (buff 32)) (new-recipient principal))
  (begin
    ;; Check authorization
    (asserts! (or (is-eq tx-sender contract-owner) 
                  (is-authorized-contract tx-sender)) err-unauthorized)
    
    ;; Get current credential data
    (match (map-get? credentials { credential-id: credential-id })
      credential-data
        (begin
          ;; Remove from old recipient's list
          (unwrap! (remove-recipient-credential (get recipient credential-data) credential-id) (err u202))
          
          ;; Update the credential's recipient
          (map-set credentials
            { credential-id: credential-id }
            (merge credential-data { recipient: new-recipient })
          )
          
          ;; Add to new recipient's list
          (unwrap! (add-recipient-credential new-recipient credential-id) (err u203))
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Add credential to recipient's list (internal helper)
(define-private (add-recipient-credential (recipient principal) (credential-id (buff 32)))
  (match (map-get? recipient-credentials { recipient: recipient })
    existing-data 
      (map-set recipient-credentials
        { recipient: recipient }
        { credential-ids: (unwrap! (as-max-len? 
                                     (append (get credential-ids existing-data) credential-id)
                                     u50)
                                  (err u204)) }
      )
    ;; No existing credentials for this recipient
    (map-set recipient-credentials
      { recipient: recipient }
      { credential-ids: (list credential-id) }
    )
  )
  (ok true)
)

;; Add credential to issuer's list (internal helper)
(define-private (add-issuer-credential (issuer principal) (credential-id (buff 32)))
  (match (map-get? issuer-credentials { issuer: issuer })
    existing-data 
      (map-set issuer-credentials
        { issuer: issuer }
        { credential-ids: (unwrap! (as-max-len? 
                                     (append (get credential-ids existing-data) credential-id)
                                     u50)
                                  (err u205)) }
      )
    ;; No existing credentials for this issuer
    (map-set issuer-credentials
      { issuer: issuer }
      { credential-ids: (list credential-id) }
    )
  )
  (ok true)
)

;; Remove credential from recipient's list (basic implementation)
(define-private (remove-recipient-credential (recipient principal) (credential-id (buff 32)))
  (match (map-get? recipient-credentials { recipient: recipient })
    existing-data 
      ;; For now, just mark as removed by clearing the list (simplified)
      (map-set recipient-credentials
        { recipient: recipient }
        { credential-ids: (filter not-target-credential (get credential-ids existing-data)) }
      )
    (err err-not-found)
  )
  (ok true)
)

;; Helper function for filtering (simplified)
(define-private (not-target-credential (cred-id (buff 32)))
  true ;; Simplified for stage 2
)

;; Get credential data
(define-read-only (get-credential (credential-id (buff 32)))
  (map-get? credentials { credential-id: credential-id })
)

;; Get credentials by recipient
(define-read-only (get-recipient-credentials (recipient principal))
  (map-get? recipient-credentials { recipient: recipient })
)

;; Get credentials by issuer
(define-read-only (get-issuer-credentials (issuer principal))
  (map-get? issuer-credentials { issuer: issuer })
)

;; Check if credential is valid (not revoked and not expired)
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential-data 
      (and 
        (not (get revoked credential-data))
        (match (get expires-at credential-data)
          expiry (< block-height expiry)
          true
        )
      )
    false
  )
)

;; Authorize a contract
(define-public (authorize-contract (contract principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set authorized-contracts { contract: contract } { authorized: true })
    (ok true)
  )
)

;; Check if caller is an authorized contract
(define-read-only (is-authorized-contract (contract principal))
  (default-to false (get authorized (map-get? authorized-contracts { contract: contract })))
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)