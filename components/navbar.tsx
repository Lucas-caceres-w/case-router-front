'use client';
import { Dropdown, Navbar, useThemeMode } from 'flowbite-react';
import ToggleTheme from './toggle-theme';
import { EllipsisVertical, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HandleAuth } from './context/handleAuth';
import { useAuth } from './context/SessionProvider';

function NavbarComp() {
   const { mode } = useThemeMode();
   const [currentMode, setCurrentMode] = useState(mode); // Almacena el modo de tema
   const { logout } = HandleAuth();
   const { user } = useAuth();

   // Sincroniza el modo del tema en el cliente
   useEffect(() => {
      setCurrentMode(mode); // Establece el modo de tema correctamente después de la hidratación
   }, [mode]);

   const Logout = async () => {
      await logout();
   };

   return (
      <Navbar className="bg-slate-100 sticky top-0 z-20" fluid>
         <Navbar.Brand className="py-3 dark:text-slate-400">
            <Image
               src={
                  currentMode === 'light'
                     ? '/assets/navbar.png'
                     : '/assets/navbar-dark.png'
               }
               alt="logo"
               width={100}
               height={60}
            />
         </Navbar.Brand>
         <ToggleTheme />
         <Dropdown
            inline
            arrowIcon={false}
            label={
               <div className="dark:text-slate-400 text-slate-900 flex flex-row capitalize gap-2">
                  <User />
                  {user?.username}
               </div>
            }
         >
            <Dropdown.Divider />
            <Dropdown.Item onClick={Logout} icon={LogOut}>
               Salir
            </Dropdown.Item>
         </Dropdown>
      </Navbar>
   );
}

export default NavbarComp;
