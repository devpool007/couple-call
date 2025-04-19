import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userNames, setUserNames] = useState({});

  const updateUserName = (userId, name) => {
    setUserNames(prev => ({
      ...prev,
      [userId]: name
    }));
  };

  return (
    <UserContext.Provider value={{ userNames, updateUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}