import React from 'react';
import '../styles/LoadingScreen.css'; // You'll create this CSS file

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p className = "loading-text">Loading...</p>
    </div>
  );
};

export default LoadingScreen;