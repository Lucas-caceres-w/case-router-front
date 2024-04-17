"use client";
import { Sidebar } from "flowbite-react";
import { Book, Home, Map, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function SideBarComp({ expiro }: { expiro: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data } = useSession();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" && window.innerWidth
  );

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      // Llamar a la función de signOut
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (expiro) {
    handleLogout();
  }

  useEffect(() => {
    // Función para actualizar windowWidth cuando cambie el tamaño de la ventana
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Suscribirse al evento resize
    window.addEventListener("resize", handleResize);

    // Limpiar el efecto al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth && windowWidth < 1024) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [windowWidth]);

  return (
    <Sidebar
      className="h-screen rounded-none fixed z-10 max-w-40"
      collapsed={collapsed}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={Home}>
            Inicio
          </Sidebar.Item>
          {data?.user?.rol === 3 ? null : (
            <Sidebar.Item href="/dashboard/usuarios" icon={User}>
              Usuarios
            </Sidebar.Item>
          )}
          <Sidebar.Item href="/dashboard/casos" icon={Book}>
            Casos
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/map" icon={Map}>
            Mapa
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      <Sidebar.CTA className="absolute bottom-24 w-11/12">
        <p className="text-slate-800 dark:text-slate-200">Swift Code ©</p>
      </Sidebar.CTA>
    </Sidebar>
  );
}

export default SideBarComp;
