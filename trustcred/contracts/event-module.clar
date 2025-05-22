;; Event Module (event-module.clar) - Stage 3: Production-Ready Event System
;; This contract logs all system events for transparency and traceability with full error handling.

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-input (err u103))
(define-constant err-contract-paused (err u104))
(define-constant err-event-limit-reached (err u105))
(define-constant err-index-full (err u106))
(define-constant err-invalid-range (err u107))
(define-constant err-event-overflow (err u108))

;; Contract state
(define-data-var contract-paused bool false)
(define-data-var max-events-per-subject uint u100)
(define-data-var max-events-per-actor uint u100)

;; Define data structures

;; Event structure
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

;; Event type registry for validation
(define-map valid-event-types
  { event-type: (string-utf8 32) }
  { active: bool }
)

;; Public functions

;; Log a new event with comprehensive validation
(define-public (log-event (event-type (string-utf8 32)) 
                         (subject-id (buff 32))
                         (target (optional principal)))
  (let ((caller tx-sender)
        (event-id (+ (var-get event-counter) u1)))
    
    ;; Contract state checks
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    
    ;; Input validation
    (asserts! (> (len event-type) u0) err-invalid-input)
    (asserts! (> (len subject-id) u0) err-invalid-input)
    (asserts! (is-valid-event-type event-type) err-invalid-input)
    
    ;; Authorization check
    (asserts! (is-authorized-contract caller) err-unauthorized)
    
    ;; Check event limits
    (try! (validate-event-limits subject-id caller))
    
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
    
    ;; Update indexes with overflow handling
    (try! (update-subject-index-safe subject-id event-id))
    (try! (update-actor-index-safe caller event-id))
    
    ;; Emit event for external listeners
    (print { 
      event: "event-logged",
      event-id: event-id,
      event-type: event-type,
      subject-id: subject-id,
      actor: caller
    })
    
    (ok event-id)
  )
)

;; Register a valid event type
(define-public (register-event-type (event-type (string-utf8 32)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> (len event-type) u0) err-invalid-input)
    (map-set valid-event-types { event-type: event-type } { active: true })
    (ok true)
  )
)

;; Deactivate an event type
(define-public (deactivate-event-type (event-type (string-utf8 32)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set valid-event-types { event-type: event-type } { active: false })
    (ok true)
  )
)

;; Pause/unpause contract
(define-public (set-contract-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set contract-paused paused)
    (ok true)
  )
)

;; Update event limits
(define-public (update-event-limits (max-subject uint) (max-actor uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (> max-subject u0) (> max-actor u0)) err-invalid-input)
    (var-set max-events-per-subject max-subject)
    (var-set max-events-per-actor max-actor)
    (ok true)
  )
)

;; Private helper functions

;; Validate event limits
(define-private (validate-event-limits (subject-id (buff 32)) (actor principal))
  (let ((subject-count (len (unwrap-panic (get-subject-events subject-id))))
        (actor-count (len (unwrap-panic (get-actor-events actor)))))
    (if (>= subject-count (var-get max-events-per-subject))
      err-event-limit-reached
      (if (>= actor-count (var-get max-events-per-actor))
        err-event-limit-reached
        (ok true)
      )
    )
  )
)

;; Safe subject index update with overflow handling
(define-private (update-subject-index-safe (subject-id (buff 32)) (event-id uint))
  (match (map-get? subject-events { subject-id: subject-id })
    existing-data 
      (match (as-max-len? (append (get event-ids existing-data) event-id) u100)
        new-list (begin
          (map-set subject-events
            { subject-id: subject-id }
            { event-ids: new-list }
          )
          (ok true)
        )
        err-index-full
      )
    ;; No existing events for this subject
    (begin
      (map-set subject-events
        { subject-id: subject-id }
        { event-ids: (list event-id) }
      )
      (ok true)
    )
  )
)

;; Safe actor index update with overflow handling
(define-private (update-actor-index-safe (actor principal) (event-id uint))
  (match (map-get? actor-events { actor: actor })
    existing-data 
      (match (as-max-len? (append (get event-ids existing-data) event-id) u100)
        new-list (begin
          (map-set actor-events
            { actor: actor }
            { event-ids: new-list }
          )
          (ok true)
        )
        err-index-full
      )
    ;; No existing events for this actor
    (begin
      (map-set actor-events
        { actor: actor }
        { event-ids: (list event-id) }
      )
      (ok true)
    )
  )
)

;; Fallback function when event list exceeds max length
(define-private (log-event-overflow (event-type (string-utf8 32)) 
                                   (subject-id (buff 32))
                                   (target (optional principal)))
  (begin
    (print { 
      error: "event-list-overflow", 
      event-type: event-type, 
      subject-id: subject-id,
      timestamp: block-height
    })
    err-event-overflow
  )
)

;; Read-only functions

;; Get an event by ID
(define-read-only (get-event (event-id uint))
  (map-get? events { event-id: event-id })
)

;; Get all events for a subject
(define-read-only (get-subject-events (subject-id (buff 32)))
  (match (map-get? subject-events { subject-id: subject-id })
    data (ok (get event-ids data))
    (ok (list))
  )
)

;; Get all events triggered by an actor
(define-read-only (get-actor-events (actor principal))
  (match (map-get? actor-events { actor: actor })
    data (ok (get event-ids data))
    (ok (list))
  )
)

;; Get total number of events
(define-read-only (get-event-count)
  (var-get event-counter)
)

;; Get events in a range with validation
(define-read-only (get-events-range (start uint) (count uint))
  (let ((end (+ start count))
        (total-events (var-get event-counter)))
    (if (and (> start u0) (<= end total-events) (<= count u50))
      (ok (map get-event-safe (generate-range start count)))
      err-invalid-range
    )
  )
)

;; Generate a range of numbers for pagination
(define-read-only (generate-range (start uint) (count uint))
  (if (is-eq count u1)
    (list start)
    (if (is-eq count u2)
      (list start (+ start u1))
      (if (is-eq count u3)
        (list start (+ start u1) (+ start u2))
        (list start (+ start u1) (+ start u2) (+ start u3))
      )
    )
  )
)

;; Safe event retrieval
(define-read-only (get-event-safe (event-id uint))
  (map-get? events { event-id: event-id })
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

;; Check if event type is valid
(define-read-only (is-valid-event-type (event-type (string-utf8 32)))
  (default-to false 
    (get active (map-get? valid-event-types { event-type: event-type }))
  )
)

;; Get contract status
(define-read-only (get-contract-status)
  {
    paused: (var-get contract-paused),
    total-events: (var-get event-counter),
    max-events-per-subject: (var-get max-events-per-subject),
    max-events-per-actor: (var-get max-events-per-actor)
  }
)

;; Initialize contract with default event types
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set event-counter u0)
    (var-set contract-paused false)
    (var-set max-events-per-subject u100)
    (var-set max-events-per-actor u100)
    
    ;; Register default event types
    (map-set valid-event-types { event-type: u"CREDENTIAL_ISSUED" } { active: true })
    (map-set valid-event-types { event-type: u"CREDENTIAL_VERIFIED" } { active: true })
    (map-set valid-event-types { event-type: u"CREDENTIAL_REVOKED" } { active: true })
    (map-set valid-event-types { event-type: u"ISSUER_REGISTERED" } { active: true })
    (map-set valid-event-types { event-type: u"ISSUER_UPDATED" } { active: true })
    (map-set valid-event-types { event-type: u"ISSUER_SUSPENDED" } { active: true })
    
    (ok true)
  )
)