'use client';
import { uploadCertification } from '@/utils/api/personal';
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
} from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

function UpCertificado({ refreshPersonal }: { refreshPersonal: () => void }) {
   const params = useSearchParams();
   const router = useRouter();
   const idParam = params.get('certificado');
   const estatus = params.get('estatus');
   const selects = [
      { name: 'asbesto', label: 'Certificación de Asbesto' },
      { name: 'plomo', label: 'Certificación de Plomo' },
      { name: 'Medica', label: 'Evaluación Medica' },
      {
         name: 'fitTest',
         label: 'Prueba de Fit Test',
      },
      {
         name: 'resultadoFitTest',
         label: 'Resultado de Fit Test',
      },
      {
         name: 'resultadoMedica',
         label: 'Resultado de Evaluación Medica',
      },
      {
         name: 'licencia',
         label: 'Licencia de conducir PDF',
      },
      { name: 'otros', label: 'Otros documentos' },
   ];
   const [file, setFile] = useState<File | any>();
   const [fechaExportacion, setFechaExportacion] = useState({
      inicio: new Date(),
      exp: new Date(),
   });
   const [selectedOption, setSelectedOption] = useState(selects[0].name);
   const [selectedMedica, setSelectedMedica] = useState('asbesto');
   const [selectedLicencia, setSelectedLicencia] = useState('1');
   const [days, setDays] = useState('');
   const [color, setColor] = useState('');
   const [text, setText] = useState('');
   const [showToast, setShowToast] = useState(false);
   const [loading, setLoading] = useState(false);

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

   const readFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files?.[0];
      setFile(fileList);
   };

   const selectFechaExportacion = (e: Date, name: string) => {
      setFechaExportacion((prev: any) => ({
         ...prev,
         [name]: new Date(e),
      }));
   };

   const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(e.target.value);
   };

   const handleChangeMedica = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedMedica(e.target.value);
   };

   const handleChangeLicencia = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedLicencia(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) {
         console.error('No hay archivo');
         return;
      }
      const allowedExtensions = ['pdf'];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
         callToast(
            'failure',
            'El archivo no esta permitido, asegurese de que sean archivos .pdf'
         );
         return;
      }
      const formData = new FormData();
      formData.append('Blob', file, file.name);
      formData.append('option', selectedOption);
      formData.append('days', days);
      setLoading(true);
      try {
         if (!idParam) {
            return;
         }
         const res = await uploadCertification({
            formData,
            inicio: fechaExportacion.inicio,
            expiracion: fechaExportacion.exp,
            tipo: selectedOption === 'medica' ? selectedMedica : selectedOption,
            tipoEvaluacion:
               selectedOption === 'licencia' ? selectedLicencia : null,
            idParam,
         });
         if (res) {
            callToast('success', 'Archivo guardado correctamente');
            setSelectedOption(selects[0].name);
            setDays('');
            router.replace('/dashboard/personal?estatus=' + estatus);
            refreshPersonal();
         } else {
            callToast('warning', 'Error al guardar el documento');
         }
      } catch (err) {
         callToast('failure', 'Error del servidor');
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         {showToast && <ToastAttr color={color} text={text} />}
         <Modal
            show={idParam ? true : false}
            onClose={() =>
               router.push('/dashboard/personal?estatus=' + estatus)
            }
         >
            <Modal.Header>Subir certificación</Modal.Header>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
               <Modal.Body>
                  <Label>Seleccionar tipo de certificación</Label>
                  <Select required onChange={handleChange}>
                     {selects.map((e, idx) => {
                        return (
                           <option value={e.name} key={idx}>
                              {e.label}
                           </option>
                        );
                     })}
                  </Select>
                  {selectedOption === 'medica' && (
                     <div className="pt-2">
                        <Label>Seleccionar tipo de Evaluación medica</Label>
                        <Select required onChange={handleChangeMedica}>
                           <option value={'asbesto'}>Asbesto</option>
                           <option value={'plomo'}>Plomo</option>
                           <option value={'asbestoPlomo'}>
                              Asbesto / Plomo
                           </option>
                        </Select>
                     </div>
                  )}
                  {selectedOption === 'licencia' && (
                     <div className="pt-2">
                        <Label>Seleccionar categoria</Label>
                        <Select required onChange={handleChangeLicencia}>
                           <option value={'1'}>1</option>
                           <option value={'2'}>2</option>
                           <option value={'3'}>3</option>
                           <option value={'4'}>4</option>
                           <option value={'5'}>5</option>
                           <option value={'6'}>6</option>
                           <option value={'7'}>7</option>
                           <option value={'8'}>8</option>
                           <option value={'9'}>9</option>
                        </Select>
                     </div>
                  )}
                  <FileInput
                     onChange={readFile}
                     accept=".pdf"
                     className="mt-4"
                     name="file"
                     required
                  />
                  {selectedOption !== 'resultadoMedica' &&
                     selectedOption !== 'resultadoFitTest' && (
                        <section className="flex flex-row">
                           <div className="mt-4 w-full pb-12">
                              <Label>Fecha de inicio</Label>
                              <Datepicker
                                 onSelectedDateChanged={(e) =>
                                    selectFechaExportacion(e, 'inicio')
                                 }
                                 language="es-ES"
                                 showTodayButton={false}
                                 showClearButton={false}
                                 required
                                 className="w-5/12 absolute"
                                 name="inicio"
                                 value={
                                    fechaExportacion.inicio
                                       ? format(
                                            fechaExportacion.inicio,
                                            'dd-MM-yy'
                                         )
                                       : ''
                                 }
                              />
                           </div>
                           <div className="mt-4 w-full pb-12">
                              <Label>Fecha de expiración</Label>
                              <Datepicker
                                 onSelectedDateChanged={(e) =>
                                    selectFechaExportacion(e, 'exp')
                                 }
                                 language="es-ES"
                                 showTodayButton={false}
                                 showClearButton={false}
                                 required
                                 className="w-5/12 absolute"
                                 name="exp"
                                 value={
                                    fechaExportacion.exp
                                       ? format(
                                            fechaExportacion.exp,
                                            'dd-MM-yy'
                                         )
                                       : ''
                                 }
                              />
                           </div>
                        </section>
                     )}
               </Modal.Body>
               <Modal.Footer className="flex justify-end">
                  <Button disabled={loading} type="submit" size={'sm'}>
                     {loading ? <Spinner /> : 'Enviar'}
                  </Button>
                  <Button
                     size={'sm'}
                     onClick={() =>
                        router.push('/dashboard/personal?estatus=' + estatus)
                     }
                  >
                     Cancelar
                  </Button>
               </Modal.Footer>
            </form>
         </Modal>
      </>
   );
}

export default UpCertificado;
