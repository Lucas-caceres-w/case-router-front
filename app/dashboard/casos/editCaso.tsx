"use client";
import { getOne, updateCaso } from "@/utils/api/casos";
import { CreateCaso } from "@/utils/types";
import {
  Alert,
  Button,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

function EditCaso() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialEdit = {
    latitud: "",
    longitud: "",
    nroCatastro: "",
    asignadoPor: "",
    nroOgpeSbp: "",
    nombreInspector: "",
  };
  const [edit, setEdit] = useState<any>(initialEdit);
  const idCaso = params.get("edit");
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

  useEffect(() => {
    if (!idCaso) {
      return;
    }
    getCaso();
  }, [idCaso]);

  if (!idCaso) {
    return;
  }

  const getCaso = async () => {
    const res: CreateCaso = await getOne(idCaso);
    const {
      latitud,
      longitud,
      asignadoPor,
      nroOgpeSbp,
      nombreInspector,
      nroCatastro,
    } = res;
    const data = {
      latitud,
      longitud,
      nroCatastro,
      asignadoPor,
      nroOgpeSbp,
      nombreInspector,
    };
    if (res) {
      setEdit(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdit((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateCaso(idCaso, edit);
      console.log(res);
      if (res === "Caso actualizado") {
        callToast("success", "Caso actualizado");
        setTimeout(() => {
          router.push("/dashboard/casos");
          router.refresh();
        }, 1000);
      } else {
        callToast("error", "Error al actualizar el caso");
      }
    } catch (err) {
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
        onClose={() => {
          router.push("/dashboard/casos");
          setEdit(initialEdit);
        }}
      >
        <Modal.Header>Editar caso</Modal.Header>
        <form onSubmit={OnSubmit}>
          <Modal.Body>
            {inputs.map((e, idx) => {
              return (
                <div key={idx}>
                  <Label>{e.label}</Label>
                  <TextInput
                    onChange={handleChange}
                    value={edit[e.name]}
                    type={e.type}
                    name={e.name}
                  />
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer className="flex items-center justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Actualizar"}
            </Button>
            <Button
              onClick={() => {
                router.push("/dashboard/casos");
                setEdit(initialEdit);
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

const inputs = [
  {
    name: "latitud",
    type: "number",
    label: "Latitud",
  },
  {
    name: "longitud",
    type: "number",
    label: "Longitud",
  },
  {
    name: "asignadoPor",
    type: "text",
    label: "Asignado por",
  },
  {
    name: "nroCatastro",
    type: "text",
    label: "Nro catastro",
  },
  {
    name: "nroOgpeSbp",
    type: "text",
    label: "Nro OGPE/SBP",
  },
  {
    name: "nombreInspector",
    type: "text",
    label: "Nombre inspector",
  },
];

export default EditCaso;
