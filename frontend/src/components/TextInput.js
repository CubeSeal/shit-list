import React, { useState, useEffect } from 'react';
import axios from 'axios';

// In development, use the full URL from env
// In production, use relative path since we're serving from the same origin
const API_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_API_URL;

function TextInput({ onSubmit }) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Test backend connection on component mount
    const testConnection = async () => {
      try {
        await axios.get(`${API_URL}/api/test`);
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
    if (text.trim()) {
      const result = await onSubmit(text);
      if (result.success) {
        setMessage(result.message);
        setText('');
      } else {
        setError(result.message);
      }
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await handleSubmit(e);
    }
  };

  return (
    <div className="container">
      <h1>Save Text to MongoDB</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
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