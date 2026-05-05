import { BaseModel } from './BaseModel';

export class RefreshToken extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.tokenId = data.tokenId || data.id;
    this.userId = data.userId || data.user_id;
    this.token = data.token;
    this.expiresAt = data.expiresAt || data.expires_at;
    this.isRevoked = data.isRevoked || data.is_revoked;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      tokenId: 'id',
      userId: 'user_id',
      expiresAt: 'expires_at',
      isRevoked: 'is_revoked'
    };
  }

  getRequiredFields() {
    return ['userId', 'token', 'expiresAt'];
  }

  sanitize() {
    super.sanitize();
    // Remove fields that shouldn't be exposed
    delete this.token; // Token should never be exposed to frontend
    return this;
  }

  // Helper methods
  isExpired() {
    if (!this.expiresAt) return true;
    return new Date() > new Date(this.expiresAt);
  }

  isValid() {
    return !this.isRevoked && !this.isExpired();
  }

  getExpiryDisplay() {
    if (!this.expiresAt) return 'No expiry date';
    return new Date(this.expiresAt).toLocaleDateString();
  }

  getTimeUntilExpiry() {
    if (!this.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(this.expiresAt);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'Less than 1 hour';
    }
  }
}
