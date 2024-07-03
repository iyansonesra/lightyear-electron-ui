import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path as necessary

interface User {
  firstName: string;
  lastName: string;
  userId: string;
  PIN: string; // Assuming PIN is stored as a string
}

const UserPinSearch: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [pin, setPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findUserByPin = async () => {
    setIsLoading(true);
    setError(null);
    setFirstName(null);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('PIN', '==', pin));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this PIN');
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as User;
          setFirstName(userData.firstName);
        });
      }
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter 8-digit PIN"
        maxLength={8}
      />
      <button onClick={findUserByPin} disabled={isLoading || pin.length !== 8}>
        {isLoading ? 'Searching...' : 'Find User'}
      </button>
      {firstName && <p>First Name: {firstName}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserPinSearch;