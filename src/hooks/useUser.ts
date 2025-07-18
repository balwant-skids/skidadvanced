import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useUser() {

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
      if (session?.user?.email) {
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
  }, [session?.user?.email]);

  return {
    registerUser,
    loginUser,
    logoutUser,
    user: userDetails || null,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading'
  };
}
  