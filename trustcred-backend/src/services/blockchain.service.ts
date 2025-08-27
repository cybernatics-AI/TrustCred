import { connectRedis } from '../config/redis';
import { logBlockchain, logError, logInfo } from '../utils/logger';
import { STACKS_TESTNET, STACKS_MAINNET, StacksNetworks } from '@stacks/network';
import { fetchCallReadOnlyFunction, cvToJSON, standardPrincipalCV } from '@stacks/transactions';

// Types for blockchain operations
export interface BlockchainCredential {
  credentialId: string;
  issuer: string;
  recipient: string;
  schemaId: string;
  issuedAt: number;
  expiresAt: number | null;
  revoked: boolean;
  revokedAt: number | null;
  dataHash: string;
  metadataUri: string;
  valid: boolean;
}

export interface VerificationResult {
  exists: boolean;
  valid: boolean;
  revoked: boolean;
  expired: boolean;
  issuer: string;
  issuedAt: number;
  expiresAt: number | null;
}

export class BlockchainService {
  private contractAddress: string;
  private contractName: string;
  private network: any;
  private redisClient: any = null; // Redis client type
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'blockchain:';

  constructor() {
    const fullContract = process.env.STACKS_CONTRACT_ADDRESS || 
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.digital-credentials';
    
    const [address, name] = fullContract.split('.');
    this.contractAddress = address;
    this.contractName = name || 'digital-credentials';
    
    // Initialize network
    const networkType = process.env.STACKS_NETWORK || 'testnet';
    this.network = networkType === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

    // Initialize Redis connection for caching
    this.initializeRedis();
    
    logInfo('BlockchainService initialized', {
      network: networkType,
      contractAddress: this.contractAddress,
      contractName: this.contractName,
    });
  }

  private async initializeRedis(): Promise<void> {
    try {
      this.redisClient = await connectRedis();
      logInfo('Redis connected for blockchain caching');
    } catch (error) {
      logError('Redis connection failed, continuing without cache', error as Error);
    }
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    if (!this.redisClient) return null;
    
    try {
      const cached = await this.redisClient.get(`${this.CACHE_PREFIX}${key}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      logError('Cache read error', error as Error, { key });
    }
    return null;
  }

  private async setCache<T>(key: string, value: T, ttl: number = this.CACHE_TTL): Promise<void> {
    if (!this.redisClient) return;
    
    try {
      await this.redisClient.setEx(
        `${this.CACHE_PREFIX}${key}`, 
        ttl, 
        JSON.stringify(value)
      );
    } catch (error) {
      logError('Cache write error', error as Error, { key });
    }
  }

  /**
   * Get credential details from blockchain
   */
  async getCredential(credentialId: string): Promise<BlockchainCredential | null> {
    const cacheKey = `credential:${credentialId}`;
    
    try {
      // Try cache first
      const cached = await this.getFromCache<BlockchainCredential>(cacheKey);
      if (cached) {
        logInfo('Credential retrieved from cache', { credentialId });
        return cached;
      }

      logInfo('Fetching credential from blockchain', { credentialId });

      // Call the smart contract to get credential data
      const result = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-credential',
        functionArgs: [standardPrincipalCV(credentialId)],
        network: this.network,
        senderAddress: this.contractAddress,
      });

      const resultData = cvToJSON(result);
      
      // Handle case where credential doesn't exist
      if (!resultData.success || resultData.value.type === 'none') {
        logInfo('Credential not found on blockchain', { credentialId });
        return null;
      }

      const credentialData = resultData.value.value;
      const credential: BlockchainCredential = {
        credentialId,
        issuer: credentialData.issuer.value,
        recipient: credentialData.recipient.value,
        schemaId: credentialData.schemaId.value,
        issuedAt: parseInt(credentialData.issuedAt.value),
        expiresAt: credentialData.expiresAt.value ? parseInt(credentialData.expiresAt.value) : null,
        revoked: credentialData.revoked.value,
        revokedAt: credentialData.revokedAt.value ? parseInt(credentialData.revokedAt.value) : null,
        dataHash: credentialData.dataHash.value,
        metadataUri: credentialData.metadataUri.value,
        valid: !credentialData.revoked.value && (credentialData.expiresAt.value ? Date.now() < parseInt(credentialData.expiresAt.value) : true),
      };

      // Cache successful result
      await this.setCache(cacheKey, credential);
      logBlockchain('get-credential', credentialId, true);

      return credential;

    } catch (error) {
      logError('Failed to get credential from blockchain', error as Error, { credentialId });
      logBlockchain('get-credential', credentialId, false);
      
      // For development, fall back to mock data if blockchain is unavailable
      if (process.env.NODE_ENV === 'development') {
        logInfo('Falling back to mock data in development', { credentialId });
        return this.getMockCredential(credentialId);
      }
      
      throw new Error(`Blockchain read failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get credential verification details
   */
  async verifyCredential(credentialId: string): Promise<VerificationResult> {
    const cacheKey = `verification:${credentialId}`;
    
    try {
      // Try cache first (shorter TTL for verification)
      const cached = await this.getFromCache<VerificationResult>(cacheKey);
      if (cached) {
        logInfo('Verification result retrieved from cache', { credentialId });
        return cached;
      }

      logInfo('Verifying credential on blockchain', { credentialId });

      // Get full credential data
      const credential = await this.getCredential(credentialId);
      
      if (!credential) {
        const verification: VerificationResult = {
          exists: false,
          valid: false,
          revoked: false,
          expired: false,
          issuer: '',
          issuedAt: 0,
          expiresAt: null,
        };
        
        await this.setCache(cacheKey, verification, 60);
        logBlockchain('verify-credential', credentialId, false);
        return verification;
      }

      const now = Date.now();
      const expired = credential.expiresAt ? now > credential.expiresAt : false;
      
      const verification: VerificationResult = {
        exists: true,
        valid: credential.valid && !credential.revoked && !expired,
        revoked: credential.revoked,
        expired,
        issuer: credential.issuer,
        issuedAt: credential.issuedAt,
        expiresAt: credential.expiresAt,
      };
      
      // Cache for shorter time (1 minute for verification)
      await this.setCache(cacheKey, verification, 60);
      
      logBlockchain('verify-credential', credentialId, verification.exists);
      
      return verification;

    } catch (error) {
      logError('Failed to verify credential on blockchain', error as Error, { credentialId });
      logBlockchain('verify-credential', credentialId, false);
      throw new Error(`Blockchain verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * Check if credential exists on blockchain
   */
  async credentialExists(credentialId: string): Promise<boolean> {
    try {
      const credential = await this.getCredential(credentialId);
      const exists = credential !== null;
      
      logBlockchain('credential-exists', credentialId, exists);
      return exists;

    } catch (error) {
      logError('Failed to check credential existence', error as Error, { credentialId });
      logBlockchain('credential-exists', credentialId, false);
      return false;
    }
  }

  /**
   * Get network info
   */
  getNetworkInfo(): { network: string; contractAddress: string } {
    return {
      network: process.env.STACKS_NETWORK || 'testnet',
      contractAddress: this.contractAddress,
    };
  }

  /**
   * Health check for blockchain service
   */
  async healthCheck(): Promise<{ healthy: boolean; network: string; latency?: number }> {
    try {
      const startTime = Date.now();
      
      // Test blockchain connectivity with a simple contract call
      const result = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-contract-info',
        functionArgs: [],
        network: this.network,
        senderAddress: this.contractAddress,
      });

      const latency = Date.now() - startTime;
      const healthy = result !== null;
      
      return {
        healthy,
        network: process.env.STACKS_NETWORK || 'testnet',
        latency,
      };

    } catch (error) {
      logError('Blockchain health check failed', error as Error);
      return {
        healthy: false,
        network: process.env.STACKS_NETWORK || 'testnet',
      };
    }
  }

  /**
   * Invalidate cache for a credential (useful after updates)
   */
  async invalidateCredentialCache(credentialId: string): Promise<void> {
    if (!this.redisClient) return;

    try {
      await this.redisClient.del(`${this.CACHE_PREFIX}credential:${credentialId}`);
      await this.redisClient.del(`${this.CACHE_PREFIX}verification:${credentialId}`);
      logInfo('Cache invalidated for credential', { credentialId });
    } catch (error) {
      logError('Failed to invalidate cache', error as Error, { credentialId });
    }
  }

  /**
   * Mock credential data for development/testing
   */
  private getMockCredential(credentialId: string): BlockchainCredential {
    return {
      credentialId,
      issuer: 'ST1SAMPLE...ISSUER',
      recipient: 'ST1SAMPLE...RECIPIENT',
      schemaId: 'schema-123',
      issuedAt: Date.now() - 86400000, // 1 day ago
      expiresAt: Date.now() + 31536000000, // 1 year from now
      revoked: false,
      revokedAt: null,
      dataHash: 'abc123def456',
      metadataUri: `https://ipfs.io/ipfs/${credentialId}`,
      valid: true,
    };
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();