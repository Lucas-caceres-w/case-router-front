"use client";
import { DeleteImage, getImagesById } from "@/utils/api/casos";
import { apiUrl, staticsUrl } from "@/utils/routes";
import { Fotos } from "@/utils/types";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "flowbite-react";
import { Delete, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ImagesModal() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>();
  const idCaso = params.get("getFotos");
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
    getFotos();
  }, [idCaso]);

  if (!idCaso) {
    return;
  }

  const getFotos = async () => {
    const res = await getImagesById(idCaso);
    if (res) {
      const fotos = res.fotosGrales;
      setImages(fotos);
    }
  };

  const deleteImg = async (id: string, path: string) => {
    const res = await DeleteImage(id, path);
    if (res === "Imagen eliminada") {
      callToast("success", "Imagen eliminada correctamente");
      setTimeout(() => {
        router.push("/dashboard/casos");
        router.refresh();
      }, 2000);
    } else {
      callToast("failure", "Ocurrio un error");
    }
  };

  return (
    <>
      {showToast && <ToastAttr color={color} text={text} />}
      <Modal
        show={idCaso ? true : false}
        onClose={() => router.push("/dashboard/casos")}
      >
        <ModalHeader>Imagenes del caso</ModalHeader>
        <ModalBody>
          <div className="flex flex-row gap-2 w-full h-full">
            {images
              ? images?.map((e, idx) => {
                  return (
                    <div key={idx} className="relative group">
                      <span
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteImg(idCaso, e);
                        }}
                        className="absolute top-0 right-0 bg-red-500 p-1 w-7 rounded-bl-md z-10 hover:bg-red-600 cursor-pointer hidden group-hover:block"
                      >
                        <Trash className="text-white" size={"sm"} />
                      </span>
                      <a
                        className="cursor-pointer w-max"
                        target="_blank"
                        href={staticsUrl + e}
                      >
                        <Image
                          loading="lazy"
                          width={150}
                          height={200}
                          alt={e}
                          src={staticsUrl + e}
                        />
                      </a>
                    </div>
                  );
                })
              : "No existen imagenes"}
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button size={"sm"} onClick={() => router.push("/dashboard/casos")}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ImagesModal;
