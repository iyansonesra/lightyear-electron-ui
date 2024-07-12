import React, { useState } from 'react';
import './../styles/Login.css';
import logo from '../assets/lightyear-logo.png';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from './UserContext';
import { FaBackspace } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";



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

export const Login: React.FC<{
  setIsAuthorized: (value: boolean) => void,
  setIsGuestUser: (value: boolean) => void
}> = ({ setIsAuthorized, setIsGuestUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserInfo } = useUser();
  const [rawPin, setRawPin] = useState<string>('');
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
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
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('PIN', '==', rawPin));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this PIN');
      } else {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as User;
        setUserInfo(userData.firstName, userData.lastName);
        setIsAuthorized(true); // Set the user as authorized
      }
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
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
        <button className="loginButton" onClick={findUserByPin} disabled={isLoading || rawPin.length !== 8}>
          {isLoading ? 'Searching...' : 'Log In'}
        </button>
        {error && <p className='errorText'>{error}</p>}
        <div className='signup'>
          <p className='accountText'>Don't have an account?</p>
          <Link className='signUpText' to='/SignUp'>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};