import {
   addPersonal,
   getPersonalByDate,
   ImportPersonal,
} from '@/utils/api/personal';
import { exportPersonal, importPersonal, Personal } from '@/utils/types';
import { format } from 'date-fns';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import * as XLSX from 'xlsx';

function AddPersonal({ refreshPersonal }: { refreshPersonal: () => void }) {
   const params = useSearchParams();
   const router = useRouter();
   const estatus = params.get('estatus');
   const [modal, setModal] = useState(false);
   const [loading, setLoading] = useState(false);
   const initialForm = {
      name: '',
      secondName: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      numContacto: '',
      idPersonal: '',
   };
   const [formData, setFormData] = useState<any>(initialForm);
   const [fileData, setFileData] = useState<File>();
   const [color, setColor] = useState('');
   const [text, setText] = useState('');
   const [showToast, setShowToast] = useState(false);
   const [importData, setImportData] = useState(false);
   const [exportData, setExportData] = useState(false);
   const [fechaExportacion, setFechaExportacion] = useState({
      desde: new Date(),
      hasta: new Date(),
   });

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

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev: any) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!estatus) {
         return;
      }
      try {
         setLoading(true);
         const res = await addPersonal(formData, estatus);
         console.log(res)
         if (res === 'personal agregado') {
            setModal(false);
            refreshPersonal();
            setFormData(initialForm);
            callToast('success', 'Personal agregado');
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

   const selectFechaFormData = (e: Date, name: string) => {
      setFormData((prev: any) => ({
         ...prev,
         [name]: new Date(e),
      }));
   };

   const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
      setFileData(e.target.files?.[0]);
      //console.log(e);
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
            const worksheet = workbook.Sheets['Personal nuevo'];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const customKeys = [
               'idPersonal',
               'name',
               'secondName',
               'apellidoMaterno',
               'apellidoPaterno',
               'numContacto',
               'trabaja',
            ];
            const dataRows = jsonData.slice(1);
            const parsedData = dataRows
               .map((row: any) => {
                  const rowData: any = {};
                  if (
                     row.some(
                        (value) =>
                           typeof value === 'string' && value.trim() !== ''
                     )
                  ) {
                     row.forEach((value, index: any) => {
                        const label = customKeys[index];
                        if (label === 'trabaja') {
                           rowData[label] =
                              typeof value === 'string' &&
                              value.trim().toLowerCase() === 'si'
                                 ? true
                                 : false;
                        } else {
                           rowData[label] = value;
                        }
                     });
                     return rowData;
                  }
                  return null;
               })
               .filter((rowData: any) => rowData !== null) as importPersonal[];
            if (parsedData) {
               setLoading(true);
               const res = await ImportPersonal(parsedData);
               if (res === 'AddPersonal') {
                  setLoading(false);
                  setImportData(false);
                  router.replace('/dashboard/personal?estatus=' + estatus);
                  router.refresh();
                  callToast('success', 'Personal importados agregados');
               } else if (res === 'noAdd') {
                  callToast('warning', 'No se agrego personal nuevo');
                  setLoading(false);
               } else {
                  callToast(
                     'failure',
                     `Error al agregar personal, verifique no dejar ningun campo vacio`
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

   const isCertificacionVencida = (
      fechaExpiracion: Date | null | undefined
   ): boolean | null => {
      if (!fechaExpiracion) return null; // Devuelve null si no hay fecha de expiración
      const now = new Date();
      return new Date(fechaExpiracion) < now; // Retorna true si está vencido, false si aún es vigente
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
         const response = await getPersonalByDate(
            dateDesde,
            dateHasta,
            estatus
         );
         if (response.length > 0) {
            const dataExcel = response.map((caso: exportPersonal) => {
               const {
                  apellidoMaterno,
                  apellidoPaterno,
                  name,
                  numContacto,
                  observaciones,
                  secondName,
                  trabaja,
                  id,
                  idPersonal,
                  certificacions,
                  /* @ts-ignore */
                  updatedAt,
                  /* @ts-ignore */
                  createdAt,
               } = caso;
               const agrupaciones = certificacions.reduce(
                  (acc: any, cert) => {
                     const { tipoDocumento } = cert;
                     switch (tipoDocumento) {
                        case 'asbesto':
                           acc.asbesto.push(cert);
                           break;
                        case 'plomo':
                           acc.plomo.push(cert);
                           break;
                        case 'fitTest':
                           acc.fitTest.push(cert);
                           break;
                        case 'Medica':
                           acc.medica.push(cert);
                           break;
                        case 'resultadoFitTest':
                           acc.medica.push(cert);
                           break;
                        case 'resultadoMedica':
                           acc.medica.push(cert);
                           break;
                        case 'licencia':
                           acc.otros.push(cert);
                           break;
                        case 'otros':
                           acc.otros.push(cert);
                           break;
                     }

                     return acc;
                  },
                  {
                     asbesto: [],
                     plomo: [],
                     fitTest: [],
                     medica: [],
                     resultadoFitTest: [],
                     resultadoMedica: [],
                     licencia: [],
                     otros: [],
                  }
               );
               return {
                  id: id,
                  Nombre: name,
                  Identificador: idPersonal,
                  'Segundo nombre': secondName,
                  'Apellido Materno': apellidoMaterno,
                  'Apellido Paterno': apellidoPaterno,
                  Telefono: numContacto,
                  'Trabaja en la empresa?': trabaja ? 'SI' : 'NO',
                  Observaciones: observaciones ?? '',
                  'Ultima actualizacion': format(updatedAt, 'dd/MM/yyyy'),
                  'Fecha de creacion': format(createdAt, 'dd/MM/yyyy'),
                  'Certificación de asbesto': agrupaciones?.asbesto?.length
                     ? isCertificacionVencida(
                          agrupaciones.asbesto[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  'Certificación de plomo': agrupaciones?.plomo?.length
                     ? isCertificacionVencida(
                          agrupaciones.plomo[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  'Evaluacion Fit Test': agrupaciones?.fitTest?.length
                     ? isCertificacionVencida(
                          agrupaciones.fitTest[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  'Evaluacion medica': agrupaciones?.medica?.length
                     ? isCertificacionVencida(
                          agrupaciones.medica[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  'Resultado Fit Test': agrupaciones?.resultadoFitTest?.length
                     ? isCertificacionVencida(
                          agrupaciones.resultadoFitTest[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  'Resultado Evaluación Medica': agrupaciones?.resultadoMedica
                     ?.length
                     ? isCertificacionVencida(
                          agrupaciones.resultadoMedica[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  'Licencia de conducir': agrupaciones?.licencia?.length
                     ? isCertificacionVencida(
                          agrupaciones.licencia[0]?.fechaExpiracion
                       )
                        ? 'Vencido'
                        : 'Vigente'
                     : 'No tiene',
                  Otros: agrupaciones?.otros?.length
                     ? 'Tiene otros documentos'
                     : 'No tiene',
               };
            });

            //console.log(dataExcel);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataExcel);

            const colWidths = dataExcel.reduce((acc: any, row: any) => {
               Object.keys(row).forEach((key, index) => {
                  const value = row[key];
                  const previousWidth = acc[index] || 0;
                  const newValueWidth = 14;
                  acc[index] = Math.max(previousWidth, newValueWidth);
               });
               return acc;
            }, []);
            worksheet['!cols'] = colWidths.map((width: number) => ({
               wch: 16,
            }));

            XLSX.utils.book_append_sheet(
               workbook,
               worksheet,
               'PERSONAL EXPORTADOS'
            );
            const excel = XLSX.write(workbook, {
               bookType: 'xlsx',
               type: 'array',
            });
            const blob = new Blob([excel], {
               type: 'application/octet-stream',
            });
            const fileName = 'personal.xlsx';
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
         <>
            {showToast && <ToastAttr color={color} text={text} />}
            <>
               <Button /* onClick={() => setModal(true)} */>
                  Agregar <PlusCircle className="ml-2" />
               </Button>
               <Button /* onClick={() => setExportData(true)} */>
                  Exportar datos <FileUp className="ml-2" />
               </Button>
               <Button outline /* onClick={() => setImportData(true)} */>
                  Importar datos <FileUp className="ml-2" />
               </Button>
            </>
            <Modal show={modal} onClose={() => setModal(false)}>
               <Modal.Header>Agregar personal</Modal.Header>
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
                              {e.type === 'number' && (
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
                                       //@ts-ignore
                                       onChange={handleChange}
                                       value={formData[e.name]}
                                       type={e.type}
                                       name={e.name}
                                       required
                                    >
                                       <option value={''}>
                                          Seleccionar opcion
                                       </option>
                                       {Object.keys(e.options).map(
                                          (key, idx) => (
                                             <option
                                                key={idx}
                                                value={e.options[key]}
                                             >
                                                {e.options[key]}
                                             </option>
                                          )
                                       )}
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
                                             ? format(
                                                  formData[e.name],
                                                  'dd-MM-yy'
                                               )
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
         </>
      </div>
   );
}

const inputs = [
   { name: 'name', type: 'text', label: 'Nombre' },
   {
      name: 'secondName',
      type: 'text',
      label: 'Segundo nombre',
   },
   {
      name: 'apellidoMaterno',
      type: 'text',
      label: 'Apellido materno',
   },
   { name: 'apellidoPaterno', type: 'text', label: 'Apellido paterno' },
   { name: 'numContacto', type: 'text', label: 'Numero de contacto' },
   { name: 'idPersonal', type: 'number', label: 'Identificador' },
];

export default AddPersonal;
