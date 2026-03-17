const express = require('express');
const cors = require('cors');
const { sql, connectToDB } = require('./config/db');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Validation middleware
const validateEmployee = (req, res, next) => {
  const { name, age, position } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }
  
  if (!age || isNaN(age) || age < 1 || age > 100) {
    return res.status(400).json({ error: 'Age must be between 1 and 100' });
  }
  
  if (!position || typeof position !== 'string' || position.trim().length < 2) {
    return res.status(400).json({ error: 'Position must be at least 2 characters long' });
  }
  
  next();
};

// Connect to database
connectToDB();

// API Routes
app.get('/api/employees', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT id, name, age, position
      FROM Employees
      ORDER BY id
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    
    const result = await sql.query`
      SELECT id, name, age, position
      FROM Employees
      WHERE id = ${id}
    `;
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

app.post('/api/employees', validateEmployee, async (req, res) => {
  try {
    const { name, age, position } = req.body;
    
    const result = await sql.query`
      INSERT INTO Employees (name, age, position)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.age, INSERTED.position
      VALUES (${name.trim()}, ${parseInt(age)}, ${position.trim()})
    `;
    
    // Broadcast WebSocket event
    broadcast({
      type: 'employee_created',
      data: result.recordset[0]
    });
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating employee:', err);
    if (err.number === 2627) { // Unique constraint violation
      res.status(409).json({ error: 'Employee already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }
});

app.put('/api/employees/:id', validateEmployee, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const { name, age, position } = req.body;

    // Update without OUTPUT clause (to work with triggers)
    const updateResult = await sql.query`
      UPDATE Employees
      SET name = ${name.trim()}, age = ${parseInt(age)}, position = ${position.trim()}
      WHERE id = ${id}
    `;

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Fetch updated employee data
    const result = await sql.query`
      SELECT id, name, age, position
      FROM Employees
      WHERE id = ${id}
    `;

    const updatedEmployee = result.recordset[0];

    // Broadcast WebSocket event
    broadcast({
      type: 'employee_updated',
      data: updatedEmployee
    });

    res.json(updatedEmployee);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    
    const result = await sql.query`
      DELETE FROM Employees
      OUTPUT DELETED.id
      WHERE id = ${id}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Broadcast WebSocket event
    broadcast({
      type: 'employee_deleted',
      data: { id: result.recordset[0].id }
    });
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// WebSocket Server setup
const wss = new WebSocket.Server({ server });

// Store all connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.add(ws);
  
  // Send welcome message to new client
  ws.send(JSON.stringify({ type: 'connection', message: 'Connected to employee management WebSocket' }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Function to broadcast message to all connected clients
const broadcast = (message) => {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});