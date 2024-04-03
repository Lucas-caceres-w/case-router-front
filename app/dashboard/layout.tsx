import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeModeScript } from "flowbite-react";
import SideBarComp from "@/components/sidebar";
import NavbarComp from "@/components/navbar";
import SessionAuthProvider from "@/context/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Case Router | Sistema",
  description: "Sistema creado por https://lucasdev.com.ar",
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
      <SessionAuthProvider>
        <body className={"bg-slate-200 dark:bg-slate-700"}>
          <NavbarComp />
          <SideBarComp />
          {children}
        </body>
      </SessionAuthProvider>
    </html>
  );
}
