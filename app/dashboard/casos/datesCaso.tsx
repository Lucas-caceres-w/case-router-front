"use client";
import { changeDates, getOne } from "@/utils/api/casos";
import { Caso } from "@/utils/types";
import { format } from "date-fns";
import {
  Alert,
  Button,
  Datepicker,
  Label,
  Modal,
  Spinner,
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

interface Fechas {
  fechaRecibido: Date | undefined;
  fechaRevision: Date | undefined;
}

function DatesModal() {
  const params = useSearchParams();
  const router = useRouter();
  const [edit, setEdit] = useState<Fechas>({
    fechaRecibido: undefined,
    fechaRevision: undefined,
  });
  const [loading, setLoading] = useState(false);
  const idCaso = params.get("fechas");
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

  useEffect(() => {}, [edit.fechaRevision]);

  useEffect(() => {
    if (!idCaso) {
      return;
    }
    getCaso();
  }, [idCaso]);

  if (!idCaso) {
    return;
  }

  const clearDate = (name: string) => {
    setEdit((prev: any) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const getCaso = async () => {
    const res: Caso = await getOne(idCaso);
    const { fechaRecibido, fechaFin } = res;
    setEdit({
      fechaRecibido: fechaRecibido,
      fechaRevision: fechaFin,
    });
  };

  const handleChange = (e: Date, name: string) => {
    setEdit((prev: any) => ({
      ...prev,
      [name]: format(e, "yyyy-MM-dd HH:mm:ss"),
    }));
  };

  const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (edit.fechaRecibido === null && edit.fechaRevision === null) {
        callToast("success", "No  se realizaron cambios");
        setTimeout(() => {
          router.replace("/dashboard/casos");
        }, 1500);
        return;
      }
      await changeDates(idCaso, edit);
      callToast("success", "Fechas actualizadas");
      setTimeout(() => {
        router.replace("/dashboard/casos");
        router.refresh();
      }, 1000);
    } catch (err) {
      callToast("failure", "Ocurrio un error al actualizar el caso");
      console.log(err);
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
        <Modal.Header>Modificar Fecha de revision / completado</Modal.Header>
        <form onSubmit={OnSubmit}>
          <Modal.Body className="flex flex-row gap-2 justify-around pr-32">
            <div className="">
              <Label>Fecha de revision</Label>
              <Datepicker
                value={
                  edit.fechaRevision
                    ? format(edit.fechaRevision, "dd-MM-yyyy")
                    : " "
                }
                onSelectedDateChanged={(e) => handleChange(e, "fechaRevision")}
                showClearButton={false}
                className="absolute bottom-18 mr-12"
              />
              <Button
                onClick={() => clearDate("fechaRevision")}
                className="mt-12"
              >
                Limpiar
              </Button>
            </div>
            <div>
              <Label>Fecha completado</Label>
              <Datepicker
                value={
                  edit.fechaRecibido
                    ? format(edit.fechaRecibido, "dd-MM-yyyy")
                    : " "
                }
                onSelectedDateChanged={(e) => handleChange(e, "fechaRecibido")}
                className="absolute bottom-18 mr-12"
              />
              <Button
                onClick={() => clearDate("fechaRecibido")}
                className="mt-12"
              >
                Limpiar
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button disabled={loading} type="submit" size={"sm"}>
              {loading ? <Spinner /> : "Enviar"}
            </Button>
            <Button size={"sm"} onClick={() => router.push("/dashboard/casos")}>
              Cancelar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default DatesModal;
