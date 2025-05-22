;; Event Module (event-module.clar) - Stage 2: Enhanced Event System with Indexing
;; This contract provides enhanced event logging with subject tracking and basic indexing.

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-input (err u103))

;; Define data structures

;; Event structure - enhanced with subject tracking
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

;; Index of events by actor
(define-map actor-events
  { actor: principal }
  { event-ids: (list 50 uint) }
)

;; Authorized contracts list
(define-map authorized-contracts
  { contract: principal }
  { authorized: bool }
)

;; Public functions

;; Log a new event with enhanced tracking
(define-public (log-event (event-type (string-utf8 32)) 
                         (subject-id (buff 32))
                         (target (optional principal)))
  (let ((caller tx-sender)
        (event-id (+ (var-get event-counter) u1)))
    
    ;; Basic input validation
    (asserts! (> (len event-type) u0) err-invalid-input)
    (asserts! (> (len subject-id) u0) err-invalid-input)
    
    ;; Ensure caller is authorized (relaxed for Stage 2)
    (asserts! (or (is-authorized-contract caller) (is-eq caller contract-owner)) err-unauthorized)
    
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
    (update-subject-index subject-id event-id)
    
    ;; Add to actor index
    (update-actor-index caller event-id)
    
    (ok event-id)
  )
)

;; Add authorized contract
(define-public (add-authorized-contract (contract principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set authorized-contracts { contract: contract } { authorized: true })
    (ok true)
  )
)

;; Remove authorized contract
(define-public (remove-authorized-contract (contract principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete authorized-contracts { contract: contract })
    (ok true)
  )
)

;; Private helper functions

;; Update subject index
(define-private (update-subject-index (subject-id (buff 32)) (event-id uint))
  (match (map-get? subject-events { subject-id: subject-id })
    existing-data 
      (map-set subject-events
        { subject-id: subject-id }
        { event-ids: (unwrap-panic (as-max-len? 
                                      (append (get event-ids existing-data) event-id)
                                      u50)) }
      )
    ;; No existing events for this subject
    (map-set subject-events
      { subject-id: subject-id }
      { event-ids: (list event-id) }
    )
  )
)

;; Update actor index
(define-private (update-actor-index (actor principal) (event-id uint))
  (match (map-get? actor-events { actor: actor })
    existing-data 
      (map-set actor-events
        { actor: actor }
        { event-ids: (unwrap-panic (as-max-len? 
                                      (append (get event-ids existing-data) event-id)
                                      u50)) }
      )
    ;; No existing events for this actor
    (map-set actor-events
      { actor: actor }
      { event-ids: (list event-id) }
    )
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

;; Check if contract is authorized
(define-read-only (is-authorized-contract (contract principal))
  (default-to false 
    (get authorized (map-get? authorized-contracts { contract: contract }))
  )
)

;; Get recent events (last 10)
(define-read-only (get-recent-events)
  (let ((current-count (var-get event-counter))
        (start-id (if (> current-count u10) (- current-count u9) u1)))
    (filter is-valid-event 
      (map get-event-or-none 
        (list start-id (+ start-id u1) (+ start-id u2) (+ start-id u3) 
              (+ start-id u4) (+ start-id u5) (+ start-id u6) (+ start-id u7)
              (+ start-id u8) (+ start-id u9))
      )
    )
  )
)

;; Helper functions for recent events
(define-read-only (get-event-or-none (event-id uint))
  (map-get? events { event-id: event-id })
)

(define-read-only (is-valid-event (event (optional {event-type: (string-utf8 32), subject-id: (buff 32), actor: principal, target: (optional principal), timestamp: uint, block-height: uint})))
  (is-some event)
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set event-counter u0)
    (ok true)
  )
)