import NavbarComp from '@/components/navbar';
import SideBarComp from '@/components/sidebar';
import { ThemeModeScript } from 'flowbite-react';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
   title: 'Case Router | Sistema',
   description: 'Sistema desarrollado por https://lucasdev.com.ar',
   icons: {
      icon: '/assets/favicon.png',
   },
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="es">
         <head>
            <ThemeModeScript />
         </head>
         <body className={'bg-slate-200 dark:bg-slate-700'}>
            <NavbarComp />
            <SideBarComp expiro={false} />
            {children}
         </body>
      </html>
   );
}
