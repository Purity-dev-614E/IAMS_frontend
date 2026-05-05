import { BaseModel } from './BaseModel';

export class WeeklyReview extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.reviewId = data.reviewId || data.id;
    this.attachmentId = data.attachmentId || data.attachment_id;
    this.weekNumber = data.weekNumber || data.week_number;
    this.weekStartDate = data.weekStartDate || data.week_start_date;
    this.weekEndDate = data.weekEndDate || data.week_end_date;
    this.status = data.status;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      reviewId: 'id',
      attachmentId: 'attachment_id',
      weekNumber: 'week_number',
      weekStartDate: 'week_start_date',
      weekEndDate: 'week_end_date'
    };
  }

  getRequiredFields() {
    return ['attachmentId', 'weekNumber', 'weekStartDate', 'weekEndDate'];
  }

  // Helper methods
  isPending() {
    return this.status === 'pending';
  }

  isIndustryReviewed() {
    return this.status === 'industry_reviewed';
  }

  isUniReviewed() {
    return this.status === 'uni_reviewed';
  }

  isComplete() {
    return this.status === 'complete';
  }

  getStatusDisplay() {
    const statusMap = {
      pending: 'Pending',
      industry_reviewed: 'Industry Reviewed',
      uni_reviewed: 'University Reviewed',
      complete: 'Complete'
    };
    return statusMap[this.status] || this.status;
  }

  getWeekDisplay() {
    return `Week ${this.weekNumber}`;
  }

  getDateRangeDisplay() {
    if (!this.weekStartDate || !this.weekEndDate) return '';
    const start = new Date(this.weekStartDate).toLocaleDateString();
    const end = new Date(this.weekEndDate).toLocaleDateString();
    return `${start} – ${end}`;
  }

  canReceiveIndustryFeedback() {
    return this.isPending() || this.isUniReviewed();
  }

  canReceiveUniFeedback() {
    return this.isIndustryReviewed();
  }
}
