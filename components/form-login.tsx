"use client";
import { recuperarContraseña } from "@/utils/api/users";
import {
  Alert,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  TextInput,
  useThemeMode,
} from "flowbite-react";
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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [valid, setValid] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [validLogin, setValidLogin] = useState<boolean>();
  const regEx = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  const callToast = (type: string, text: string) => {
    setShowToast(true);
    setColor(type);
    setText(text);
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  };

  const ToastAttr = ({ color, text }: { color: string; text: string }) => {
    return (
      <Alert className="absolute top-5 right-5 z-[99999]" color={color}>
        <span>{text}</span>
      </Alert>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (regEx.test(email)) {
      console.log(valid);
      setValid(true);
    } else {
      console.log(valid);
      setValid(false);
    }
  }, [email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSubmit(true);
    try {
      const res = await signIn("credentials", {
        user: formData.user,
        password: formData.password,
        redirect: false,
      });
      if (res?.ok) {
        setValidLogin(true);
        router.replace("/dashboard");
      } else {
        setValidLogin(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await recuperarContraseña(email);
      if (res === "no_existe") {
        callToast("failure", "No se encontro un usuario con este correo.");
      } else {
        callToast("success", "Se envio su contraseña a su correo.");
        setRecovery(false);
      }
    } catch (err) {
      callToast("failure", "Error al enviar correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showToast && <ToastAttr color={color} text={text} />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-72 p-4">
        <div className="text-center text-lg font-bold text-slate-800 dark:text-slate-200">
          <Image
            width={100}
            height={100}
            alt="logo"
            className="mx-auto"
            src={
              mode !== "light"
                ? "/assets/login-dark.png"
                : "/assets/favicon.png"
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
            color={submit ? (validLogin ? "success" : "failure") : "auto"}
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
            color={submit ? (validLogin ? "success" : "failure") : "auto"}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Spinner />
          ) : (
            <span className="flex flex-row items-center gap-2">
              Ingresar <LogIn className="ml-2" />
            </span>
          )}
        </Button>
        {submit && (
          <div className="text-center">
            {validLogin ? (
              <span className="text-sm text-center my-0 text-green-500">
                Login exitoso
              </span>
            ) : (
              <span className="text-sm text-center my-0 text-red-500">
                Usuario o contraseña incorrectos
              </span>
            )}
          </div>
        )}
        <p
          onClick={() => setRecovery(true)}
          className="text-blue-500 hover:underline my-0 text-center text-sm cursor-pointer"
        >
          Recuperar contraseña
        </p>
      </form>
      <Modal show={recovery} onClose={() => setRecovery(false)}>
        <ModalHeader>Recuperar contraseña</ModalHeader>
        <form onSubmit={sendEmail}>
          <ModalBody>
            <TextInput
              value={email}
              onChange={changeEmail}
              name="email"
              type="email"
              required
              color={email.length ? (!valid ? "failure" : "success") : "auto"}
              placeholder="Ingresa tu email"
            />
            <p className="text-xs text-neutral-800 dark:text-neutral-300 text-balance mt-2 pl-2">
              Ingresa el email con el que estas registrado en la plataforma
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-end flex-row items-center">
            <Button disabled={loading} type="submit">
              {loading ? <Spinner /> : "Enviar"}
            </Button>
            <Button onClick={() => setRecovery(false)}>Cancelar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

export default FormLogin;
