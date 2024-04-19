import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Case route | Iniciar sesion",
  description: "Sistema desarrollado por https://lucasdev.com.ar",
  icons: {
    icon: "/assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <ThemeModeScript />
      </head>
      <body className={"bg-slate-200 dark:bg-slate-700"}>{children}</body>
    </html>
  );
}
