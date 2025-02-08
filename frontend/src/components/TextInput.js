import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TextInput() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Test backend connection on component mount
    const testConnection = async () => {
      try {
        await axios.get('http://localhost:3001/api/test');
        console.log('Backend connection successful');
      } catch (err) {
        console.error('Backend connection failed:', err);
        setError('Cannot connect to server');
      }
    };
    testConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/save', { text });
      setMessage('Text saved successfully!');
      setText(''); // Clear the input after successful save
    } catch (error) {
      console.error('Save error:', error);
      setError(error.response?.data?.error || 'Error saving text. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Save Text to MongoDB</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit">Save Text</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default TextInput; 