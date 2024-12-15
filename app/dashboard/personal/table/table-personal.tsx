'use client';
import { useAuth } from '@/components/context/SessionProvider';
import { staticsCerts } from '@/utils/routes';
import { Personal } from '@/utils/types';
import { format } from 'date-fns';
import { Dropdown, Pagination, Table, TextInput } from 'flowbite-react';
import { Briefcase, Edit, Edit2, Paperclip, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TablePersonal({
   initialPersonal,
   estatus,
}: {
   initialPersonal: Personal[];
   estatus: string | null;
}) {
   const router = useRouter();
   const [cols, setCols] = useState(initialPersonal);
   const [filteredPersonal, setFilteredPersonal] = useState<Personal[]>(cols);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;
   const { user } = useAuth();

   const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredPersonal(initialPersonal.slice(startIndex, endIndex));
   };

   const tableHead = [
      { name: 'Nombre', accessor: 'name', date: false },
      { name: 'Inicial', accessor: 'secondName', date: false },
      { name: 'Apellido Materno', accessor: 'apellidoMaterno', date: false },
      { name: 'Apellido Paterno', accessor: 'apellidoPaterno', date: false },
      { name: 'Numero de contacto', accessor: 'numContacto', date: false },
      {
         name: 'Certificacion de Asbesto',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'asbesto'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Fecha de inicio de cerficiacion de asbesto',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'asbesto'
            );
            return cert && cert.fechaInicio
               ? format(new Date(cert.fechaInicio), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Fecha de caducidad de cerficiacion de asbesto',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'asbesto'
            );
            return cert && cert.fechaExpiracion
               ? format(new Date(cert.fechaExpiracion), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Certificacion de Plomo',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'plomo'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Fecha de inicio de cerficiacion de plomo',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'plomo'
            );
            return cert && cert.fechaInicio
               ? format(new Date(cert.fechaInicio), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Fecha de caducidad de cerficiacion de plomo',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'plomo'
            );
            return cert && cert.fechaExpiracion
               ? format(new Date(cert.fechaExpiracion), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Certificacion',
         accessor: (e: Personal) => {
            const certifications = e?.certificacions?.reduce(
               (acc: Set<string>, cert: any) => {
                  if (
                     cert.tipoDocumento === 'plomo' ||
                     cert.tipoDocumento === 'asbesto/plomo' ||
                     cert.tipoDocumento === 'asbesto'
                  ) {
                     acc.add(cert.tipoDocumento);
                  }
                  return acc;
               },
               new Set()
            );

            if (certifications.size === 0) return 'NO';
            return Array.from(certifications).join('/');
         },
         date: false,
      },
      {
         name: 'Evaluacion Medica',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento.toLowerCase() === 'medica'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Fecha de inicio de Examen medico',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento.toLowerCase() === 'medica'
            );
            return cert && cert.fechaInicio
               ? format(new Date(cert.fechaInicio), 'dd/MM/yyyy')
               : '---';
         },
         date: false,
      },
      {
         name: 'Fecha de caducidad de Examen medico',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento.toLowerCase() === 'medica'
            );
            return cert && cert.fechaExpiracion
               ? format(new Date(cert.fechaExpiracion), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Prueba de Fit Test',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento.toLowerCase() === 'fittest'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Fecha de inicio de Fit Test',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento.toLowerCase() === 'fittest'
            );
            return cert && cert.fechaInicio
               ? format(new Date(cert.fechaInicio), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Fecha de caducidad de Fit Test',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento.toLowerCase() === 'fittest'
            );
            return cert && cert.fechaExpiracion
               ? format(new Date(cert.fechaExpiracion), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Resultados de Evaluacion Medica',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) =>
                  cert.tipoDocumento.toLowerCase() === 'resultadomedica'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Resultados de Fit Test',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert) => cert.tipoDocumento.toLowerCase() === 'resultadofittest'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Licencia de conducir',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert) => cert.tipoDocumento === 'licencia'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  tipo {cert.tipoEvaluacion}
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      {
         name: 'Fecha de inicio de licencia de conducir',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'licencia'
            );
            return cert && cert.fechaInicio
               ? format(new Date(cert.fechaInicio), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Fecha de caducidad de licencia de conducir',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert: any) => cert.tipoDocumento === 'licencia'
            );
            return cert && cert.fechaExpiracion
               ? format(new Date(cert.fechaExpiracion), 'dd/MM/yyyy')
               : '---';
         },
         date: true,
      },
      {
         name: 'Otros Documentos',
         accessor: (e: Personal) => {
            const cert = e?.certificacions?.find(
               (cert) => cert.tipoDocumento === 'otros'
            );
            return cert ? (
               <span
                  onClick={() =>
                     router.push(
                        `/dashboard/personal?estatus=${estatus}&certificacion=${e.id}`
                     )
                  }
                  className="text-white px-2 py-1 bg-green-600 rounded-md cursor-pointer"
               >
                  SI
               </span>
            ) : (
               <span className="text-white px-1 py-1 bg-red-600 rounded-md">
                  NO
               </span>
            );
         },
         date: false,
      },
      { name: 'Observaciones', accessor: 'observaciones', date: false },
      { name: 'Acciones', accessor: 'actions', date: false },
   ];

   useEffect(() => {
      setCurrentPage(1);
      setFilteredPersonal(initialPersonal.slice(0, itemsPerPage));
   }, [initialPersonal]);

   return (
      <>
         <div className="my-4 min-h-[550px] overflow-x-auto">
            <div className="flex flex-row items-center gap-4">
               <TextInput
                  className="my-2 w-48"
                  //onChange={handleChange}
                  type="search"
                  placeholder="Buscar..."
               />
            </div>
            <Table>
               <Table.Head className="sticky top-0">
                  {tableHead.map((th, idx) => (
                     <Table.HeadCell key={idx}>{th.name}</Table.HeadCell>
                  ))}
               </Table.Head>
               <Table.Body>
                  {filteredPersonal
                     ? filteredPersonal?.map((e: any) => {
                          return (
                             <Table.Row
                                key={e.id}
                                className="dark:bg-slate-800 bg-slate-100"
                             >
                                {tableHead
                                   .filter((th) => th.accessor !== 'actions')
                                   .map((th, idx) => {
                                      const data =
                                         typeof th.accessor === 'function'
                                            ? th.accessor(e)
                                            : e[th.accessor];
                                      return (
                                         <Table.Cell key={idx}>
                                            {th.date &&
                                            !isNaN(new Date(data).getTime())
                                               ? data
                                               : data}
                                         </Table.Cell>
                                      );
                                   })}
                                <Table.Cell className="z-30">
                                   <Dropdown className="z-30" label="Acciones">
                                      {(user?.rol === 1 || user?.rol === 4) &&
                                      e.rol !== 4 &&
                                      e.rol !== 1 ? null : (
                                         <Dropdown.Item
                                            onClick={() =>
                                               router.push(
                                                  `/dashboard/personal?estatus=${estatus}&personal_edit=${e.id}`
                                               )
                                            }
                                            className="flex justify-between gap-2"
                                         >
                                            Editar
                                            <Edit className="w-4" />
                                         </Dropdown.Item>
                                      )}
                                      <Dropdown.Item
                                         onClick={() =>
                                            router.push(
                                               `/dashboard/personal?estatus=${estatus}&coments=${e.id}`
                                            )
                                         }
                                         className="flex justify-between gap-2"
                                      >
                                         Observaciones
                                         <Edit2 className="w-4" />
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                         onClick={() =>
                                            router.push(
                                               `/dashboard/personal?estatus=${estatus}&trabaja=${e.id}`
                                            )
                                         }
                                         className="flex justify-between gap-2"
                                      >
                                         Trabaja en la empresa
                                         <Briefcase className="w-4" />
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                         onClick={() =>
                                            router.push(
                                               `/dashboard/personal?estatus=${estatus}&certificado=${e.id}`
                                            )
                                         }
                                         className="flex justify-between gap-2"
                                      >
                                         Subir certificación
                                         <Paperclip className="w-4" />
                                      </Dropdown.Item>
                                      {(user?.rol === 1 || user?.rol === 4) &&
                                      e.rol !== 4 &&
                                      e.rol !== 1 ? null : (
                                         <Dropdown.Item
                                            onClick={() =>
                                               router.push(
                                                  `/dashboard/personal?estatus=${estatus}&delete=${e.id}`
                                               )
                                            }
                                            className="flex justify-between gap-2"
                                         >
                                            Eliminar <Trash className="w-4" />
                                         </Dropdown.Item>
                                      )}
                                   </Dropdown>
                                </Table.Cell>
                             </Table.Row>
                          );
                       })
                     : null}
               </Table.Body>
            </Table>
         </div>
         <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(initialPersonal?.length / itemsPerPage)}
            onPageChange={handlePageChange}
         />
      </>
   );
}

export default TablePersonal;
