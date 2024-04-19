import { ThemeModeScript } from "flowbite-react";

export const metadata = {
  title: "Case Router | Usuarios",
  description: "Sistema desarrollado por https://lucasdev.com.ar",
  icons: {
    icon: "/assets/favicon.png",
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
      <body className="bg-slate-200 dark:bg-slate-700">{children}</body>
    </html>
  );
}
