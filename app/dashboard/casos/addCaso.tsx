// @ts-nocheck
"use client";
import { ImportData, createCaso, getCasosByDate } from "@/utils/api/casos";
import { Caso, ImportCaso } from "@/utils/types";
import { format } from "date-fns";
import {
  Alert,
  Button,
  Datepicker,
  FileInput,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import { FileUp, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import * as XLSX from "xlsx";

function AddCaso() {
  const [modal, setModal] = useState(false);
  const initialForm = {
    latitud: "",
    longitud: "",
    nroCatastro: "",
    asignadoPor: "",
    nroOgpeSbp: "",
    nombreInspector: "",
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [fileData, setFileData] = useState<File>();
  const [importData, setImportData] = useState(false);
  const [fechaExportacion, setFechaExportacion] = useState({
    desde: new Date(),
    hasta: new Date(),
  });
  const [exportData, setExportData] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { data } = useSession();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFileData(e.target.files?.[0]);
    console.log(e);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await createCaso(formData);
      if (res === "el caso existe") {
        callToast("warning", "El caso ya existe");
      } else if (res === "caso creado") {
        setModal(false);
        router.refresh();
        callToast("success", "Caso agregado");
      } else {
        callToast("warning", "Error inesperado");
      }
    } catch (err) {
      callToast("error", "Ocurrio un error al guardar el caso");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const SubmitFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileData) {
      console.log("No se ha seleccionado ningún archivo.");
      return;
    }
    // Procesar el archivo Excel
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event?.target?.result) {
        const binaryString = event.target.result as string;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const worksheet = workbook.Sheets["Casos Nuevos PPP"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const customKeys = [
          "nombreInspector",
          "asignadoPor",
          "nroCatastro",
          "nroOgpeSbp",
          "latitud",
          "longitud",
          "estatus",
          "region",
          "areaOperacional",
          "pueblo",
        ];
        const dataRows = jsonData.slice(1);
        const parsedData = dataRows
          .map((row: any) => {
            const rowData: ImportCaso | any = {} as ImportCaso;
            if (row.some((value: string) => value.trim() !== "")) {
              row.forEach((value: string, index: any) => {
                const label = customKeys[index];
                rowData[label] = value;
              });
              return rowData;
            }
            return null;
          })
          .filter((rowData: any) => rowData !== null) as ImportCaso;
        if (parsedData) {
          setLoading(true);
          const res = await ImportData(parsedData);
          if (res === "AddCases") {
            setLoading(false);
            setImportData(false);
            router.replace("/dashboard/casos");
            router.refresh();
            callToast("success", "Casos importados agregados");
          } else if (res === "noAdd") {
            callToast("warning", "No se agregaron casos nuevos");
            setLoading(false);
          } else {
            callToast(
              "failure",
              `Error al agregar casos, verifique no dejar ningun campo vacio`
            );
            setLoading(false);
          }
        } else {
          callToast("failure", "No hay archivo para importar");
          setLoading(false);
        }
      }
    };
    reader.readAsBinaryString(fileData);
  };

  const selectFechaExportacion = (e: Date, name: string) => {
    setFechaExportacion((prev: any) => ({
      ...prev,
      [name]: new Date(e),
    }));
  };

  const getCasosDates = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dateDesde = fechaExportacion.desde
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const dateHasta = fechaExportacion.hasta
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    try {
      setLoading(true);
      const response = await getCasosByDate(dateDesde, dateHasta);

      if (response.length > 0) {
        const dataExcel = response.map((caso: Caso) => {
          const id = caso.id;
          const asignadoPor = caso.asignadoPor;
          const nombreInspector = caso.nombreInspector;
          const ogpeSbp = caso.nroOgpeSbp;
          const lat = caso.latitud;
          const lng = caso.longitud;
          const nroCatastro = caso.nroCatastro;
          const estatus = caso.estatus;
          const region = caso.region;
          const pueblo = caso.pueblo;
          const areaOperacional = caso.areaOperacional;
          const observaciones = caso.observaciones;
          const fechaRevision = format(
            new Date(caso.fechaRevision),
            "dd-MM-yyyy"
          );
          const fechaRecibido = format(
            new Date(caso.fechaRecibido),
            "dd-MM-yyyy"
          );
          const creado = format(new Date(caso.createdAt), "dd-MM-yyyy");
          const ultimaActualizacion = format(
            new Date(caso.updatedAt),
            "dd-MM-yyyy"
          );
          const escrituras = caso.documento.escrituras;
          const evidenciaServicio = caso.documento.evidenciaServicio;
          const evidenciaTitularidad = caso.documento.evidenciaTitularidad;
          const plano = caso.documento.plano;
          const planoInscripcion = caso.documento.planoInscripcion;
          const planoSituacion = caso.documento.planoSituacion;
          const fotoPredioArea = caso.documento.fotoPredioArea;
          const memorialSubsanacion = caso.documento.memorialSubsanacion;
          const memoExplicativo = caso.documento.memoExplicativo;
          const mapaEsquematico = caso.documento.mapaEsquematico;
          const credencialIngArq = caso.documento.credencialIngArq;
          const crtAut = caso.documento.crtAut;
          const AAA1190 = caso.documento.AAA1190;

          return {
            id: id,
            latitud: lat,
            longitud: lng,
            "Asignado por": asignadoPor,
            "Nombre inspector": nombreInspector,
            "Nro ogpe sbp": ogpeSbp,
            "Nro catastro": nroCatastro,
            "Fecha revision": fechaRevision,
            estatus,
            "Area operacional": region,
            Region: areaOperacional,
            pueblo,
            "Fecha recibido": fechaRecibido,
            Observaciones: observaciones,
            "Fecha de creacion": creado,
            "Ultima actualizacion": ultimaActualizacion,
            Escrituras: escrituras ? "SI" : "NO",
            "Evidencia de servicio": evidenciaServicio ? "SI" : "NO",
            "Evidencia titularidad": evidenciaTitularidad ? "SI" : "NO",
            Plano: plano ? "SI" : "NO",
            "Plano inscripción": planoInscripcion ? "SI" : "NO",
            "Plano de situacion": planoSituacion ? "SI" : "NO",
            "Foto Predio / Area": fotoPredioArea ? "SI" : "NO",
            "Memorial subsanacion": memorialSubsanacion ? "SI" : "NO",
            "Memo explicativo": memoExplicativo ? "SI" : "NO",
            "Mapa esquematico": mapaEsquematico ? "SI" : "NO",
            "Credenciales autorizadas": credencialIngArq ? "SI" : "NO",
            "Crt. Autorizada": crtAut ? "SI" : "NO",
            "Formulario 1190": AAA1190 ? "SI" : "NO",
          };
        });

        console.log(dataExcel);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataExcel);

        const colWidths = dataExcel.reduce((acc, row) => {
          Object.keys(row).forEach((key, index) => {
            const value = row[key];
            const previousWidth = acc[index] || 0;
            const newValueWidth = 12;
            acc[index] = Math.max(previousWidth, newValueWidth);
          });
          return acc;
        }, []);
        worksheet["!cols"] = colWidths.map((width) => ({ wch: 16 }));

        XLSX.utils.book_append_sheet(workbook, worksheet, "CASOS EXPORTADOS");
        const excel = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excel], { type: "application/octet-stream" });
        const fileName = "casos.xlsx";
        const downloadLink = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadLink;
        link.download = fileName;
        link.click();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-end gap-4">
      {showToast && <ToastAttr color={color} text={text} />}
      {data?.user?.rol === 3 ? null : (
        <>
          <Button onClick={() => setModal(true)}>
            Agregar <PlusCircle className="ml-2" />
          </Button>
          <Button onClick={() => setExportData(true)}>
            Exportar datos <FileUp className="ml-2" />
          </Button>
          <Button outline onClick={() => setImportData(true)}>
            Importar datos <FileUp className="ml-2" />
          </Button>
        </>
      )}
      <Modal show={modal} onClose={() => setModal(false)}>
        <Modal.Header>Agregar caso</Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Body className="flex flex-col gap-2">
            {inputs.map((e: any, idx: number) => {
              return (
                <div className="flex flex-col gap-2" key={idx}>
                  <Label>{e.label}</Label>
                  <TextInput
                    onChange={handleChange}
                    value={formData[e.name]}
                    type={e.type}
                    name={e.name}
                    required
                  />
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer className="flex items-center justify-end">
            <Button disabled={loading} type="submit">
              Enviar
            </Button>
            <Button
              onClick={() => {
                setModal(false);
                setFormData(initialForm);
              }}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal show={exportData} onClose={() => setExportData(false)}>
        <Modal.Header>Importar datos</Modal.Header>
        <form onSubmit={getCasosDates}>
          <Modal.Body>
            <section className="flex flex-row gap-64 my-2 mb-4 -mt-12 py-12 justify-start">
              <div>
                <Label className="my-2" htmlFor="date-import">
                  Desde
                </Label>
                <Datepicker
                  onSelectedDateChanged={(e) =>
                    selectFechaExportacion(e, "desde")
                  }
                  className="absolute"
                  language="es-ES"
                  showTodayButton={false}
                  showClearButton={false}
                  name="desde"
                  value={format(fechaExportacion.desde, "dd-MM-yy")}
                />
              </div>
              <div>
                <Label className="my-2" htmlFor="date-import">
                  Hasta
                </Label>
                <Datepicker
                  onSelectedDateChanged={(e) =>
                    selectFechaExportacion(e, "hasta")
                  }
                  className="absolute"
                  language="es-ES"
                  showTodayButton={false}
                  showClearButton={false}
                  name="hasta"
                  value={format(fechaExportacion.hasta, "dd-MM-yy")}
                />
              </div>
            </section>
            <Modal.Footer className="flex items-center justify-end">
              <Button disabled={loading} type="submit">
                {loading ? <Spinner /> : "Descargar informe"}
              </Button>
              <Button onClick={() => setExportData(false)}>Cancelar</Button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
      <Modal show={importData} onClose={() => setImportData(false)}>
        <Modal.Header>Importar datos</Modal.Header>
        <form onSubmit={SubmitFile}>
          <Modal.Body>
            <div>
              <Label className="my-2" htmlFor="date-import">
                Ingrese el archivo
              </Label>
              <FileInput
                accept=".xlsx , .xls , .xlsm"
                onChange={handleFile}
                id="date-import"
              />
            </div>
            <Modal.Footer className="flex items-center justify-end">
              <Button disabled={loading} type="submit">
                {loading ? <Spinner /> : "Enviar"}
              </Button>
              <Button onClick={() => setImportData(false)}>Cancelar</Button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </div>
  );
}

const inputs = [
  {
    name: "latitud",
    type: "text",
    label: "Latitud",
  },
  {
    name: "longitud",
    type: "text",
    label: "Longitud",
  },
  {
    name: "nroCatastro",
    type: "text",
    label: "Nro. catastro",
  },
  {
    name: "asignadoPor",
    type: "text",
    label: "Asignado por",
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

export default AddCaso;
