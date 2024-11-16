import { ThemeModeScript } from 'flowbite-react';
import React from 'react';

export const metadata = {
   title: 'Case Router | Casos',
   description: 'Sistema desarrollado por https://lucasdev.com.ar',
   icons: {
      icon: '/assets/favicon.png',
   },
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="es">
         <head>
            <ThemeModeScript />
         </head>
         <body className="bg-slate-200 dark:bg-slate-700">
            <React.Suspense>{children}</React.Suspense>
         </body>
      </html>
   );
}
