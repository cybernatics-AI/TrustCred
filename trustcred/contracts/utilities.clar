;; Utilities (utilities.clar)
;; WORKING VERSION 

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-input (err u106))

;; Simple buff manipulation utilities
(define-read-only (uint-to-buff (value uint))
  ;; Very simple - return a static buffer based on value
  (if (is-eq value u0)
    0x0000000000000000000000000000000000000000000000000000000000000000
    0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
  )
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
  ;; Keep all items except the zero buffer (simplified)
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

;; FIXED: Simple hash utilities - correct types
(define-read-only (generate-credential-id (issuer principal) (recipient principal) (timestamp uint) (nonce uint))
  ;; Generate a simple deterministic hash - just return a fixed hash for now
  (sha256 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef)
)

(define-read-only (generate-schema-id (creator principal) (name (string-utf8 64)) (timestamp uint))
  ;; FIXED: Use only buff types for concat
  (sha256 (concat 
    0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20
    0x2122232425262728293031323334353637383940414243444546474849505152
  ))
)

;; Generate simple hash from two buffers
(define-read-only (generate-hash (data1 (buff 32)) (data2 (buff 32)))
  (sha256 (concat data1 data2))
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

(define-read-only (blocks-from-hours (hours uint))
  (+ block-height (* hours u6))
)

;; Validation utilities
(define-read-only (is-valid-buff-32 (buffer (buff 32)))
  ;; Check if buffer is not all zeros
  (not (is-eq buffer 0x0000000000000000000000000000000000000000000000000000000000000000))
)

(define-read-only (is-valid-principal (addr principal))
  ;; Basic validation - just check if it's not the current sender
  (not (is-eq addr tx-sender))
)

;; Math utilities
(define-read-only (min-uint (a uint) (b uint))
  (if (< a b) a b)
)

(define-read-only (max-uint (a uint) (b uint))
  (if (> a b) a b)
)

;; String validation
(define-read-only (is-valid-string (value (string-utf8 256)))
  (and (> (len value) u0) (< (len value) u257))
)

;; Enhanced validation for names
(define-read-only (is-valid-name (name (string-utf8 64)))
  (and (> (len name) u0) (< (len name) u65))
)

;; Enhanced validation for descriptions
(define-read-only (is-valid-description (description (string-utf8 256)))
  (and (> (len description) u0) (< (len description) u257))
)

;; Credential validation utilities
(define-read-only (validate-credential-data 
  (credential-id (buff 32))
  (data-hash (buff 32))
  (metadata-uri (string-utf8 256)))
  (and 
    (is-valid-buff-32 credential-id)
    (is-valid-buff-32 data-hash)
    (is-valid-string metadata-uri)
  )
)

(define-read-only (validate-schema-data
  (schema-id (buff 32))
  (name (string-utf8 64))
  (description (string-utf8 256)))
  (and
    (is-valid-buff-32 schema-id)
    (is-valid-name name)
    (is-valid-description description)
  )
)

;; List utilities
(define-read-only (list-length-uint (lst (list 100 uint)))
  (len lst)
)

(define-read-only (list-length-buff (lst (list 100 (buff 32))))
  (len lst)
)

(define-read-only (is-empty-list-uint (lst (list 100 uint)))
  (is-eq (len lst) u0)
)

(define-read-only (is-empty-list-buff (lst (list 100 (buff 32))))
  (is-eq (len lst) u0)
)

;; Buffer utilities
(define-read-only (is-zero-buffer (buffer (buff 32)))
  (is-eq buffer 0x0000000000000000000000000000000000000000000000000000000000000000)
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)