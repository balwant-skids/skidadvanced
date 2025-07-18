'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

interface UserContextType {
  registerUser: (email: string, password: string, name: string, role: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<any>;
  userDetails: any;
  setUserDetails: (details: any) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<any>(null);

  const registerUser = async (email: string, password: string, name: string, role: string) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    });
    return res.json();
  };

  const loginUser = async (email: string, password: string) => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    return res;
  };

  const logoutUser = async () => {
    const res = await signOut();
    return res;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.email && !userDetails) {
        try {
          const res = await fetch(`/api/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUserDetails(userData);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [session?.user?.email, userDetails]);

  return (
    <UserContext.Provider value={{
        userDetails,
        setUserDetails,
        isLoading: status === 'loading',
        registerUser,
        loginUser,
        logoutUser,
        isAuthenticated: !!userDetails
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
} 