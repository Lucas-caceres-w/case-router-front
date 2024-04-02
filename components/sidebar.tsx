"use client";
import { Sidebar } from "flowbite-react";
import { ArrowBigLeft, Book, Home, Map, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function SideBarComp() {
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" && window.innerWidth
  );

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
    <Sidebar className="h-screen rounded-none fixed z-10" collapsed={collapsed}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={Home}>
            Inicio
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/usuarios" icon={User}>
            Usuarios
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/casos" icon={Book}>
            Casos
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/map" icon={Map}>
            Mapa
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SideBarComp;
