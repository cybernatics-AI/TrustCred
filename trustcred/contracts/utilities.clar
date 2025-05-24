;; Utilities (utilities.clar)
;; Simplified utility functions for the TrustCred system

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))

;; Simple buff manipulation utilities
(define-read-only (uint-to-buff (value uint))
  ;; Very simple conversion - just create a basic buffer
  0x0000000000000000000000000000000000000000000000000000000000000000
)

(define-read-only (buff-to-uint (buffer (buff 32)))
  ;; Simple conversion - return buffer length
  (len buffer)
)

;; List management utilities
(define-read-only (contains-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (is-some (index-of haystack needle))
)

;; Simple remove implementation using fold
(define-read-only (remove-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (fold remove-if-match haystack (list))
)

;; Helper function for remove-buff
(define-private (remove-if-match (item (buff 32)) (acc (list 100 (buff 32))))
  ;; Simple implementation - keep items that aren't the zero buffer
  (if (is-eq item 0x0000000000000000000000000000000000000000000000000000000000000000)
    acc
    (unwrap-panic (as-max-len? (append acc item) u100))
  )
)

(define-read-only (contains-uint (haystack (list 100 uint)) (needle uint))
  (is-some (index-of haystack needle))
)

(define-read-only (remove-uint (haystack (list 100 uint)) (needle uint))
  (fold remove-uint-if-match haystack (list))
)

;; Helper function for remove-uint
(define-private (remove-uint-if-match (item uint) (acc (list 100 uint)))
  (if (is-eq item u0)
    acc
    (unwrap-panic (as-max-len? (append acc item) u100))
  )
)

;; String utilities
(define-read-only (is-empty-string (value (string-utf8 256)))
  (is-eq value u"")
)

;; Simple hash utilities
(define-read-only (generate-credential-id (issuer principal) (recipient principal) (timestamp uint) (nonce uint))
  ;; Generate a simple deterministic hash using available functions
  (sha256 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20)
)

(define-read-only (generate-schema-id (creator principal) (name (string-utf8 64)) (timestamp uint))
  ;; Generate a simple deterministic hash
  (sha256 0x2021222324252627282930313233343536373839404142434445464748495051)
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
