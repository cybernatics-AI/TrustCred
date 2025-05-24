;; Utilities (utilities.clar)
;; Complete utility functions with advanced list management for the TrustCred system

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))

;; Buff manipulation utilities - Fixed to use correct Clarity functions
(define-read-only (uint-to-buff (value uint))
  (if (<= value u255)
    (unwrap-panic (to-uint-buff value))
    0x00000000000000000000000000000000
  )
)

(define-read-only (buff-to-uint (buffer (buff 32)))
  (match (from-uint-buff buffer)
    success success
    u0
  )
)

;; List management utilities - Fixed filter syntax
(define-read-only (contains-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (is-some (index-of haystack needle))
)

(define-read-only (remove-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (filter is-not-needle haystack)
)

;; Helper function for remove-buff
(define-private (is-not-needle (item (buff 32)) (needle (buff 32)))
  (not (is-eq item needle))
)

(define-read-only (contains-uint (haystack (list 100 uint)) (needle uint))
  (is-some (index-of haystack needle))
)

(define-read-only (remove-uint (haystack (list 100 uint)) (needle uint))
  (filter is-not-uint-needle haystack)
)

;; Helper function for remove-uint
(define-private (is-not-uint-needle (item uint) (needle uint))
  (not (is-eq item needle))
)

;; String utilities
(define-read-only (is-empty-string (value (string-utf8 256)))
  (is-eq value u"")
)

;; Hash utilities - Fixed to use proper buff conversion
(define-read-only (generate-credential-id (issuer principal) (recipient principal) (timestamp uint) (nonce uint))
  (let ((issuer-buff (unwrap-panic (principal-to-buff issuer)))
        (recipient-buff (unwrap-panic (principal-to-buff recipient)))
        (timestamp-buff (uint-to-buff timestamp))
        (nonce-buff (uint-to-buff nonce)))
    (sha256 (concat (concat (concat issuer-buff recipient-buff) timestamp-buff) nonce-buff))
  )
)

;; Helper function to convert principal to buff
(define-private (principal-to-buff (p principal))
  (ok (unwrap-panic (to-consensus-buff? p)))
)

(define-read-only (generate-schema-id (creator principal) (name (string-utf8 64)) (timestamp uint))
  (let ((creator-buff (unwrap-panic (principal-to-buff creator)))
        (name-buff (unwrap-panic (to-consensus-buff? name)))
        (timestamp-buff (uint-to-buff timestamp)))
    (sha256 (concat (concat creator-buff name-buff) timestamp-buff))
  )
)

;; Time-related utilities
(define-read-only (is-expired (expiry (optional uint)))
  (match expiry
    timestamp (>= block-height timestamp)
    false
  )
)

(define-read-only (blocks-from-days (days uint))
  (+ block-height (* days u144))
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)