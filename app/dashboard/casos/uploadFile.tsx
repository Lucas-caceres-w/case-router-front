'use client';
import { uploadFile } from '@/utils/api/casos';
import {
   Alert,
   Button,
   FileInput,
   Label,
   Modal,
   Select,
   Spinner,
   TextInput,
} from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

function UploadModal() {
   const selects = [
      { name: 'planAsbesto', label: 'Plan de trabajo de Asbesto (ABS)' },
      { name: 'planPlomo', label: 'Plan de trabajo de Plomo (LBP)' },
      { name: 'estudioAsbesto', label: 'Estudio Ambiental de Asbesto' },
      {
         name: 'estudioEnmendado',
         label: 'Estudio Ambiental de Asbesto Enmendado',
      },
      { name: 'estudioPlomo', label: 'Estudio Ambiental de Plomo' },
      {
         name: 'estudioPlomoEnmendado',
         label: 'Estudio Ambiental de Plomo Enmendado',
      },
      { name: 'permisoAsbesto', label: 'Permiso de Asbesto' },
      { name: 'permisoPlomo', label: 'Permiso de Plomo' },
      { name: 'cambioOrden', label: 'Cambios de Orden' },
      { name: 'planosProyectos', label: 'Planos de Proyectos Ambientales' },
      {
         name: 'planosProyectosDemolicion',
         label: 'Planos de Proyectos de Demolición',
      },
      { name: 'planosCambioOrden', label: 'Planos de Cambios de Orden' },
      {
         name: 'documentosCambioOrden',
         label: 'Documentos de Cambios de Orden',
      },
      {
         name: 'ClearenceAsbesto',
         label: 'Clearence de ABS PDF',
      },
      {
         name: 'ClearencePlomo',
         label: 'Clearence de LPB PDF',
      },
      { name: 'otros', label: 'Otros documentos' },
   ];
   const [file, setFile] = useState<File | any>();
   const [selectedOption, setSelectedOption] = useState(selects[0].name);
   const [days, setDays] = useState('');
   const params = useSearchParams();
   const router = useRouter();
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
      }, 2000);
   };

   const ToastAttr = ({ color, text }: { color: string; text: string }) => {
      return (
         <Alert className="absolute top-5 right-5 z-[99999]" color={color}>
            <span>{text}</span>
         </Alert>
      );
   };

   const idCaso = params.get('upload');

   const readFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files?.[0];
      setFile(fileList);
   };

   const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(e.target.value);
   };

   const handleChangeDays = (e: ChangeEvent<HTMLInputElement>) => {
      setDays(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) {
         //console.log("No hay archivo");
         return;
      }
      const allowedExtensions = ['pdf']; // Extensiones permitidas
      // Obtener la extensión del archivo
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      // Verificar si la extensión está permitida
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
         if (!idCaso) {
            return;
         }
         const res = await uploadFile(idCaso, formData);
         if (res) {
            callToast('success', 'Archivo guardado correctamente');
            setSelectedOption(selects[0].name);
            setDays('');
            setTimeout(() => {
               router.replace('/dashboard/casos');
               router.refresh();
            }, 1500);
         } else {
            callToast('warning', 'Error al guardar el documento');
         }
      } catch (err) {
         callToast('failure', 'Error del servidor');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (selectedOption !== 'cambioOrden') {
         setDays('');
      }
   }, [selectedOption, router]);

   return (
      <>
         {showToast && <ToastAttr color={color} text={text} />}
         <Modal
            show={idCaso ? true : false}
            onClose={() => router.push('/dashboard/casos')}
         >
            <Modal.Header>Subir documento</Modal.Header>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
               <Modal.Body>
                  <Label>Seleccionar tipo de documento</Label>
                  <Select onChange={handleChange}>
                     {selects.map((e, idx) => {
                        return (
                           <option value={e.name} key={idx}>
                              {e.label}
                           </option>
                        );
                     })}
                  </Select>
                  {selectedOption === 'cambioOrden' && (
                     <>
                        <Label>Dias adicionales</Label>
                        <TextInput
                           onChange={handleChangeDays}
                           type="number"
                           value={days}
                        ></TextInput>
                     </>
                  )}
                  <FileInput
                     onChange={readFile}
                     accept=".pdf"
                     className="mt-4"
                     name="file"
                     required
                  />
               </Modal.Body>
               <Modal.Footer className="flex justify-end">
                  <Button disabled={loading} type="submit" size={'sm'}>
                     {loading ? <Spinner /> : 'Enviar'}
                  </Button>
                  <Button
                     size={'sm'}
                     onClick={() => router.push('/dashboard/casos')}
                  >
                     Cancelar
                  </Button>
               </Modal.Footer>
            </form>
         </Modal>
      </>
   );
}

export default UploadModal;
