;; Event Module (event-module.clar) - Stage 1: Basic Event Logging
;; This contract provides basic event logging functionality for the TrustCred system.

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

;; Define data structures

;; Event structure - simplified for initial implementation
(define-map events
  { event-id: uint }
  {
    event-type: (string-utf8 32),
    actor: principal,
    timestamp: uint,
    data: (string-utf8 256)
  }
)

;; Event counter
(define-data-var event-counter uint u0)

;; Public functions

;; Log a basic event
(define-public (log-event (event-type (string-utf8 32)) 
                         (data (string-utf8 256)))
  (let ((event-id (+ (var-get event-counter) u1)))
    
    ;; Increment event counter
    (var-set event-counter event-id)
    
    ;; Store the event
    (map-set events
      { event-id: event-id }
      {
        event-type: event-type,
        actor: tx-sender,
        timestamp: block-height,
        data: data
      }
    )
    
    (ok event-id)
  )
)

;; Read-only functions

;; Get an event by ID
(define-read-only (get-event (event-id uint))
  (map-get? events { event-id: event-id })
)

;; Get total number of events
(define-read-only (get-event-count)
  (var-get event-counter)
)

;; Get events in a range (simple pagination)
(define-read-only (get-events-range (start uint) (end uint))
  (let ((current-count (var-get event-counter)))
    (if (and (<= start end) (<= end current-count))
      (ok (map get-event-safe (list start (+ start u1) (+ start u2) (+ start u3) (+ start u4))))
      (err err-not-found)
    )
  )
)

;; Helper function for safe event retrieval
(define-read-only (get-event-safe (event-id uint))
  (default-to 
    { event-id: u0, event-type: u"none", actor: tx-sender, timestamp: u0, data: u"" }
    (map-get? events { event-id: event-id })
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