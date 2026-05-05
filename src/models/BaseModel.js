/**
 * Base Model Class
 * Provides common functionality for all data models
 */

export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || data.created_at || null;
    this.updatedAt = data.updatedAt || data.updated_at || null;
  }

  // Convert model to plain object for API requests
  toJSON() {
    const result = {};
    for (const key in this) {
      if (this.hasOwnProperty(key) && this[key] !== undefined) {
        result[key] = this[key];
      }
    }
    return result;
  }

  // Convert model to database format (snake_case)
  toDatabaseFormat() {
    const result = {};
    const fieldMap = this.getFieldMapping();
    
    for (const [frontendField, value] of Object.entries(this.toJSON())) {
      const dbField = fieldMap[frontendField] || frontendField;
      if (value !== undefined && value !== null) {
        result[dbField] = value;
      }
    }
    
    return result;
  }

  // Create model instance from database response
  static fromDatabase(data, ModelClass) {
    const fieldMap = new ModelClass().getFieldMapping();
    const reverseMap = Object.fromEntries(
      Object.entries(fieldMap).map(([key, value]) => [value, key])
    );
    
    const transformedData = {};
    for (const [dbField, value] of Object.entries(data)) {
      const frontendField = reverseMap[dbField] || dbField;
      transformedData[frontendField] = value;
    }
    
    return new ModelClass(transformedData);
  }

  // Get field mapping (to be overridden by subclasses)
  getFieldMapping() {
    return {
      id: 'id',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
  }

  // Validate required fields
  validate() {
    const errors = [];
    const requiredFields = this.getRequiredFields();
    
    for (const field of requiredFields) {
      if (!this[field]) {
        errors.push(`${field} is required`);
      }
    }
    
    return errors;
  }

  // Get required fields (to be overridden by subclasses)
  getRequiredFields() {
    return [];
  }

  // Sanitize data before saving
  sanitize() {
    // Base sanitization - remove sensitive fields
    delete this.password_hash;
    delete this.token;
    delete this.verificationToken;
    
    return this;
  }
}
