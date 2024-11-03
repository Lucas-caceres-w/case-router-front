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
   user: User | null;
   setUser: Dispatch<SetStateAction<User | null>>;
   logged: { isLoggedIn: boolean };
   getCookie: () => Promise<void>;
}

const AuthContext = createContext<UserContextType | null>(null);

interface User {
   id: number | null;
   username: string | null;
   rol: number | null;
   email: string | null;
}

export function AuthProvider({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const [user, setUser] = useState<User | null>(null);
   const [logged, setLogged] = useState({ isLoggedIn: false });

   const getCookie = async () => {
      const cookies = parse(document.cookie);
      const token = cookies.session;
      if (token) {
         try {
            const { payload } = await jwtVerify(
               token,
               new TextEncoder().encode('XCaseRoute$')
            );
            console.log(payload);
            setLogged({ isLoggedIn: true });
            setUser({
               id: payload?.id as number,
               rol: payload?.rol as number,
               username: payload?.name as string,
               email: payload?.email as string,
            });
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('dataSet', JSON.stringify(payload));
         } catch (error) {
            console.error('Token verification failed:', error);
            resetUser();
         }
      } else {
         console.error('Token not found');
         resetUser();
      }
   };

   const resetUser = () => {
      setLogged({ isLoggedIn: false });
      setUser(null);
      localStorage.removeItem('dataSet');
   };

   useEffect(() => {
      getCookie();
   }, []);

   return (
      <AuthContext.Provider value={{ user, setUser, logged, getCookie }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }

   return context;
}
