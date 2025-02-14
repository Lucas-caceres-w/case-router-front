// @ts-nocheck
'use client';
import { User } from '@/utils/types';
import { format } from 'date-fns';
import { Dropdown, Pagination, Table, TextInput } from 'flowbite-react';
import { Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import AddUser from '../addUser';
import { useAuth } from '@/components/context/SessionProvider';

function TableUserComp({ initialCols }: { initialCols: User[] | [] }) {
   const router = useRouter();
   const [cols, setCols] = useState(initialCols);
   const [filteredCasos, setFilteredCasos] = useState<User[] | []>(cols);
   const [currentPage, setCurrentPage] = useState(1);
   const { user } = useAuth();
   console.log(cols);
   const itemsPerPage = 5; // Número de elementos por página

   // Función para manejar el cambio de página
   const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);

      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredCasos(initialCols.slice(startIndex, endIndex));
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.toLowerCase();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const filtered = initialCols
         .filter((e) => e.rol !== 4) // Excluir `DEV`
         .filter(
            (e) =>
               e.id.toString().toLowerCase().includes(value) ||
               e.username.toLowerCase().includes(value) ||
               e.email.toLowerCase().includes(value) ||
               format(e.createdAt, 'yyyy-MM-dd')
                  .toLowerCase()
                  .includes(value) ||
               e.name.toLowerCase().includes(value) ||
               e.rol.toString().toLowerCase().includes(value)
         );

      setFilteredCasos(
         value.trim() === ''
            ? filtered.slice(startIndex, endIndex)
            : filtered.slice(0, 5)
      );
      setCurrentPage(1);
   };

   useEffect(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const filteredData = initialCols.filter((e) => e.rol !== 4);
      setFilteredCasos(filteredData.slice(startIndex, endIndex));
   }, [currentPage, initialCols, itemsPerPage]);

   const getValue = (valor: number) => {
      switch (valor) {
         case 1:
            return (
               <span className="bg-green-500 rounded-md border border-green-400 p-2 text-slate-200 font-semibold">
                  SUPERADMIN
               </span>
            );
         case 2:
            return (
               <span className="bg-blue-500 rounded-md border border-blue-400 p-2 text-slate-200 font-semibold">
                  ADMIN
               </span>
            );
         case 3:
            return (
               <span className="bg-slate-500 rounded-md border border-slate-400 p-2 text-slate-200 font-semibold">
                  USER
               </span>
            );
         case 4:
            return (
               <span className="bg-sky-600 rounded-md border border-sky-400 p-2 text-slate-200 font-semibold">
                  DEV
               </span>
            );
      }
   };

   return (
      <>
         <div className="my-4 min-h-[450px] overflow-x-auto">
            <div className="flex flex-row items-center gap-4">
               <TextInput
                  className="my-2 w-48"
                  onChange={handleChange}
                  type="search"
                  placeholder="Buscar..."
               />
               {(user?.rol === 1 || user?.rol === 4) && (
                  <AddUser cols={setCols} />
               )}
            </div>
            <Table>
               <Table.Head className="sticky top-0">
                  <Table.HeadCell>ID</Table.HeadCell>
                  <Table.HeadCell>Nombre</Table.HeadCell>
                  <Table.HeadCell>email</Table.HeadCell>
                  <Table.HeadCell>Usuario</Table.HeadCell>
                  <Table.HeadCell>Rol</Table.HeadCell>
                  <Table.HeadCell>Fecha creacion</Table.HeadCell>
                  <Table.HeadCell>Acciones</Table.HeadCell>
               </Table.Head>
               <Table.Body>
                  {filteredCasos.map((e: User) => (
                     <Table.Row
                        key={e.id}
                        className="dark:bg-slate-800 bg-slate-100"
                     >
                        <Table.Cell>{e?.id}</Table.Cell>
                        <Table.Cell>{e?.name}</Table.Cell>
                        <Table.Cell>{e?.email}</Table.Cell>
                        <Table.Cell>{e?.username}</Table.Cell>
                        <Table.Cell>{getValue(e?.rol)}</Table.Cell>
                        <Table.Cell>
                           {format(e?.createdAt, 'dd/MM/yyyy')}
                        </Table.Cell>
                        <Table.Cell className="z-30">
                           {(user?.rol === 1 || user?.rol === 4) && (
                              <Dropdown className="z-30" label="Acciones">
                                 <Dropdown.Item
                                    onClick={() =>
                                       router.push(
                                          '/dashboard/usuarios?user_edit=' +
                                             e?.id
                                       )
                                    }
                                    className="flex justify-between gap-2"
                                 >
                                    Editar
                                    <Edit className="w-4" />
                                 </Dropdown.Item>
                                 {e.rol !== 1 && (
                                    <Dropdown.Item
                                       onClick={() =>
                                          router.push(
                                             '/dashboard/usuarios?delete=' +
                                                e?.id
                                          )
                                       }
                                       className="flex justify-between gap-2"
                                    >
                                       Eliminar <Trash className="w-4" />
                                    </Dropdown.Item>
                                 )}
                              </Dropdown>
                           )}
                        </Table.Cell>
                     </Table.Row>
                  ))}
               </Table.Body>
            </Table>
         </div>
         <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(initialCols?.length / itemsPerPage)}
            onPageChange={handlePageChange}
         />
      </>
   );
}

export default TableUserComp;
