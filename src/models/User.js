import { BaseModel } from './BaseModel';

export class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.userId || data.id;
    this.userName = data.userName || data.name;
    this.userEmail = data.userEmail || data.email;
    this.userRole = data.userRole || data.role;
    this.userStatus = data.userStatus || data.status;
    this.department = data.department;
    this.staffId = data.staffId || data.staff_id;
  }

  getFieldMapping() {
    return {
      ...super.getFieldMapping(),
      userId: 'id',
      userName: 'name',
      userEmail: 'email',
      userRole: 'role',
      userStatus: 'status',
      department: 'department',
      staffId: 'staff_id'
    };
  }

  getRequiredFields() {
    return ['userName', 'userEmail', 'userRole'];
  }

  sanitize() {
    super.sanitize();
    // Remove sensitive fields that shouldn't be sent to frontend
    delete this.password_hash;
    return this;
  }

  // Helper methods
  isAdmin() {
    return this.userRole === 'admin';
  }

  isStudent() {
    return this.userRole === 'student';
  }

  isUniSupervisor() {
    return ['uni_supervisor', 'uni_sup'].includes(this.userRole);
  }

  getDisplayName() {
    return this.userName || 'Unknown User';
  }

  // Add role getter for backward compatibility
  get role() {
    return this.userRole;
  }

  get name() {
    return this.userName;
  }

  get email() {
    return this.userEmail;
  }

  get status() {
    return this.userStatus;
  }
}
