import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, HashRouter, useLocation } from 'react-router-dom';
import { WorkoutScreen } from '../src/pages/WorkoutScreen';
import { Login } from '../src/pages/Login';
import LoadingScreen from '../src/pages/LoadingScreen';
import { UserProvider } from '../src/pages/UserContext';
import { ChestPress } from './pages/ChestPress';
import { WorkoutSummary } from './pages/WorkoutSummary'; // Import the WorkoutSummary component

function AppContent(): JSX.Element {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // Adjust this value to control how long the loading screen appears

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <UserProvider>
        {isLoading && <LoadingScreen />}
        <Routes>
          <Route 
            path="/" 
            element={
              (isAuthorized || isGuestUser)
                ? <Navigate to="/workout" replace /> 
                : <Login setIsAuthorized={setIsAuthorized} setIsGuestUser={setIsGuestUser}/>
            } 
          />
          <Route 
            path="/workout" 
            element={
              (isAuthorized || isGuestUser)
                ? <WorkoutScreen setIsAuthorized={setIsAuthorized} setIsGuestUser={setIsGuestUser} /> 
                : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/workout-summary" 
            element={
              (isAuthorized || isGuestUser)
                ? <WorkoutSummary /> 
                : <Navigate to="/" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </>
  );
}

function App(): JSX.Element {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;