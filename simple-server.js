// Simple mock server using Node.js built-in modules
const http = require('http');
const url = require('url');

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

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const server = http.createServer((req, res) => {
  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Parse body for POST/PUT requests
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      let parsedBody = body ? JSON.parse(body) : {};

      // Routes
      if (path === '/api/health' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Backend is running' }));
        return;
      }

      if (path === '/api/users' && method === 'GET') {
        const filters = {
          role: parsedUrl.query.role,
          status: parsedUrl.query.status,
          search: parsedUrl.query.search
        };

        let filteredUsers = users.filter(user => {
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

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: filteredUsers }));
        return;
      }

      if (path.startsWith('/api/users/') && method === 'GET') {
        const id = parseInt(path.split('/')[3]);
        const user = users.find(u => u.id === id);
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User not found' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: user }));
        return;
      }

      if (path === '/api/users' && method === 'POST') {
        const { firstName, lastName, email, role, status, tempPassword } = parsedBody;
        
        if (!firstName || !lastName || !email || !tempPassword) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }

        if (users.find(u => u.email === email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Email already exists' }));
          return;
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
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newUser }));
        return;
      }

      if (path.startsWith('/api/users/') && method === 'PUT') {
        const id = parseInt(path.split('/')[3]);
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User not found' }));
          return;
        }

        const { firstName, lastName, email, role, status } = parsedBody;

        if (firstName) users[userIndex].firstName = firstName;
        if (lastName) users[userIndex].lastName = lastName;
        if (email) users[userIndex].email = email;
        if (role) users[userIndex].role = role;
        if (status) users[userIndex].status = status;

        users[userIndex].name = `${users[userIndex].firstName} ${users[userIndex].lastName}`;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: users[userIndex] }));
        return;
      }

      if (path.startsWith('/api/users/') && method === 'DELETE') {
        const id = parseInt(path.split('/')[3]);
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User not found' }));
          return;
        }

        users.splice(userIndex, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'User deleted successfully' }));
        return;
      }

      if (path.startsWith('/api/users/') && path.endsWith('/approve') && method === 'POST') {
        const id = parseInt(path.split('/')[3]);
        const user = users.find(u => u.id === id);
        
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User not found' }));
          return;
        }

        if (user.role !== 'uni_sup') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User is not a university supervisor' }));
          return;
        }

        user.status = 'active';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: user }));
        return;
      }

      if (path.startsWith('/api/users/') && path.endsWith('/reject') && method === 'POST') {
        const id = parseInt(path.split('/')[3]);
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User not found' }));
          return;
        }

        if (users[userIndex].role !== 'uni_sup') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'User is not a university supervisor' }));
          return;
        }

        users.splice(userIndex, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Supervisor rejected successfully' }));
        return;
      }

      // 404 for unknown routes
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Route not found' }));

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/users');
  console.log('  GET  /api/users/:id');
  console.log('  POST /api/users');
  console.log('  PUT  /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('  POST /api/users/:id/approve');
  console.log('  POST /api/users/:id/reject');
});
