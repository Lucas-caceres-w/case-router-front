'use client';
import Tittle from '@/components/title';
import { getPersonal } from '@/utils/api/personal';
import { Personal } from '@/utils/types';
import React, { useEffect, useState } from 'react';
import TablePersonal from './table/table-personal';
import AddPersonal from './addPersonal';
import EditPersonal from './editPersonal';
import Observaciones from './observaciones';
import DeletePersonal from './deletePersonal';
import UpCertificado from './addCertificaciones';
import ChangeStatus from './trabaja';
import useGetAllSearchParams from '@/components/estatusC';
import CertsModal from './getCertificaciones';


function PersonalPages() {
   const estatus = useGetAllSearchParams().estatus;
   const [personal, setPersonal] = useState<Personal[]>();

   const fetchPersonal = async () => {
      if (estatus) {
         /* const res = await getPersonal(estatus);

         setPersonal(res); */
      }
   };

   useEffect(() => {
      fetchPersonal();
   }, [estatus]);

   return (
      <main className="ml-24 lg:ml-56 mt-10 !w-[calc(100% - 60px)]">
         <div className="flex justify-between items-center">
            <Tittle>
               Personal {estatus === 'active' ? 'Activo' : 'Inactivo'}
            </Tittle>
            <section className="flex flex-row gap-2">
               <AddPersonal refreshPersonal={fetchPersonal} />
               <Observaciones refreshPersonal={fetchPersonal} />
               <EditPersonal refreshPersonal={fetchPersonal} />
               <DeletePersonal refreshPersonal={fetchPersonal} />
               <UpCertificado refreshPersonal={fetchPersonal} />
               <ChangeStatus refreshPersonal={fetchPersonal} />
               <CertsModal refreshPersonal={fetchPersonal}/>
            </section>
         </div>
         <React.Suspense fallback="Cargando...">
            <TablePersonal initialPersonal={personal || []} estatus={estatus} />
         </React.Suspense>
      </main>
   );
}

export default PersonalPages;
