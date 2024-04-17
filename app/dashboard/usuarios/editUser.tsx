"use client";
import { getOneUser, updateUser } from "@/utils/api/users";
import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

function EditUser() {
  const initialForm = {
    name: "",
    email: "",
    username: "",
    password: "",
    rol: 2,
  };
  const params = useSearchParams();
  const paramId = params.get("user_edit");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [visiblePass, setVisiblePass] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!paramId) {
      return;
    }
    getUser();
  }, [paramId]);

  if (!paramId) {
    return;
  }

  const getUser = async () => {
    const user = await getOneUser(paramId);
    setFormData(user);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value: string | number = e.target.value;
    setFormData((prev) => ({ ...prev, rol: Number(value) }));
  };

  const togglePasswordVisibility = () => {
    setVisiblePass(!visiblePass);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    try {
      await updateUser(paramId, formData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={paramId ? true : false}
        onClose={() => router.replace("/dashboard/usuarios")}
      >
        <Modal.Header>Editar usuario</Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Nombre</Label>
              <TextInput
                type="text"
                required
                onChange={handleChange}
                name="name"
                value={formData.name || ""}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Email</Label>
              <TextInput
                type="email"
                required
                onChange={handleChange}
                name="email"
                value={formData.email || ""}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Usuario</Label>
              <TextInput
                type="text"
                required
                onChange={handleChange}
                name="username"
                value={formData.username || ""}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Contraseña</Label>
              <div className="relative">
                <TextInput
                  type={visiblePass ? "text" : "password"}
                  required
                  onChange={handleChange}
                  name="password"
                  value={formData.password || ""}
                />
                {!visiblePass ? (
                  <Eye
                    className="absolute right-3 top-2 text-slate-400 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-2 text-slate-400 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <Label>Seleccionar rol</Label>
              <Select onChange={changeSelect} value={formData.rol} required>
                <option value={1}>SUPERADMIN</option>
                <option value={2}>ADMIN</option>
                <option value={3}>USER</option>
              </Select>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-row justify-end gap-2">
            <Button disabled={loading} type="submit">
              {loading ? <Spinner /> : "Enviar"}
            </Button>
            <Button
              onClick={() => {
                setFormData(initialForm);
                router.replace("/dashboard/usuarios");
              }}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default EditUser;
