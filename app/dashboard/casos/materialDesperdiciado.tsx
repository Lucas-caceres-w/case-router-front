'use client';
import { cantidadDesperdiciada, getOne } from '@/utils/api/casos';
import { Caso } from '@/utils/types';
import {
   Alert,
   Button,
   Label,
   Modal,
   Spinner,
   TextInput,
} from 'flowbite-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

function MaterialDesperdiciado() {
   const params = useSearchParams();
   const router = useRouter();
   const [originalEstatus, setOriginalEstatus] = useState('');
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

   const idCaso = params.get('material');

   useEffect(() => {
      if (!idCaso) {
         return;
      }
      getCaso();
   }, [idCaso]);

   if (!idCaso) {
      return;
   }

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEdit(e.target.value);
   };

   const getCaso = async () => {
      const res: Caso = await getOne(idCaso);
      const { cantidadDesperdiciada } = res;
      if (res) {
         setEdit(cantidadDesperdiciada);
         setOriginalEstatus(cantidadDesperdiciada);
      }
   };

   const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await cantidadDesperdiciada(edit, idCaso);
         if (res) {
            callToast('success', 'Se cambio el estado a  ' + edit);
            setTimeout(() => {
               router.push('/dashboard/casos');
               router.refresh();
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
            show={idCaso ? true : false}
            onClose={() => router.push('/dashboard/casos')}
         >
            <Modal.Header>Cambiar estatus</Modal.Header>
            <form onSubmit={OnSubmit}>
               <Modal.Body>
                  <Label>Cantidad de material que se desperdicio</Label>
                  <TextInput
                     onChange={handleChange}
                     required
                     value={edit}
                  ></TextInput>
               </Modal.Body>
               <Modal.Footer className="flex justify-end">
                  <Button disabled={loading} type="submit">
                     {loading ? <Spinner /> : 'Enviar'}
                  </Button>
                  <Button onClick={() => router.push('/dashboard/casos')}>
                     Cancelar
                  </Button>
               </Modal.Footer>
            </form>
         </Modal>
      </>
   );
}

export default MaterialDesperdiciado;
