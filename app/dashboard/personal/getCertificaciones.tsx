'use client';
import { DeleteDoc } from '@/utils/api/casos';
import { deleteCertificacion, getCertificaciones } from '@/utils/api/personal';
import { staticsCerts } from '@/utils/routes';
import { format } from 'date-fns';
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

function CertsModal({refreshPersonal}) {
   const params = useSearchParams();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [tipoDocs, settipoDocs] = useState();
   const [docs, setDocs] = useState();
   const idPersonal = params.get('certificacion');
   const estatus = params.get('estatus');
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
      if (!idPersonal) {
         return;
      }
      getCerts();
   }, [idPersonal]);

   useEffect(() => {
      const agruparPorTipoCertificacion = (documentos) => {
         return documentos?.reduce((acc, doc) => {
            const tipo = doc.tipoDocumento;

            if (!acc[tipo]) {
               acc[tipo] = [];
            }

            acc[tipo].push(doc);
            return acc;
         }, {});
      };

      const documentosAgrupados = agruparPorTipoCertificacion(docs);
      settipoDocs(documentosAgrupados);
   }, [docs]);

   if (!idPersonal) {
      return;
   }

   const getCerts = async () => {
      const res = await getCertificaciones(idPersonal);
      if (res) {
         setDocs(res.certificacions);
      }
   };

   const deleteDoc = async (id: string) => {
      const res = await deleteCertificacion(id);
      if (res === 'Certificacion eliminada') {
         callToast('success', 'Documento eliminado correctamente');
         setTimeout(() => {
            getCerts();
            refreshPersonal()
         }, 2000);
      } else {
         callToast('failure', 'Ocurrio un error');
      }
   };

   return (
      <>
         {showToast && <ToastAttr color={color} text={text} />}
         <Modal
            show={idPersonal ? true : false}
            onClose={() => {
               router.push(`/dashboard/personal?estatus=${estatus}`);
               router.refresh();
            }}
         >
            <ModalHeader>Certificaciones</ModalHeader>
            <ModalBody>
               <div className="flex flex-col gap-6 w-full h-full">
                  {tipoDocs
                     ? Object.entries(tipoDocs).map(([tipo, file]) => (
                          <div key={tipo} className="mb-4">
                             <h2 className="text-lg font-medium text-gray-700 dark:text-white capitalize">
                                Certificado tipo: {tipo}
                             </h2>
                             <ul className="list-disc ml-6">
                                {file?.map((doc) => (
                                   <li key={doc.id} className="my-2">
                                      <div className="flex flex-row gap-2">
                                         <span className="w-48 overflow-hidden">
                                            <a
                                               href={`${staticsCerts}/${doc.fileName}`}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               className="text-blue-500 hover:underline truncate"
                                            >
                                               {doc.fileName}
                                            </a>
                                         </span>
                                         <span className="ml-4 text-slate-700 dark:text-slate-200">
                                            Fecha:{' '}
                                            {format(
                                               doc.updatedAt,
                                               'dd/MM/yyyy'
                                            )}
                                         </span>
                                         <span
                                            onClick={() => deleteDoc(doc.id)}
                                            className="text-red-500 ml-4 cursor-pointer"
                                         >
                                            X
                                         </span>
                                      </div>
                                   </li>
                                ))}
                             </ul>
                          </div>
                       ))
                     : 'No existen certificaciones'}
               </div>
            </ModalBody>
            <ModalFooter className="flex justify-end">
               <Button
                  size={'sm'}
                  onClick={() =>
                     router.push(`/dashboard/personal?estatus=${estatus}`)
                  }
               >
                  Cerrar
               </Button>
            </ModalFooter>
         </Modal>
      </>
   );
}

export default CertsModal;
