import { ThemeModeScript } from 'flowbite-react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/context/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'Case Router',
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
      <AuthProvider>
         <html lang="es">
            <head>
               <ThemeModeScript />
            </head>
            <body className={'bg-slate-200 dark:bg-slate-700'}>{children}</body>
         </html>
      </AuthProvider>
   );
}
