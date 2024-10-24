'use client';
import { addComents, getOne } from '@/utils/api/casos';
import { getOnePersonal, updatePersonal } from '@/utils/api/personal';
import { CreateCaso, Personal } from '@/utils/types';
import { Button, Modal, Spinner, Textarea } from 'flowbite-react';
import { Check, Edit } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

function Observaciones({ refreshPersonal }: { refreshPersonal: () => void }) {
   const params = useSearchParams();
   const router = useRouter();
   const [edit, setEdit] = useState('');
   const [editable, setEditable] = useState(false);
   const [loading, setLoading] = useState(false);
   const idParams = params.get('coments');
   const estatus = params.get('estatus');

   useEffect(() => {
      if (!idParams) {
         return;
      }
      getCaso();
   }, [idParams]);

   if (!idParams) {
      return;
   }

   const getCaso = async () => {
      const res: Personal & { observaciones: string } = await getOnePersonal(
         estatus,
         idParams
      );
      const { observaciones } = res;
      if (res) {
         setEdit(observaciones);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEdit(e.target.value);
   };

   const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await updatePersonal(
            { observaciones: edit },
            estatus,
            idParams
         );
         if (res === 'personal actualizado') {
            router.push('/dashboard/personal?estatus' + estatus);
            refreshPersonal();
         }
      } catch (err) {
         console.log(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <Modal
            show={idParams ? true : false}
            onClose={() =>
               router.push('/dashboard/personal?estatus=' + estatus)
            }
         >
            <Modal.Header>Añadir comentarios</Modal.Header>
            <form onSubmit={OnSubmit}>
               <Modal.Body>
                  <article className="flex flex-col items-end">
                     {!editable && (
                        <>
                           <p className="w-full text-slate-800 dark:text-slate-200 text-lg">
                              {edit}
                           </p>
                           <div className="bg-black/10 p-2 cursor-pointer hover:bg-black/20 rounded-md w-min my-2">
                              <Edit
                                 onClick={() => setEditable(true)}
                                 className="text-slate-800 dark:text-slate-200"
                              />
                           </div>
                        </>
                     )}
                  </article>
                  {editable && (
                     <div className="flex flex-col items-end gap-y-2">
                        <Textarea
                           onChange={handleChange}
                           value={edit}
                           className="resize-none min-h-32"
                           placeholder="Agregar comentarios"
                        />
                        <Button
                           className="w-min"
                           size={'xs'}
                           onClick={() => setEditable(false)}
                        >
                           <Check />
                        </Button>
                     </div>
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

export default Observaciones;
