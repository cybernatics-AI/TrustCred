;; TrustCred: Digital Credentials Internal (digital-credentials-internal.clar)
;; Stage 3: Complete implementation with advanced access control and utility integration

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-unauthorized (err u102))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u103))

;; These functions are internal and should only be called by other TrustCred contracts

;; Create a credential (internal)
(define-public (create-credential 
                (credential-id (buff 32))
                (issuer principal)
                (recipient principal)
                (schema-id (buff 32))
                (data-hash (buff 32))
                (metadata-uri (string-utf8 256))
                (expires-at (optional uint)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Store the credential via the main contract
    (try! (contract-call? .digital-credentials store-credential
                          credential-id
                          issuer
                          recipient
                          schema-id
                          data-hash
                          metadata-uri
                          expires-at))
    
    (ok true)
  )
)

;; Revoke a credential (internal) - Fixed begin block structure
(define-public (revoke-credential (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Call the revoke function in the main contract
    (try! (contract-call? .digital-credentials revoke-credential credential-id))
    
    (ok true)
  )
)

;; Update credential recipient (internal)
(define-public (update-credential-recipient (credential-id (buff 32)) (new-recipient principal))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Get current credential data
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential-data
        (begin
          ;; Store updated credential
          (try! (contract-call? .digital-credentials store-credential
                                credential-id
                                (get issuer credential-data)
                                new-recipient
                                (get schema-id credential-data)
                                (get data-hash credential-data)
                                (get metadata-uri credential-data)
                                (get expires-at credential-data)))
          (ok true)
        )
      (err err-not-found)
    )
  )
)

;; Update credential metadata (internal)
(define-public (update-credential-metadata (credential-id (buff 32)) (new-metadata-uri (string-utf8 256)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Get current credential data
    (match (contract-call? .digital-credentials get-credential credential-id)
      credential-data
        (begin
          ;; Store updated credential
          (try! (contract-call? .digital-credentials store-credential
                                credential-id
                                (get issuer credential-data)
                                (get recipient credential-data)
                                (get schema-id credential-data)
                                (get data-hash credential-data)
                                new-metadata-uri
                                (get expires-at credential-data)))
          (ok true)
        )
      (err err-not-found)
    )
  )
)

;; Data maps for tracking credentials by recipient and issuer
(define-map recipient-credentials
  { recipient: principal }
  { credential-ids: (list 100 (buff 32)) }
)

(define-map issuer-credentials
  { issuer: principal }
  { credential-ids: (list 100 (buff 32)) }
)

;; Add credential to recipient's list (internal)
(define-public (add-recipient-credential (recipient principal) (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Add credential to recipient's list
    (match (map-get? recipient-credentials { recipient: recipient })
      existing-data 
        (map-set recipient-credentials
          { recipient: recipient }
          { credential-ids: (unwrap! (as-max-len? 
                                       (append (get credential-ids existing-data) credential-id)
                                       u100)
                                    (err u108)) }
        )
      ;; No existing credentials for this recipient
      (map-set recipient-credentials
        { recipient: recipient }
        { credential-ids: (list credential-id) }
      )
    )
    
    (ok true)
  )
)

;; Remove credential from recipient's list (internal)
(define-public (remove-recipient-credential (recipient principal) (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Remove credential from recipient's list
    (match (map-get? recipient-credentials { recipient: recipient })
      existing-data 
        (let ((updated-list (contract-call? .utilities remove-buff 
                                          (get credential-ids existing-data) 
                                          credential-id)))
          (map-set recipient-credentials
            { recipient: recipient }
            { credential-ids: updated-list }
          )
        )
      (err err-not-found)
    )
    
    (ok true)
  )
)

;; Add credential to issuer's list (internal)
(define-public (add-issuer-credential (issuer principal) (credential-id (buff 32)))
  (begin
    ;; Ensure caller is an authorized contract
    (asserts! (is-authorized-contract tx-sender) err-unauthorized)
    
    ;; Add credential to issuer's list
    (match (map-get? issuer-credentials { issuer: issuer })
      existing-data 
        (map-set issuer-credentials
          { issuer: issuer }
          { credential-ids: (unwrap! (as-max-len? 
                                       (append (get credential-ids existing-data) credential-id)
                                       u100)
                                    (err u108)) }
        )
      ;; No existing credentials for this issuer
      (map-set issuer-credentials
        { issuer: issuer }
        { credential-ids: (list credential-id) }
      )
    )
    
    (ok true)
  )
)

;; Read-only functions to get credentials by recipient/issuer
(define-read-only (get-recipient-credentials (recipient principal))
  (match (map-get? recipient-credentials { recipient: recipient })
    data (ok (get credential-ids data))
    (ok (list))
  )
)

(define-read-only (get-issuer-credentials (issuer principal))
  (match (map-get? issuer-credentials { issuer: issuer })
    data (ok (get credential-ids data))
    (ok (list))
  )
)

;; Helper function to check if caller is an authorized contract
(define-read-only (is-authorized-contract (contract principal))
  (or
    (is-eq contract (as-contract tx-sender))
    (is-eq contract .credential-operations)
    (is-eq contract .issuer-management)
    (is-eq contract .digital-credentials)
  )
)

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)