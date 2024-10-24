'use client';
import {
   createContext,
   useContext,
   useState,
   useEffect,
   Dispatch,
   SetStateAction,
} from 'react';
import { parse } from 'cookie';
import { jwtVerify } from 'jose';

interface UserContextType {
   user: string | User;
   setUser: Dispatch<SetStateAction<string | User>>;
   logged: { isLoggedIn: boolean };
   getCookie: () => Promise<void>;
}

const AuthContext = createContext<UserContextType | null>(null);

interface User {
   id?: number | unknown;
   username?: string | unknown;
   rol?: number | unknown;
   email?: string | unknown;
}

export function AuthProvider({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const User = {
      id: '',
      username: '',
      rol: '',
      email: '',
   };
   const [user, setUser] = useState<User | string>(User);
   const [logged, setLogged] = useState({ isLoggedIn: false });
   const localData =
      typeof window !== 'undefined' && localStorage.getItem('data');

   const getCookie = async () => {
      const cookies = parse(document.cookie);
      const token = cookies?.session;

      if (token) {
         try {
            const { payload } = await jwtVerify(
               token,
               new TextEncoder().encode('XCaseRoute$')
            );
            console.log(payload);
            setLogged({ isLoggedIn: true });
            setUser({
               id: payload?.userId,
               rol: payload?.rol,
               username: payload?.name,
               email: payload?.email,
            });
            localStorage.setItem('dataSet', JSON.stringify(payload));
         } catch (error) {
            console.error('Token verification failed:', error);
            setLogged({ isLoggedIn: false });
            setUser(User);
         }
      } else {
         setLogged({ isLoggedIn: false });
         setUser(User);
         localStorage.removeItem('dataSet');
      }
   };

   useEffect(() => {
      getCookie();
   }, [localData]);

   return (
      <AuthContext.Provider value={{ user, setUser, logged, getCookie }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error('useAuthContext must be used within an AuthProvider');
   }

   return context;
}
