// Loader.js
import React from 'react';
import './Loader.css'; // Import the CSS for styling

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loader;
