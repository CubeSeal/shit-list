const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schema
const TextSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const Text = mongoose.model('Text', TextSchema);

// API endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

app.post('/api/save', async (req, res) => {
  try {
    const { text } = req.body;
    const newText = new Text({ text });
    const savedText = await newText.save();
    res.status(200).json(savedText);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Error saving text' });
  }
});

// Add this route to get previous texts
app.get('/api/texts', async (req, res) => {
  try {
    const texts = await Text.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(texts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching texts' });
  }
});

// Serve static files in production
if (config.nodeEnv === 'production') {
  // Serve static files from the React build directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
}); 