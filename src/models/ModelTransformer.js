/**
 * Model Transformer Utility
 * Handles transformation between API responses and frontend models
 */

import { BaseModel } from './BaseModel';

export class ModelTransformer {
  /**
   * Transform API response data to model instances
   * @param {Object|Array} data - Raw API response data
   * @param {Class} ModelClass - Model class to transform to
   * @returns {Object|Array} Transformed model instance(s)
   */
  static transform(data, ModelClass) {
    if (Array.isArray(data)) {
      return data.map(item => BaseModel.fromDatabase(item, ModelClass));
    }
    return BaseModel.fromDatabase(data, ModelClass);
  }

  /**
   * Transform model instances to API request format
   * @param {Object|Array} models - Model instance(s)
   * @returns {Object|Array} Data ready for API request
   */
  static transformToAPI(models) {
    if (Array.isArray(models)) {
      return models.map(model => {
        const sanitized = model.sanitize();
        return sanitized.toDatabaseFormat();
      });
    }
    const sanitized = models.sanitize();
    return sanitized.toDatabaseFormat();
  }

  /**
   * Transform paginated API response
   * @param {Object} response - Paginated API response
   * @param {Class} ModelClass - Model class for data items
   * @returns {Object} Transformed paginated response
   */
  static transformPaginated(response, ModelClass) {
    if (!response || !response.data) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
    }

    return {
      data: this.transform(response.data, ModelClass),
      pagination: {
        page: response.page || 1,
        limit: response.limit || 20,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }
    };
  }

  /**
   * Validate model before API request
   * @param {Object} model - Model instance
   * @returns {Object} Validation result
   */
  static validate(model) {
    const errors = model.validate();
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Transform API error response to consistent format
   * @param {Error|Object} error - API error
   * @returns {Object} Standardized error object
   */
  static transformError(error) {
    if (error.response) {
      // HTTP error response
      return {
        message: error.response.data?.message || error.message,
        status: error.response.status,
        code: error.response.data?.code,
        details: error.response.data?.details || {}
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        code: 'NETWORK_ERROR',
        details: {}
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500,
        code: 'UNKNOWN_ERROR',
        details: {}
      };
    }
  }

  /**
   * Create success response wrapper
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @returns {Object} Standardized success response
   */
  static createSuccessResponse(data, message = 'Operation successful') {
    return {
      success: true,
      data,
      message
    };
  }

  /**
   * Create error response wrapper
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   * @returns {Object} Standardized error response
   */
  static createErrorResponse(message, details = {}) {
    return {
      success: false,
      message,
      details
    };
  }
}

// Export convenience functions for common operations
export const transformToModel = ModelTransformer.transform;
export const transformToAPI = ModelTransformer.transformToAPI;
export const transformPaginated = ModelTransformer.transformPaginated;
export const validateModel = ModelTransformer.validate;
export const transformError = ModelTransformer.transformError;
export const createSuccessResponse = ModelTransformer.createSuccessResponse;
export const createErrorResponse = ModelTransformer.createErrorResponse;
