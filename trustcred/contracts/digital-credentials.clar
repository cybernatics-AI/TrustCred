;; TrustCred: Core Module (digital-credentials.clar)
;; This is the core contract that defines the credential data structures
;; Version 0.2.0

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))
(define-constant err-expired (err u104))

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

;; Check if a credential is valid (not expired)
(define-read-only (is-credential-valid (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential (match (get expires-at credential)
                 expiry (< block-height expiry)  ;; Not expired
                 true)                           ;; No expiry date means always valid
    false  ;; Credential not found
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
        data-hash: data-hash,
        metadata-uri: metadata-uri
      }
    )
    
    (ok true)
  )
)

;; Helper function to verify if a credential exists
(define-read-only (credential-exists (credential-id (buff 32)))
  (is-some (map-get? credentials { credential-id: credential-id }))
)

;; Helper function to verify if a schema exists
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
