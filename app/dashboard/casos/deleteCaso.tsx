"use client";
import { deleteCaso } from "@/utils/api/casos";
import {
  Alert,
  Button,
  Modal,
  Spinner
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function DeleteCaso() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [showToast, setShowToast] = useState(false);

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

  const idCaso = params.get("delete");

  if (!idCaso) {
    return;
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteCaso(idCaso);
      if (res === "caso eliminado") {
        callToast("success", "El caso fue eliminado");
        setTimeout(() => {
          router.push("/dashboard/casos");
          router.refresh();
        }, 1000);
      } else {
        callToast("error", "Error  al eliminar el caso");
      }
    } catch (err) {
      callToast("error", "Error del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showToast && <ToastAttr color={color} text={text} />}
      <Modal
        show={idCaso ? true : false}
        onClose={() => router.push("/dashboard/casos")}
      >
        <Modal.Header>Editar caso</Modal.Header>
        <Modal.Body>
          <p className="text-slate-800 font-semibold dark:text-slate-200">
            Estas seguro de eliminar el caso id: {idCaso}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end">
          <Button disabled={loading} onClick={handleDelete}>
            {loading ? <Spinner /> : "Eliminar"}
          </Button>
          <Button onClick={() => router.push("/dashboard/casos")}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteCaso;
