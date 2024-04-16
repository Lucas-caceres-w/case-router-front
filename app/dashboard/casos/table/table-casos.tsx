//@ts-nocheck
"use client";
import { options } from "@/utils/mockups/mockups";
import { staticsPdf } from "@/utils/routes";
import { Caso } from "@/utils/types";
import { format, isWithinInterval, parse } from "date-fns";
import {
  Button,
  Datepicker,
  Dropdown,
  Label,
  Pagination,
  Radio,
  Table,
  TextInput,
  Tooltip,
} from "flowbite-react";
import {
  Book,
  Calendar,
  Camera,
  Edit,
  Map,
  RefreshCcw,
  Trash,
  Upload,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

function TableComp({ initialCols }: { initialCols: Caso[] | [] }) {
  const router = useRouter();
  const [cols, setCols] = useState(initialCols);
  const [filteredCasos, setFilteredCasos] = useState<Caso[] | []>(cols);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Número de elementos por página
  const { data } = useSession();
  const [startDate, setstartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [expandEstatus, setExpandEstatus] = useState(false);
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
    const casosFiltrados = initialCols.filter((caso) => {
      const casoDate = new Date(caso.createdAt);
      return isWithinInterval(casoDate, {
        start: startDateObj,
        end: endDateObj,
      });
    });
    setFilteredCasos(casosFiltrados);
  };

  function getStatusLabel(est: string) {
    const estatus =
      options.find(
        (option) =>
          option.value.toLowerCase() === est.toLowerCase() ||
          option.label.toLowerCase() === est.toLowerCase()
      )?.label || "";
    //console.log(est);
    let cn =
      est === "iniciado"
        ? "text-white"
        : est === "completado"
        ? "text-green-500"
        : "text-yellow-500";
    return <p className={`${cn} font-semibold`}>{estatus}</p>;
  }

  useEffect(() => {
    if (startDate && endDate) {
      filterCasosPorFecha();
    } else {
      setFilteredCasos(initialCols.slice(0, 5));
    }
  }, [startDate, endDate]);
  //console.log(cols);

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <div>
          <Label>Busqueda gral.</Label>
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
          <Button
            onClick={() => setExpandEstatus(!expandEstatus)}
            className="my-2"
          >
            {expandEstatus ? "Hide" : "Expand"}
          </Button>
          {expandEstatus && (
            <section className="flex flex-row flex-wrap gap-x-4 items-center my-4">
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
                  onClick={() => selectCasosByStatus("solicitaPlanos")}
                  name="estatus"
                  value="solicitaPlanos"
                  id="solicitaPlanos"
                />
                <Label htmlFor="solicitaPlanos">Se Solicita Planos</Label>
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
                  onClick={() => selectCasosByStatus("referidoGTA")}
                  name="estatus"
                  value="referidoGTA"
                  id="referidoGTA"
                />
                <Label htmlFor="referidoGTA">Referido a GTA</Label>
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
          )}
        </fieldset>
      </div>
      <div className="w-[98%] h-full min-h-[450px] overflow-x-scroll">
        <Table striped>
          <Table.Head className="sticky top-0 z-40">
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Nombre Inspector
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Asignado por AAA
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              catastro
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Ogpe Sbp
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Latitud
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Longitud
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Estatus
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Escrituras
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Evidencia servicio
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Evidencia titularidad
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Plano
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Plano incripción
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Plano situación
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Foto area
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Foto predio
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Memorial subsanación
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Memorial explicativo
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Mapa esquematico
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Credenciales
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Crt. Autorizado
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Formulario 1190
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Fecha de creación
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Fecha de revisión
            </Table.HeadCell>
            {/* Si esta habilitado */}
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Fecha de completado
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Region
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Area operacional
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Pueblo
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Carta recomendación
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Fotos
            </Table.HeadCell>
            <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
              Comentarios
            </Table.HeadCell>
            {data?.user?.rol === 3 ? null : (
              <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
                Acciones
              </Table.HeadCell>
            )}
          </Table.Head>
          <Table.Body className="overflow-scroll">
            {filteredCasos &&
              Array.isArray(filteredCasos) &&
              filteredCasos?.map((e: Caso) => {
                return (
                  <Table.Row
                    key={e.id}
                    className="dark:bg-slate-800 bg-slate-100"
                  >
                    <Table.Cell>{e.nombreInspector}</Table.Cell>
                    <Table.Cell className="text-nowrap">
                      {e.asignadoPor}
                    </Table.Cell>
                    <Table.Cell className="text-nowrap">
                      {e.nroCatastro}
                    </Table.Cell>
                    <Table.Cell className="text-nowrap">
                      {e.nroOgpeSbp}
                    </Table.Cell>
                    <Table.Cell>{e.latitud}</Table.Cell>
                    <Table.Cell>{e.longitud}</Table.Cell>
                    <Table.Cell className="text-nowrap">
                      {getStatusLabel(e.estatus)}
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
                    <Table.Cell>{getValue(e.documento?.fotoArea)}</Table.Cell>
                    <Table.Cell>{getValue(e.documento?.fotoPredio)}</Table.Cell>
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
                    <Table.Cell>{format(e.createdAt, "dd/MM/yyyy")}</Table.Cell>
                    <Table.Cell>
                      {e.fechaRevision && format(e.fechaRevision, "dd/MM/yyyy")}
                    </Table.Cell>
                    <Table.Cell>
                      {e.estatus !== "iniciado"
                        ? e.fechaRecibido &&
                          format(e.fechaRecibido, "dd/MM/yyyy")
                        : "-"}
                    </Table.Cell>
                    {/* Cuando esta habilitado */}
                    <Table.Cell className="text-nowrap capitalize">
                      {e.estatus !== "iniciado" ? e.region.toLowerCase() : "-"}
                    </Table.Cell>
                    <Table.Cell className="capitalize">
                      {e.estatus !== "iniciado" ? e.areaOperacional.toLocaleLowerCase() : "-"}
                    </Table.Cell>
                    <Table.Cell className="capitalize">
                      {e.estatus !== "iniciado" ? e.pueblo.toLocaleLowerCase() : "-"}
                    </Table.Cell>
                    <Table.Cell>
                      {e.estatus !== "iniciado"
                        ? getValue(e.documento?.cartaRecomendacion)
                        : "-"}
                    </Table.Cell>
                    <Table.Cell className="text-nowrap">
                      {e.estatus !== "iniciado" ? (
                        e.Foto?.fotosGrales?.length > 0 ? (
                          <div
                            className="p-2 hover:bg-slate-500/30 rounded-md cursor-pointer w-max"
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
                    <Table.Cell>
                      {e.observaciones ? (
                        <span>{e.observaciones}</span>
                      ) : (
                        <span className="text-red-500">Sin comentarios</span>
                      )}
                    </Table.Cell>
                    {data?.user?.rol === 3 ? null : (
                      <Table.Cell>
                        <div>
                          <Dropdown
                            className="z-50"
                            placement="left-bottom"
                            label="Acciones"
                          >
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
                              Estatus
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
                            <Dropdown.Item
                              onClick={() =>
                                router.push("/dashboard/casos?coments=" + e.id)
                              }
                              className="flex justify-between gap-2"
                            >
                              Comentarios <Book className="w-4" />
                            </Dropdown.Item>
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
                                router.push("/dashboard/casos?fechas=" + e.id)
                              }
                              className="flex justify-between gap-2"
                            >
                              Fecha rec/rev <Calendar className="w-4" />
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
                        </div>
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
