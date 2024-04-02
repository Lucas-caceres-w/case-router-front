"use client";
import { Dropdown, Navbar } from "flowbite-react";
import ToggleTheme from "./toggle-theme";
import { EllipsisVertical, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

function NavbarComp() {
  return (
    <Navbar className="bg-slate-100 sticky top-0 z-20" fluid>
      <Navbar.Brand className="py-3 dark:text-slate-400">LOGO</Navbar.Brand>
      <ToggleTheme />
      <Dropdown
        inline
        arrowIcon={false}
        label={<EllipsisVertical className="dark:text-slate-400" />}
      >
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => signOut()} icon={LogOut}>
          Salir
        </Dropdown.Item>
      </Dropdown>
    </Navbar>
  );
}

export default NavbarComp;
