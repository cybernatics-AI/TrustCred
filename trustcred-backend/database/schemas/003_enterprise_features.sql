-- TrustCred Database Schema - Enterprise Features
-- Phase 5: Enterprise-grade features and advanced integrations

-- =============================================================================
-- ENTERPRISE SECURITY & COMPLIANCE
-- =============================================================================

-- Advanced audit trails with data retention policies
CREATE TABLE enhanced_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    geolocation JSONB, -- Country, city, coordinates
    risk_score INTEGER DEFAULT 0, -- 0-100 risk assessment
    compliance_tags JSONB DEFAULT '[]', -- GDPR, SOC2, ISO27001 tags
    retention_until DATE, -- Data retention policy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data retention policies
CREATE TABLE retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    data_type VARCHAR(100) NOT NULL, -- 'audit_logs', 'credentials', 'user_data'
    retention_period_days INTEGER NOT NULL,
    retention_reason VARCHAR(255), -- Legal, compliance, business requirement
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One policy per organization per data type
    UNIQUE(organization_id, data_type)
);

-- Create indexes for enhanced audit
CREATE INDEX idx_enhanced_audit_logs_user_id ON enhanced_audit_logs(user_id);
CREATE INDEX idx_enhanced_audit_logs_organization_id ON enhanced_audit_logs(organization_id);
CREATE INDEX idx_enhanced_audit_logs_compliance_tags ON enhanced_audit_logs USING GIN(compliance_tags);
CREATE INDEX idx_enhanced_audit_logs_retention_until ON enhanced_audit_logs(retention_until);

-- =============================================================================
-- ENTERPRISE INTEGRATIONS
-- =============================================================================

-- LDAP/Active Directory integration
CREATE TABLE ldap_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    server_url VARCHAR(500) NOT NULL,
    base_dn VARCHAR(500) NOT NULL,
    bind_dn VARCHAR(500) NOT NULL,
    bind_password_encrypted BYTEA NOT NULL,
    user_search_filter VARCHAR(500),
    group_search_filter VARCHAR(500),
    sync_enabled BOOLEAN DEFAULT TRUE,
    sync_interval_minutes INTEGER DEFAULT 60,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LDAP user mappings
CREATE TABLE ldap_user_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ldap_config_id UUID NOT NULL REFERENCES ldap_configurations(id) ON DELETE CASCADE,
    ldap_user_id VARCHAR(255) NOT NULL, -- LDAP distinguished name
    local_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ldap_groups JSONB DEFAULT '[]', -- LDAP group memberships
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One mapping per LDAP user per config
    UNIQUE(ldap_config_id, ldap_user_id)
);

-- ERP system integrations
CREATE TABLE erp_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    erp_type VARCHAR(100) NOT NULL, -- 'sap', 'oracle', 'netsuite', 'custom'
    name VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(500),
    api_key_encrypted BYTEA,
    api_secret_encrypted BYTEA,
    webhook_url VARCHAR(500),
    sync_enabled BOOLEAN DEFAULT TRUE,
    sync_direction VARCHAR(20) DEFAULT 'bidirectional' CHECK (sync_direction IN ('inbound', 'outbound', 'bidirectional')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for integrations
CREATE INDEX idx_ldap_configurations_organization_id ON ldap_configurations(organization_id);
CREATE INDEX idx_ldap_user_mappings_ldap_config_id ON ldap_user_mappings(ldap_config_id);
CREATE INDEX idx_ldap_user_mappings_local_user_id ON ldap_user_mappings(local_user_id);
CREATE INDEX idx_erp_integrations_organization_id ON erp_integrations(organization_id);

-- =============================================================================
-- ADVANCED ANALYTICS & BUSINESS INTELLIGENCE
-- =============================================================================

-- Real-time analytics dashboard data
CREATE TABLE real_time_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_unit VARCHAR(50), -- 'count', 'percentage', 'currency', 'time_ms'
    dimension_key VARCHAR(100), -- 'credential_type', 'issuer', 'recipient'
    dimension_value VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Composite unique constraint
    UNIQUE(organization_id, metric_name, dimension_key, dimension_value, timestamp)
);

-- Predictive analytics models
CREATE TABLE analytics_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- 'fraud_detection', 'usage_prediction', 'churn_prediction'
    model_version VARCHAR(50) NOT NULL,
    model_data BYTEA NOT NULL, -- Serialized model
    accuracy_score DECIMAL(5,4), -- 0.0000 to 1.0000
    training_data_size INTEGER,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Model predictions and insights
CREATE TABLE model_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES analytics_models(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    prediction_result JSONB NOT NULL,
    confidence_score DECIMAL(5,4),
    prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_real_time_analytics_organization_id ON real_time_analytics(organization_id);
CREATE INDEX idx_real_time_analytics_metric_name ON real_time_analytics(metric_name);
CREATE INDEX idx_real_time_analytics_timestamp ON real_time_analytics(timestamp);
CREATE INDEX idx_analytics_models_organization_id ON analytics_models(organization_id);
CREATE INDEX idx_analytics_models_model_type ON analytics_models(model_type);
CREATE INDEX idx_model_predictions_model_id ON model_predictions(model_id);

-- =============================================================================
-- WHITE-LABEL & CUSTOMIZATION
-- =============================================================================

-- Organization branding and customization
CREATE TABLE organization_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7), -- Hex color code
    secondary_color VARCHAR(7),
    accent_color VARCHAR(7),
    custom_css TEXT,
    custom_js TEXT,
    favicon_url VARCHAR(500),
    custom_domain VARCHAR(255),
    ssl_certificate BYTEA,
    ssl_private_key BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom credential templates
CREATE TABLE custom_credential_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL, -- 'diploma', 'certificate', 'license', 'badge'
    design_data JSONB NOT NULL, -- Template design specifications
    preview_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom fields and validation rules
CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    field_name VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'date', 'select', 'file'
    field_label VARCHAR(255) NOT NULL,
    field_description TEXT,
    validation_rules JSONB DEFAULT '{}', -- Required, min/max length, regex patterns
    options JSONB DEFAULT '[]', -- For select fields
    is_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for customization
CREATE INDEX idx_organization_branding_organization_id ON organization_branding(organization_id);
CREATE INDEX idx_custom_credential_templates_organization_id ON custom_credential_templates(organization_id);
CREATE INDEX idx_custom_fields_organization_id ON custom_fields(organization_id);

-- =============================================================================
-- ENTERPRISE WORKFLOWS
-- =============================================================================

-- Approval workflows
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(100) NOT NULL, -- 'credential_issuance', 'schema_creation', 'user_registration'
    steps JSONB NOT NULL, -- Array of approval steps
    auto_approve_threshold INTEGER DEFAULT 1, -- Number of approvals needed
    escalation_enabled BOOLEAN DEFAULT FALSE,
    escalation_timeout_hours INTEGER DEFAULT 24,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow instances
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    current_step INTEGER DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'approved', 'rejected', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for workflows
CREATE INDEX idx_approval_workflows_organization_id ON approval_workflows(organization_id);
CREATE INDEX idx_workflow_instances_workflow_id ON workflow_instances(workflow_id);
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================================================

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_organization_branding_updated_at BEFORE UPDATE ON organization_branding FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_credential_templates_updated_at BEFORE UPDATE ON custom_credential_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE enhanced_audit_logs IS 'Enhanced audit logs with compliance and retention policies';
COMMENT ON TABLE retention_policies IS 'Data retention policies for compliance requirements';
COMMENT ON TABLE ldap_configurations IS 'LDAP/Active Directory integration configurations';
COMMENT ON TABLE ldap_user_mappings IS 'Mapping between LDAP users and local users';
COMMENT ON TABLE erp_integrations IS 'ERP system integration configurations';
COMMENT ON TABLE real_time_analytics IS 'Real-time analytics metrics for dashboards';
COMMENT ON TABLE analytics_models IS 'Machine learning models for predictive analytics';
COMMENT ON TABLE model_predictions IS 'Predictions and insights from analytics models';
COMMENT ON TABLE organization_branding IS 'Custom branding and styling for organizations';
COMMENT ON TABLE custom_credential_templates IS 'Custom credential template designs';
COMMENT ON TABLE custom_fields IS 'Custom fields and validation rules for credentials';
COMMENT ON TABLE approval_workflows IS 'Configurable approval workflows for enterprise processes';
COMMENT ON TABLE workflow_instances IS 'Active instances of approval workflows';
