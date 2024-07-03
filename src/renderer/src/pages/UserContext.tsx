import React, { createContext, useState, useContext } from 'react';

interface UserContextType {
  firstName: string;
  lastName: string;
  setUserInfo: (firstName: string, lastName: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const setUserInfo = (first: string, last: string) => {
    setFirstName(first);
    setLastName(last);
  };

  return (
    <UserContext.Provider value={{ firstName, lastName, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};