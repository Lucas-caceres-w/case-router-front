"use client";
import { uploadFile } from "@/utils/api/casos";
import {
  Alert,
  Button,
  FileInput,
  Label,
  Modal,
  Select,
  Spinner,
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

function UploadModal() {
  const selects = [
    {
      name: "escrituras",
      label: "Escritura",
    },
    {
      name: "evidenciaServicio",
      label: "Evidencia servicio",
    },
    {
      name: "evidenciaTitularidad",
      label: "Evidencia titularidad",
    },
    {
      name: "plano",
      label: "Plano",
    },
    {
      name: "planoInscripcion",
      label: "Plano Inscripción",
    },
    {
      name: "planoSituacion",
      label: "Plano situación",
    },
    {
      name: "fotoPredioArea",
      label: "Foto de Predio / Area",
    },
    {
      name: "memorialSubsanacion",
      label: "Memorial subsanación",
    },
    {
      name: "memoExplicativo",
      label: "mapaEsquematico",
    },
    {
      name: "credencialIngArq",
      label: "credenciales",
    },
    {
      name: "crtAut",
      label: "Crt. autorizado",
    },
    {
      name: "AAA1190",
      label: "Formulario 1190",
    },
    {
      name: "cartaRecomendacion",
      label: "Carta recomendación",
    },
  ];
  const [file, setFile] = useState<File | any>();
  const [selectedOption, setSelectedOption] = useState(selects[0].name);
  const params = useSearchParams();
  const router = useRouter();
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const idCaso = params.get("upload");

  const readFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files?.[0];
    setFile(fileList);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.log("No hay archivo");
      return;
    }
    //const blob = new Blob([file], { type: file?.type });
    const formData = new FormData();
    formData.append("Blob", file, file.name);
    formData.append("option", selectedOption);
    setLoading(true);
    try {
      if (!idCaso) {
        return;
      }
      const res = await uploadFile(idCaso, formData);
      if (res) {
        callToast("success", "Archivo guardado correctamente");
        setTimeout(() => {
          router.replace("/dashboard/casos");
          router.refresh();
        }, 1500);
      } else {
        callToast("warning", "Error al guardar el documento");
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
        <Modal.Header>Subir documento</Modal.Header>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <Modal.Body>
            <Label>Seleccionar tipo de documento</Label>
            <Select onChange={handleChange}>
              {selects.map((e, idx) => {
                return (
                  <option value={e.name} key={idx}>
                    {e.label}
                  </option>
                );
              })}
            </Select>
            <FileInput
              onChange={readFile}
              accept=".pdf"
              className="mt-4"
              name="file"
              required
            />
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

export default UploadModal;
