import { BaseModel } from './BaseModel';

export class Attachment extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.attachmentId = data.attachmentId || data.id;
    this.studentId = data.studentId || data.student_id;
    this.organizationName = data.organizationName || data.organization_name || data.organization;
    this.industrySupervisorName = data.industrySupervisorName || data.industry_supervisor_name || data.supervisorName;
    this.industrySupervisorEmail = data.industrySupervisorEmail || data.industry_supervisor_email || data.supervisorEmail;
    this.universitySupervisorName = data.universitySupervisorName
      || data.universitySupervisor
      || data.university_supervisor
      || data.uniSupervisorName
      || data.uni_supervisor_name
      || data.supervisor_name
      || data.supervisor?.name
      || '';
    this.universitySupervisorId = data.universitySupervisorId || data.uni_supervisor_id || data.supervisor?.id || null;
    this.universitySupervisorEmail = data.universitySupervisorEmail || data.supervisor_email || data.supervisor?.email || '';
    this.universitySupervisorStaffId = data.universitySupervisorStaffId || data.supervisor_staff_id || data.supervisor?.staff_id || '';
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
      universitySupervisorName: 'supervisor_name',
      universitySupervisorId: 'uni_supervisor_id',
      universitySupervisorEmail: 'supervisor_email',
      universitySupervisorStaffId: 'supervisor_staff_id',
      startDate: 'start_date',
      endDate: 'end_date'
    };
  }

  getRequiredFields() {
    return ['organizationName', 'startDate', 'endDate'];
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
