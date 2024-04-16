import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { isCookieExpired } from "@/utils/verify";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Case Router",
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
      <body className={"bg-slate-200 dark:bg-slate-700"}>{children}</body>
    </html>
  );
}
