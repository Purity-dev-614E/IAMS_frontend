import { BaseModel } from './BaseModel';

export class DailyLog extends BaseModel {
  constructor(data = {}) {
    // Handle nested API response: {log: {...}} or direct data
    const logData = data.log || data;
    
    super(logData);
    // Ensure id is preserved from the original data
    this.id = logData.id;
    this.logId = logData.logId || logData.id || this.id;
    this.attachmentId = logData.attachmentId || logData.attachment_id;
    this.logDate = logData.logDate || logData.log_date;
    this.tasksPerformed = logData.tasksPerformed || logData.tasks_performed;
    this.skillsAcquired = logData.skillsAcquired || logData.skills_acquired;
    this.observations = logData.observations;
    this.status = logData.status;
    this.submittedAt = logData.submittedAt || logData.submitted_at;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      logId: 'id',
      attachmentId: 'attachment_id',
      logDate: 'log_date',
      tasksPerformed: 'tasks_performed',
      skillsAcquired: 'skills_acquired',
      submittedAt: 'submitted_at'
    };
  }

  getRequiredFields() {
    return ['attachmentId', 'logDate', 'tasksPerformed', 'skillsAcquired'];
  }

  sanitize() {
    super.sanitize();
    // Remove fields that shouldn't be sent in create/update requests
    delete this.logId;
    delete this.createdAt;
    delete this.updatedAt;
    delete this.submittedAt;
    return this;
  }

  // Helper methods
  isDraft() {
    return this.status === 'draft';
  }

  isSubmitted() {
    return this.status === 'submitted';
  }

  isReviewed() {
    return this.status === 'reviewed';
  }

  canEdit() {
    return this.isDraft();
  }

  getStatusDisplay() {
    const statusMap = {
      draft: 'Draft',
      submitted: 'Submitted',
      reviewed: 'Reviewed'
    };
    return statusMap[this.status] || 'Draft';
  }

  getFormattedDate() {
    if (!this.logDate) return '';
    return new Date(this.logDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedDateForInput() {
    if (!this.logDate) return '';
    return new Date(this.logDate).toISOString().split('T')[0];
  }

  getCharacterCounts() {
    return {
      tasks: this.tasksPerformed?.length || 0,
      skills: this.skillsAcquired?.length || 0,
      observations: this.observations?.length || 0
    };
  }

  // Validation limits
  getLimits() {
    return {
      tasks: 500,
      skills: 300,
      observations: 1000
    };
  }

  validate() {
    const errors = super.validate();
    const limits = this.getLimits();
    
    if (this.tasksPerformed && this.tasksPerformed.length > limits.tasks) {
      errors.push(`Tasks performed exceeds ${limits.tasks} character limit`);
    }
    
    if (this.skillsAcquired && this.skillsAcquired.length > limits.skills) {
      errors.push(`Skills acquired exceeds ${limits.skills} character limit`);
    }
    
    if (this.observations && this.observations.length > limits.observations) {
      errors.push(`Observations exceeds ${limits.observations} character limit`);
    }
    
    return errors;
  }
}
