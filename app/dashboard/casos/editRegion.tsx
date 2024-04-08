"use client";
import { asignarAreas, getOne } from "@/utils/api/casos";
import { Areas } from "@/utils/mockups/areas";
import { Caso } from "@/utils/types";
import {
  Alert,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

function RegionEdit() {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const casoId = params.get("area");
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
    if (!casoId) {
      return;
    }
    getCaso();
  }, [casoId]);

  if (!casoId) {
    return;
  }

  const getCaso = async () => {
    const res: Caso = await getOne(casoId);
    const { region, pueblo, areaOperacional } = res;
    const data = {
      region,
      pueblo,
      areaOperacional,
    };
    if (res) {
      setSelectedArea(data.areaOperacional);
      setSelectedRegion(data.region);
      setSelectedMunicipio(data.pueblo);
    }
  };

  const handleAreaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedArea(value);
    setSelectedRegion(""); // Reset selected region when area changes
    setSelectedMunicipio(""); // Reset selected municipio when area changes
  };

  const handleRegionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedRegion(value);
    setSelectedMunicipio(""); // Reset selected municipio when region changes
  };

  const handleMunicipioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMunicipio(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      areaOperacional: selectedRegion,
      region: selectedArea,
      pueblo: selectedMunicipio,
    };
    try {
      if (!casoId) {
        return;
      }
      const res = await asignarAreas({ data, id: casoId });
      if (res) {
        setTimeout(() => {
          router.replace("/dashboard/casos");
          router.refresh();
        }, 1000);
        callToast("success", "Regiones actualizadas");
      } else {
        callToast("warn", "Error al actualizar la region");
      }
    } catch (err) {
      callToast("error", "Error del servidor");
    }
  };

  return (
    <>
      {showToast && <ToastAttr color={color} text={text} />}
      <Modal
        show={casoId ? true : false}
        onClose={() => router.push("/dashboard/casos")}
      >
        <ModalHeader>Editar Region / Pueblo / Area</ModalHeader>
        <form onSubmit={onSubmit}>
          <ModalBody>
            {inputs.map((e, idx) => {
              return (
                <div key={idx}>
                  <Label>{e.label}</Label>
                  <Select
                    required
                    name={e.name}
                    value={
                      e.name === "areasOperacionales"
                        ? selectedArea
                        : e.name === "regiones"
                        ? selectedRegion
                        : selectedMunicipio
                    }
                    onChange={
                      e.name === "areasOperacionales"
                        ? handleAreaChange
                        : e.name === "regiones"
                        ? handleRegionChange
                        : handleMunicipioChange
                    }
                  >
                    <option value="">Seleccione {e.type}</option>
                    {e.name === "areasOperacionales" &&
                      Areas[0]?.areasOperacionales.map((area, index) => (
                        <option key={index} value={area.nombre}>
                          {area.nombre}
                        </option>
                      ))}
                    {e.name === "regiones" &&
                      selectedArea &&
                      Areas[0]?.areasOperacionales
                        .find((area) => area.nombre === selectedArea)
                        ?.regiones.map((region, index) => (
                          <option key={region.id} value={region.nombre}>
                            {region.nombre}
                          </option>
                        ))}
                    {e.name === "municipios" &&
                      selectedRegion &&
                      Areas[0]?.areasOperacionales
                        .find((area) => area.nombre === selectedArea)
                        ?.regiones.find(
                          (region) => region.nombre === selectedRegion
                        )
                        ?.municipios.map((municipio, index) => (
                          <option
                            key={municipio.id}
                            id={`${municipio.id}`}
                            value={municipio.nombre}
                          >
                            {municipio.nombre}
                          </option>
                        ))}
                  </Select>
                </div>
              );
            })}
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button type="submit">Actualizar</Button>
            <Button onClick={() => router.push("/dashboard/casos")}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

const inputs = [
  {
    name: "areasOperacionales",
    type: "Region",
    label: "Seleccionar region",
  },
  {
    name: "regiones",
    type: "Area operacional",
    label: "Seleccionar Areas Operacionales",
  },
  {
    name: "municipios",
    type: "Municipio",
    label: "Seleccionar pueblo",
  },
];

export default RegionEdit;
