"use client";
import { deleteUser } from "@/utils/api/users";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const DeleteUser = async () => {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const idParam = params.get("delete");

  if (!idParam) {
    return;
  }

  const deleteHandler = async (id: string) => {
    setLoading(true);
    try {
      const res = await deleteUser(id);
      if (res === "usuario eliminado") {
        router.replace("/dashboard/usuarios");
        router.refresh();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={idParam ? true : false}
        onClose={() => router.push("/dashboard/usuarios")}
      >
        <ModalHeader>Eliminar usuario</ModalHeader>
        <ModalBody>
          <p className="text-slate-800 dark:text-slate-200">
            Estas seguro de eliminar el usuario con id: {idParam}
          </p>
        </ModalBody>
        <ModalFooter className="flex flex-row justify-end">
          <Button disabled={loading} onClick={() => deleteHandler(idParam)}>
            {loading ? <Spinner /> : "Eliminar"}
          </Button>
          <Button onClick={() => router.push("/dashboard/usuarios")}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
