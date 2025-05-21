;; TrustCred: Core Module (digital-credentials.clar)
;; This is the core contract that handles the primary data structures and functionality
;; for the TrustCred digital credentials system.
;; Version 1.0.0

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))
(define-constant err-expired (err u104))
(define-constant err-revoked (err u105))
(define-constant err-invalid-input (err u106))

;; Define data structures

;; Credential structure
(define-map credentials
  { credential-id: (buff 32) }
  {
    issuer: principal,
    recipient: principal,
    schema-id: (buff 32),
    issued-at: uint,
    expires-at: (optional uint),
    revoked: bool,
    revoked-at: (optional uint),
    data-hash: (buff 32),
    metadata-uri: (string-utf8 256)
  }
)

;; Schema structure for defining credential types
(define-map credential-schemas
  { schema-id: (buff 32) }
  {
    name: (string-utf8 64),
    description: (string-utf8 256),
    creator: principal,
    created-at: uint,
    fields: (list 20 (string-utf8 64)),
    version: (string-utf8 16)
  }
)

;; Public functions

;; Get a credential
(define-read-only (get-credential (credential-id (buff 32)))
  (map-get? credentials { credential-id: credential-id })
)

;; Get a credential schema
(define-read-only (get-schema (schema-id (buff 32)))
  (map-get? credential-schemas { schema-id: schema-id })
)

;; Check if a credential is valid (not expired and not revoked)
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential (and 
                 (not (get revoked credential))
                 (match (get expires-at credential)
                   expiry (< block-height expiry)
                   true
                 )
               )
    false
  )
)

;; Internal function to store credential schema (called by credential-operations contract)
(define-public (store-schema (schema-id (buff 32)) 
                           (name (string-utf8 64)) 
                           (description (string-utf8 256))
                           (creator principal)
                           (fields (list 20 (string-utf8 64)))
                           (version (string-utf8 16)))
  (begin
    ;; In a full implementation, we would check that tx-sender is the credential-operations contract
    ;; For this simplified version, we'll allow any call
    
    (asserts! (is-none (map-get? credential-schemas { schema-id: schema-id })) err-already-exists)
    
    (map-set credential-schemas
      { schema-id: schema-id }
      {
        name: name,
        description: description,
        creator: creator,
        created-at: block-height,
        fields: fields,
        version: version
      }
    )
    
    (ok true)
  )
)

;; Internal function to store credential data (called by credential-operations contract)
(define-public (store-credential (credential-id (buff 32)) 
                               (issuer principal)
                               (recipient principal)
                               (schema-id (buff 32))
                               (data-hash (buff 32))
                               (metadata-uri (string-utf8 256))
                               (expires-at (optional uint)))
  (begin
    ;; In a full implementation, we would check that tx-sender is the credential-operations contract
    
    (asserts! (is-none (map-get? credentials { credential-id: credential-id })) err-already-exists)
    (asserts! (is-some (map-get? credential-schemas { schema-id: schema-id })) err-not-found)
    
    (map-set credentials
      { credential-id: credential-id }
      {
        issuer: issuer,
        recipient: recipient,
        schema-id: schema-id,
        issued-at: block-height,
        expires-at: expires-at,
        revoked: false,
        revoked-at: none,
        data-hash: data-hash,
        metadata-uri: metadata-uri
      }
    )
    
    (ok true)
  )
)

;; Revoke a credential
(define-public (revoke-credential (credential-id (buff 32)))
  (let ((caller tx-sender))
    (match (map-get? credentials { credential-id: credential-id })
      credential 
        (begin
          ;; Only the credential-operations contract or the issuer can revoke
          ;; In a full implementation, we would check caller is authorized
          ;; For this simplified version, we'll just check if caller is the issuer
          (asserts! (is-eq (get issuer credential) caller) err-unauthorized)
          
          ;; Update credential status
          (map-set credentials
            { credential-id: credential-id }
            (merge credential { 
              revoked: true,
              revoked-at: (some block-height)
            })
          )
          
          ;; Call event module or other contracts would happen here
          (ok true)
        )
      (err err-not-found)
    )
  )
)

;; Check if credential is revoked
(define-read-only (is-credential-revoked (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential (get revoked credential)
    false  ;; Credential not found, consider not revoked
  )
)

;; Get credential verification details
(define-read-only (get-verification-details (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential
      (ok {
        issuer: (get issuer credential),
        schema-id: (get schema-id credential), 
        issued-at: (get issued-at credential),
        expires-at: (get expires-at credential),
        revoked: (get revoked credential),
        revoked-at: (get revoked-at credential),
        valid: (and 
                (not (get revoked credential))
                (match (get expires-at credential)
                  expiry (< block-height expiry)
                  true)
               )
      })
    (err err-not-found)
  )
)

;; Helper functions

;; Verify if a credential exists
(define-read-only (credential-exists (credential-id (buff 32)))
  (is-some (map-get? credentials { credential-id: credential-id }))
)

;; Verify if a schema exists
(define-read-only (schema-exists (schema-id (buff 32)))
  (is-some (map-get? credential-schemas { schema-id: schema-id }))
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)