import { blockchainService, VerificationResult as BlockchainVerificationResult } from './blockchain.service';
import { executeQuery } from '../config/database';
import { logInfo, logError, logDatabase } from '../utils/logger';
import QRCode from 'qrcode';

// Types for verification service
export interface CredentialVerification {
  credentialId: string;
  exists: boolean;
  valid: boolean;
  revoked: boolean;
  expired: boolean;
  issuer: {
    address: string;
    name: string;
    verified: boolean;
    type: string;
  };
  recipient: {
    address: string;
  };
  metadata: {
    name?: string;
    description?: string;
    issuedAt: number;
    expiresAt: number | null;
    revokedAt: number | null;
    metadataUri: string;
    dataHash: string;
  };
  schema: {
    id: string;
    name: string;
    version: string;
  } | null;
  verificationTimestamp: number;
  source: 'blockchain' | 'hybrid';
}

export interface BatchVerificationResult {
  results: CredentialVerification[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    revoked: number;
    expired: number;
    notFound: number;
  };
  timestamp: number;
}

export interface PublicCredentialInfo {
  credentialId: string;
  issuer: {
    name: string;
    type: string;
    verified: boolean;
  };
  schema: {
    name: string;
    version: string;
  };
  issuedAt: number;
  expiresAt: number | null;
  status: 'active' | 'revoked' | 'expired';
}

export interface QRCodeData {
  credentialId: string;
  verificationUrl: string;
  timestamp: number;
}

export class VerificationService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.BASE_URL || 'https://api.trustcred.com';
  }

  /**
   * Verify a single credential by combining blockchain and database data
   */
  async verifyCredential(credentialId: string): Promise<CredentialVerification> {
    try {
      logInfo('Starting credential verification', { credentialId });

      // Get verification result from blockchain
      const blockchainResult = await blockchainService.verifyCredential(credentialId);
      
      if (!blockchainResult.exists) {
        return this.createNotFoundResult(credentialId);
      }

      // Get additional data from database
      const dbData = await this.getCredentialMetadata(credentialId);
      const issuerData = await this.getIssuerData(blockchainResult.issuer);
      const schemaData = dbData ? await this.getSchemaData(dbData.schema_id) : null;

      // Combine blockchain and database data
      const verification: CredentialVerification = {
        credentialId,
        exists: blockchainResult.exists,
        valid: blockchainResult.valid,
        revoked: blockchainResult.revoked,
        expired: blockchainResult.expired,
        issuer: {
          address: blockchainResult.issuer,
          name: issuerData?.name || 'Unknown Issuer',
          verified: issuerData?.verified || false,
          type: issuerData?.type || 'unknown',
        },
        recipient: {
          address: dbData?.recipient_address || '',
        },
        metadata: {
          name: schemaData?.name,
          description: schemaData?.description,
          issuedAt: blockchainResult.issuedAt,
          expiresAt: blockchainResult.expiresAt,
          revokedAt: blockchainResult.revoked ? Date.now() : null,
          metadataUri: dbData?.metadata_uri || '',
          dataHash: dbData?.data_hash || '',
        },
        schema: schemaData ? {
          id: schemaData.id,
          name: schemaData.name,
          version: schemaData.version,
        } : null,
        verificationTimestamp: Date.now(),
        source: 'hybrid',
      };

      // Log verification result
      await this.logVerification(credentialId, verification);

      logInfo('Credential verification completed', { 
        credentialId, 
        valid: verification.valid,
        revoked: verification.revoked,
        expired: verification.expired,
      });

      return verification;

    } catch (error) {
      logError('Credential verification failed', error as Error, { credentialId });
      return this.createErrorResult(credentialId, error as Error);
    }
  }

  /**
   * Verify multiple credentials in batch
   */
  async verifyBatch(credentialIds: string[]): Promise<BatchVerificationResult> {
    try {
      logInfo('Starting batch verification', { count: credentialIds.length });

      const results = await Promise.allSettled(
        credentialIds.map(id => this.verifyCredential(id))
      );

      const verifications: CredentialVerification[] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          logError('Batch verification item failed', result.reason, { 
            credentialId: credentialIds[index] 
          });
          return this.createErrorResult(credentialIds[index], result.reason);
        }
      });

      // Calculate summary
      const summary = {
        total: verifications.length,
        valid: verifications.filter(v => v.valid).length,
        invalid: verifications.filter(v => !v.valid && v.exists).length,
        revoked: verifications.filter(v => v.revoked).length,
        expired: verifications.filter(v => v.expired).length,
        notFound: verifications.filter(v => !v.exists).length,
      };

      const batchResult: BatchVerificationResult = {
        results: verifications,
        summary,
        timestamp: Date.now(),
      };

      logInfo('Batch verification completed', {
        ...summary,
        processingTime: Date.now() - batchResult.timestamp,
      });

      return batchResult;

    } catch (error) {
      logError('Batch verification failed', error as Error);
      throw new Error(`Batch verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get public information about a credential (for sharing)
   */
  async getPublicCredentialInfo(credentialId: string): Promise<PublicCredentialInfo | null> {
    try {
      const verification = await this.verifyCredential(credentialId);
      
      if (!verification.exists) {
        return null;
      }

      const status = verification.revoked ? 'revoked' 
        : verification.expired ? 'expired' 
        : 'active';

      return {
        credentialId,
        issuer: {
          name: verification.issuer.name,
          type: verification.issuer.type,
          verified: verification.issuer.verified,
        },
        schema: {
          name: verification.schema?.name || 'Unknown Schema',
          version: verification.schema?.version || '1.0',
        },
        issuedAt: verification.metadata.issuedAt,
        expiresAt: verification.metadata.expiresAt,
        status,
      };

    } catch (error) {
      logError('Failed to get public credential info', error as Error, { credentialId });
      return null;
    }
  }

  /**
   * Generate QR code for credential verification
   */
  async generateQRCode(credentialId: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
    try {
      const qrData: QRCodeData = {
        credentialId,
        verificationUrl: `${this.baseUrl}/verify/${credentialId}`,
        timestamp: Date.now(),
      };

      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        ...options,
      });

      logInfo('QR code generated', { credentialId });
      return qrCodeDataUrl;

    } catch (error) {
      logError('QR code generation failed', error as Error, { credentialId });
      throw new Error(`QR code generation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Verify credential from QR code data
   */
  async verifyFromQRCode(qrCodeData: string): Promise<CredentialVerification> {
    try {
      const parsedData: QRCodeData = JSON.parse(qrCodeData);
      
      if (!parsedData.credentialId) {
        throw new Error('Invalid QR code data: missing credential ID');
      }

      logInfo('Verifying credential from QR code', { 
        credentialId: parsedData.credentialId 
      });

      return await this.verifyCredential(parsedData.credentialId);

    } catch (error) {
      logError('QR code verification failed', error as Error);
      throw new Error(`QR code verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * Search public credentials by issuer or schema
   */
  async searchPublicCredentials(params: {
    issuer?: string;
    schema?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ credentials: PublicCredentialInfo[]; total: number }> {
    try {
      const { issuer, schema, limit = 50, offset = 0 } = params;

      let query = `
        SELECT 
          c.blockchain_id as credential_id,
          c.issued_at,
          c.expires_at,
          c.status,
          o.name as issuer_name,
          o.type as issuer_type,
          o.verified as issuer_verified,
          cs.name as schema_name,
          cs.version as schema_version,
          COUNT(*) OVER() as total_count
        FROM credentials c
        JOIN organizations o ON c.issuer_id = o.id
        LEFT JOIN credential_schemas cs ON c.schema_id = cs.id
        WHERE c.status = 'active'
      `;

      const queryParams: any[] = [];
      let paramIndex = 1;

      if (issuer) {
        query += ` AND (o.name ILIKE $${paramIndex} OR o.stacks_address = $${paramIndex})`;
        queryParams.push(`%${issuer}%`);
        paramIndex++;
      }

      if (schema) {
        query += ` AND cs.name ILIKE $${paramIndex}`;
        queryParams.push(`%${schema}%`);
        paramIndex++;
      }

      query += ` ORDER BY c.issued_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);

      const results = await executeQuery<any>(query, queryParams);

      const credentials: PublicCredentialInfo[] = results.map(row => ({
        credentialId: row.credential_id,
        issuer: {
          name: row.issuer_name,
          type: row.issuer_type,
          verified: row.issuer_verified,
        },
        schema: {
          name: row.schema_name || 'Unknown Schema',
          version: row.schema_version || '1.0',
        },
        issuedAt: new Date(row.issued_at).getTime(),
        expiresAt: row.expires_at ? new Date(row.expires_at).getTime() : null,
        status: row.status,
      }));

      const total = results.length > 0 ? parseInt(results[0].total_count) : 0;

      logInfo('Public credential search completed', {
        issuer,
        schema,
        resultCount: credentials.length,
        total,
      });

      return { credentials, total };

    } catch (error) {
      logError('Public credential search failed', error as Error, params);
      throw new Error(`Search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get credential metadata from database
   */
  private async getCredentialMetadata(credentialId: string): Promise<any | null> {
    try {
      const results = await executeQuery<any>(
        'SELECT * FROM credentials WHERE blockchain_id = $1',
        [credentialId]
      );

      if (results.length === 0) {
        return null;
      }

      logDatabase('select', 'credentials', true, { credentialId });
      return results[0];

    } catch (error) {
      logError('Failed to get credential metadata', error as Error, { credentialId });
      logDatabase('select', 'credentials', false, { credentialId });
      return null;
    }
  }

  /**
   * Get issuer data from database
   */
  private async getIssuerData(issuerAddress: string): Promise<any | null> {
    try {
      const results = await executeQuery<any>(
        'SELECT name, type, verified FROM organizations WHERE stacks_address = $1',
        [issuerAddress]
      );

      if (results.length === 0) {
        return null;
      }

      logDatabase('select', 'organizations', true, { issuerAddress });
      return results[0];

    } catch (error) {
      logError('Failed to get issuer data', error as Error, { issuerAddress });
      logDatabase('select', 'organizations', false, { issuerAddress });
      return null;
    }
  }

  /**
   * Get schema data from database
   */
  private async getSchemaData(schemaId: string): Promise<any | null> {
    try {
      const results = await executeQuery<any>(
        'SELECT id, name, version, schema_definition FROM credential_schemas WHERE id = $1',
        [schemaId]
      );

      if (results.length === 0) {
        return null;
      }

      logDatabase('select', 'credential_schemas', true, { schemaId });
      return results[0];

    } catch (error) {
      logError('Failed to get schema data', error as Error, { schemaId });
      logDatabase('select', 'credential_schemas', false, { schemaId });
      return null;
    }
  }

  /**
   * Log verification attempt
   */
  private async logVerification(credentialId: string, verification: CredentialVerification): Promise<void> {
    try {
      await executeQuery(
        `INSERT INTO verification_logs 
         (credential_id, verification_result, verification_method, verified_at) 
         VALUES (
           (SELECT id FROM credentials WHERE blockchain_id = $1),
           $2,
           'api',
           NOW()
         )`,
        [credentialId, JSON.stringify({
          valid: verification.valid,
          revoked: verification.revoked,
          expired: verification.expired,
          verificationTimestamp: verification.verificationTimestamp,
        })]
      );

      logDatabase('insert', 'verification_logs', true, { credentialId });

    } catch (error) {
      logError('Failed to log verification', error as Error, { credentialId });
      logDatabase('insert', 'verification_logs', false, { credentialId });
    }
  }

  /**
   * Create not found result
   */
  private createNotFoundResult(credentialId: string): CredentialVerification {
    return {
      credentialId,
      exists: false,
      valid: false,
      revoked: false,
      expired: false,
      issuer: {
        address: '',
        name: '',
        verified: false,
        type: '',
      },
      recipient: {
        address: '',
      },
      metadata: {
        issuedAt: 0,
        expiresAt: null,
        revokedAt: null,
        metadataUri: '',
        dataHash: '',
      },
      schema: null,
      verificationTimestamp: Date.now(),
      source: 'blockchain',
    };
  }

  /**
   * Create error result
   */
  private createErrorResult(credentialId: string, error: Error): CredentialVerification {
    return {
      credentialId,
      exists: false,
      valid: false,
      revoked: false,
      expired: false,
      issuer: {
        address: '',
        name: 'Error',
        verified: false,
        type: 'error',
      },
      recipient: {
        address: '',
      },
      metadata: {
        issuedAt: 0,
        expiresAt: null,
        revokedAt: null,
        metadataUri: '',
        dataHash: '',
      },
      schema: null,
      verificationTimestamp: Date.now(),
      source: 'blockchain',
    };
  }
}

// Export singleton instance
export const verificationService = new VerificationService();