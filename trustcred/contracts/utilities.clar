;; =============================================================================
;; ERROR FIX 3: utilities.clar
;; Fixed int-to-ascii function error
;; =============================================================================

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-input (err u106))

;; FIXED: Buffer utilities without int-to-ascii
(define-read-only (uint-to-buff (value uint))
  ;; Convert uint to a 32-byte buffer representation using available functions
  (sha256 (concat 0x00000000000000000000000000000000 
                 (unwrap-panic (to-consensus-buff? value))))
)

(define-read-only (buff-to-uint (buffer (buff 32)))
  ;; Simple conversion - return a hash-based uint
  (match (slice? buffer u0 u8)
    slice (buff-to-uint-le slice)
    u0
  )
)

;; List management utilities with proper error handling
(define-read-only (contains-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (is-some (index-of haystack needle))
)

;; FIXED: Simplified remove implementation
(define-read-only (remove-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (fold build-list-without-buff haystack { needle: needle, result: (list) })
)

;; Helper function for remove-buff
(define-private (build-list-without-buff 
  (item (buff 32)) 
  (data { needle: (buff 32), result: (list 100 (buff 32)) }))
  (if (is-eq item (get needle data))
    data ;; Skip this item
    (merge data { 
      result: (unwrap-panic (as-max-len? (append (get result data) item) u100)) 
    })
  )
)

;; Uint list utilities
(define-read-only (contains-uint (haystack (list 100 uint)) (needle uint))
  (is-some (index-of haystack needle))
)

(define-read-only (remove-uint (haystack (list 100 uint)) (needle uint))
  (fold build-uint-list-without-needle haystack { needle: needle, result: (list) })
)

;; Helper for remove-uint
(define-private (build-uint-list-without-needle 
  (item uint) 
  (data { needle: uint, result: (list 100 uint) }))
  (if (is-eq item (get needle data))
    data ;; Skip this item
    (merge data { 
      result: (unwrap-panic (as-max-len? (append (get result data) item) u100)) 
    })
  )
)

;; String utilities
(define-read-only (is-empty-string (value (string-utf8 256)))
  (is-eq (len value) u0)
)

(define-read-only (is-valid-string (value (string-utf8 256)))
  (and (> (len value) u0) (< (len value) u257))
)

;; FIXED: Hash utilities without int-to-ascii
(define-read-only (generate-credential-id (issuer principal) (recipient principal) (timestamp uint) (nonce uint))
  ;; Generate a deterministic but unique hash for credential ID
  (sha256 (concat 
    (sha256 (concat (unwrap-panic (principal-destruct? issuer)) 
                   (unwrap-panic (principal-destruct? recipient))))
    (sha256 (concat (unwrap-panic (to-consensus-buff? timestamp)) 
                   (unwrap-panic (to-consensus-buff? nonce))))
  ))
)

(define-read-only (generate-schema-id (creator principal) (name (string-utf8 64)) (timestamp uint))
  ;; Generate a deterministic hash for schema ID
  (sha256 (concat 
    (sha256 (unwrap-panic (principal-destruct? creator)))
    (sha256 (concat (unwrap-panic (to-consensus-buff? name)) 
                   (unwrap-panic (to-consensus-buff? timestamp))))
  ))
)

;; Generate a random-ish hash using available entropy
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
  ;; Assuming ~10 minute block times = 144 blocks per day
  (+ block-height (* days u144))
)

(define-read-only (blocks-from-hours (hours uint))
  ;; Assuming ~10 minute block times = 6 blocks per hour
  (+ block-height (* hours u6))
)

(define-read-only (is-future-timestamp (timestamp uint))
  (> timestamp block-height)
)

;; Validation utilities
(define-read-only (is-valid-buff-32 (buffer (buff 32)))
  ;; Check if buffer is not all zeros
  (not (is-eq buffer 0x0000000000000000000000000000000000000000000000000000000000000000))
)

(define-read-only (is-valid-principal (addr principal))
  ;; Basic validation - check if principal can be destructured
  (is-some (principal-destruct? addr))
)

;; Math utilities
(define-read-only (min-uint (a uint) (b uint))
  (if (< a b) a b)
)

(define-read-only (max-uint (a uint) (b uint))
  (if (> a b) a b)
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
    (> (len name) u0)
    (> (len description) u0)
    (< (len name) u65)
    (< (len description) u257)
  )
)

;; Error handling utilities
(define-read-only (is-ok-response (response (response bool uint)))
  (is-ok response)
)

(define-read-only (is-err-response (response (response bool uint)))
  (is-err response)
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)