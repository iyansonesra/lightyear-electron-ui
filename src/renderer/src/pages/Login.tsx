import React, { useEffect, useState } from 'react';
import './../styles/Login.css';
import logo from '../assets/lightyear-logo.png';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from './UserContext';
import { FaBackspace } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";
import axios from 'axios'
import { getAuth, signInWithCustomToken } from 'firebase/auth';



interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, onDelete, onClear }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const handleButtonPress = (callback: () => void, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    button.classList.add('active');
    setTimeout(() => {
      button.classList.remove('active');
    }, 200); // 200 milliseconds delay
    callback();
  };

  return (
    <div className="numeric-keypad">
      {keys.map((key) => (
        <button
          className="keypad-buttons"
          key={key}
          onClick={(e) => handleButtonPress(() => onKeyPress(key), e)}
        >
          {key}
        </button>
      ))}
      <button className="keypad-buttons" onClick={(e) => handleButtonPress(onDelete, e)}>
        <FaBackspace className="backspace" size={30} />
      </button>
      <button className="keypad-buttons" onClick={(e) => handleButtonPress(onClear, e)}>
        <MdOutlineClear color={"red"} size={30} />
      </button>
    </div>
  );
};
interface User {
  firstName: string;
  lastName: string;
  userId: string;
  PIN: string;
}

async function checkServerStatus() {
  try {
    // We're using invalid data here, so we expect a 401 or 400 response
    const response = await axios.post('https://lyauthserver-jfekb4jwga-uc.a.run.app/generate-token', {
      apiKey: 'invalid',
      pin: '00000000'
    });

    // If we get here, the server is up but something unexpected happened
    console.log('Server is up, but returned an unexpected response');
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If we get a 401 or 400, the server is up and working as expected
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        console.log('Server is up and running');
        return true;
      }
    }
    console.error('Error checking server status:', error);
    return false;
  }
}

export const Login: React.FC<{
  setIsAuthorized: (value: boolean) => void,
  setIsGuestUser: (value: boolean) => void
}> = ({ setIsAuthorized, setIsGuestUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserInfo } = useUser();
  const [rawPin, setRawPin] = useState<string>('');
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const [isServerUp, setIsServerUp] = useState<boolean | null>(null);
  const [isKeypadMounted, setIsKeypadMounted] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      const status = await checkServerStatus();
      setIsServerUp(status);
    };
    checkServer();
  }, []);

  const [isKeypadMounted, setIsKeypadMounted] = useState(false);

  const toggleKeypad = () => {
    if (isKeypadVisible) {
      setIsKeypadVisible(false);
      // Delay unmounting to allow for slide-down animation
      setTimeout(() => setIsKeypadMounted(false), 300);
    } else {
      setIsKeypadMounted(true);
      setIsKeypadVisible(true);
    }
  };

  const formatPin = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 8);
    return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
  };

  const findUserByPin = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const serverUrl = 'https://lyauthserver-jfekb4jwga-uc.a.run.app/generate-token';
      const apiKey = '94060511-ed70-4390-8068-29ff2f892dbc';
  
      console.log('Sending request with PIN:', rawPin);
      const response = await axios.post(serverUrl, {
        apiKey,
        pin: rawPin
      });
  
      console.log('Server response:', response.data);
  
      if (response.data && response.data.token) {
        const auth = getAuth();
        try {
          await signInWithCustomToken(auth, response.data.token);
          console.log('Successfully signed in with custom token');
  
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where("PIN", "==", rawPin));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setIsAuthorized(true);
            setUserInfo(userData.firstName, userData.lastName);
            console.log(`Logged in as ${userData.firstName} ${userData.lastName}`);
          } else {
            throw new Error('User not found in the database.');
          }
        } catch (signInError) {
          console.error('Detailed sign-in error:', signInError);
          if (signInError instanceof Error) {
            setError(`Error signing in: ${signInError.message}`);
            console.error('Error name:', signInError.name);
            console.error('Error stack:', signInError.stack);
          } else {
            setError('Unknown error during sign-in');
          }
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Full error object:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Error response:', err.response.data);
          setError(`Server error: ${err.response.data.error || 'Unknown error'}`);
        } else if (err.request) {
          setError('No response received from server. Please try again.');
        } else {
          setError(`Error setting up request: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (key: string) => {
    if (rawPin.length < 8) {
      setRawPin(prev => prev + key);
    }
  };

  const handleDelete = () => {
    setRawPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setRawPin('');
  };


  const handleGuestLogin = () => {
    setIsGuestUser(true);
    setIsAuthorized(true);
    setUserInfo('Guest', 'User');
  };

   const handleKeyPress = (key: string) => {
    if (rawPin.length < 8) {
      setRawPin(prev => prev + key);
    }
  };

  const handleDelete = () => {
    setRawPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setRawPin('');
  };


  const handleGuestLogin = () => {
    setIsGuestUser(true);
    setIsAuthorized(true);
    setUserInfo('Guest', 'User');
  };

  return (
    <div className='root'>
      <div className='guestLogin' onClick={handleGuestLogin}>
        <h1 className='guestText'>Continue as Guest</h1>
        <IoIosArrowForward size={20} className='arrow' />
      </div>
      <div className='Login'>
        <img src={logo} className='logo' alt='Logo' />
        <h1 className='LoginText'>MEMBER LOGIN</h1>
        <h1 className='subText'>Enter your 8-digit pin to log in</h1>
        <input
          className="usernameInput"
          type="text"
          value={formatPin(rawPin)}
          readOnly
          placeholder="Enter 8-digit PIN"
          onClick={toggleKeypad}
        />
        {isKeypadMounted && (
          <div className={`keypad-container ${isKeypadVisible ? 'visible' : 'hidden'}`}>
            <NumericKeypad 
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onClear={handleClear}
            />
          </div>
        )}
        <button
          className="loginButton"
          onClick={findUserByPin}
          disabled={isLoading || rawPin.length !== 8}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        {error && <p className='errorText'>{error}</p>}
        <div className='signup'>
          <p className='accountText'>Don't have an account?</p>
          <Link className='signUpText' to='/SignUp'>Download the app</Link>
        </div>
      </div>
    </div>
  );
};