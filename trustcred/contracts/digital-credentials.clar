;; digital-credentials.clar
;; Core Module - Fixed version with proper error handling

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

;; FIXED: Store credential schema - Added proper validation
(define-public (store-schema (schema-id (buff 32)) 
                           (name (string-utf8 64)) 
                           (description (string-utf8 256))
                           (creator principal)
                           (fields (list 20 (string-utf8 64)))
                           (version (string-utf8 16)))
  (begin
    ;; Validate inputs
    (asserts! (> (len name) u0) err-invalid-input)
    (asserts! (> (len description) u0) err-invalid-input)
    (asserts! (> (len version) u0) err-invalid-input)
    (asserts! (> (len fields) u0) err-invalid-input)
    
    ;; Check schema doesn't already exist
    (asserts! (is-none (map-get? credential-schemas { schema-id: schema-id })) err-already-exists)
    
    ;; Store the schema
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

;; FIXED: Store credential - Improved validation and logic
(define-public (store-credential (credential-id (buff 32)) 
                               (issuer principal)
                               (recipient principal)
                               (schema-id (buff 32))
                               (data-hash (buff 32))
                               (metadata-uri (string-utf8 256))
                               (expires-at (optional uint)))
  (begin
    ;; Validate inputs
    (asserts! (> (len data-hash) u0) err-invalid-input)
    (asserts! (> (len metadata-uri) u0) err-invalid-input)
    
    ;; Check if schema exists first
    (asserts! (is-some (map-get? credential-schemas { schema-id: schema-id })) err-not-found)
    
    ;; For updates, allow overwriting; for new credentials, check uniqueness
    ;; This allows both new issuance and updates to work properly
    (let ((existing-credential (map-get? credentials { credential-id: credential-id })))
      (match existing-credential
        existing-data
          ;; If credential exists, this is an update - preserve some original data
          (map-set credentials
            { credential-id: credential-id }
            {
              issuer: issuer,
              recipient: recipient,
              schema-id: schema-id,
              issued-at: (get issued-at existing-data), ;; Preserve original issue time
              expires-at: expires-at,
              revoked: (get revoked existing-data), ;; Preserve revoked status
              revoked-at: (get revoked-at existing-data), ;; Preserve revoked time
              data-hash: data-hash,
              metadata-uri: metadata-uri
            }
          )
        ;; New credential
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
      )
    )
    
    (ok true)
  )
)

;; FIXED: Revoke a credential - Better error handling
(define-public (revoke-credential (credential-id (buff 32)))
  (begin
    ;; Check if credential exists
    (asserts! (is-some (map-get? credentials { credential-id: credential-id })) err-not-found)
    
    ;; Get credential data
    (let ((credential (unwrap! (map-get? credentials { credential-id: credential-id }) err-not-found)))
      ;; Check if already revoked
      (asserts! (not (get revoked credential)) err-already-exists)
      
      ;; Update credential to revoked status
      (map-set credentials
        { credential-id: credential-id }
        (merge credential {
          revoked: true,
          revoked-at: (some block-height)
        })
      )
      
      (ok true)
    )
  )
)

;; Check if credential is revoked
(define-read-only (is-credential-revoked (credential-id (buff 32)))
  (match (map-get? credentials { credential-id: credential-id })
    credential (get revoked credential)
    false
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
    err-not-found
  )
)

;; Helper functions
(define-read-only (credential-exists (credential-id (buff 32)))
  (is-some (map-get? credentials { credential-id: credential-id }))
)

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