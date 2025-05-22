;; TrustCred: Enhanced Issuer Management (issuer-management.clar)
;; Version 2 - Added admin system, issuer categories, and detailed information

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))

;; Define data structures

;; Enhanced issuer structure
(define-map authorized-issuers
  { address: principal }
  {
    name: (string-utf8 64),
    description: (string-utf8 256),
    website: (string-utf8 128),
    authorized-at: uint,
    authorized-by: principal,
    status: (string-utf8 16) ;; "active", "suspended", "revoked"
  }
)

;; Issuer categories
(define-map issuer-categories
  { issuer: principal }
  { categories: (list 5 (string-utf8 32)) }
)

;; Admin system
(define-map admins
  { address: principal }
  { added-at: uint, added-by: principal }
)

;; Public functions

;; Add a new authorized issuer (admin/owner only)
(define-public (add-issuer (issuer principal) 
                          (name (string-utf8 64)) 
                          (description (string-utf8 256))
                          (website (string-utf8 128))
                          (categories (list 5 (string-utf8 32))))
  (let ((caller tx-sender))
    ;; Ensure caller is owner or admin
    (asserts! (or (is-eq caller contract-owner) (is-admin caller)) err-unauthorized)
    
    ;; Ensure issuer doesn't already exist
    (asserts! (is-none (map-get? authorized-issuers { address: issuer })) err-already-exists)
    
    ;; Add the issuer
    (map-set authorized-issuers
      { address: issuer }
      {
        name: name,
        description: description,
        website: website,
        authorized-at: block-height,
        authorized-by: caller,
        status: "active"
      }
    )
    
    ;; Set issuer categories
    (map-set issuer-categories
      { issuer: issuer }
      { categories: categories }
    )
    
    ;; Log the event
    (print { event: "issuer-added", issuer: issuer, added-by: caller })
    
    (ok true)
  )
)

;; Remove an issuer (admin/owner only)
(define-public (remove-issuer (issuer principal))
  (let ((caller tx-sender))
    ;; Ensure caller is owner or admin
    (asserts! (or (is-eq caller contract-owner) (is-admin caller)) err-unauthorized)
    
    ;; Ensure issuer exists
    (asserts! (is-some (map-get? authorized-issuers { address: issuer })) err-not-found)
    
    ;; Update issuer status to "revoked"
    (map-set authorized-issuers
      { address: issuer }
      (merge (unwrap-panic (map-get? authorized-issuers { address: issuer }))
             { status: "revoked" })
    )
    
    ;; Log the event
    (print { event: "issuer-removed", issuer: issuer, removed-by: caller })
    
    (ok true)
  )
)

;; Suspend an issuer (admin/owner only)
(define-public (suspend-issuer (issuer principal))
  (let ((caller tx-sender))
    ;; Ensure caller is owner or admin
    (asserts! (or (is-eq caller contract-owner) (is-admin caller)) err-unauthorized)
    
    ;; Ensure issuer exists
    (asserts! (is-some (map-get? authorized-issuers { address: issuer })) err-not-found)
    
    ;; Update issuer status to "suspended"
    (map-set authorized-issuers
      { address: issuer }
      (merge (unwrap-panic (map-get? authorized-issuers { address: issuer }))
             { status: "suspended" })
    )
    
    ;; Log the event
    (print { event: "issuer-suspended", issuer: issuer, suspended-by: caller })
    
    (ok true)
  )
)

;; Reactivate a suspended issuer (admin/owner only)
(define-public (reactivate-issuer (issuer principal))
  (let ((caller tx-sender))
    ;; Ensure caller is owner or admin
    (asserts! (or (is-eq caller contract-owner) (is-admin caller)) err-unauthorized)
    
    ;; Ensure issuer exists
    (asserts! (is-some (map-get? authorized-issuers { address: issuer })) err-not-found)
    
    ;; Get current issuer data
    (let ((issuer-data (unwrap-panic (map-get? authorized-issuers { address: issuer }))))
      ;; Ensure issuer is suspended
      (asserts! (is-eq (get status issuer-data) "suspended") err-unauthorized)
      
      ;; Update issuer status to "active"
      (map-set authorized-issuers
        { address: issuer }
        (merge issuer-data { status: "active" })
      )
      
      ;; Log the event
      (print { event: "issuer-reactivated", issuer: issuer, reactivated-by: caller })
      
      (ok true)
    )
  )
)

;; Add an admin (owner only)
(define-public (add-admin (admin principal))
  (begin
    ;; Ensure caller is owner
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    ;; Ensure admin doesn't already exist
    (asserts! (is-none (map-get? admins { address: admin })) err-already-exists)
    
    ;; Add the admin
    (map-set admins
      { address: admin }
      { added-at: block-height, added-by: tx-sender }
    )
    
    ;; Log the event
    (print { event: "admin-added", admin: admin })
    
    (ok true)
  )
)

;; Remove an admin (owner only)
(define-public (remove-admin (admin principal))
  (begin
    ;; Ensure caller is owner
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    ;; Ensure admin exists
    (asserts! (is-some (map-get? admins { address: admin })) err-not-found)
    
    ;; Remove the admin
    (map-delete admins { address: admin })
    
    ;; Log the event
    (print { event: "admin-removed", admin: admin })
    
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

;; Get issuer categories
(define-read-only (get-issuer-categories (issuer principal))
  (match (map-get? issuer-categories { issuer: issuer })
    data (ok (get categories data))
    (err err-not-found)
  )
)

;; Check if an address is an admin
(define-read-only (is-admin (address principal))
  (is-some (map-get? admins { address: address }))
)

;; Initialize contract (owner only)
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    ;; Add the contract owner as the first admin
    (map-set admins
      { address: contract-owner }
      { added-at: block-height, added-by: contract-owner }
    )
    (ok true)
  )
)