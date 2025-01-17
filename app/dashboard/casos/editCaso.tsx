'use client';
import { getOne, updateCaso } from '@/utils/api/casos';
import { Pueblos } from '@/utils/mockups/areas';
import { Supervisores } from '@/utils/mockups/mockups';
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

function EditCaso({ refreshProyectos }: { refreshProyectos: () => void }) {
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
      latitud: '',
      longitud: '',
      direccionProyecto: '',
      zipCode: '',
      pueblo: '',
      descripcionProyecto: '',
      materialARemover: '',
      cantidadDesperdiciadaPlomo: '',
      cantidadEstimadaPlomoYardas: '',
      cantidadEstimadaPlomoPiesCuad: '',
      cantidadEstimadaPlomoPiesLineales: '',
      cantidadDesperdiciadaAsbesto: '',
      cantidadEstimadaAsbestoYardas: '',
      cantidadEstimadaAsbestoPiesCuad: '',
      cantidadEstimadaAsbestoPiesLineales: '',
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
      }, 2000);
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
         cantidadEstimadaAsbestoYardas,
         cantidadEstimadaAsbestoPiesCuad,
         cantidadEstimadaAsbestoPiesLineales,
         cantidadEstimadaPlomoPiesCuad,
         cantidadEstimadaPlomoPiesLineales,
         cantidadEstimadaPlomoYardas,
         cantidadDesperdiciadaAsbesto,
         cantidadDesperdiciadaPlomo,
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
         cantidadEstimadaAsbestoYardas,
         cantidadEstimadaAsbestoPiesCuad,
         cantidadEstimadaAsbestoPiesLineales,
         cantidadEstimadaPlomoPiesCuad,
         cantidadEstimadaPlomoPiesLineales,
         cantidadEstimadaPlomoYardas,
         cantidadDesperdiciadaAsbesto,
         cantidadDesperdiciadaPlomo,
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
         if (res === 'Caso actualizado') {
            callToast('success', 'Caso actualizado');
            router.replace('/dashboard/casos');
            refreshProyectos();
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
            size={'5xl'}
            show={idCaso ? true : false}
            onClose={() => {
               router.push('/dashboard/casos');
               setEdit(initialEdit);
            }}
         >
            <Modal.Header>Editar caso</Modal.Header>
            <form 
            className="body_modal"onSubmit={OnSubmit}>
               <Modal.Body className="grid grid-cols-3 gap-x-2">
                  {inputs?.map((e: any, idx: number) => {
                     const shouldRender =
                        e.type === 'text' &&
                        (!e.material ||
                           e.material === edit?.materialARemover ||
                           edit?.materialARemover?.toLowerCase() ===
                              'asbesto/plomo');
                     return (
                        <div
                           className={`flex flex-col gap-1 ${
                              shouldRender ||
                              e.type === 'select' ||
                              e.type === 'date'
                                 ? ''
                                 : 'hidden'
                           }`}
                           key={idx}
                        >
                           {shouldRender && (
                              <div key={e.name}>
                                 <Label>{e.label}</Label>
                                 <TextInput
                                    onChange={handleChange}
                                    value={edit[e.name] || ''}
                                    type={e.type}
                                    name={e.name}
                                 />
                              </div>
                           )}
                           {e.type === 'select' && (
                              <>
                                 <Label>{e.label}</Label>
                                 <Select
                                    onChange={handleChange}
                                    value={edit[e.name]}
                                    type={e.type}
                                    name={e.name}
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
                                    className="absolute w-4/12"
                                    language="es-ES"
                                    showTodayButton={false}
                                    showClearButton={false}
                                    value={
                                       edit[e.name]
                                          ? format(edit[e.name], 'dd-MM-yy')
                                          : ''
                                    }
                                    name={e.name}
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
   {
      name: 'gerenteProyecto',
      type: 'select',
      label: 'Gerente de proyecto',
      options: ['Melvin J. Torres'],
   },
   {
      name: 'superintendenteProyecto',
      type: 'text',
      label: 'Superintendente de proyecto',
   },
   {
      name: 'supervisorProyecto',
      type: 'select',
      label: 'Supervisor de Proyecto',
      options: Supervisores.map((e) => e.supervisor),
   },
   { name: 'nombreCliente', type: 'text', label: 'Nombre de cliente' },
   { name: 'nombreProyecto', type: 'text', label: 'Nombre de proyecto' },
   {
      name: 'cantidadEstimadaAsbestoYardas',
      type: 'text',
      label: 'Cantidad estimado a remover en yardas (ABS)',
      material: 'Asbesto',
   },
   {
      name: 'cantidadEstimadaAsbestoPiesCuad',
      type: 'text',
      label: 'Cantidad estimado a remover en ft2 (ABS)',
      material: 'Asbesto',
   },
   {
      name: 'cantidadEstimadaAsbestoPiesLineales',
      type: 'text',
      label: 'Cantidad estimado a remover en ft lnl (ABS)',
      material: 'Asbesto',
   },
   {
      name: 'cantidadEstimadaPlomoYardas',
      type: 'text',
      label: 'Cantidad estimado a remover en yardas(LBL)',
      material: 'Plomo',
   },
   {
      name: 'cantidadEstimadaPlomoPiesCuad',
      type: 'text',
      label: 'Cantidad estimado a remover en ft2(LBL)',
      material: 'Plomo',
   },
   {
      name: 'cantidadEstimadaPlomoPiesLineales',
      type: 'text',
      label: 'Cantidad estimado a remover en ft lnl(LBL)',
      material: 'Plomo',
   },
   {
      name: 'cantidadDesperdiciadaAsbesto',
      type: 'text',
      label: 'Cantidad desperdiciada (ABS)',
   },
   {
      name: 'cantidadDesperdiciadaPlomo',
      type: 'text',
      label: 'Cantidad desperdiciada (LBL)',
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
   { name: 'latitud', type: 'text', label: 'Latitud' },
   { name: 'longitud', type: 'text', label: 'Longitud' },
   { name: 'direccionProyecto', type: 'text', label: 'Dirección de proyecto' },
   { name: 'zipCode', type: 'text', label: 'ZIP CODE' },
   {
      name: 'pueblo',
      type: 'select',
      label: 'Pueblo',
      options: Pueblos.map((e) => e.pueblo),
   },
   { name: 'fechaInicio', type: 'date', label: 'Fecha de inicio' },
   { name: 'fechaFin', type: 'date', label: 'Fecha de fin' },
];

export default EditCaso;
