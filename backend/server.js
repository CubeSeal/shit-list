const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3
const cors = require('cors');
const path = require('path');
const config = require('./config'); // Keep config for port, nodeEnv

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SQLite database connection
const dbPath = path.resolve(__dirname, 'database.db'); // Define database file path
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  } else {
    console.log('Successfully connected to SQLite database.');
    // Create table if it doesn't exist upon successful connection
    db.run(`CREATE TABLE IF NOT EXISTS texts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        // Log error if table creation fails
        console.error('Error creating table:', err.message);
      }
    });
  }
});

// API endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

app.post('/api/save', (req, res) => {
  const { text } = req.body;
  if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
  }
  // SQL query to insert text
  const sql = `INSERT INTO texts (text) VALUES (?)`;
  // Use a function callback to access 'this.lastID' for the inserted row's ID
  db.run(sql, [text], function(err) {
    if (err) {
      console.error('Save error:', err.message);
      return res.status(500).json({ error: 'Error saving text' });
    }
    // Retrieve the newly inserted row to send back in the response
    db.get(`SELECT id, text, createdAt FROM texts WHERE id = ?`, [this.lastID], (err, row) => {
      if (err) {
         console.error('Error retrieving saved text:', err.message);
         // Even if insert succeeded, retrieval might fail
         return res.status(500).json({ error: 'Error retrieving saved text after insert' });
      }
       res.status(200).json(row); // Send the complete row back
    });
  });
});

app.get('/api/texts', (req, res) => {
  // SQL query to get the last 5 texts, ordered by creation date
  const sql = `SELECT id, text, createdAt FROM texts ORDER BY createdAt DESC LIMIT 5`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching texts:', err.message);
      return res.status(500).json({ error: 'Error fetching texts' });
    }
    res.json(rows); // Send the fetched rows
  });
});

// Serve static files in production
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start the server
app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

// Graceful shutdown: Close the database connection when the app terminates
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing SQLite database:', err.message);
    } else {
      console.log('SQLite database connection closed.');
    }
    process.exit(err ? 1 : 0);
  });
});

