"use client";
import { uploadImages } from "@/utils/api/casos";
import {
  Alert,
  Button,
  FileInput,
  Modal,
  Spinner
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

function UploadImages() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileList | null>();
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const callToast = (type: string, text: string) => {
    setShowToast(true);
    setColor(type);
    setText(text);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const ToastAttr = ({ color, text }: { color: string; text: string }) => {
    return (
      <Alert className="absolute top-5 right-5 z-[99999]" color={color}>
        <span>{text}</span>
      </Alert>
    );
  };

  const idCaso = params.get("fotos");

  useEffect(() => {
    if (!idCaso) {
      return;
    }
  }, [idCaso]);

  if (!idCaso) {
    return;
  }

  const readFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    setFile(fileList);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      //console.log("No hay archivo");
      return;
    }
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

    const formData = new FormData();
    for (var i = 0; i < file.length; i++) {
      const fileName = file[i].name;
      const fileExtension = fileName?.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        callToast(
          "warning",
          `El archivo ${fileName} tiene una extensión no permitida`
        );
        return;
      }
      formData.append("photos", file[i], file[i].name);
    }
    try {
      if (!idCaso) {
        return;
      }
      const res = await uploadImages(idCaso, formData);
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
      callToast("failure", "Error del servidor");
    }
  };

  return (
    <>
      {showToast && <ToastAttr color={color} text={text} />}
      <Modal
        show={idCaso ? true : false}
        onClose={() => router.push("/dashboard/casos")}
      >
        <Modal.Header>Subir fotos</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <FileInput
              onChange={readFile}
              multiple
              accept=".jpg,.jpeg,.webp,.png"
            />
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

export default UploadImages;
