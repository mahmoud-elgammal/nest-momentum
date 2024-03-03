import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { fetcher } from '../libs/fetcher.lib';

interface UserContextProps {
  children: ReactNode;
}

interface UserData {
  username: string;
  email: string;
  // Add more user-related fields as needed
}

interface UserContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  loaded: boolean;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    fetcher
      .get('auth/current-user')
      .then((value) => {
        setUser(value.data);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          setUser(null);
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const contextValue: UserContextValue = {
    user,
    isAuthenticated,
    loaded: isLoaded,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
