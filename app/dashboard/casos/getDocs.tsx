'use client';
import { DeleteDoc, getDocsById } from '@/utils/api/casos';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function DocsModal({ refreshProyectos }: { refreshProyectos: () => void }) {
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
      getDocs();
   }, [idCaso]);

   if (!idCaso) {
      return;
   }

   const getDocs = async () => {
      const res = await getDocsById(idCaso);
      if (res) {
         const fotos = res;
         setDocs(fotos);
      }
   };

   const deleteDoc = async (id: number, key: string, file: string) => {
      const res = await DeleteDoc(id, key, file);
      if (res === 'Documento eliminado') {
         callToast('success', 'Documento eliminado correctamente');
         setTimeout(() => {
            getDocs();
            refreshProyectos();
         }, 2000);
      } else {
         callToast('failure', 'Ocurrio un error');
      }
   };

   function getDocumentDescription(identifier: string): string {
      switch (identifier) {
         case 'planAsbesto':
            return 'Plan de Asbesto';
         case 'planPlomo':
            return 'Plan de Plomo';
         case 'estudioAsbesto':
            return 'Estudio de Asbesto';
         case 'estudioEnmendado':
            return 'Estudio Enmendado';
         case 'estudioPlomo':
            return 'Estudio de Plomo';
         case 'estudioPlomoEnmendado':
            return 'Estudio de Plomo Enmendado';
         case 'permisoAsbesto':
            return 'Permiso de Asbesto';
         case 'permisoPlomo':
            return 'Permiso de Plomo';
         case 'cambioOrden':
            return 'Cambio de Orden';
         case 'planosProyectos':
            return 'Planos de Proyectos';
         case 'planosProyectosDemolicion':
            return 'Planos de Proyectos de Demolición';
         case 'planosCambioOrden':
            return 'Planos de Cambio de Orden';
         case 'documentosCambioOrden':
            return 'Documentos de Cambio de Orden';
         case 'otros':
            return 'Otros Documentos';
         default:
            return 'Documento Desconocido';
      }
   }

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
                                <b className="text-black dark:text-white">
                                   {getDocumentDescription(key)}
                                </b>
                                <div className="flex flex-col gap-2 flex-wrap">
                                   {Array.isArray(value) &&
                                      value.map((file, index) => (
                                         <div
                                            key={index}
                                            className="w-48 overflow-hidden flex flex-row items-center gap-2"
                                         >
                                            <a
                                               key={index}
                                               className="w-48 text-blue-500 py-2 rounded-md truncate"
                                               href={staticsPdf + file}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                            >
                                               {file}
                                            </a>
                                            <span
                                               onClick={() =>
                                                  deleteDoc(docs.id, key, file)
                                               }
                                               className="bg-red-500 cursor-pointer hover:bg-red-400 px-2 py-0 text-white top-0 right-0 w-min"
                                            >
                                               X
                                            </span>
                                         </div>
                                      ))}
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
