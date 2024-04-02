import { ThemeModeScript } from "flowbite-react";

export const metadata = {
  title: "Casie Router | Usuarios",
  description: "Sistema creado por https://lucasdev.com.ar",
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
      <body className="bg-slate-200 dark:bg-slate-700">{children}</body>
    </html>
  );
}
