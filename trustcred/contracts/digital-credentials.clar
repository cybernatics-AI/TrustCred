;; TrustCred: Core Module (digital-credentials.clar)
;; This is the core contract that defines the basic credential structure
;; Version 0.1.0

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))

;; Define data structures

;; Credential structure
(define-map credentials
  { credential-id: (buff 32) }
  {
    issuer: principal,
    recipient: principal,
    issued-at: uint,
    data-hash: (buff 32)
  }
)

;; Public functions

;; Get a credential
(define-read-only (get-credential (credential-id (buff 32)))
  (map-get? credentials { credential-id: credential-id })
)

;; Internal function to store credential data (called by credential-operations contract)
;; This is a simplified version that only handles the bare minimum
(define-public (store-credential (credential-id (buff 32)) 
                               (issuer principal)
                               (recipient principal)
                               (data-hash (buff 32)))
  (begin
    ;; In a full implementation, we would check that tx-sender is the credential-operations contract
    ;; For this simple version, we'll allow any call
    
    (asserts! (is-none (map-get? credentials { credential-id: credential-id })) err-already-exists)
    
    (map-set credentials
      { credential-id: credential-id }
      {
        issuer: issuer,
        recipient: recipient,
        issued-at: block-height,
        data-hash: data-hash
      }
    )
    
    (ok true)
  )
)

;; Helper function to verify if a credential exists
(define-read-only (credential-exists (credential-id (buff 32)))
  (is-some (map-get? credentials { credential-id: credential-id }))
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)