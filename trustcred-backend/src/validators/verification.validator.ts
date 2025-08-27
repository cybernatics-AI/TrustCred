import Joi from 'joi';

// Credential ID validation (hex string, 64 characters)
const credentialIdSchema = Joi.string()
  .pattern(/^[a-fA-F0-9]{64}$/)
  .required()
  .messages({
    'string.pattern.base': 'Credential ID must be a 64-character hexadecimal string',
    'any.required': 'Credential ID is required',
  });

// Optional credential ID for some endpoints
const optionalCredentialIdSchema = credentialIdSchema.optional();

// Batch verification schema
export const batchVerificationSchema = Joi.object({
  credentialIds: Joi.array()
    .items(credentialIdSchema)
    .min(1)
    .max(50) // Limit batch size for performance
    .required()
    .messages({
      'array.min': 'At least one credential ID is required',
      'array.max': 'Maximum 50 credentials can be verified at once',
      'any.required': 'Credential IDs array is required',
    }),
});

// Single credential verification schema
export const singleVerificationSchema = Joi.object({
  credentialId: credentialIdSchema,
});

// QR code verification schema
export const qrVerificationSchema = Joi.object({
  qrData: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'QR data must be at least 10 characters',
      'string.max': 'QR data must not exceed 1000 characters',
      'any.required': 'QR data is required',
    }),
});

// QR code generation schema
export const qrGenerationSchema = Joi.object({
  credentialId: credentialIdSchema,
  options: Joi.object({
    width: Joi.number().integer().min(100).max(1000).default(300),
    margin: Joi.number().integer().min(0).max(10).default(2),
    errorCorrectionLevel: Joi.string().valid('L', 'M', 'Q', 'H').default('M'),
  }).optional(),
});

// Public credential search schema
export const publicSearchSchema = Joi.object({
  issuer: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Issuer name must be at least 2 characters',
      'string.max': 'Issuer name must not exceed 100 characters',
    }),
  
  schema: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Schema name must be at least 2 characters',
      'string.max': 'Schema name must not exceed 100 characters',
    }),
    
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
    .optional()
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
    
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional()
    .messages({
      'number.min': 'Offset must be at least 0',
    }),
});

// Route parameter validation for credential ID
export const credentialIdParamSchema = Joi.object({
  credentialId: credentialIdSchema,
});

// Common validation middleware
export const validateCredentialId = (req: any, res: any, next: any) => {
  const { error } = credentialIdParamSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message,
    });
  }
  next();
};

export const validateBatchVerification = (req: any, res: any, next: any) => {
  const { error } = batchVerificationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message,
    });
  }
  next();
};

export const validateQRVerification = (req: any, res: any, next: any) => {
  const { error } = qrVerificationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message,
    });
  }
  next();
};

export const validateQRGeneration = (req: any, res: any, next: any) => {
  const { error } = qrGenerationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message,
    });
  }
  next();
};

export const validatePublicSearch = (req: any, res: any, next: any) => {
  const { error } = publicSearchSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message,
    });
  }
  
  // Add validated and sanitized data to request
  req.validatedQuery = publicSearchSchema.validate(req.query).value;
  next();
};