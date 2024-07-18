// src/components/WorkoutSummary.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/WorkoutSummary.css'

export const WorkoutSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    timeTaken,
    totalSets,
    totalReps,
    workoutType,
    maxWeight,
    averageWeight
  } = location.state;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="workout-summary">
      <h1 className = "header-text-summ">Workout Summary</h1>
     
        <div className = "listing">
          <h1 className='mid-text'>Time taken:</h1>
          <h1 className = "light-text">{formatTime(timeTaken)}</h1>
        </div>
        <div className = "divider"></div>

        <div className = "listing">
          <h1 className='mid-text'>Total sets completed: </h1>
          <h1 className='light-text'>{totalSets}</h1>
        </div>
        <div className = "divider"></div>

        <div className = "listing">
          <h1 className='mid-text'>Total reps completed: </h1>
          <h1 className='light-text'>{totalReps}</h1>
        </div>
        <div className = "divider"></div>
        
        
        <div className = "listing">
          <h1 className='mid-text'>Workout type: </h1>
          <h1 className='light-text'>{workoutType}</h1>
        </div>
        <div className = "divider"></div>

        <div className = "listing">
          <h1 className='mid-text'>Maximum weight reached: </h1>
          <h1 className='light-text'> {maxWeight}</h1>
        </div>
        <div className = "divider"></div>

        <div className = "listing">
          <h1 className='mid-text'>Average weight: </h1>
          <h1 className='light-text'>{averageWeight}</h1>
        </div>
        <div className = "divider"></div>
       
  
      <button className = 'back-button' onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};