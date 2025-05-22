;; Utilities (utilities.clar)
;; Complete utility functions with advanced list management for the TrustCred system

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))

;; Buff manipulation utilities
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
(define-read-only (contains-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (is-some (index-of haystack needle))
)

(define-read-only (remove-buff (haystack (list 100 (buff 32))) (needle (buff 32)))
  (filter remove-predicate haystack)
  (where (remove-predicate (item (buff 32)))
    (not (is-eq item needle))
  )
)

(define-read-only (contains-uint (haystack (list 100 uint)) (needle uint))
  (is-some (index-of haystack needle))
)

(define-read-only (remove-uint (haystack (list 100 uint)) (needle uint))
  (filter remove-predicate haystack)
  (where (remove-predicate (item uint))
    (not (is-eq item needle))
  )
)

;; String utilities
(define-read-only (is-empty-string (value (string-utf8 256)))
  (is-eq value "")
)

;; Hash utilities
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

;; TrustCred: Event Module (event-module.clar) - Stage 3
;; Complete event logging system with comprehensive indexing and error handling

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
  { event-ids: (list 100 uint) }
)

;; Index of events by actor
(define-map actor-events
  { actor: principal }
  { event-ids: (list 100 uint) }
)

;; Public functions
(define-public (log-event (event-type (string-utf8 32)) 
                         (subject-id (buff 32))
                         (target (optional principal)))
  (let ((caller tx-sender)
        (event-id (+ (var-get event-counter) u1)))
    
    ;; Ensure caller is from an authorized contract
    (asserts! (is-authorized-contract caller) err-unauthorized)
    
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
                                  u100)
                               (log-event-overflow event-type subject-id target)) }
        )
      (map-set subject-events
        { subject-id: subject-id }
        { event-ids: (list event-id) }
      )
    )
    
    ;; Add to actor index
    (match (map-get? actor-events { actor: caller })
      existing-data 
        (map-set actor-events
          { actor: caller }
          { event-ids: (unwrap! (as-max-len? 
                                  (append (get event-ids existing-data) event-id)
                                  u100)
                               (log-event-overflow event-type subject-id target)) }
        )
      (map-set actor-events
        { actor: caller }
        { event-ids: (list event-id) }
      )
    )
    
    (ok event-id)
  )
)

;; Fallback function when event list exceeds max length
(define-private (log-event-overflow (event-type (string-utf8 32)) 
                                   (subject-id (buff 32))
                                   (target (optional principal)))
  (begin
    (print { error: "event-list-overflow", event-type: event-type, subject-id: subject-id })
    (err u108)
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

(define-read-only (get-actor-events (actor principal))
  (match (map-get? actor-events { actor: actor })
    data (ok (get event-ids data))
    (ok (list))
  )
)

(define-read-only (get-event-count)
  (var-get event-counter)
)

;; Helper function to check if caller is an authorized contract
(define-read-only (is-authorized-contract (contract principal))
  (or
    (is-eq contract (as-contract tx-sender))
    (is-eq contract (as-contract .digital-credentials))
    (is-eq contract (as-contract .credential-operations))
    (is-eq contract (as-contract .issuer-management))
    (is-eq contract .digital-credentials)
    (is-eq contract .credential-operations)
    (is-eq contract .issuer-management)
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