;; Utilities (utilities.clar)
;; Enhanced utility functions with list management for the TrustCred system

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))

;; Buffer manipulation utilities
(define-read-only (uint-to-buff (value uint))
  (unwrap-panic (to-consensus-buff? value))
)

(define-read-only (buff-to-uint (buffer (buff 32)))
  (match (from-consensus-buff? uint buffer)
    success success
    u0
  )
)

;; List management utilities
(define-read-only (contains-buff (haystack (list 50 (buff 32))) (needle (buff 32)))
  (is-some (index-of haystack needle))
)

(define-read-only (contains-uint (haystack (list 50 uint)) (needle uint))
  (is-some (index-of haystack needle))
)

;; String utilities
(define-read-only (is-empty-string (value (string-utf8 256)))
  (is-eq value "")
)

;; Enhanced hash utilities
(define-read-only (generate-credential-id (issuer principal) (recipient principal) (timestamp uint) (nonce uint))
  (sha256 (concat (concat (concat 
    (unwrap-panic (to-consensus-buff? issuer))
    (unwrap-panic (to-consensus-buff? recipient)))
    (uint-to-buff timestamp))
    (uint-to-buff nonce)))
)

(define-read-only (generate-schema-id (creator principal) (name (string-utf8 64)) (timestamp uint))
  (sha256 (concat (concat 
    (unwrap-panic (to-consensus-buff? creator))
    (unwrap-panic (to-consensus-buff? name)))
    (uint-to-buff timestamp)))
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

;; TrustCred: Event Module (event-module.clar) - Stage 2
;; Enhanced event logging with subject tracking and authorization

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))

;; Define data structures
(define-map events
  { event-id: uint }
  {
    event-type: (string-utf8 32),
    subject-id: (buff 32),
    actor: principal,
    target: (optional principal),
    timestamp: uint,
    block-height: uint
  }
)

;; Event counter
(define-data-var event-counter uint u0)

;; Index of events by subject
(define-map subject-events
  { subject-id: (buff 32) }
  { event-ids: (list 50 uint) }
)

;; Public functions
(define-public (log-event (event-type (string-utf8 32)) 
                         (subject-id (buff 32))
                         (target (optional principal)))
  (let ((caller tx-sender)
        (event-id (+ (var-get event-counter) u1)))
    
    ;; Basic authorization check
    (asserts! (is-authorized-caller caller) err-unauthorized)
    
    ;; Increment event counter
    (var-set event-counter event-id)
    
    ;; Store the event
    (map-set events
      { event-id: event-id }
      {
        event-type: event-type,
        subject-id: subject-id,
        actor: caller,
        target: target,
        timestamp: block-height,
        block-height: block-height
      }
    )
    
    ;; Add to subject index
    (match (map-get? subject-events { subject-id: subject-id })
      existing-data 
        (map-set subject-events
          { subject-id: subject-id }
          { event-ids: (unwrap! (as-max-len? 
                                  (append (get event-ids existing-data) event-id)
                                  u50)
                               (err u108)) }
        )
      (map-set subject-events
        { subject-id: subject-id }
        { event-ids: (list event-id) }
      )
    )
    
    (ok event-id)
  )
)

;; Read-only functions
(define-read-only (get-event (event-id uint))
  (map-get? events { event-id: event-id })
)

(define-read-only (get-subject-events (subject-id (buff 32)))
  (match (map-get? subject-events { subject-id: subject-id })
    data (ok (get event-ids data))
    (ok (list))
  )
)

(define-read-only (get-event-count)
  (var-get event-counter)
)

;; Basic authorization function
(define-read-only (is-authorized-caller (caller principal))
  (or
    (is-eq caller contract-owner)
    (is-contract caller)
  )
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set event-counter u0)
    (ok true)
  )
)