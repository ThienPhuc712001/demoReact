const sql = require('mssql');
require('dotenv').config();

// Single configuration using SQL Login from .env
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'EmployeeDB',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false, // local dev, no SSL
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  },
  parseJSON: true
};

let pool = null;

async function connectToDB() {
  try {
    if (pool) {
      console.log('Using existing database connection pool');
      return true;
    }
    
    console.log('Connecting to MSSQL Server...');
    pool = await sql.connect(config);
    console.log('Connected to MSSQL Server successfully');
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    pool = null;
    return false;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing database connection:', err.message);
  }
}

// Graceful shutdown
process.on('SIGTERM', closeConnection);
process.on('SIGINT', closeConnection);

module.exports = {
  sql,
  config,
  connectToDB,
  closeConnection,
  getPool: () => pool
};