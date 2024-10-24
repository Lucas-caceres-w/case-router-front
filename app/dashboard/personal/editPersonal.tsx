'use client';
import {
   addPersonal,
   getOnePersonal,
   getPersonal,
   updatePersonal,
} from '@/utils/api/personal';
import { format } from 'date-fns';
import {
   Alert,
   Button,
   Datepicker,
   Label,
   Modal,
   Select,
   TextInput,
} from 'flowbite-react';
import { PlusCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

function EditPersonal({ refreshPersonal }: { refreshPersonal: () => void }) {
   const params = useSearchParams();
   const estatus = params.get('estatus');
   const paramId = params.get('personal_edit');
   const [loading, setLoading] = useState(false);
   const initialForm = {
      name: '',
      secondName: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      numContacto: '',
   };
   const [formData, setFormData] = useState<any>(initialForm);
   const [color, setColor] = useState('');
   const [text, setText] = useState('');
   const [showToast, setShowToast] = useState(false);
   const router = useRouter();

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

   const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!estatus) {
         return;
      }
      try {
         setLoading(true);
         const res = await updatePersonal(formData, estatus, paramId);
         if (res === 'personal actualizado') {
            router.replace('/dashboard/personal?estatus=' + estatus);
            refreshPersonal();
            callToast('success', 'Personal actualizado');
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
      console.log(formData);
   };

   useEffect(() => {
      if (!paramId) {
         return;
      }
      getPersonal();
   }, [paramId]);

   const getPersonal = async () => {
      const user = await getOnePersonal(estatus, paramId);
      setFormData(user);
   };

   if (!paramId) {
      return;
   }

   return (
      <div className="w-full flex justify-end gap-4 mr-10">
         <>
            {showToast && <ToastAttr color={color} text={text} />}
            <Modal
               show={paramId ? true : false}
               onClose={() =>
                  router.replace('/dashboard/personal?estatus=' + estatus)
               }
            >
               <Modal.Header>Actualizar Personal</Modal.Header>
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
                           router.replace(
                              '/dashboard/personal?estatus=' + estatus
                           );
                           setFormData(initialForm);
                        }}
                     >
                        Cancelar
                     </Button>
                  </Modal.Footer>
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
];

export default EditPersonal;
