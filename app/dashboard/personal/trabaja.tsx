'use client';
import { cambiarEstatus, getOne } from '@/utils/api/casos';
import { getOnePersonal, updatePersonal } from '@/utils/api/personal';
import { options } from '@/utils/mockups/mockups';
import { Caso, Personal } from '@/utils/types';
import { Alert, Button, Modal, Select, Spinner } from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

function ChangeStatus({ refreshPersonal }: { refreshPersonal: () => void }) {
   const router = useRouter();
   const params = useSearchParams();
   const idParam = params.get('trabaja');
   const estatus = params.get('estatus');
   const [originalEstatus, setOriginalEstatus] = useState<string>('true');
   const [edit, setEdit] = useState(originalEstatus);
   const [loading, setLoading] = useState(false);
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
      if (!idParam) {
         return;
      }
      getPersonal();
   }, [idParam]);

   if (!idParam) {
      return;
   }

   const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setEdit(e.target.value);
      console.log(e.target.value);
   };

   const getPersonal = async () => {
      const res: Personal = await getOnePersonal(estatus, idParam);
      const { trabaja } = res;
      if (res) {
         if (trabaja) {
            setEdit('true');
            setOriginalEstatus('true');
         }
      }
   };

   const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await updatePersonal(
            { trabaja: edit === 'true' ? true : false },
            estatus,
            idParam
         );
         if (res) {
            callToast(
               'success',
               'Se cambio el estado a  ' + (edit === 'true' ? 'Trabaja' : 'No trabaja')
            );
            setTimeout(() => {
               router.push('/dashboard/personal?estatus=' + estatus);
               refreshPersonal();
            }, 1500);
         } else {
            callToast('warn', 'Error al cambiar el estado');
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
            <Modal.Header>Cambiar estatus</Modal.Header>
            <form onSubmit={OnSubmit}>
               <Modal.Body>
                  <Select onChange={handleChange} value={edit}>
                     <option value={'true'}>Si</option>
                     <option value={'false'}>No</option>
                  </Select>
               </Modal.Body>
               <Modal.Footer className="flex justify-end">
                  <Button disabled={loading} type="submit">
                     {loading ? <Spinner /> : 'Enviar'}
                  </Button>
                  <Button
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

export default ChangeStatus;
