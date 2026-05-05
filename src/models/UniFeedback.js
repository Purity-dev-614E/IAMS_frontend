import { BaseModel } from './BaseModel';

export class UniFeedback extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.feedbackId = data.feedbackId || data.id;
    this.weeklyReviewId = data.weeklyReviewId || data.weekly_review_id;
    this.supervisorId = data.supervisorId || data.uni_supervisor_id;
    this.comments = data.comments;
    this.improvements = data.improvements;
    this.rating = data.rating;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      feedbackId: 'id',
      weeklyReviewId: 'weekly_review_id',
      supervisorId: 'uni_supervisor_id'
    };
  }

  getRequiredFields() {
    return ['weeklyReviewId', 'supervisorId'];
  }

  sanitize() {
    super.sanitize();
    // Remove fields that shouldn't be sent in create/update requests
    delete this.feedbackId;
    delete this.createdAt;
    delete this.updatedAt;
    return this;
  }

  // Helper methods
  getRatingDisplay() {
    if (!this.rating) return 'Not rated';
    return `${this.rating}/5`;
  }

  getRatingStars() {
    if (!this.rating) return '';
    const stars = '★'.repeat(this.rating);
    const emptyStars = '☆'.repeat(5 - this.rating);
    return stars + emptyStars;
  }

  hasComments() {
    return this.comments && this.comments.trim().length > 0;
  }

  hasImprovements() {
    return this.improvements && this.improvements.trim().length > 0;
  }

  isValidRating() {
    return this.rating >= 1 && this.rating <= 5;
  }

  validate() {
    const errors = super.validate();
    
    if (this.rating && !this.isValidRating()) {
      errors.push('Rating must be between 1 and 5');
    }
    
    return errors;
  }
}
