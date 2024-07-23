import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, HashRouter, useLocation } from 'react-router-dom';
import { WorkoutScreen } from '../src/pages/WorkoutScreen';
import { Login } from '../src/pages/Login';
import LoadingScreen from '../src/pages/LoadingScreen';
import { UserProvider } from '../src/pages/UserContext';
import { ChestPress } from './pages/ChestPress';
import { WorkoutSummary } from './pages/WorkoutSummary'; // Import the WorkoutSummary component

// function useCustomToken() {
//   const [token, setToken] = useState<string | null>(null);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     async function runTest() {
//       try {
//         await window.api.testServerAccess();
//       } catch (error) {
//         console.error('Error testing server access:', error);
//       }
//     }

//     console.log('Running test');
  
//     runTest();
//   }, []);

//   useEffect(() => {
//     async function fetchToken() {
//       try {
//         const fetchedToken = await window.api.getCustomToken('ba5b11aa64f16d9cc7310d1e046aa1bea44406eedeb660cba0720c24fe39f919');
//         setToken(fetchedToken);
//         console.log('Received token:', fetchedToken);
//       } catch (err) {
//         setError(err instanceof Error ? err : new Error('Failed to get token'));
//         console.error('Failed to get token:', err);
//       }
//     }

//     fetchToken();
//   }, []);

//   return { token, error };
// }

// const axios = require('axios');

// async function testServerAccess() {
//   try {
//     const url = 'https://token-server-jfekb4jwga-uc.a.run.app';
//     const res = await axios.get(url);
//     console.log('Response data:', res.data);
//     console.log('Response status:', res.status);
//     console.log('Response headers:', res.headers);
//   } catch (error) {
//     console.error('Error accessing the server:', error.message);
//     if (error.response) {
//       console.error('Response status:', error.response.status);
//       console.error('Response data:', error.response.data);
//     }
//   }
// }



function AppContent(): JSX.Element {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  // const { token, error } = useCustomToken();

  // testServerAccess();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // Adjust this value to control how long the loading screen appears

    return () => clearTimeout(timer);
  }, [location]);

  // useEffect(() => {
  //   if (token) {
  //     // You can use the token here, e.g., to set up Firebase authentication
  //     console.log('Token is ready:', token);
  //     // Optionally set isAuthorized based on the token
  //     // setIsAuthorized(true);
  //   }
  //   if (error) {
  //     console.error('Error fetching token:', error);
  //     // Handle the error appropriately
  //   }
  // }, [token, error]);

  

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