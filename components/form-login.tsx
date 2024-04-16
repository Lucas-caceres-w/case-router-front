"use client";
import { Button, Label, TextInput, useThemeMode } from "flowbite-react";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const initialForm = {
  user: "",
  password: "",
};

function FormLogin() {
  const [formData, setFormData] = useState(initialForm);
  const router = useRouter();
  const { mode, setMode } = useThemeMode();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await signIn("credentials", {
        user: formData.user,
        password: formData.password,
        redirect: false,
      });
      if (res?.ok) {
        router.replace("/dashboard");
      } else {
        alert('Error de ingreso');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-72 p-4">
      <div className="text-center text-lg font-bold text-slate-800 dark:text-slate-200">
        <Image
          width={100}
          height={100}
          alt="logo"
          className="mx-auto"
          src={
            mode !== "light" ? "/assets/login-dark.png" : "/assets/favicon.png"
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="user">Usuario / Email</Label>
        <TextInput
          onChange={handleChange}
          type="text"
          name="user"
          id="user"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <TextInput
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          required
        />
      </div>
      <Button type="submit">
        Ingresar
        <LogIn className="ml-2" />
      </Button>
    </form>
  );
}

export default FormLogin;
