import { BaseModel } from './BaseModel';

export class Report extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.reportId = data.reportId || data.id;
    this.generatedBy = data.generatedBy || data.generated_by;
    this.reportType = data.reportType || data.type;
    this.parameters = data.parameters;
    this.filePath = data.filePath || data.file_path;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      reportId: 'id',
      generatedBy: 'generated_by',
      reportType: 'type',
      filePath: 'file_path'
    };
  }

  getRequiredFields() {
    return ['generatedBy', 'reportType'];
  }

  sanitize() {
    super.sanitize();
    // Remove fields that shouldn't be sent in create requests
    delete this.reportId;
    delete this.createdAt;
    delete this.filePath; // File path is set by backend
    return this;
  }

  // Helper methods
  getTypeDisplay() {
    const typeMap = {
      'student': 'Student Report',
      'cohort': 'Cohort Report',
      'weekly-review-status': 'Weekly Review Status'
    };
    return typeMap[this.reportType] || this.reportType;
  }

  getFormattedDate() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString();
  }

  hasParameters() {
    return this.parameters && Object.keys(this.parameters).length > 0;
  }

  getParameterSummary() {
    if (!this.hasParameters()) return 'No parameters';
    return Object.entries(this.parameters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  isDownloadable() {
    return !!this.filePath;
  }
}
