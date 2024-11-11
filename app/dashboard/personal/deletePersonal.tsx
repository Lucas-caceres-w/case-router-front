'use client';
import { deleteCaso, getOne } from '@/utils/api/casos';
import { deletePersonal, getOnePersonal } from '@/utils/api/personal';
import { Personal } from '@/utils/types';
import { Alert, Button, Modal, Spinner } from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

function DeletePersonal({ refreshPersonal }: { refreshPersonal: () => void }) {
   const params = useSearchParams();
   const router = useRouter();
   const idCaso = params.get('delete');
   const estatus = params.get('estatus');
   const [loading, setLoading] = useState(false);
   const [color, setColor] = useState('');
   const [text, setText] = useState('');
   const [showToast, setShowToast] = useState(false);
   const [casoActual, setCasoActual] = useState<string>();

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

   if (!idCaso) {
      return;
   }

   const getCasoData = async () => {
      const res: Personal = await getOnePersonal(estatus, idCaso);
      setCasoActual(res?.name + ' ' + res?.secondName);
   };

   getCasoData();

   const handleDelete = async () => {
      setLoading(true);
      try {
         const res = await deletePersonal(estatus, idCaso);
         if (res === 'personal eliminado') {
            callToast('success', 'El personal fue eliminado');
            router.push('/dashboard/personal?estatus=' + estatus);
            refreshPersonal();
         } else {
            callToast('failure', 'Error  al eliminar el personal');
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
            show={idCaso ? true : false}
            onClose={() => router.push('/dashboard/personal?estatus' + estatus)}
         >
            <Modal.Header>Eliminar personal</Modal.Header>
            <Modal.Body>
               <p className="text-slate-800 font-semibold dark:text-slate-200">
                  Estas seguro de eliminar el personal: {casoActual}
               </p>
            </Modal.Body>
            <Modal.Footer className="flex items-center justify-end">
               <Button disabled={loading} onClick={handleDelete}>
                  {loading ? <Spinner /> : 'Eliminar'}
               </Button>
               <Button
                  onClick={() =>
                     router.push('/dashboard/personal?estatus' + estatus)
                  }
               >
                  Cancelar
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
}

export default DeletePersonal;
