'use client';
import { getOne, updateCaso } from '@/utils/api/casos';
import { CreateCaso } from '@/utils/types';
import { format } from 'date-fns';
import {
   Alert,
   Button,
   Datepicker,
   Label,
   Modal,
   Select,
   Spinner,
   TextInput,
} from 'flowbite-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

function EditCaso() {
   const params = useSearchParams();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const initialEdit = {
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
      cantidadDesperdiciada: '',
      cantidadEstimada: '',
      fechaInicio: '',
      fechaFin: '',
   };
   const [edit, setEdit] = useState<any>(initialEdit);
   const idCaso = params.get('edit');
   const [color, setColor] = useState('');
   const [text, setText] = useState('');
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
      if (!idCaso) {
         return;
      }
      getCaso();
   }, [idCaso]);

   if (!idCaso) {
      return;
   }

   const getCaso = async () => {
      const res: CreateCaso = await getOne(idCaso);
      const {
         gerenteProyecto,
         superintendenteProyecto,
         supervisorProyecto,
         nombreCliente,
         nombreProyecto,
         numeroProyecto,
         direccionProyecto,
         cantidadEstimada,
         latitud,
         longitud,
         pueblo,
         descripcionProyecto,
         materialARemover,
         fechaInicio,
         fechaFin,
      } = res;
      const data = {
         gerenteProyecto,
         superintendenteProyecto,
         supervisorProyecto,
         nombreCliente,
         nombreProyecto,
         numeroProyecto,
         direccionProyecto,
         cantidadEstimada,
         latitud,
         longitud,
         pueblo,
         descripcionProyecto,
         materialARemover,
         fechaInicio,
         fechaFin,
      };
      if (res) {
         setEdit(data);
      }
   };

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEdit((prev: any) => ({
         ...prev,
         [event.target.name]: event.target.value,
      }));
   };

   const selectFechaFormData = (e: Date, name: string) => {
      setEdit((prev: any) => ({
         ...prev,
         [name]: new Date(e),
      }));
   };

   const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await updateCaso(idCaso, edit);
         //console.log(res);
         if (res === 'Caso actualizado') {
            callToast('success', 'Caso actualizado');
            setTimeout(() => {
               router.push('/dashboard/casos');
               router.refresh();
            }, 1000);
         } else {
            callToast('failure', 'Error al actualizar el caso');
         }
      } catch (err) {
         console.log(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         {showToast && <ToastAttr color={color} text={text} />}
         <Modal
            show={idCaso ? true : false}
            onClose={() => {
               router.push('/dashboard/casos');
               setEdit(initialEdit);
            }}
         >
            <Modal.Header>Editar caso</Modal.Header>
            <form onSubmit={OnSubmit}>
               <Modal.Body className="grid grid-cols-2 gap-2 h-max">
                  {inputs?.map((e: any, idx: number) => {
                     return (
                        <div className="flex flex-col gap-2" key={idx}>
                           {e.type === 'text' && (
                              <>
                                 <Label>{e.label}</Label>
                                 <TextInput
                                    onChange={handleChange}
                                    value={edit[e.name]}
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
                                    value={edit[e.name]}
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
                                       edit[e.name]
                                          ? format(edit[e.name], 'dd-MM-yy')
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
                  <Button type="submit" disabled={loading}>
                     {loading ? <Spinner /> : 'Actualizar'}
                  </Button>
                  <Button
                     onClick={() => {
                        router.push('/dashboard/casos');
                        setEdit(initialEdit);
                     }}
                  >
                     Cancelar
                  </Button>
               </Modal.Footer>
            </form>
         </Modal>
      </>
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
      options: ['Asbesto', 'Plomo'],
   },
   { name: 'numeroProyecto', type: 'text', label: 'Nº proyecto' },
   { name: 'direccionProyecto', type: 'text', label: 'Dirección de proyecto' },
   { name: 'latitud', type: 'text', label: 'Latitud' },
   { name: 'longitud', type: 'text', label: 'Longitud' },
   { name: 'pueblo', type: 'text', label: 'Pueblo' },
   { name: 'fechaInicio', type: 'date', label: 'Fecha de inicio' },
   { name: 'fechaFin', type: 'date', label: 'Fecha de fin' },
];

export default EditCaso;
