import { BaseModel } from './BaseModel';

export class Student extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.studentId = data.studentId || data.id;
    this.userId = data.userId || data.user_id;
    this.registrationNumber = data.registrationNumber || data.reg_number;
    this.program = data.program;
    this.school = data.school;
    this.yearOfStudy = data.yearOfStudy || data.year_of_study;
    this.admissionYear = data.admissionYear || data.admission_year;
    this.academicStatus = data.academicStatus || data.academic_status;
    this.supervisorId = data.supervisorId || data.uni_supervisor_id;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      studentId: 'id',
      userId: 'user_id',
      registrationNumber: 'reg_number',
      school: 'school',
      yearOfStudy: 'year_of_study',
      admissionYear: 'admission_year',
      academicStatus: 'academic_status',
      supervisorId: 'uni_supervisor_id'
    };
  }

  getRequiredFields() {
    return ['registrationNumber', 'program', 'yearOfStudy'];
  }

  // Helper methods
  getYearDisplay() {
    return `Year ${this.yearOfStudy}`;
  }

  getProgramDisplay() {
    return this.program || 'Not specified';
  }
}
