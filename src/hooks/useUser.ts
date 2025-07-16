import { signIn, signOut } from 'next-auth/react';

export function useUser() {
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
  
    return { registerUser, loginUser, logoutUser };
  }
  