/**
 * End of Attachment Report Model
 * Represents student end-of-attachment reports (PDF or text submissions)
 */

import { BaseModel } from './BaseModel';

export class EndOfAttachmentReport extends BaseModel {
  constructor(data = {}) {
    super(data);
    
    // Core fields
    this.attachmentId = data.attachmentId || data.attachment_id || null;
    this.studentId = data.studentId || data.student_id || null;
    this.submissionType = data.submissionType || data.submission_type || 'text';
    this.textContent = data.textContent || data.text_content || '';
    this.pdfFilePath = data.pdfFilePath || data.pdf_file_path || '';
    this.pdfFilename = data.pdfFilename || data.pdf_filename || '';
    
    // Status and review fields
    this.status = data.status || 'submitted';
    this.feedbackComments = data.feedbackComments || data.feedback_comments || '';
    this.reviewedBy = data.reviewedBy || data.reviewed_by || null;
    this.reviewedAt = data.reviewedAt || data.reviewed_at || null;
    this.submittedAt = data.submittedAt || data.submitted_at || null;
  }

  // Field mapping for database conversion
  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      attachmentId: 'attachment_id',
      studentId: 'student_id',
      submissionType: 'submission_type',
      textContent: 'text_content',
      pdfFilePath: 'pdf_file_path',
      pdfFilename: 'pdf_filename',
      feedbackComments: 'feedback_comments',
      reviewedBy: 'reviewed_by',
      reviewedAt: 'reviewed_at',
      submittedAt: 'submitted_at'
    };
  }

  // Get required fields for validation
  getRequiredFields() {
    const baseRequired = ['attachmentId', 'studentId'];
    
    // Add submission type specific requirements
    if (this.submissionType === 'text') {
      return [...baseRequired, 'textContent'];
    } else if (this.submissionType === 'pdf') {
      return [...baseRequired, 'pdfFilePath', 'pdfFilename'];
    }
    
    return baseRequired;
  }

  // Validate model data
  validate() {
    const errors = super.validate();
    
    // Validate submission type
    if (!['text', 'pdf'].includes(this.submissionType)) {
      errors.push('Submission type must be either "text" or "pdf"');
    }
    
    // Validate status
    if (!['submitted', 'under_review', 'approved', 'rejected'].includes(this.status)) {
      errors.push('Status must be one of: submitted, under_review, approved, rejected');
    }
    
    // Validate text content for text submissions
    if (this.submissionType === 'text') {
      if (!this.textContent || this.textContent.trim().length === 0) {
        errors.push('Text content is required for text submissions');
      } else if (this.textContent.trim().length < 100) {
        errors.push('Text content must be at least 100 characters');
      }
    }
    
    // Validate PDF fields for PDF submissions
    if (this.submissionType === 'pdf') {
      if (!this.pdfFilePath || this.pdfFilePath.trim().length === 0) {
        errors.push('PDF file path is required for PDF submissions');
      }
      if (!this.pdfFilename || this.pdfFilename.trim().length === 0) {
        errors.push('PDF filename is required for PDF submissions');
      }
    }
    
    return errors;
  }

  // Sanitize data before saving
  sanitize() {
    super.sanitize();
    
    // Trim text fields
    if (this.textContent) {
      this.textContent = this.textContent.trim();
    }
    if (this.feedbackComments) {
      this.feedbackComments = this.feedbackComments.trim();
    }
    if (this.pdfFilename) {
      this.pdfFilename = this.pdfFilename.trim();
    }
    
    return this;
  }

  // Check if report is submitted by a specific student
  isSubmittedBy(studentId) {
    return this.studentId === studentId;
  }

  // Check if report can be reviewed
  canBeReviewed() {
    return this.status === 'submitted' || this.status === 'under_review';
  }

  // Check if report is approved
  isApproved() {
    return this.status === 'approved';
  }

  // Check if report is rejected
  isRejected() {
    return this.status === 'rejected';
  }

  // Check if report is under review
  isUnderReview() {
    return this.status === 'under_review';
  }

  // Get submission type display name
  getSubmissionTypeDisplay() {
    return this.submissionType === 'pdf' ? 'PDF File' : 'Text Content';
  }

  // Get status display name
  getStatusDisplay() {
    const statusMap = {
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return statusMap[this.status] || this.status;
  }

  // Check if report has feedback
  hasFeedback() {
    return this.feedbackComments && this.feedbackComments.trim().length > 0;
  }

  // Get file size validation for PDF uploads
  static validatePdfFileSize(fileSize) {
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    return fileSize <= maxSize;
  }

  // Get max file size for PDF uploads
  static getMaxPdfFileSize() {
    return 10 * 1024 * 1024; // 10MB
  }

  // Generate filename for PDF uploads
  static generatePdfFilename(originalFilename) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000000000);
    const extension = originalFilename.split('.').pop().toLowerCase();
    
    return `end-of-attachment-${timestamp}-${randomSuffix}.${extension}`;
  }

  // Check if file is a valid PDF
  static isValidPdfFile(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return extension === 'pdf';
  }
}
