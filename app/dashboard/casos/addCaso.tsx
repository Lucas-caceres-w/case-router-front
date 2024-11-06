// @ts-nocheck
'use client';
import { useAuth } from '@/components/context/SessionProvider';
import { ImportData, createCaso, getCasosByDate } from '@/utils/api/casos';
import { Pueblos } from '@/utils/mockups/areas';
import { Caso, ImportCaso } from '@/utils/types';
import { differenceInDays, format } from 'date-fns';
import {
   Alert,
   Button,
   Datepicker,
   FileInput,
   Label,
   Modal,
   Select,
   Spinner,
   TextInput,
} from 'flowbite-react';
import { FileUp, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import * as XLSX from 'xlsx';

function AddCaso() {
   const [modal, setModal] = useState(false);
   const initialForm = {
      gerenteProyecto: '',
      superintendenteProyecto: '',
      supervisorProyecto: '',
      nombreCliente: '',
      nombreProyecto: '',
      numeroProyecto: '',
      direccionProyecto: '',
      latitud: '',
      longitud: '',
      pueblo: '',
      descripcionProyecto: '',
      materialARemover: '',
      cantidadEstimada: '',
      fechaInicio: '',
      fechaFin: '',
   };
   const [formData, setFormData] = useState<any>(initialForm);
   const [fileData, setFileData] = useState<File>();
   const [importData, setImportData] = useState(false);
   const [exportData, setExportData] = useState(false);
   const [fechaExportacion, setFechaExportacion] = useState({
      desde: new Date(),
      hasta: new Date(),
   });
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const { user } = useAuth();
   const [color, setColor] = useState('');
   const [text, setText] = useState('');
   const [showToast, setShowToast] = useState(false);

   const calcularProgreso = (fechaInicio, fechaFin) => {
      const fechaActual = new Date();
      const totalDias = differenceInDays(
         new Date(fechaFin),
         new Date(fechaInicio)
      );
      const diasTranscurridos = differenceInDays(
         fechaActual,
         new Date(fechaInicio)
      );

      const progreso = Math.min((diasTranscurridos / totalDias) * 100, 100);

      return progreso.toFixed(2);
   };

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
      setFormData((prev: any) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const selectFechaFormData = (e: Date, name: string) => {
      setFormData((prev: any) => ({
         ...prev,
         [name]: new Date(e),
      }));
      console.log(formData);
   };

   const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
      setFileData(e.target.files?.[0]);
      //console.log(e);
   };

   const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
         setLoading(true);
         const res = await createCaso(formData);
         if (res === 'el proyecto existe') {
            callToast('warning', 'El Proyecto ya existe');
         } else if (res === 'Proyecto creado') {
            setModal(false);
            router.refresh();
            callToast('success', 'Proyecto agregado');
         } else {
            callToast('warning', 'Error inesperado');
         }
      } catch (err) {
         callToast('failure', 'Ocurrio un error al guardar el caso');
         console.log(err);
      } finally {
         setLoading(false);
      }
   };

   const SubmitFile = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!fileData) {
         console.log('No se ha seleccionado ningún archivo.');
         return;
      }
      // Procesar el archivo Excel
      const reader = new FileReader();
      reader.onload = async (event) => {
         if (event?.target?.result) {
            const binaryString = event.target.result as string;
            const workbook = XLSX.read(binaryString, { type: 'binary' });
            const worksheet = workbook.Sheets['Proyectos Nuevos PPP'];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const customKeys = [
               'gerenteProyecto',
               'superintendenteProyecto',
               'supervisorProyecto',
               'nombreProyecto',
               'nombreCliente',
               'direccionProyecto',
               'latitud',
               'longitud',
               'pueblo',
               'numeroProyecto',
               'estatus',
               'descripcionProyecto',
               'materialARemover',
               'cantidadEstimada',
            ];
            const dataRows = jsonData.slice(1);
            const parsedData = dataRows
               .map((row: any) => {
                  const rowData: ImportCaso | any = {} as ImportCaso;
                  if (row.some((value: string) => value.trim() !== '')) {
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
               if (res === 'AddCases') {
                  setLoading(false);
                  setImportData(false);
                  router.replace('/dashboard/casos');
                  router.refresh();
                  callToast('success', 'Casos importados agregados');
               } else if (res === 'noAdd') {
                  callToast('warning', 'No se agregaron casos nuevos');
                  setLoading(false);
               } else {
                  callToast(
                     'failure',
                     `Error al agregar casos, verifique no dejar ningun campo vacio`
                  );
                  setLoading(false);
               }
            } else {
               callToast('failure', 'No hay archivo para importar');
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
         .replace('T', ' ');
      const dateHasta = fechaExportacion.hasta
         .toISOString()
         .slice(0, 19)
         .replace('T', ' ');

      try {
         setLoading(true);
         const response = await getCasosByDate(dateDesde, dateHasta);

         if (response.length > 0) {
            const dataExcel = response.map((caso: Caso) => {
               const id = caso.id;
               const gerenteProyecto = caso.gerenteProyecto;
               const superintendenteProyecto = caso.superintendenteProyecto;
               const supervisorProyecto = caso.supervisorProyecto;
               const nombreCliente = caso.nombreCliente;
               const nombreProyecto = caso.nombreProyecto;
               const direccionProyecto = caso.direccionProyecto;
               const lat = caso.latitud;
               const lng = caso.longitud;
               const pueblo = caso.pueblo;
               const numeroProyecto = caso.numeroProyecto;
               const progreso =
                  caso?.fechaInicio && caso?.fechaFin
                     ? calcularProgreso(caso?.fechaInicio, caso?.fechaFin)
                     : 'Sin progreso';
               const estatus = caso.estatus;
               const descripcionProyecto = caso.descripcionProyecto;
               const fechaAdjudicado = caso?.fechaAdjudicado
                  ? format(new Date(caso?.fechaAdjudicado), 'dd-MM-yyyy')
                  : 'Sin fecha';
               const materialARemover = caso.materialARemover;
               const cantidadEstimada = caso.cantidadEstimada;
               const cantidadDesperdiciada = caso.cantidadDesperdiciada;
               const comentarios = caso.observaciones;

               const planAsbesto = caso.documento.planAsbesto;
               const planPlomo = caso.documento.planPlomo;
               const estudioAsbesto = caso.documento.estudioAsbesto;
               const estudioEnmendado = caso.documento.estudioEnmendado;
               const estudioPlomo = caso.documento.estudioPlomo;
               const estudioPlomoEnmendado =
                  caso.documento.estudioPlomoEnmendado;
               const permisoAsbesto = caso.documento.permisoAsbesto;
               const permisoPlomo = caso.documento.permisoPlomo;
               const cambioOrden = caso.documento.cambioOrden;
               const planosProyectos = caso.documento.planosProyectos;
               const planosProyectosDemolicion =
                  caso.documento.planosProyectosDemolicion;
               const planosCambioOrden = caso.documento.planosCambioOrden;
               const documentosCambioOrden =
                  caso.documento.documentosCambioOrden;
               const fechaCambioOrden = caso.fechaCambioOrden
                  ? format(new Date(caso.fechaCambioOrden), 'dd-MM-yyyy')
                  : 'Sin fecha';
               const diasAdicionales = caso.diasAdicionales;
               const otros = caso.documento.otros;
               const fechaInicio = caso?.fechaInicio
                  ? format(new Date(caso.fechaInicio), 'dd-MM-yyyy')
                  : 'Sin fecha';
               const fechaFin = caso?.fechaFin
                  ? format(new Date(caso.fechaFin), 'dd-MM-yyyy')
                  : 'Sin fecha';
               const DuracionEnDias =
                  caso?.fechaInicio && caso?.fechaFin
                     ? differenceInDays(
                          format(caso?.fechaFin, 'yyyy/MM/dd'),
                          format(caso?.fechaInicio, 'yyyy/MM/dd')
                       )
                     : 'Sin fecha';
               const TiempoTranscurrido = caso?.fechaInicio
                  ? differenceInDays(
                       format(new Date(), 'yyyy/MM/dd'),
                       format(caso?.fechaInicio, 'yyyy/MM/dd')
                    )
                  : 'Sin fecha';
               const ultimaActualizacion =
                  caso.updatedAt &&
                  format(new Date(caso.updatedAt), 'dd-MM-yyyy');

               return {
                  id: id,
                  'Gerente del proyecto': gerenteProyecto,
                  'Superintendente del proyecto': superintendenteProyecto,
                  'Supervisor del proyecto': supervisorProyecto,
                  'Nombre de cliente': nombreCliente,
                  'Nombre del proyecto': nombreProyecto,
                  'Direccion del proyecto': direccionProyecto,
                  latitud: lat,
                  longitud: lng,
                  Pueblo: pueblo,
                  'Numero de proyecto': numeroProyecto,
                  'Progreso del proyecto': calcularProgreso,
                  Estado: estatus,
                  'Descripcion del proyecto': descripcionProyecto,
                  'Fecha de adjudicacion': fechaAdjudicado,
                  'Material a remover': materialARemover,
                  'Cantidad estimada': cantidadEstimada,
                  'Cantidad desperdiciada': cantidadDesperdiciada,
                  'Ultima actualizacion': ultimaActualizacion,
                  'Plan de trabajo de Asbesto (ABS)': planAsbesto ? 'SI' : 'NO',
                  'Plan de trabajo de Plomo (LBL)': planPlomo ? 'SI' : 'NO',
                  'Estudio Ambiental de Asbesto (ABS)': estudioAsbesto
                     ? 'SI'
                     : 'NO',
                  'Estudio Ambiental de Enmendado (ABS)': estudioEnmendado
                     ? 'SI'
                     : 'NO',
                  'Estudio Ambiental de Plomo (LBL)': estudioPlomo
                     ? 'SI'
                     : 'NO',
                  'Estudio Ambiental de Plomo Enmendado (LBL)':
                     estudioPlomoEnmendado ? 'SI' : 'NO',
                  'Permiso de Asbesto': permisoAsbesto ? 'SI' : 'NO',
                  'Permiso de Plomo': permisoPlomo ? 'SI' : 'NO',
                  'Cambio de orden': cambioOrden ? 'SI' : 'NO',
                  'Planos de proyectos Ambientales': planosProyectos
                     ? 'SI'
                     : 'NO',
                  'Planos de proyecto de Demolicion': planosProyectosDemolicion
                     ? 'SI'
                     : 'NO',
                  'Planos de cambio de orden': planosCambioOrden ? 'SI' : 'NO',
                  'Documentos de Cambios de Orden': documentosCambioOrden
                     ? 'SI'
                     : 'NO',
                  'Fecha de cambio de Orden': fechaCambioOrden,
                  'Dias adicionales por cambio de Orden': diasAdicionales,
                  'Otros documentos': otros ? 'SI' : 'NO',
                  'Fecha de inicio': fechaInicio,
                  'Fecha de fin': fechaFin,
                  'Duracion del proyecto': DuracionEnDias,
                  'Tiempo transcurrido': TiempoTranscurrido,
                  Comentarios: comentarios,
               };
            });

            //console.log(dataExcel);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataExcel);

            const colWidths = dataExcel.reduce((acc, row) => {
               Object.keys(row).forEach((key, index) => {
                  const value = row[key];
                  const previousWidth = acc[index] || 0;
                  const newValueWidth = 14;
                  acc[index] = Math.max(previousWidth, newValueWidth);
               });
               return acc;
            }, []);
            worksheet['!cols'] = colWidths.map((width) => ({ wch: 16 }));

            XLSX.utils.book_append_sheet(
               workbook,
               worksheet,
               'PROYECTOS EXPORTADOS'
            );
            const excel = XLSX.write(workbook, {
               bookType: 'xlsx',
               type: 'array',
            });
            const blob = new Blob([excel], {
               type: 'application/octet-stream',
            });
            const fileName = 'proyectos.xlsx';
            const downloadLink = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
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
      <div className="w-full flex justify-end gap-4 mr-10">
         {showToast && <ToastAttr color={color} text={text} />}
         {
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
         }
         <Modal show={modal} onClose={() => setModal(false)}>
            <Modal.Header>Agregar proyecto</Modal.Header>
            <form onSubmit={onSubmit}>
               <Modal.Body className="grid grid-cols-2 gap-2 h-max">
                  {inputs?.map((e: any, idx: number) => {
                     return (
                        <div className="flex flex-col gap-2" key={idx}>
                           {e.type === 'text' && (
                              <>
                                 <Label>{e.label}</Label>
                                 <TextInput
                                    onChange={handleChange}
                                    value={formData[e.name]}
                                    type={e.type}
                                    name={e.name}
                                    required
                                 />
                              </>
                           )}
                           {e.type === 'select' && (
                              <>
                                 <Label>{e.label}</Label>
                                 <Select
                                    onChange={handleChange}
                                    value={formData[e.name]}
                                    type={e.type}
                                    name={e.name}
                                    required
                                 >
                                    <option value={''}>
                                       Seleccionar opcion
                                    </option>
                                    {Object.keys(e.options).map((key, idx) => (
                                       <option key={idx} value={e.options[key]}>
                                          {e.options[key]}
                                       </option>
                                    ))}
                                 </Select>
                              </>
                           )}
                           {e.type === 'date' && (
                              <div className="pb-6">
                                 <Label>{e.label}</Label>
                                 <Datepicker
                                    onSelectedDateChanged={(d) =>
                                       selectFechaFormData(d, e.name)
                                    }
                                    className="absolute w-5/12"
                                    language="es-ES"
                                    showTodayButton={false}
                                    showClearButton={false}
                                    value={
                                       formData[e.name]
                                          ? format(formData[e.name], 'dd-MM-yy')
                                          : ''
                                    }
                                    name={e.name}
                                    required
                                 />
                              </div>
                           )}
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
            <Modal.Header>Exportar datos</Modal.Header>
            <form onSubmit={getCasosDates}>
               <Modal.Body>
                  <section className="flex flex-row gap-64 my-2 mb-4 -mt-12 py-12 justify-start">
                     <div>
                        <Label className="my-2" htmlFor="date-import">
                           Desde
                        </Label>
                        <Datepicker
                           onSelectedDateChanged={(e) =>
                              selectFechaExportacion(e, 'desde')
                           }
                           className="absolute"
                           language="es-ES"
                           showTodayButton={false}
                           showClearButton={false}
                           name="desde"
                           value={format(fechaExportacion.desde, 'dd-MM-yy')}
                        />
                     </div>
                     <div>
                        <Label className="my-2" htmlFor="date-import">
                           Hasta
                        </Label>
                        <Datepicker
                           onSelectedDateChanged={(e) =>
                              selectFechaExportacion(e, 'hasta')
                           }
                           className="absolute"
                           language="es-ES"
                           showTodayButton={false}
                           showClearButton={false}
                           name="hasta"
                           value={format(fechaExportacion.hasta, 'dd-MM-yy')}
                        />
                     </div>
                  </section>
                  <Modal.Footer className="flex items-center justify-end">
                     <Button disabled={loading} type="submit">
                        {loading ? <Spinner /> : 'Descargar informe'}
                     </Button>
                     <Button onClick={() => setExportData(false)}>
                        Cancelar
                     </Button>
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
                        {loading ? <Spinner /> : 'Enviar'}
                     </Button>
                     <Button onClick={() => setImportData(false)}>
                        Cancelar
                     </Button>
                  </Modal.Footer>
               </Modal.Body>
            </form>
         </Modal>
      </div>
   );
}

const inputs = [
   { name: 'gerenteProyecto', type: 'text', label: 'Gerente de proyecto' },
   {
      name: 'superintendenteProyecto',
      type: 'text',
      label: 'Superintendente de proyecto',
   },
   {
      name: 'supervisorProyecto',
      type: 'text',
      label: 'Supervisor de Proyecto',
   },
   { name: 'nombreCliente', type: 'text', label: 'Nombre de cliente' },
   { name: 'nombreProyecto', type: 'text', label: 'Nombre de proyecto' },
   {
      name: 'cantidadEstimada',
      type: 'text',
      label: 'Cantidad estimado a remover',
   },
   {
      name: 'descripcionProyecto',
      type: 'select',
      label: 'Descripción',
      options: ['Ambiental', 'Ambiental/Demolicion'],
   },
   {
      name: 'materialARemover',
      type: 'select',
      label: 'Material a remover',
      options: ['Asbesto', 'Plomo', 'Asbesto/Plomo'],
   },
   { name: 'numeroProyecto', type: 'text', label: 'Nº proyecto' },
   { name: 'direccionProyecto', type: 'text', label: 'Dirección de proyecto' },
   { name: 'latitud', type: 'text', label: 'Latitud' },
   { name: 'longitud', type: 'text', label: 'Longitud' },
   {
      name: 'pueblo',
      type: 'select',
      label: 'Pueblo',
      options: Pueblos.map((e) => e.pueblo),
   },
   { name: 'fechaInicio', type: 'date', label: 'Fecha de inicio' },
   { name: 'fechaFin', type: 'date', label: 'Fecha de fin' },
];

export default AddCaso;
