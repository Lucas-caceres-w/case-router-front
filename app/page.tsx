"use client";

import { Spinner } from "flowbite-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    async function redirectUser() {
      const session = await getSession();
      if (!session) {
        // Si no hay sesión, redirigir al inicio de sesión
        router.push("/login");
      } else {
        // Si hay sesión, redirigir al dashboard
        router.push("/dashboard");
      }
    }
    redirectUser();
  }, []);
  return (
    <main className="min-h-screen grid place-items-center bg-slate-200 dark:bg-slate-700">
      <Spinner className="!w-64" size={"lg"} />
    </main>
  );
}
