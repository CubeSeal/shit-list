import React, { useState, useEffect } from 'react';
import './App.css';
import TextInput from './components/TextInput';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_API_URL;
const MAX_TEXTS = 5; // Limit the number of displayed texts

function App() {
  const [previousTexts, setPreviousTexts] = useState([]);

  useEffect(() => {
    // Fetch previous texts when component mounts
    const fetchTexts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/texts`);
        setPreviousTexts(response.data.slice(0, MAX_TEXTS));
      } catch (error) {
        console.error('Error fetching texts:', error);
      }
    };
    fetchTexts();
  }, []);

  const handleSubmit = async (text) => {
    try {
      const response = await axios.post(`${API_URL}/api/save`, { text });
      // Add new text to the list and maintain limit
      setPreviousTexts(prev => [response.data, ...prev].slice(0, MAX_TEXTS));
      return { success: true, message: 'Text saved successfully!' };
    } catch (error) {
      console.error('Save error:', error);
      return { success: false, message: 'Error saving text. Please try again.' };
    }
  };

  return (
    <div className="App">
      <div className="previous-texts">
        {previousTexts.map((item, index) => (
          <div key={item._id || index} className="text-entry">
            <p>{item.text}</p>
            <small>{new Date(item.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="input-section">
        <TextInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default App;
