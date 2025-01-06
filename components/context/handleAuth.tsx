import { useState } from 'react';
import { useAuth } from './SessionProvider';

export function HandleAuth() {
   const [error, setError] = useState<string | null | unknown>(null);
   const [loading, setLoading] = useState(false);
   const { getCookie } = useAuth();

   const login = async ({
      username,
      password,
   }: {
      username: string;
      password: string;
   }) => {
      try {
         setLoading(true);
         const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
         });
         const json = await res.json();
         if (json.message === 'Successfully login') {
            if (window.location.pathname === '/login') {
               window.location.replace('/dashboard');
            } else {
               getCookie();
            }
         } else {
            setError(json.message);
         }
         return json;
      } catch (err) {
         console.error('Error en login:', err);
         setError(err);
         return err;
      } finally {
         setLoading(false);
         setTimeout(() => {
            setError(null);
         }, 2000);
      }
   };

   const logout = async () => {
      const res = await fetch('/api/logout');
      const json = await res.json();
      if (json.message === 'Logout successful') {
         window.location.replace('/login');
      }
   };

   return {
      login, // Función para hacer login
      logout, // Función para hacer logout
      error,
      loading,
   };
}
