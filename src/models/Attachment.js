import { BaseModel } from './BaseModel';

export class Attachment extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.attachmentId = data.attachmentId || data.id;
    this.studentId = data.studentId || data.student_id;
    this.organizationName = data.organizationName || data.organization_name;
    this.industrySupervisorName = data.industrySupervisorName || data.industry_supervisor_name;
    this.industrySupervisorEmail = data.industrySupervisorEmail || data.industry_supervisor_email;
    this.startDate = data.startDate || data.start_date;
    this.endDate = data.endDate || data.end_date;
    this.status = data.status;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      attachmentId: 'id',
      studentId: 'student_id',
      organizationName: 'organization_name',
      industrySupervisorName: 'industry_supervisor_name',
      industrySupervisorEmail: 'industry_supervisor_email',
      startDate: 'start_date',
      endDate: 'end_date'
    };
  }

  getRequiredFields() {
    return ['studentId', 'organizationName', 'startDate', 'endDate'];
  }

  // Helper methods
  isActive() {
    return this.status === 'active';
  }

  isPending() {
    return this.status === 'pending';
  }

  isCompleted() {
    return this.status === 'completed';
  }

  getDurationInDays() {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFormattedDateRange() {
    if (!this.startDate || !this.endDate) return '';
    const start = new Date(this.startDate).toLocaleDateString();
    const end = new Date(this.endDate).toLocaleDateString();
    return `${start} – ${end}`;
  }

  getStatusDisplay() {
    const statusMap = {
      pending: 'Pending Approval',
      active: 'Active',
      completed: 'Completed'
    };
    return statusMap[this.status] || this.status;
  }
}
