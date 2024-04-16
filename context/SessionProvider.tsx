"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

function SessionAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default SessionAuthProvider;
