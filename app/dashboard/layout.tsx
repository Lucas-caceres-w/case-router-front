import NavbarComp from "@/components/navbar";
import SideBarComp from "@/components/sidebar";
import SessionAuthProvider from "@/components/context/SessionProvider";
import { authOptions } from "@/utils/auth";
import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "../globals.css";

export const metadata: Metadata = {
  title: "Case Router | Sistema",
  description: "Sistema desarrollado por https://lucasdev.com.ar",
  icons: {
    icon: "/assets/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const expireDate = session.accessToken;
  const expirationTime = new Date(expireDate)?.getTime() + 6 * 60 * 60 * 1000;
  const Logueo = new Date(expireDate).getTime();
  const Expiro = new Date(expirationTime).getTime();

  const expiro = Logueo > Expiro;

  return (
    <html lang="es">
      <head>
        <ThemeModeScript />
      </head>
      <SessionAuthProvider>
        <body className={"bg-slate-200 dark:bg-slate-700"}>
          <NavbarComp />
          <SideBarComp expiro={expiro} />
          {children}
        </body>
      </SessionAuthProvider>
    </html>
  );
}
