import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Case Route | Mapa de casos",
  description: "Sistema creado por https://lucasdev.com.ar",
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
      <body className="bg-slate-200 dark:bg-slate-700">{children}</body>
    </html>
  );
}
