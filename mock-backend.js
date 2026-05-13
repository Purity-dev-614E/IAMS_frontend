// Simple mock backend server for testing user management
// Run with: node mock-backend.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let users = [
  {
    id: 1,
    name: 'Purity Chelagat Sang',
    firstName: 'Purity',
    lastName: 'Chelagat Sang',
    email: 'purity.sang@students.jkuat.ac.ke',
    role: 'student',
    status: 'active',
    registered: '17 Feb 2025',
    lastActive: 'Today'
  },
  {
    id: 2,
    name: 'Grace Wanjiru',
    firstName: 'Grace',
    lastName: 'Wanjiru',
    email: 'grace.wanjiru@students.jkuat.ac.ke',
    role: 'student',
    status: 'active',
    registered: '17 Feb 2025',
    lastActive: '2 hrs ago'
  },
  {
    id: 3,
    name: 'Dr. Francis Kamau',
    firstName: 'Francis',
    lastName: 'Kamau',
    email: 'f.kamau@jkuat.ac.ke',
    role: 'uni_sup',
    status: 'active',
    registered: '10 Jan 2025',
    lastActive: 'Yesterday'
  },
  {
    id: 4,
    name: 'Dr. Alice Njoroge',
    firstName: 'Alice',
    lastName: 'Njoroge',
    email: 'a.njoroge@jkuat.ac.ke',
    role: 'uni_sup',
    status: 'pending',
    registered: '1 Apr 2025',
    lastActive: 'Never'
  },
  {
    id: 5,
    name: 'System Administrator',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@jkuat.ac.ke',
    role: 'admin',
    status: 'active',
    registered: '1 Jan 2025',
    lastActive: 'Today'
  }
];

let nextId = 6;

// Mock attachments data
let attachments = [
  {
    id: "uuid-001",
    organization_name: "Tech Company Ltd",
    industry_supervisor_name: "John Smith",
    industry_supervisor_email: "john@techcompany.com",
    start_date: "2024-01-15T00:00:00.000Z",
    end_date: "2024-06-15T00:00:00.000Z",
    status: "active",
    created_at: "2024-01-10T10:30:00.000Z",
    student_name: "Alice Johnson",
    student_email: "alice@university.edu",
    reg_number: "STD001",
    program: "Computer Science",
    year_of_study: 3,
    supervisor_name: "Dr. Jane Doe",
    supervisor_email: "jane@university.edu",
    logs: 15
  },
  {
    id: "uuid-002",
    organization_name: "Digital Solutions Inc",
    industry_supervisor_name: "Sarah Williams",
    industry_supervisor_email: "sarah@digitalsolutions.com",
    start_date: "2024-02-01T00:00:00.000Z",
    end_date: "2024-07-01T00:00:00.000Z",
    status: "pending",
    created_at: "2024-01-25T14:20:00.000Z",
    student_name: "Bob Martinez",
    student_email: "bob@university.edu",
    reg_number: "STD002",
    program: "Software Engineering",
    year_of_study: 3,
    supervisor_name: "Dr. Robert Chen",
    supervisor_email: "robert@university.edu",
    logs: 0
  },
  {
    id: "uuid-003",
    organization_name: "Innovation Labs",
    industry_supervisor_name: "Michael Davis",
    industry_supervisor_email: "michael@innovationlabs.com",
    start_date: "2023-09-01T00:00:00.000Z",
    end_date: "2024-02-01T00:00:00.000Z",
    status: "completed",
    created_at: "2023-08-20T09:15:00.000Z",
    student_name: "Carol White",
    student_email: "carol@university.edu",
    reg_number: "STD003",
    program: "Information Technology",
    year_of_study: 4,
    supervisor_name: "Dr. Emily Brown",
    supervisor_email: "emily@university.edu",
    logs: 45
  }
];

let nextAttachmentId = 4;

// Helper function to filter users
const filterUsers = (users, filters) => {
  return users.filter(user => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.status && user.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!user.name.toLowerCase().includes(searchLower) && 
          !user.email.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

// Get all users with filtering
app.get('/api/users', (req, res) => {
  const filters = {
    role: req.query.role,
    status: req.query.status,
    search: req.query.search
  };
  
  const filteredUsers = filterUsers(users, filters);
  res.json({ success: true, data: filteredUsers });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// Create user
app.post('/api/users', (req, res) => {
  const { firstName, lastName, email, role, status, tempPassword } = req.body;
  
  if (!firstName || !lastName || !email || !tempPassword) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  
  const newUser = {
    id: nextId++,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email,
    role: role || 'student',
    status: status || 'active',
    registered: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    lastActive: 'Today'
  };
  
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const { firstName, lastName, email, role, status } = req.body;
  
  if (firstName) users[userIndex].firstName = firstName;
  if (lastName) users[userIndex].lastName = lastName;
  if (email) users[userIndex].email = email;
  if (role) users[userIndex].role = role;
  if (status) users[userIndex].status = status;
  
  // Update name if firstName or lastName changed
  users[userIndex].name = `${users[userIndex].firstName} ${users[userIndex].lastName}`;
  
  res.json({ success: true, data: users[userIndex] });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.json({ success: true, message: 'User deleted successfully' });
});

// Approve supervisor
app.post('/api/users/:id/approve', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  if (user.role !== 'uni_sup') {
    return res.status(400).json({ success: false, message: 'User is not a university supervisor' });
  }
  
  user.status = 'active';
  res.json({ success: true, data: user });
});

// Reject supervisor
app.post('/api/users/:id/reject', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  if (users[userIndex].role !== 'uni_sup') {
    return res.status(400).json({ success: false, message: 'User is not a university supervisor' });
  }
  
  users.splice(userIndex, 1);
  res.json({ success: true, message: 'Supervisor rejected successfully' });
});

// Get pending supervisors
app.get('/api/users/pending-supervisors', (req, res) => {
  const pendingSupervisors = users.filter(u => u.role === 'uni_sup' && u.status === 'pending');
  res.json({ success: true, data: pendingSupervisors });
});

// Get users by role
app.get('/api/users/role/:role', (req, res) => {
  const role = req.params.role;
  const roleUsers = users.filter(u => u.role === role);
  res.json({ success: true, data: roleUsers });
});

app.listen(port, () => {
  console.log(`Mock backend server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/users');
  console.log('  GET  /api/users/:id');
  console.log('  POST /api/users');
  console.log('  PUT  /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('  POST /api/users/:id/approve');
  console.log('  POST /api/users/:id/reject');
  console.log('  GET  /api/users/pending-supervisors');
  console.log('  GET  /api/users/role/:role');
});
