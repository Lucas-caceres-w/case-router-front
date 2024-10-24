'use client';
import { DeleteImage, getDocsById, getImagesById } from '@/utils/api/casos';
import { staticsPdf } from '@/utils/routes';
import { ShowDoc } from '@/utils/types';
import {
   Alert,
   Button,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
} from 'flowbite-react';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function DocsModal() {
   const params = useSearchParams();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [docs, setDocs] = useState<ShowDoc>();
   const idCaso = params.get('docs');
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
      getDocs();
   }, [idCaso]);

   if (!idCaso) {
      return;
   }

   const getDocs = async () => {
      const res = await getDocsById(idCaso);
      if (res) {
         console.log(res);
         const fotos = res;
         setDocs(fotos);
      }
   };

   const deleteDoc = async (id: string, path: string) => {
      const res = await DeleteImage(id, path);
      if (res === 'Documento eliminado') {
         callToast('success', 'Documento eliminado correctamente');
         setTimeout(() => {
            getDocs();
         }, 2000);
      } else {
         callToast('failure', 'Ocurrio un error');
      }
   };

   return (
      <>
         {showToast && <ToastAttr color={color} text={text} />}
         <Modal
            show={idCaso ? true : false}
            onClose={() => {
               router.push('/dashboard/casos');
               router.refresh();
            }}
         >
            <ModalHeader>Imagenes del caso</ModalHeader>
            <ModalBody>
               <div className="grid grid-cols-2 gap-6 w-full h-full">
                  {docs
                     ? Object.entries(docs).map(([key, value]) => {
                          if (
                             key === 'id' ||
                             key === 'proyectoId' ||
                             key === 'updatedAt' ||
                             key === 'createdAt'
                          ) {
                             return null;
                          }
                          return (
                             <div className="flex flex-col gap-2" key={key}>
                                <b className='text-black dark:text-white'>{key}</b>
                                <div className="flex flex-row flex-wrap ">
                                   {value && (
                                      <a
                                         className="bg-green-500 w-20 text-white px-4 py-1 rounded-md truncate"
                                         href={staticsPdf + value}
                                         target="_blank"
                                      >
                                         {value}
                                      </a>
                                   )}
                                </div>
                             </div>
                          );
                       })
                     : 'No existen documentos'}
               </div>
            </ModalBody>
            <ModalFooter className="flex justify-end">
               <Button
                  size={'sm'}
                  onClick={() => router.push('/dashboard/casos')}
               >
                  Cerrar
               </Button>
            </ModalFooter>
         </Modal>
      </>
   );
}

export default DocsModal;
