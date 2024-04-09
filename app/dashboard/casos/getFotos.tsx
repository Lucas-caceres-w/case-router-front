"use client";
import { getImagesById } from "@/utils/api/casos";
import { apiUrl, staticsUrl } from "@/utils/routes";
import { Fotos } from "@/utils/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "flowbite-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ImagesModal() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>();
  const idCaso = params.get("getFotos");

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
  console.log(images)
  return (
    <>
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
                    <a
                      className="cursor-pointer w-max"
                      target="_blank"
                      key={idx}
                      href={staticsUrl + e}
                    >
                      <Image
                        loading="lazy"
                        width={100}
                        height={150}
                        alt={e}
                        src={staticsUrl + e}
                      />
                    </a>
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
