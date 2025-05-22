;; TrustCred: Basic Issuer Management (issuer-management.clar)
;; MVP version - Basic issuer authorization and management

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))

;; Define data structures

;; Basic issuer structure
(define-map authorized-issuers
  { address: principal }
  {
    name: (string-utf8 64),
    authorized-at: uint,
    authorized-by: principal,
    status: (string-utf8 16) ;; "active", "inactive"
  }
)

;; Public functions

;; Add a new authorized issuer (owner only)
(define-public (add-issuer (issuer principal) (name (string-utf8 64)))
  (begin
    ;; Ensure caller is owner
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    ;; Ensure issuer doesn't already exist
    (asserts! (is-none (map-get? authorized-issuers { address: issuer })) err-already-exists)
    
    ;; Add the issuer
    (map-set authorized-issuers
      { address: issuer }
      {
        name: name,
        authorized-at: block-height,
        authorized-by: tx-sender,
        status: "active"
      }
    )
    
    ;; Log the event
    (print { event: "issuer-added", issuer: issuer })
    
    (ok true)
  )
)

;; Remove an issuer (owner only)
(define-public (remove-issuer (issuer principal))
  (begin
    ;; Ensure caller is owner
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    ;; Ensure issuer exists
    (asserts! (is-some (map-get? authorized-issuers { address: issuer })) err-not-found)
    
    ;; Update issuer status to "inactive"
    (map-set authorized-issuers
      { address: issuer }
      (merge (unwrap-panic (map-get? authorized-issuers { address: issuer }))
             { status: "inactive" })
    )
    
    ;; Log the event
    (print { event: "issuer-removed", issuer: issuer })
    
    (ok true)
  )
)

;; Read-only functions

;; Check if an address is an authorized issuer
(define-read-only (is-authorized-issuer (address principal))
  (match (map-get? authorized-issuers { address: address })
    issuer-data (is-eq (get status issuer-data) "active")
    false
  )
)

;; Get issuer information
(define-read-only (get-issuer-info (issuer principal))
  (map-get? authorized-issuers { address: issuer })
)