;; Utilities (utilities.clar)
;; Basic utility functions for the TrustCred system

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))

;; Basic buffer utilities
(define-read-only (uint-to-buff (value uint))
  (unwrap-panic (to-consensus-buff? value))
)

(define-read-only (buff-to-uint (buffer (buff 32)))
  (match (from-consensus-buff? uint buffer)
    success success
    u0
  )
)

;; Basic hash utilities
(define-read-only (generate-credential-id (issuer principal) (recipient principal) (timestamp uint))
  (sha256 (concat (concat
    (unwrap-panic (to-consensus-buff? issuer))
    (unwrap-panic (to-consensus-buff? recipient)))
    (uint-to-buff timestamp)))
)

;; Basic time utilities
(define-read-only (is-expired (expiry (optional uint)))
  (match expiry
    timestamp (>= block-height timestamp)
    false
  )
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)

;; TrustCred: Event Module (event-module.clar) - Stage 1
;; Basic event logging for system transparency

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))

;; Define data structures
(define-map events
  { event-id: uint }
  {
    event-type: (string-utf8 32),
    actor: principal,
    timestamp: uint
  }
)

;; Event counter
(define-data-var event-counter uint u0)

;; Public functions
(define-public (log-event (event-type (string-utf8 32)))
  (let ((caller tx-sender)
        (event-id (+ (var-get event-counter) u1)))
    
    ;; Increment event counter
    (var-set event-counter event-id)
    
    ;; Store the event
    (map-set events
      { event-id: event-id }
      {
        event-type: event-type,
        actor: caller,
        timestamp: block-height
      }
    )
    
    (ok event-id)
  )
)

;; Read-only functions
(define-read-only (get-event (event-id uint))
  (map-get? events { event-id: event-id })
)

(define-read-only (get-event-count)
  (var-get event-counter)
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set event-counter u0)
    (ok true)
  )
)