import { Request, Response } from 'express';
import { verificationService } from '../services/verification.service';
import { logInfo, logError, logRequest } from '../utils/logger';
import { performance } from 'perf_hooks';

// Extend Request type for validated data
interface ValidatedRequest extends Request {
  validatedQuery?: any;
  validatedBody?: any;
}

export class VerificationController {
  /**
   * Verify a single credential by ID
   * GET /api/v1/verify/:credentialId
   */
  async verifyCredential(req: ValidatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const { credentialId } = req.params;

    try {
      logInfo('Credential verification request received', { 
        credentialId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      const verification = await verificationService.verifyCredential(credentialId);
      const responseTime = performance.now() - startTime;

      // Log successful request
      logRequest(req.method, req.originalUrl, 200, responseTime, {
        credentialId,
        valid: verification.valid,
      });

      res.status(200).json({
        success: true,
        data: verification,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('Credential verification failed', error as Error, {
        credentialId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      logRequest(req.method, req.originalUrl, 500, responseTime, {
        credentialId,
        error: errorMessage,
      });

      res.status(500).json({
        success: false,
        error: 'Verification Failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Unable to verify credential at this time' 
          : errorMessage,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });
    }
  }

  /**
   * Verify multiple credentials in batch
   * POST /api/v1/verify/batch
   */
  async verifyBatch(req: ValidatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const { credentialIds } = req.body;

    try {
      logInfo('Batch verification request received', { 
        count: credentialIds.length,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      const batchResult = await verificationService.verifyBatch(credentialIds);
      const responseTime = performance.now() - startTime;

      logRequest(req.method, req.originalUrl, 200, responseTime, {
        credentialCount: credentialIds.length,
        validCount: batchResult.summary.valid,
        invalidCount: batchResult.summary.invalid,
      });

      res.status(200).json({
        success: true,
        data: batchResult,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('Batch verification failed', error as Error, {
        credentialCount: credentialIds.length,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      logRequest(req.method, req.originalUrl, 500, responseTime, {
        credentialCount: credentialIds.length,
        error: errorMessage,
      });

      res.status(500).json({
        success: false,
        error: 'Batch Verification Failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Unable to verify credentials at this time' 
          : errorMessage,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });
    }
  }

  /**
   * Verify credential from QR code data
   * POST /api/v1/verify/qr
   */
  async verifyQRCode(req: ValidatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const { qrData } = req.body;

    try {
      logInfo('QR code verification request received', { 
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      const verification = await verificationService.verifyFromQRCode(qrData);
      const responseTime = performance.now() - startTime;

      logRequest(req.method, req.originalUrl, 200, responseTime, {
        credentialId: verification.credentialId,
        valid: verification.valid,
      });

      res.status(200).json({
        success: true,
        data: verification,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('QR code verification failed', error as Error, {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      logRequest(req.method, req.originalUrl, 400, responseTime, {
        error: errorMessage,
      });

      res.status(400).json({
        success: false,
        error: 'QR Code Verification Failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Invalid QR code data' 
          : errorMessage,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });
    }
  }

  /**
   * Get public information about a credential
   * GET /api/v1/credentials/:credentialId/public
   */
  async getPublicCredentialInfo(req: ValidatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const { credentialId } = req.params;

    try {
      logInfo('Public credential info request received', { 
        credentialId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      const publicInfo = await verificationService.getPublicCredentialInfo(credentialId);
      const responseTime = performance.now() - startTime;

      if (!publicInfo) {
        logRequest(req.method, req.originalUrl, 404, responseTime, {
          credentialId,
          found: false,
        });

        res.status(404).json({
          success: false,
          error: 'Credential Not Found',
          message: 'The specified credential does not exist',
          timestamp: Date.now(),
          processingTime: Math.round(responseTime),
        });
        return;
      }

      logRequest(req.method, req.originalUrl, 200, responseTime, {
        credentialId,
        found: true,
      });

      res.status(200).json({
        success: true,
        data: publicInfo,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('Public credential info request failed', error as Error, {
        credentialId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      logRequest(req.method, req.originalUrl, 500, responseTime, {
        credentialId,
        error: errorMessage,
      });

      res.status(500).json({
        success: false,
        error: 'Request Failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Unable to retrieve credential information' 
          : errorMessage,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });
    }
  }

  /**
   * Generate QR code for credential
   * POST /api/v1/credentials/:credentialId/qr
   */
  async generateQRCode(req: ValidatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const { credentialId } = req.params;
    const { options } = req.body || {};

    try {
      logInfo('QR code generation request received', { 
        credentialId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      const qrCodeDataUrl = await verificationService.generateQRCode(credentialId, options);
      const responseTime = performance.now() - startTime;

      logRequest(req.method, req.originalUrl, 200, responseTime, {
        credentialId,
      });

      res.status(200).json({
        success: true,
        data: {
          credentialId,
          qrCodeDataUrl,
          format: 'data:image/png;base64',
        },
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('QR code generation failed', error as Error, {
        credentialId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      logRequest(req.method, req.originalUrl, 500, responseTime, {
        credentialId,
        error: errorMessage,
      });

      res.status(500).json({
        success: false,
        error: 'QR Code Generation Failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Unable to generate QR code' 
          : errorMessage,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });
    }
  }

  /**
   * Search public credentials
   * GET /api/v1/search/credentials
   */
  async searchPublicCredentials(req: ValidatedRequest, res: Response): Promise<void> {
    const startTime = performance.now();
    const searchParams = req.validatedQuery || req.query;

    try {
      logInfo('Public credential search request received', { 
        params: searchParams,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      const searchResult = await verificationService.searchPublicCredentials(searchParams);
      const responseTime = performance.now() - startTime;

      logRequest(req.method, req.originalUrl, 200, responseTime, {
        resultCount: searchResult.credentials.length,
        totalCount: searchResult.total,
        searchParams,
      });

      res.status(200).json({
        success: true,
        data: searchResult,
        pagination: {
          limit: searchParams.limit || 50,
          offset: searchParams.offset || 0,
          total: searchResult.total,
          hasMore: (searchParams.offset || 0) + searchResult.credentials.length < searchResult.total,
        },
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('Public credential search failed', error as Error, {
        searchParams,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });

      logRequest(req.method, req.originalUrl, 500, responseTime, {
        searchParams,
        error: errorMessage,
      });

      res.status(500).json({
        success: false,
        error: 'Search Failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Unable to search credentials at this time' 
          : errorMessage,
        timestamp: Date.now(),
        processingTime: Math.round(responseTime),
      });
    }
  }

  /**
   * Health check for verification service
   * GET /api/v1/verify/health
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    const startTime = performance.now();

    try {
      // Test blockchain connectivity
      const blockchainService = await import('../services/blockchain.service');
      const blockchainHealth = await blockchainService.blockchainService.healthCheck();
      
      const responseTime = performance.now() - startTime;
      const healthy = blockchainHealth.healthy;

      const healthStatus = {
        status: healthy ? 'healthy' : 'degraded',
        timestamp: Date.now(),
        services: {
          blockchain: {
            status: blockchainHealth.healthy ? 'up' : 'down',
            network: blockchainHealth.network,
            latency: blockchainHealth.latency,
          },
          database: {
            status: 'up', // Assume database is up if we reach this point
          },
          api: {
            status: 'up',
            responseTime: Math.round(responseTime),
          },
        },
      };

      const statusCode = healthy ? 200 : 503;

      logRequest(req.method, req.originalUrl, statusCode, responseTime, {
        healthy,
        blockchainLatency: blockchainHealth.latency,
      });

      res.status(statusCode).json({
        success: healthy,
        data: healthStatus,
      });

    } catch (error) {
      const responseTime = performance.now() - startTime;
      const errorMessage = (error as Error).message;

      logError('Health check failed', error as Error);

      logRequest(req.method, req.originalUrl, 503, responseTime, {
        error: errorMessage,
      });

      res.status(503).json({
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: Date.now(),
          error: process.env.NODE_ENV === 'production' 
            ? 'Service temporarily unavailable' 
            : errorMessage,
        },
      });
    }
  }
}

// Export singleton instance
export const verificationController = new VerificationController();