"use client";
import { getUsers, userCreate } from "@/utils/api/users";
import { User } from "@/utils/types";
import {
  Alert,
  Button,
  Label,
  Modal,
  ModalBody,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

function AddUser({ cols }: { cols: Dispatch<SetStateAction<User[]>> }) {
  const initialForm = {
    name: "",
    email: "",
    username: "",
    password: "",
    rol: 3,
  };
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value: string | number = e.target.value;
    setFormData((prev) => ({ ...prev, rol: Number(value) }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await userCreate(formData);
      if (res === "usuario creado") {
        setShow(false);
        cols(await getUsers());
        router.refresh();
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShow(true)}>Agregar</Button>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Header>Agregar usuario</Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Nombre</Label>
              <TextInput
                type="text"
                required
                onChange={handleChange}
                name="name"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Email</Label>
              <TextInput
                type="email"
                required
                onChange={handleChange}
                name="email"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Usuario</Label>
              <TextInput
                type="text"
                required
                onChange={handleChange}
                name="username"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Contraseña</Label>
              <TextInput
                type="password"
                required
                onChange={handleChange}
                name="password"
              />
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
            <Button onClick={() => setShow(false)}>Cancelar</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default AddUser;
