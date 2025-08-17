# TrustCred Database Schema Documentation

## Overview

This directory contains the complete database schema for the TrustCred platform, organized by development phases. The schema is designed to support all TrustCred use cases from basic credential management to enterprise-grade features.

## Schema Files

### 1. **001_initial_schema.sql** - Phase 1: Core Platform
**Core tables for basic credential operations:**
- `organizations` - Issuer organizations (universities, companies, etc.)
- `users` - Platform users with role-based access control
- `credential_schemas` - Templates defining credential structure
- `credentials` - Individual credentials issued to recipients
- `verification_logs` - Audit trail of credential verifications
- `issuer_categories` - Organization categorization
- `credential_templates` - Pre-built credential templates
- `user_sessions` - Authentication session management
- `api_keys` - API access management
- `notifications` - User notification system
- `audit_logs` - Basic audit trail

### 2. **002_analytics_schema.sql** - Phase 2: Enhanced Features
**Advanced features and analytics:**
- `credential_analytics` - Daily credential operation metrics
- `template_categories` - Template marketplace organization
- `template_reviews` - User reviews and ratings
- `multisig_requirements` - Multi-signature security
- `credential_approvals` - Approval workflow system
- `webhooks` - External integration webhooks
- `webhook_deliveries` - Webhook delivery tracking
- `notification_preferences` - User notification settings
- `sms_deliveries` - SMS notification tracking

### 3. **003_enterprise_features.sql** - Phase 5: Enterprise Features
**Enterprise-grade features and integrations:**
- `enhanced_audit_logs` - Advanced compliance audit trails
- `retention_policies` - Data retention management
- `ldap_configurations` - LDAP/Active Directory integration
- `ldap_user_mappings` - LDAP user synchronization
- `erp_integrations` - ERP system connections
- `real_time_analytics` - Real-time dashboard metrics
- `analytics_models` - Machine learning models
- `model_predictions` - Predictive analytics insights
- `organization_branding` - White-label customization
- `custom_credential_templates` - Custom template designs
- `custom_fields` - Custom field definitions
- `approval_workflows` - Configurable approval processes
- `workflow_instances` - Active workflow tracking

## Database Design Principles

### 1. **Security First**
- All sensitive data encrypted at rest
- Comprehensive audit logging
- Role-based access control (RBAC)
- Data retention policies for compliance

### 2. **Scalability**
- Proper indexing on all query patterns
- JSONB fields for flexible data storage
- Partitioning strategy for large tables
- Efficient foreign key relationships

### 3. **Compliance Ready**
- GDPR compliance features
- SOC 2 audit trail support
- ISO 27001 security measures
- Data retention policy enforcement

### 4. **Performance Optimized**
- Strategic indexing strategy
- Efficient query patterns
- Connection pooling support
- Read replica support for analytics

## Key Relationships

```
organizations (1) ←→ (many) users
organizations (1) ←→ (many) credential_schemas
organizations (1) ←→ (many) credentials
credential_schemas (1) ←→ (many) credentials
users (1) ←→ (many) credentials (as recipient)
users (1) ←→ (many) verification_logs
credentials (1) ←→ (many) verification_logs
```

## Indexing Strategy

### **Primary Indexes**
- UUID primary keys on all tables
- Foreign key indexes for all relationships
- Composite indexes for common query patterns

### **Performance Indexes**
- Status fields for filtering operations
- Date fields for time-based queries
- JSONB GIN indexes for complex queries
- Full-text search indexes where needed

## Data Types

### **Core Types**
- `UUID` - Primary keys and foreign keys
- `VARCHAR` - String data with appropriate limits
- `TEXT` - Long-form text content
- `JSONB` - Flexible structured data
- `TIMESTAMP WITH TIME ZONE` - All date/time fields
- `BOOLEAN` - True/false flags
- `INTEGER` - Numeric counts and IDs
- `DECIMAL` - Precise numeric values

### **Specialized Types**
- `INET` - IP address storage
- `BYTEA` - Encrypted data and binary content

## Migration Strategy

### **Phase 1 Deployment**
```bash
# Apply initial schema
psql -d trustcred -f database/schemas/001_initial_schema.sql
```

### **Phase 2 Deployment**
```bash
# Apply enhanced features schema
psql -d trustcred -f database/schemas/002_analytics_schema.sql
```

### **Phase 5 Deployment**
```bash
# Apply enterprise features schema
psql -d trustcred -f database/schemas/003_enterprise_features.sql
```

## Environment Setup

### **Development Database**
```bash
# Create development database
createdb trustcred_dev

# Apply schemas
psql -d trustcred_dev -f database/schemas/001_initial_schema.sql
psql -d trustcred_dev -f database/schemas/002_analytics_schema.sql
psql -d trustcred_dev -f database/schemas/003_enterprise_features.sql
```

### **Production Database**
```bash
# Create production database
createdb trustcred_prod

# Apply schemas with proper permissions
psql -d trustcred_prod -f database/schemas/001_initial_schema.sql
psql -d trustcred_prod -f database/schemas/002_analytics_schema.sql
psql -d trustcred_prod -f database/schemas/003_enterprise_features.sql
```

## Backup and Recovery

### **Daily Backups**
```bash
# Full database backup
pg_dump trustcred_prod > backup_$(date +%Y%m%d).sql

# Schema-only backup
pg_dump --schema-only trustcred_prod > schema_backup_$(date +%Y%m%d).sql
```

### **Point-in-Time Recovery**
```bash
# Restore from backup
psql -d trustcred_prod < backup_20241201.sql

# Restore specific schema
psql -d trustcred_prod < database/schemas/001_initial_schema.sql
```

## Monitoring and Maintenance

### **Performance Monitoring**
- Query performance analysis
- Index usage statistics
- Table size monitoring
- Connection pool metrics

### **Regular Maintenance**
- Vacuum operations for table cleanup
- Analyze operations for query optimization
- Index maintenance and rebuilding
- Statistics updates for query planning

## Security Considerations

### **Data Encryption**
- All sensitive data encrypted at rest
- API keys and secrets encrypted
- User passwords hashed with bcrypt
- SSL/TLS for data in transit

### **Access Control**
- Database user role restrictions
- Application-level authentication
- API key management
- Audit logging for all operations

## Future Enhancements

### **Planned Features**
- GraphQL schema support
- Real-time data streaming
- Advanced analytics dashboards
- Machine learning model integration
- Multi-tenant architecture support

### **Scalability Improvements**
- Horizontal partitioning strategies
- Read replica configurations
- Caching layer integration
- CDN integration for static assets

This database schema provides a robust foundation for TrustCred's growth from MVP to enterprise platform, with clear migration paths and comprehensive feature support.
