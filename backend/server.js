const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
mongoose.connect('mongodb://localhost:27017/textdb', {
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

// API endpoint to test connection
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// API endpoint to save text
app.post('/api/save', async (req, res) => {
  try {
    const { text } = req.body;
    const newText = new Text({ text });
    await newText.save();
    res.status(200).json({ message: 'Text saved successfully' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Error saving text' });
  }
});

// Change the port to 3001
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 