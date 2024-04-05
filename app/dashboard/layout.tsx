import NavbarComp from "@/components/navbar";
import SideBarComp from "@/components/sidebar";
import SessionAuthProvider from "@/context/SessionProvider";
import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import "../globals.css";

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
