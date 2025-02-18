import React from 'react';
import './App.css';
import TextInput from './components/TextInput';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_API_URL;

function App() {
  const handleSubmit = async (text) => {
    try {
      await axios.post(`${API_URL}/api/save`, { text });
      return { success: true, message: 'Text saved successfully!' };
    } catch (error) {
      console.error('Save error:', error);
      return { success: false, message: 'Error saving text. Please try again.' };
    }
  };

  return (
    <div className="App">
      <TextInput onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
