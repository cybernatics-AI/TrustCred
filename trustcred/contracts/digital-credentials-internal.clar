;; TrustCred: Digital Credentials Internal (digital-credentials-internal.clar)
;; Basic credential storage and retrieval functionality

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u103))

;; Basic credential storage
(define-map credentials
  { credential-id: (buff 32) }
  {
    issuer: principal,
    recipient: principal,
    issued-at: uint,
    data-hash: (buff 32),
    revoked: bool
  }
)

;; Create a credential (basic version)
(define-public (create-credential 
                (credential-id (buff 32))
                (issuer principal)
                (recipient principal)
                (data-hash (buff 32)))
  (begin
    ;; Check if credential already exists
    (asserts! (is-none (map-get? credentials { credential-id: credential-id })) err-already-exists)
    
    ;; Store the credential
    (map-set credentials
      { credential-id: credential-id }
      {
        issuer: issuer,
        recipient: recipient,
        issued-at: block-height,
        data-hash: data-hash,
        revoked: false
      }
    )
    
    (ok true)
  )
)

;; Get credential data
(define-read-only (get-credential (credential-id (buff 32)))
  (map-get? credentials { credential-id: credential-id })
)

;; Revoke a credential
(define-public (revoke-credential (credential-id (buff 32)))
  (begin
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

;; Check if credential is valid (not revoked)
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential-data (not (get revoked credential-data))
    false
  )
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)