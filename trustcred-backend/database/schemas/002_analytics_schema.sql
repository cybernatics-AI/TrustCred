-- TrustCred Database Schema - Analytics & Enhanced Features
-- Phase 2: Enhanced functionality with analytics and advanced features

-- =============================================================================
-- ANALYTICS TABLES
-- =============================================================================

-- Credential issuance analytics
CREATE TABLE credential_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    credentials_issued INTEGER DEFAULT 0,
    credentials_revoked INTEGER DEFAULT 0,
    credentials_expired INTEGER DEFAULT 0,
    verification_requests INTEGER DEFAULT 0,
    successful_verifications INTEGER DEFAULT 0,
    failed_verifications INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Composite unique constraint
    UNIQUE(organization_id, date)
);

-- Create indexes for analytics
CREATE INDEX idx_credential_analytics_organization_id ON credential_analytics(organization_id);
CREATE INDEX idx_credential_analytics_date ON credential_analytics(date);

-- =============================================================================
-- TEMPLATE MARKETPLACE TABLES
-- =============================================================================

-- Template categories
CREATE TABLE template_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    parent_category_id UUID REFERENCES template_categories(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template ratings and reviews
CREATE TABLE template_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES credential_templates(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One review per user per template
    UNIQUE(template_id, reviewer_id)
);

-- Create indexes for template reviews
CREATE INDEX idx_template_reviews_template_id ON template_reviews(template_id);
CREATE INDEX idx_template_reviews_reviewer_id ON template_reviews(reviewer_id);
CREATE INDEX idx_template_reviews_rating ON template_reviews(rating);

-- =============================================================================
-- ADVANCED SECURITY FEATURES
-- =============================================================================

-- Multi-signature requirements
CREATE TABLE multisig_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schema_id UUID NOT NULL REFERENCES credential_schemas(id) ON DELETE CASCADE,
    required_signatures INTEGER NOT NULL DEFAULT 1,
    approver_roles JSONB NOT NULL DEFAULT '[]', -- Array of required roles
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credential approval workflow
CREATE TABLE credential_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approval_notes TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for approvals
CREATE INDEX idx_credential_approvals_credential_id ON credential_approvals(credential_id);
CREATE INDEX idx_credential_approvals_approver_id ON credential_approvals(approver_id);
CREATE INDEX idx_credential_approvals_status ON credential_approvals(approval_status);

-- =============================================================================
-- INTEGRATION & WEBHOOKS
-- =============================================================================

-- Webhook configurations
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events JSONB NOT NULL DEFAULT '[]', -- Array of events to trigger webhook
    secret_key VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    retry_count INTEGER DEFAULT 0,
    last_triggered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook delivery logs
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_time_ms INTEGER,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhooks
CREATE INDEX idx_webhooks_organization_id ON webhooks(organization_id);
CREATE INDEX idx_webhooks_active ON webhooks(active);
CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_success ON webhook_deliveries(success);

-- =============================================================================
-- NOTIFICATION ENHANCEMENTS
-- =============================================================================

-- Notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One preference per user per notification type
    UNIQUE(user_id, notification_type)
);

-- SMS delivery logs
CREATE TABLE sms_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    provider VARCHAR(50),
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_sms_deliveries_user_id ON sms_deliveries(user_id);
CREATE INDEX idx_sms_deliveries_status ON sms_deliveries(status);

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE credential_analytics IS 'Daily analytics for credential operations';
COMMENT ON TABLE template_categories IS 'Categories for organizing credential templates';
COMMENT ON TABLE template_reviews IS 'User reviews and ratings for credential templates';
COMMENT ON TABLE multisig_requirements IS 'Multi-signature requirements for credential schemas';
COMMENT ON TABLE credential_approvals IS 'Approval workflow for credential issuance';
COMMENT ON TABLE webhooks IS 'Webhook configurations for external integrations';
COMMENT ON TABLE webhook_deliveries IS 'Log of webhook delivery attempts';
COMMENT ON TABLE notification_preferences IS 'User preferences for different notification types';
COMMENT ON TABLE sms_deliveries IS 'Log of SMS notification deliveries';
