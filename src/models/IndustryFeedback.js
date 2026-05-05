import { BaseModel } from './BaseModel';

export class IndustryFeedback extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.feedbackId = data.feedbackId || data.id;
    this.weeklyReviewId = data.weeklyReviewId || data.weekly_review_id;
    this.verificationToken = data.verificationToken || data.verification_token;
    this.comments = data.comments;
    this.improvements = data.improvements;
    this.approval = data.approval;
    this.submittedAt = data.submittedAt || data.submitted_at;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      feedbackId: 'id',
      weeklyReviewId: 'weekly_review_id',
      verificationToken: 'verification_token',
      submittedAt: 'submitted_at'
    };
  }

  getRequiredFields() {
    return ['weeklyReviewId'];
  }

  sanitize() {
    super.sanitize();
    // Remove fields that shouldn't be sent in create/update requests
    delete this.feedbackId;
    delete this.createdAt;
    delete this.updatedAt;
    delete this.submittedAt;
    delete this.verificationToken; // Token should only be used for verification, not stored
    return this;
  }

  // Helper methods
  isApproved() {
    return this.approval === 'approved';
  }

  isRejected() {
    return this.approval === 'rejected';
  }

  isPending() {
    return !this.approval;
  }

  getApprovalDisplay() {
    const approvalMap = {
      approved: 'Approved',
      rejected: 'Rejected',
      null: 'Pending'
    };
    return approvalMap[this.approval] || 'Pending';
  }

  getSubmittedDateDisplay() {
    if (!this.submittedAt) return 'Not submitted';
    return new Date(this.submittedAt).toLocaleDateString();
  }

  hasComments() {
    return this.comments && this.comments.trim().length > 0;
  }

  hasImprovements() {
    return this.improvements && this.improvements.trim().length > 0;
  }
}
