-- TrustCred Database Schema - Initial Setup
-- This file contains the core database schema for the TrustCred platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ORGANIZATIONS TABLE
-- =============================================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('educational', 'professional', 'government', 'corporate', 'association')),
    domain VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    stacks_address VARCHAR(255) UNIQUE,
    metadata_uri VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for organizations
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_verified ON organizations(verified);

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    stacks_address VARCHAR(255) UNIQUE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'issuer', 'recipient', 'verifier', 'super_admin')),
    profile JSONB DEFAULT '{}',
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- =============================================================================
-- CREDENTIAL SCHEMAS TABLE
-- =============================================================================
CREATE TABLE credential_schemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    schema_definition JSONB NOT NULL,
    blockchain_id VARCHAR(64) UNIQUE, -- Corresponds to schema-id in smart contract
    fields JSONB NOT NULL, -- Array of field definitions
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create composite unique constraint
ALTER TABLE credential_schemas ADD CONSTRAINT unique_schema_version UNIQUE(organization_id, name, version);

-- Create indexes for credential_schemas
CREATE INDEX idx_credential_schemas_organization_id ON credential_schemas(organization_id);
CREATE INDEX idx_credential_schemas_active ON credential_schemas(active);
CREATE INDEX idx_credential_schemas_blockchain_id ON credential_schemas(blockchain_id);

-- =============================================================================
-- CREDENTIALS TABLE
-- =============================================================================
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blockchain_id VARCHAR(64) UNIQUE NOT NULL, -- credential-id from smart contract
    schema_id UUID NOT NULL REFERENCES credential_schemas(id) ON DELETE CASCADE,
    issuer_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recipient_address VARCHAR(255) NOT NULL, -- Stacks address of recipient
    recipient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata_uri VARCHAR(500),
    encrypted_data BYTEA, -- Encrypted credential data
    data_hash VARCHAR(64) NOT NULL, -- Hash of credential data
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'pending')),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for credentials
CREATE INDEX idx_credentials_schema_id ON credentials(schema_id);
CREATE INDEX idx_credentials_issuer_id ON credentials(issuer_id);
CREATE INDEX idx_credentials_recipient_address ON credentials(recipient_address);
CREATE INDEX idx_credentials_status ON credentials(status);
CREATE INDEX idx_credentials_issued_at ON credentials(issued_at);
CREATE INDEX idx_credentials_expires_at ON credentials(expires_at);

-- =============================================================================
-- VERIFICATION LOGS TABLE
-- =============================================================================
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
    verifier_address VARCHAR(255),
    verifier_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verification_result JSONB NOT NULL,
    verification_method VARCHAR(50) DEFAULT 'api' CHECK (verification_method IN ('api', 'qr_code', 'mobile_app', 'web_interface')),
    ip_address INET,
    user_agent TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for verification_logs
CREATE INDEX idx_verification_logs_credential_id ON verification_logs(credential_id);
CREATE INDEX idx_verification_logs_verifier_address ON verification_logs(verifier_address);
CREATE INDEX idx_verification_logs_verified_at ON verification_logs(verified_at);

-- =============================================================================
-- ISSUER CATEGORIES TABLE
-- =============================================================================
CREATE TABLE issuer_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issuer_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create composite unique constraint
ALTER TABLE issuer_categories ADD CONSTRAINT unique_issuer_category UNIQUE(issuer_id, category);

-- Create indexes for issuer_categories
CREATE INDEX idx_issuer_categories_issuer_id ON issuer_categories(issuer_id);
CREATE INDEX idx_issuer_categories_category ON issuer_categories(category);

-- =============================================================================
-- CREDENTIAL TEMPLATES TABLE
-- =============================================================================
CREATE TABLE credential_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    schema_id UUID NOT NULL REFERENCES credential_schemas(id) ON DELETE CASCADE,
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for credential_templates
CREATE INDEX idx_credential_templates_organization_id ON credential_templates(organization_id);
CREATE INDEX idx_credential_templates_schema_id ON credential_templates(schema_id);
CREATE INDEX idx_credential_templates_is_public ON credential_templates(is_public);
CREATE INDEX idx_credential_templates_active ON credential_templates(active);

-- =============================================================================
-- USER SESSIONS TABLE
-- =============================================================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- =============================================================================
-- API KEYS TABLE
-- =============================================================================
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]',
    active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for api_keys
CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(active);

-- =============================================================================
-- NOTIFICATIONS TABLE
-- =============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('credential_issued', 'credential_revoked', 'verification_request', 'system_alert')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);

-- =============================================================================
-- AUDIT LOGS TABLE
-- =============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at columns
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credential_schemas_updated_at BEFORE UPDATE ON credential_schemas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credential_templates_updated_at BEFORE UPDATE ON credential_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA INSERTION
-- =============================================================================

-- Insert default super admin organization
INSERT INTO organizations (id, name, type, verified, status, stacks_address) 
VALUES (
    uuid_generate_v4(),
    'TrustCred Platform',
    'corporate',
    TRUE,
    'active',
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' -- Replace with actual admin address
);

-- Insert default super admin user
INSERT INTO users (email, stacks_address, organization_id, role, email_verified, profile) 
SELECT 
    'admin@trustcred.com',
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', -- Replace with actual admin address
    o.id,
    'super_admin',
    TRUE,
    '{"firstName": "System", "lastName": "Administrator"}'
FROM organizations o 
WHERE o.name = 'TrustCred Platform';

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE organizations IS 'Organizations that can issue credentials (universities, companies, etc.)';
COMMENT ON TABLE users IS 'Platform users with different roles and permissions';
COMMENT ON TABLE credential_schemas IS 'Templates defining the structure of credentials';
COMMENT ON TABLE credentials IS 'Individual credentials issued to recipients';
COMMENT ON TABLE verification_logs IS 'Audit trail of all credential verifications';
COMMENT ON TABLE issuer_categories IS 'Categories for organizing issuers by type';
COMMENT ON TABLE credential_templates IS 'Pre-built templates for common credential types';
COMMENT ON TABLE user_sessions IS 'User authentication sessions';
COMMENT ON TABLE api_keys IS 'API keys for programmatic access';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail of all system actions';
