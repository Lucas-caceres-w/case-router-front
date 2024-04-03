"use client";
import { Caso } from "@/utils/types";
import {
  Dropdown,
  Datepicker,
  Label,
  Pagination,
  Radio,
  Table,
  TextInput,
  Tooltip,
  Button,
} from "flowbite-react";
import {
  Book,
  Camera,
  Edit,
  Map,
  RefreshCcw,
  Trash,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parse } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import { staticsPdf } from "@/utils/routes";
import { options } from "@/utils/mockups/mockups";
import { useSession } from "next-auth/react";

function TableComp({ initialCols }: { initialCols: Caso[] | [] }) {
  const router = useRouter();
  const [cols, setCols] = useState(initialCols);
  const [filteredCasos, setFilteredCasos] = useState<Caso[] | []>(cols);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de elementos por página
  const { data } = useSession();
  const [startDate, setstartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredCasos(initialCols.slice(startIndex, endIndex));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toString().toLowerCase();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    if (value.trim() === "") {
      // Si el valor está vacío, mostrar todos los casos nuevamente
      setFilteredCasos(initialCols.slice(startIndex, endIndex));
    } else {
      // Filtrar los casos según el valor ingresado
      const filtered = initialCols?.filter(
        (e) =>
          e?.nombreInspector?.toString().toLowerCase().includes(value) ||
          e?.asignadoPor?.toString().toLowerCase().includes(value) ||
          e?.nroCatastro?.toString().toLowerCase().includes(value) ||
          e?.latitud?.toString().toLowerCase().includes(value) ||
          e?.longitud?.toString().toLowerCase().includes(value) ||
          e?.estatus?.toString().toLowerCase().includes(value) ||
          e?.nroOgpeSbp?.toString().toLowerCase().includes(value) ||
          e?.pueblo?.toString().toLowerCase().includes(value) ||
          e?.areaOperacional?.toString().toLowerCase().includes(value) ||
          e?.region?.toString().toLowerCase().includes(value)
      );
      console.log(filtered);
      setFilteredCasos(filtered);
    }
    setCurrentPage(1);
  };

  const selectCasosByStatus = (status: string) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (status.trim() === "") {
      // Si el valor está vacío, mostrar todos los casos nuevamente
      setFilteredCasos(initialCols.slice(startIndex, endIndex));
    } else {
      // Filtrar los casos según el valor de estatus ingresado
      const filtered = initialCols?.filter((e) =>
        e.estatus.toLowerCase().includes(status.toLowerCase())
      );
      setFilteredCasos(filtered.slice(0, 5));
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setFilteredCasos(initialCols.slice(startIndex, endIndex));
  }, [currentPage, initialCols, itemsPerPage]);

  const getValue = (valor: string | string[]) => {
    const res = valor ? (
      <Tooltip content="Ver pdf">
        <a
          href={`${staticsPdf + valor}`}
          target="_blank"
          className="bg-green-400 border-2 border-green-600 p-[5px] px-2 rounded-md text-white"
        >
          SI
        </a>
      </Tooltip>
    ) : (
      <span className="bg-red-500 border-2 border-red-600 p-[5px] rounded-md text-white">
        NO
      </span>
    );

    return res;
  };

  const filterCasosPorFecha = () => {
    const startDateObj = parse(startDate, "dd-MM-yyyy", new Date());
    const endDateObj = parse(endDate, "dd-MM-yyyy", new Date());
    // Filtra los casos por el rango de fechas seleccionado
    const casosFiltrados = initialCols.filter((caso) => {
      // Convierte la fecha del caso en objeto Date
      const casoDate = new Date(caso.createdAt);
      // Verifica si la fecha del caso está dentro del rango seleccionado
      return isWithinInterval(casoDate, {
        start: startDateObj,
        end: endDateObj,
      });
    });
    console.log(casosFiltrados);
    // Actualiza el estado con los casos filtrados
    setFilteredCasos(casosFiltrados);
  };

  useEffect(() => {
    if (startDate && endDate) {
      filterCasosPorFecha();
    } else {
      setFilteredCasos(initialCols.slice(0, 5));
    }
  }, [startDate, endDate]);

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <div>
          <Label>Buqueda gral</Label>
          <TextInput
            className="w-40"
            onChange={handleChange}
            type="search"
            placeholder="Buscar..."
          />
        </div>
        <div>
          <Label>Rango de fechas</Label>
          <section className="flex flex-row gap-2 items-center">
            <Datepicker
              showClearButton={false}
              className="w-36"
              language="es-ES"
              showTodayButton={false}
              autoHide={false}
              value={startDate}
              onSelectedDateChanged={(startDate) => {
                setstartDate(format(startDate, "dd-MM-yyyy"));
              }}
            />
            <p className="text-slate-800 dark:text-slate-200 text-nowrap">-</p>
            <Datepicker
              showClearButton={false}
              className="w-36"
              language="es-ES"
              disabled={!startDate ? true : false}
              showTodayButton={false}
              value={endDate}
              onSelectedDateChanged={(endDate) => {
                setEndDate(format(endDate, "dd-MM-yyyy"));
              }}
            />
            <Button
              onClick={() => {
                setstartDate("");
                setEndDate("");
              }}
            >
              Limpiar
            </Button>
          </section>
        </div>
        <fieldset className="w-7/12">
          <legend className="text-slate-800 dark:text-slate-200 font-semibold">
            Estado:
          </legend>
          <section className="flex flex-row flex-wrap gap-x-4 items-center">
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("iniciado")}
                name="estatus"
                value="iniciado"
                id="iniciados"
              />
              <Label htmlFor="iniciados">Iniciados</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("verificacion")}
                name="estatus"
                value="verificacion"
                id="verificacion"
              />
              <Label htmlFor="verificacion">Verificacion inicial</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("reporteInicial")}
                name="estatus"
                value="reporteInicial"
                id="reporteInicial"
              />
              <Label htmlFor="reporteInicial">Reporte inicial</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("asignado")}
                name="estatus"
                value="asignado"
                id="asignado"
              />
              <Label htmlFor="asignado">Asignado a investigacion</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("reporteCompletado")}
                name="estatus"
                value="reporteCompletado"
                id="reporteCompletado"
              />
              <Label htmlFor="reporteCompletado">Reporte completado</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("cartaRecomendacion")}
                name="estatus"
                value="cartaRecomendacion"
                id="cartaRecomendacion"
              />
              <Label htmlFor="cartaRecomendacion">
                Carta de recomendacion completada
              </Label>
            </div>
            <div className="flex gap-2 items-center">
              <Radio
                onClick={() => selectCasosByStatus("completado")}
                name="estatus"
                value="completado"
                id="completado"
              />
              <Label htmlFor="completado">Completados</Label>
            </div>
            <div className="flex gap-2 items-center p-1">
              <Radio
                onClick={() => setFilteredCasos(initialCols.slice(0, 5))}
                name="estatus"
                value="clean"
                id="clean"
              />
              <Label htmlFor="clean">Limpiar</Label>
            </div>
          </section>
        </fieldset>
      </div>
      <div className="my-4 min-h-[450px] overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Nombre Inspector</Table.HeadCell>
            <Table.HeadCell>catastro</Table.HeadCell>
            <Table.HeadCell>Asignado por AAA</Table.HeadCell>
            <Table.HeadCell>Latitud</Table.HeadCell>
            <Table.HeadCell>Longitud</Table.HeadCell>
            <Table.HeadCell>Ogbp Sbp</Table.HeadCell>
            <Table.HeadCell>Estatus</Table.HeadCell>
            <Table.HeadCell>Escrituras</Table.HeadCell>
            <Table.HeadCell>Evidencia servicio</Table.HeadCell>
            <Table.HeadCell>Evidencia titularidad</Table.HeadCell>
            <Table.HeadCell>Plano</Table.HeadCell>
            <Table.HeadCell>Plano incripción</Table.HeadCell>
            <Table.HeadCell>Plano situación</Table.HeadCell>
            <Table.HeadCell>Foto predio / area</Table.HeadCell>
            <Table.HeadCell>Memorial subsanación</Table.HeadCell>
            <Table.HeadCell>Memorial explicativo</Table.HeadCell>
            <Table.HeadCell>Mapa esquematico</Table.HeadCell>
            <Table.HeadCell>Credenciales</Table.HeadCell>
            <Table.HeadCell>Crt. Autorizado</Table.HeadCell>
            <Table.HeadCell>Formulario 1190</Table.HeadCell>
            <Table.HeadCell>Fecha de revisión</Table.HeadCell>
            <Table.HeadCell>Fecha de creación</Table.HeadCell>
            <Table.HeadCell>Fecha recibido</Table.HeadCell>
            {/* Si esta habilitado */}
            <Table.HeadCell>Region</Table.HeadCell>
            <Table.HeadCell>Area operacional</Table.HeadCell>
            <Table.HeadCell>Pueblo</Table.HeadCell>
            <Table.HeadCell>Carta recomendación</Table.HeadCell>
            <Table.HeadCell>Fotos</Table.HeadCell>
            <Table.HeadCell>Observaciones</Table.HeadCell>
            {data?.user?.rol === 3 ? null : (
              <Table.HeadCell>Acciones</Table.HeadCell>
            )}
          </Table.Head>
          <Table.Body>
            {filteredCasos?.map((e: Caso) => {
              const Estatus = () => {
                const estatus =
                  options.find((option) => option.value === e.estatus)?.label ||
                  "";
                let cn =
                  e.estatus === "iniciado"
                    ? ""
                    : e.estatus === "completado"
                    ? "text-green-500"
                    : "text-yellow-500";
                return <p className={`${cn} font-semibold`}>{`${estatus}`}</p>;
              };
              return (
                <Table.Row
                  key={e.id}
                  className="dark:bg-slate-800 bg-slate-100"
                >
                  <Table.Cell>{e.nombreInspector}</Table.Cell>
                  <Table.Cell>{e.nroCatastro}</Table.Cell>
                  <Table.Cell>{e.asignadoPor}</Table.Cell>
                  <Table.Cell>{e.latitud}</Table.Cell>
                  <Table.Cell>{e.longitud}</Table.Cell>
                  <Table.Cell className="text-nowrap">
                    {e.nroOgpeSbp}
                  </Table.Cell>
                  <Table.Cell className="text-nowrap">
                    <Estatus />
                  </Table.Cell>
                  <Table.Cell>{getValue(e.documento?.escrituras)}</Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.evidenciaServicio)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.evidenciaTitularidad)}
                  </Table.Cell>
                  <Table.Cell>{getValue(e.documento?.plano)}</Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.planoInscripcion)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.planoSituacion)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.fotoPredioArea)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.memorialSubsanacion)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.memoExplicativo)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.mapaEsquematico)}
                  </Table.Cell>
                  <Table.Cell>
                    {getValue(e.documento?.credencialIngArq)}
                  </Table.Cell>
                  <Table.Cell>{getValue(e.documento?.crtAut)}</Table.Cell>
                  <Table.Cell>{getValue(e.documento?.AAA1190)}</Table.Cell>
                  <Table.Cell>
                    {format(e.fechaRevision, "dd/MM/yyyy")}
                  </Table.Cell>
                  <Table.Cell>{format(e.createdAt, "dd/MM/yyyy")}</Table.Cell>
                  {/* Cuando esta habilitado */}
                  <Table.Cell>
                    {e.estatus !== "iniciado"
                      ? e.fechaRecibido && format(e.fechaRecibido, "dd/MM/yyyy")
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {e.estatus !== "iniciado" ? e.areaOperacional : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {e.estatus !== "iniciado" ? e.region : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {e.estatus !== "iniciado" ? e.pueblo : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {e.estatus !== "iniciado"
                      ? getValue(e.documento?.cartaRecomendacion)
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {e.estatus !== "iniciado" ? (
                      e.Foto?.fotosGrales ? (
                        <div
                          className="p-2 hover:bg-slate-500/30 rounded-md cursor-pointer"
                          onClick={() =>
                            router.push("/dashboard/casos?getFotos=" + e.id)
                          }
                        >
                          <Camera />
                        </div>
                      ) : (
                        "No hay fotos"
                      )
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                  <Table.Cell className="overflow-x-hidden overflow-ellipsis whitespace-nowrap !w-14 !max-w-14">
                    {e.estatus === "completado" ? (
                      e.observaciones ? (
                        <span>{e.observaciones}</span>
                      ) : (
                        "No tiene"
                      )
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                  {data?.user?.rol === 3 ? null : (
                    <Table.Cell className="z-30">
                      <Dropdown className="z-30" label="Acciones">
                        <Dropdown.Item
                          onClick={() =>
                            router.push("/dashboard/casos?edit=" + e.id)
                          }
                          className="flex justify-between gap-2"
                        >
                          Editar
                          <Edit className="w-4" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            router.push("/dashboard/casos?estatus=" + e.id)
                          }
                          className="flex justify-between gap-2"
                        >
                          Estado
                          <RefreshCcw className="w-4" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            router.push("/dashboard/casos?area=" + e.id)
                          }
                          className="flex justify-between gap-2"
                        >
                          Asignar areas <Map className="w-4" />
                        </Dropdown.Item>
                        {e.estatus === "completado" && (
                          <Dropdown.Item
                            onClick={() =>
                              router.push("/dashboard/casos?coments=" + e.id)
                            }
                            className="flex justify-between gap-2"
                          >
                            Observaciones <Book className="w-4" />
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() =>
                            router.push("/dashboard/casos?upload=" + e.id)
                          }
                          className="flex justify-between gap-2"
                        >
                          Subir documento <Upload className="w-4" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            router.push("/dashboard/casos?fotos=" + e.id)
                          }
                          className="flex justify-between gap-2"
                        >
                          Subir fotos <Upload className="w-4" />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            router.push("/dashboard/casos?delete=" + e.id)
                          }
                          className="flex justify-between gap-2"
                        >
                          Eliminar <Trash className="w-4" />
                        </Dropdown.Item>
                      </Dropdown>
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(initialCols?.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default TableComp;
