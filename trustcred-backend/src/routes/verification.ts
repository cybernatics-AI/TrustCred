import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller';
import {
  validateCredentialId,
  validateBatchVerification,
  validateQRVerification,
  validateQRGeneration,
  validatePublicSearch,
} from '../validators/verification.validator';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to all verification routes
// Different limits for different endpoints
const verificationRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many verification requests, please try again later',
    retryAfter: 900, // 15 minutes in seconds
  },
});

const batchRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 10, // 10 batch requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too Many Batch Requests',
    message: 'Too many batch verification requests, please try again later',
    retryAfter: 900,
  },
});

const searchRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 search requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too Many Search Requests',
    message: 'Too many search requests, please try again later',
    retryAfter: 900,
  },
});

// =============================================================================
// PUBLIC VERIFICATION ENDPOINTS (No authentication required)
// =============================================================================

/**
 * @route   GET /api/v1/verify/health
 * @desc    Health check for verification service
 * @access  Public
 */
router.get(
  '/verify/health',
  verificationController.healthCheck.bind(verificationController)
);

/**
 * @route   POST /api/v1/verify/batch
 * @desc    Verify multiple credentials in one request
 * @access  Public
 * @body    { "credentialIds": ["abc123...", "def456..."] }
 */
router.post(
  '/verify/batch',
  batchRateLimit,
  validateBatchVerification,
  verificationController.verifyBatch.bind(verificationController)
);

/**
 * @route   POST /api/v1/verify/qr
 * @desc    Verify credential from QR code data
 * @access  Public
 * @body    { "qrData": "JSON string from QR code" }
 */
router.post(
  '/verify/qr',
  verificationRateLimit,
  validateQRVerification,
  verificationController.verifyQRCode.bind(verificationController)
);

/**
 * @route   GET /api/v1/verify/:credentialId
 * @desc    Verify a single credential by ID
 * @access  Public
 * @example GET /api/v1/verify/abc123def456...
 */
router.get(
  '/verify/:credentialId',
  verificationRateLimit,
  validateCredentialId,
  verificationController.verifyCredential.bind(verificationController)
);

// =============================================================================
// PUBLIC CREDENTIAL INFO ENDPOINTS
// =============================================================================

/**
 * @route   GET /api/v1/credentials/:credentialId/public
 * @desc    Get public information about a credential
 * @access  Public
 */
router.get(
  '/credentials/:credentialId/public',
  verificationRateLimit,
  validateCredentialId,
  verificationController.getPublicCredentialInfo.bind(verificationController)
);

/**
 * @route   POST /api/v1/credentials/:credentialId/qr
 * @desc    Generate QR code for a credential
 * @access  Public
 * @body    { "options": { "width": 300, "margin": 2 } } (optional)
 */
router.post(
  '/credentials/:credentialId/qr',
  verificationRateLimit,
  validateCredentialId,
  validateQRGeneration,
  verificationController.generateQRCode.bind(verificationController)
);

/**
 * @route   GET /api/v1/search/credentials
 * @desc    Search public credentials by issuer, schema, etc.
 * @access  Public
 * @query   ?issuer=university&schema=diploma&limit=10&offset=0
 */
router.get(
  '/search/credentials',
  searchRateLimit,
  validatePublicSearch,
  verificationController.searchPublicCredentials.bind(verificationController)
);

// =============================================================================
// DOCUMENTATION & EXAMPLES
// =============================================================================

/**
 * @route   GET /api/v1/verify/docs
 * @desc    API documentation for verification endpoints
 * @access  Public
 */
router.get('/verify/docs', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'TrustCred Verification API',
      version: '1.0.0',
      description: 'Public API for verifying digital credentials on the Stacks blockchain',
      baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
      endpoints: {
        verify: {
          single: {
            method: 'GET',
            path: '/verify/:credentialId',
            description: 'Verify a single credential by ID',
            parameters: {
              credentialId: 'string (64-char hex) - The credential ID to verify',
            },
            example: '/verify/a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd',
          },
          batch: {
            method: 'POST',
            path: '/verify/batch',
            description: 'Verify multiple credentials at once (max 50)',
            body: {
              credentialIds: 'array of strings - Credential IDs to verify',
            },
            example: {
              credentialIds: [
                'a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd',
                'b2c3d4e5f6789012345678901234567890123456789012345678901234abcde',
              ],
            },
          },
          qr: {
            method: 'POST',
            path: '/verify/qr',
            description: 'Verify credential from QR code data',
            body: {
              qrData: 'string - JSON data from QR code',
            },
          },
        },
        credentials: {
          public: {
            method: 'GET',
            path: '/credentials/:credentialId/public',
            description: 'Get public information about a credential',
          },
          qrGenerate: {
            method: 'POST',
            path: '/credentials/:credentialId/qr',
            description: 'Generate QR code for a credential',
            body: {
              options: 'object (optional) - QR code generation options',
            },
          },
        },
        search: {
          method: 'GET',
          path: '/search/credentials',
          description: 'Search public credentials',
          query: {
            issuer: 'string (optional) - Filter by issuer name or address',
            schema: 'string (optional) - Filter by schema name',
            limit: 'number (optional) - Results per page (max 100, default 50)',
            offset: 'number (optional) - Pagination offset (default 0)',
          },
          example: '/search/credentials?issuer=university&limit=20',
        },
      },
      rateLimits: {
        verification: '100 requests per 15 minutes',
        batch: '10 requests per 15 minutes',
        search: '50 requests per 15 minutes',
      },
      responseFormat: {
        success: {
          success: true,
          data: 'object - Response data',
          timestamp: 'number - Unix timestamp',
          processingTime: 'number - Processing time in milliseconds',
        },
        error: {
          success: false,
          error: 'string - Error type',
          message: 'string - Error description',
          timestamp: 'number - Unix timestamp',
        },
      },
    },
    timestamp: Date.now(),
  });
});

export default router;