"use client";
import { cambiarEstatus, getOne } from "@/utils/api/casos";
import { options } from "@/utils/mockups/mockups";
import { Caso } from "@/utils/types";
import { Alert, Button, Modal, Select, Spinner } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

function ChangeStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const [edit, setEdit] = useState("");
  const [originalEstatus, setOriginalEstatus] = useState("");
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

  const idCaso = params.get("estatus");

  useEffect(() => {
    if (!idCaso) {
      return;
    }
    getCaso();
  }, [idCaso]);

  if (!idCaso) {
    return;
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEdit(e.target.value);
    console.log(e.target.value);
  };

  const getCaso = async () => {
    const res: Caso = await getOne(idCaso);
    const { estatus } = res;
    if (res) {
      setEdit(estatus);
      setOriginalEstatus(estatus);
    }
  };

  const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await cambiarEstatus(edit, idCaso);
      console.log(res);
      if (res) {
        callToast("success", "Se cambio el estado a  " + edit);
        setTimeout(() => {
          router.push("/dashboard/casos");
          router.refresh();
        }, 1500);
      } else {
        callToast("warn", "Error al cambiar el estado");
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
      <Modal show={idCaso ? true : false}>
        <Modal.Header>Cambiar estatus</Modal.Header>
        <form onSubmit={OnSubmit}>
          <Modal.Body>
            <Select onChange={handleChange} value={edit}>
              {options.map((e, idx) => {
                return (
                  <option value={e.value} key={idx}>
                    {e.label}
                  </option>
                );
              })}
            </Select>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button type="submit">{loading ? <Spinner /> : "Enviar"}</Button>
            <Button onClick={() => router.push("/dashboard/casos")}>
              Cancelar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default ChangeStatus;
