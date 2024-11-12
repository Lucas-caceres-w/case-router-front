//@ts-nocheck
'use client';
import { options } from '@/utils/mockups/mockups';
import { staticsPdf } from '@/utils/routes';
import { Caso } from '@/utils/types';
import { differenceInDays, format, isWithinInterval, parse } from 'date-fns';
import {
   Button,
   Datepicker,
   Dropdown,
   Label,
   Pagination,
   Progress,
   Radio,
   Table,
   TextInput,
   Tooltip,
} from 'flowbite-react';
import {
   Book,
   Calendar,
   Camera,
   Edit,
   Map,
   RefreshCcw,
   Trash,
   Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

function TableComp({ initialCols }: { initialCols: Caso[] | [] }) {
   const router = useRouter();
   const [cols, setCols] = useState(initialCols);
   const [progreso, setProgreso] = useState(0);
   const [filteredCasos, setFilteredCasos] = useState<Caso[] | []>(cols);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 6; // Número de elementos por página
   const [startDate, setstartDate] = useState<Date | undefined>();
   const [endDate, setEndDate] = useState<Date | undefined>();
   const [expandEstatus, setExpandEstatus] = useState(false);

   const tableHeaders = [
      { label: 'Gerente de Proyectos' },
      { label: 'Superintendente de Proyectos' },
      { label: 'Supervisor de Proyecto' },
      { label: 'Nombre de cliente' },
      { label: 'Nombre del Proyecto' },
      { label: 'Dirección Física del Proyecto' },
      { label: 'Latitud' },
      { label: 'Longitud' },
      { label: 'Pueblo' },
      { label: 'Número de Proyecto' },
      { label: '% de Proyectos completados' },
      { label: 'Estatus' },
      { label: 'Descripción del Proyecto' },
      { label: 'Fecha de Adjudicación' },
      { label: 'Material a remover' },
      { label: 'Cantidad estimada a remover' },
      { label: 'Cantidad de desperdicio' },
      { label: 'Plan de trabajo de Asbesto (ABS)' },
      { label: 'Plan de trabajo de Plomo (LBP)' },
      { label: 'Estudio Ambiental de Asbesto' },
      { label: 'Estudio Ambiental de Asbesto Enmendado' },
      { label: 'Estudio Ambiental de Plomo' },
      { label: 'Estudio Ambiental de Plomo Enmendado' },
      { label: 'Permiso de Asbesto' },
      { label: 'Permiso de Plomo' },
      { label: 'Cambios de Orden' },
      { label: 'Planos de Proyectos Ambientales' },
      { label: 'Planos de Proyectos de Demolición' },
      { label: 'Planos de Cambios de Orden' },
      { label: 'Documentos de Cambios de Orden' },
      { label: 'Clearence de ABS PDF' },
      { label: 'Clearence de LPB PDF' },
      { label: 'Fecha de Cambio de Orden' },
      { label: 'Días Adicionales por cambio de orden' },
      { label: 'Otros documentos' },
      { label: 'Fecha de inicio del Proyecto' },
      { label: 'Fecha de Finalización' },
      { label: 'Duración del Proyecto en días' },
      { label: 'Tiempo Transcurrido del Proyecto' },
      { label: 'Fotos' },
      { label: 'Comentarios' },
   ];

   const calcularProgreso = (fechaInicio, fechaFin) => {
      const fechaActual = new Date(); // Fecha actual
      const totalDias = differenceInDays(
         new Date(fechaFin),
         new Date(fechaInicio)
      ); // Días totales del proyecto
      const diasTranscurridos = differenceInDays(
         fechaActual,
         new Date(fechaInicio)
      ); // Días transcurridos desde la fecha de inicio

      // Asegurarnos de que no se supere el 100% si ya pasó la fecha de finalización
      const progreso = Math.min((diasTranscurridos / totalDias) * 100, 100);

      return progreso.toFixed(2); // Redondear el progreso a dos decimales
   };

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
      if (value.trim() === '') {
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

   const selectCasosByStatus = (status: string, status2?: string) => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      if (status.trim() === '') {
         // Si el valor está vacío, mostrar todos los casos nuevamente
         setFilteredCasos(initialCols.slice(startIndex, endIndex));
      } else {
         // Filtrar los casos según el valor de estatus ingresado
         const filtered = initialCols?.filter(
            (e) =>
               e.estatus.toLowerCase() === status.toLowerCase() ||
               e.estatus.toLowerCase() === status2?.toLowerCase()
         );
         console.log(filtered, status);
         setFilteredCasos(filtered);
      }
      setCurrentPage(1);
   };

   useEffect(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      setFilteredCasos(initialCols.slice(startIndex, endIndex));
   }, [currentPage, initialCols, itemsPerPage]);

   const getValue = (valor: string | string[], id: string) => {
      const res = valor && valor.length > 0 ? (
         <Tooltip className="z-40" content="Abrir">
            <span
               onClick={() => router.push('/dashboard/casos?docs=' + id)}
               className="bg-green-400 border-2 border-green-600 p-[5px] px-2 rounded-md text-white cursor-pointer"
            >
               SI
            </span>
         </Tooltip>
      ) : (
         <span className="bg-red-500 border-2 border-red-600 p-[5px] rounded-md text-white">
            NO
         </span>
      );

      return res;
   };

   const filterCasosPorFecha = () => {
      const startDateObj = parse(startDate, 'dd-MM-yyyy', new Date());
      const endDateObj = parse(endDate, 'dd-MM-yyyy', new Date());
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
            (option) => option.value.toLowerCase() === est.toLowerCase()
         )?.label || '';
      console.log(est);
      const classEstatus = () => {
         switch (est) {
            case 'nuevo':
               return 'text-orange-400';
            case 'adjudicado':
               return 'text-blue-400';
            case 'inicio':
               return 'text-red-400';
            case 'progreso':
               return 'text-yellow-300';
            case 'completado':
               return 'text-green-400';
            default:
               return 'text-sky-400';
         }
      };

      return <p className={`${classEstatus()} font-semibold`}>{estatus}</p>;
   }

   useEffect(() => {
      setProgreso(calcularProgreso());
   }, []);

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
                        setstartDate(format(startDate, 'dd-MM-yyyy'));
                     }}
                  />
                  <p className="text-slate-800 dark:text-slate-200 text-nowrap">
                     -
                  </p>
                  <Datepicker
                     showClearButton={false}
                     className="w-36"
                     language="es-ES"
                     disabled={!startDate ? true : false}
                     showTodayButton={false}
                     value={endDate}
                     onSelectedDateChanged={(endDate) => {
                        setEndDate(format(endDate, 'dd-MM-yyyy'));
                     }}
                  />
                  <Button
                     onClick={() => {
                        setstartDate('');
                        setEndDate('');
                     }}
                  >
                     Limpiar
                  </Button>
               </section>
            </div>
            {/* <fieldset className="w-7/12">
               <legend className="text-slate-800 dark:text-slate-200 font-semibold">
                  Estado:
               </legend>
               <Button
                  onClick={() => setExpandEstatus(!expandEstatus)}
                  className="my-2"
               >
                  {expandEstatus ? 'Hide' : 'Expand'}
               </Button>
               {expandEstatus &&
                  {
                     <section className="flex flex-row flex-wrap gap-x-4 items-center my-4">
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() => selectCasosByStatus('iniciado')}
                           name="estatus"
                           value="iniciado"
                           id="iniciados"
                        />
                        <Label htmlFor="iniciados">Iniciados</Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'verificacion',
                                 'Verificacion inicial'
                              )
                           }
                           name="estatus"
                           value="verificacion"
                           id="verificacion"
                        />
                        <Label htmlFor="verificacion">
                           Verificacion inicial
                        </Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'solicitaPlanos',
                                 'Se Solicita Planos'
                              )
                           }
                           name="estatus"
                           value="solicitaPlanos"
                           id="solicitaPlanos"
                        />
                        <Label htmlFor="solicitaPlanos">
                           Se Solicita Planos
                        </Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'reporteInicial',
                                 'Preparacion De Reporte Inicial'
                              )
                           }
                           name="estatus"
                           value="reporteInicial"
                           id="reporteInicial"
                        />
                        <Label htmlFor="reporteInicial">Reporte inicial</Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'asignado',
                                 'Asignado a investigaciòn'
                              )
                           }
                           name="estatus"
                           value="asignado"
                           id="asignado"
                        />
                        <Label htmlFor="asignado">
                           Asignado a investigacion
                        </Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'referidoGTA',
                                 'Referido a GTA'
                              )
                           }
                           name="estatus"
                           value="referidoGTA"
                           id="referidoGTA"
                        />
                        <Label htmlFor="referidoGTA">Referido a GTA</Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'reporteCompletado',
                                 'Preparaciòn de reporte completado'
                              )
                           }
                           name="estatus"
                           value="reporteCompletado"
                           id="reporteCompletado"
                        />
                        <Label htmlFor="reporteCompletado">
                           Reporte completado
                        </Label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <Radio
                           onClick={() =>
                              selectCasosByStatus(
                                 'cartaRecomendacion',
                                 'Carta de recomendacion completada'
                              )
                           }
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
                           onClick={() =>
                              selectCasosByStatus(
                                 'completado',
                                 'Listo para trasferir a PPP'
                              )
                           }
                           name="estatus"
                           value="completado"
                           id="completado"
                        />
                        <Label htmlFor="completado">Completados</Label>
                     </div>
                     <div className="flex gap-2 items-center p-1">
                        <Radio
                           onClick={() =>
                              setFilteredCasos(initialCols.slice(0, 5))
                           }
                           name="estatus"
                           value="clean"
                           id="clean"
                        />
                        <Label htmlFor="clean">Limpiar</Label>
                     </div>
                  </section>
                  }}
            </fieldset> */}
         </div>
         <div className="w-[98%] h-full min-h-[450px] overflow-x-scroll">
            <Table striped>
               <Table.Head className="sticky top-0 z-40">
                  {tableHeaders.map((header, idx) => (
                     <Table.HeadCell
                        key={idx}
                        className="!bg-slate-400 dark:!bg-slate-950"
                     >
                        {header.label}
                     </Table.HeadCell>
                  ))}
                  {
                     <Table.HeadCell className="!bg-slate-400 dark:!bg-slate-950">
                        Acciones
                     </Table.HeadCell>
                  }
               </Table.Head>
               <Table.Body className="overflow-scroll">
                  {filteredCasos &&
                     Array.isArray(filteredCasos) &&
                     filteredCasos?.map((e: Caso) => {
                        console.log(e);
                        return (
                           <Table.Row
                              key={e.id}
                              className="dark:bg-slate-800 bg-slate-100 text-balance"
                           >
                              <Table.Cell>{e?.gerenteProyecto}</Table.Cell>
                              <Table.Cell className="text-nowrap whitespace-nowrap">
                                 {e?.superintendenteProyecto}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap whitespace-nowrap">
                                 {e?.supervisorProyecto}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap whitespace-nowrap">
                                 {e?.nombreCliente}
                              </Table.Cell>
                              <Table.Cell>{e?.nombreProyecto}</Table.Cell>
                              <Table.Cell className="text-nowrap">
                                 {e?.direccionProyecto}
                              </Table.Cell>
                              <Table.Cell>{e?.latitud}</Table.Cell>
                              <Table.Cell>{e?.longitud}</Table.Cell>
                              <Table.Cell>{e?.pueblo}</Table.Cell>
                              <Table.Cell className='text-nowrap'>{e?.numeroProyecto}</Table.Cell>
                              <Table.Cell>
                                 <Progress
                                    color="cyan"
                                    textLabel="Progreso"
                                    textLabelPosition="outside"
                                    size={'lg'}
                                    labelProgress
                                    progress={calcularProgreso(
                                       e?.fechaInicio,
                                       e?.fechaFin
                                    )}
                                    progressLabelPosition="inside"
                                    labelText
                                 />
                              </Table.Cell>
                              <Table.Cell className="text-nowrap">
                                 {getStatusLabel(e.estatus)}
                              </Table.Cell>
                              <Table.Cell>{e?.descripcionProyecto}</Table.Cell>
                              <Table.Cell>
                                 {e?.estatus !== 'iniciado'
                                    ? e.fechaAdjudicado &&
                                      format(e.fechaAdjudicado, 'dd/MM/yyyy')
                                    : '-'}
                              </Table.Cell>
                              <Table.Cell>{e?.materialARemover}</Table.Cell>
                              <Table.Cell>{e?.cantidadEstimada}</Table.Cell>
                              <Table.Cell>
                                 {e?.cantidadDesperdiciada}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.planAsbesto, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.planPlomo, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.estudioAsbesto, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(
                                    e?.documento?.estudioEnmendado,
                                    e.id
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.estudioPlomo, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(
                                    e?.documento?.estudioPlomoEnmendado,
                                    e.id
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.permisoAsbesto, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.permisoPlomo, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.cambioOrden, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.planosProyectos, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(
                                    e?.documento?.planosProyectosDemolicion
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(
                                    e?.documento?.planosCambioOrden,
                                    e.id
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(
                                    e?.documento?.documentosCambioOrden,
                                    e.id
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(
                                    e?.documento?.clearenceAsbesto,
                                    e.id
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.clearencePlomo, e.id)}
                              </Table.Cell>
                              <Table.Cell>
                                 {e?.cambioOrden &&
                                    format(e?.cambioOrden, 'dd/MM/yyyy')}
                              </Table.Cell>
                              <Table.Cell>{e?.diasAdicionales}</Table.Cell>
                              <Table.Cell>
                                 {getValue(e?.documento?.otros)}
                              </Table.Cell>
                              <Table.Cell>
                                 {e?.fechaInicio &&
                                    format(e?.fechaInicio, 'dd/MM/yyyy')}
                              </Table.Cell>
                              <Table.Cell>
                                 {e?.fechaFin &&
                                    format(e?.fechaFin, 'dd/MM/yyyy')}
                              </Table.Cell>
                              <Table.Cell>
                                 {e?.fechaInicio &&
                                    e?.fechaFin &&
                                    differenceInDays(
                                       format(e?.fechaFin, 'yyyy/MM/dd'),
                                       format(e?.fechaInicio, 'yyyy/MM/dd')
                                    ) + ' Dias'}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap capitalize">
                                 {e?.fechaInicio &&
                                    differenceInDays(
                                       format(new Date(), 'yyyy/MM/dd'),
                                       format(e?.fechaInicio, 'yyyy/MM/dd')
                                    ) + ' Dias'}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap">
                                 {e?.estatus !== 'nuevo' ? (
                                    e?.Foto?.fotosGrales?.length > 0 ? (
                                       <div
                                          className="p-2 hover:bg-slate-500/30 rounded-md cursor-pointer w-max"
                                          onClick={() =>
                                             router.push(
                                                '/dashboard/casos?getFotos=' +
                                                   e.id
                                             )
                                          }
                                       >
                                          <Camera />
                                       </div>
                                    ) : (
                                       'No hay fotos'
                                    )
                                 ) : (
                                    '-'
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 {e?.observaciones ? (
                                    <span>{e.observaciones}</span>
                                 ) : (
                                    <span className="text-red-500">
                                       Sin comentarios
                                    </span>
                                 )}
                              </Table.Cell>
                              {
                                 <Table.Cell>
                                    <div>
                                       <Dropdown
                                          className="z-50"
                                          placement="left-bottom"
                                          label="Acciones"
                                       >
                                          <Dropdown.Item
                                             onClick={() =>
                                                router.push(
                                                   '/dashboard/casos?edit=' +
                                                      e.id
                                                )
                                             }
                                             className="flex justify-between gap-2"
                                          >
                                             Editar
                                             <Edit className="w-4" />
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                             onClick={() =>
                                                router.push(
                                                   '/dashboard/casos?estatus=' +
                                                      e.id
                                                )
                                             }
                                             className="flex justify-between gap-2"
                                          >
                                             Estatus
                                             <RefreshCcw className="w-4" />
                                          </Dropdown.Item>
                                          {e.estatus === 'completado' && (
                                             <Dropdown.Item
                                                onClick={() =>
                                                   router.push(
                                                      '/dashboard/casos?material=' +
                                                         e.id
                                                   )
                                                }
                                                className="flex justify-between gap-2"
                                             >
                                                Material Desperdiciado
                                                <Map className="w-4" />
                                             </Dropdown.Item>
                                          )}
                                          <Dropdown.Item
                                             onClick={() =>
                                                router.push(
                                                   '/dashboard/casos?coments=' +
                                                      e.id
                                                )
                                             }
                                             className="flex justify-between gap-2"
                                          >
                                             Comentarios{' '}
                                             <Book className="w-4" />
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                             onClick={() =>
                                                router.push(
                                                   '/dashboard/casos?upload=' +
                                                      e.id
                                                )
                                             }
                                             className="flex justify-between gap-2"
                                          >
                                             Subir documento{' '}
                                             <Upload className="w-4" />
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                             onClick={() =>
                                                router.push(
                                                   '/dashboard/casos?fotos=' +
                                                      e.id
                                                )
                                             }
                                             className="flex justify-between gap-2"
                                          >
                                             Subir fotos{' '}
                                             <Upload className="w-4" />
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                             onClick={() =>
                                                router.push(
                                                   '/dashboard/casos?delete=' +
                                                      e.id
                                                )
                                             }
                                             className="flex justify-between gap-2"
                                          >
                                             Eliminar <Trash className="w-4" />
                                          </Dropdown.Item>
                                       </Dropdown>
                                    </div>
                                 </Table.Cell>
                              }
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
