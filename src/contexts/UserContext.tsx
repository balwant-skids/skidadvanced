'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/nextjs';

interface UserContextType {
  registerUser: (email: string, password: string, name: string, role: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
  userDetails: any;
  setUserDetails: (details: any) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [userDetails, setUserDetails] = useState<any>(null);

  const registerUser = async (email: string, password: string, name: string, role: string) => {
    // With Clerk, registration is handled by Clerk's SignUp component
    // This is kept for backwards compatibility
    console.warn('registerUser is deprecated with Clerk. Use Clerk SignUp component.');
    return { error: 'Use Clerk SignUp component' };
  };

  const loginUser = async (email: string, password: string) => {
    // With Clerk, login is handled by Clerk's SignIn component
    console.warn('loginUser is deprecated with Clerk. Use Clerk SignIn component.');
    return { error: 'Use Clerk SignIn component' };
  };

  const logoutUser = async () => {
    await signOut();
    setUserDetails(null);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isSignedIn && userId && !userDetails) {
        try {
          const res = await fetch('/api/users', {
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

    if (isLoaded) {
      fetchUserDetails();
    }
  }, [isLoaded, isSignedIn, userId, userDetails]);

  // Clear user details on sign out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setUserDetails(null);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <UserContext.Provider value={{
      userDetails,
      setUserDetails,
      isLoading: !isLoaded,
      registerUser,
      loginUser,
      logoutUser,
      isAuthenticated: isSignedIn && !!userDetails
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
