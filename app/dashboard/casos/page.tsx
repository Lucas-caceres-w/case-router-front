'use client'
import TableComp from './table/table-casos';
import Tittle from '@/components/title';
import { getCasos } from '@/utils/api/casos';
import AddCaso from './addCaso';
import UploadModal from './uploadFile';
import EditCaso from './editCaso';
import React, { useEffect, useState } from 'react';
import DeleteCaso from './deleteCaso';
import RegionEdit from './editRegion';
import ChangeStatus from './changeStatus';
import CommentsModal from './comments';
import UploadImages from './uploadImages';
import ImagesModal from './getFotos';
import DatesModal from './datesCaso';
import DocsModal from './getDocs';
import MaterialDesperdiciado from './materialDesperdiciado';
import { Caso } from '@/utils/types';

function CasosPage() {
   const [proyectos, setProyectos] = useState<Caso[]>();

   const fetchProyectos = async () => {
      const data = await getCasos();
      setProyectos(data);
   };
   
   useEffect(() => {
      fetchProyectos()
   }, []);

   return (
      <main className="ml-24 lg:ml-56 mt-10 !w-[calc(100% - 200px)]">
         <div className="flex justify-between items-center">
            <Tittle>Proyectos</Tittle>
            <UploadModal />
            <EditCaso refreshProyectos={fetchProyectos} />
            <AddCaso refreshProyectos={fetchProyectos} />
            <DeleteCaso />
            <RegionEdit />
            <ChangeStatus />
            <CommentsModal />
            <DatesModal />
            <UploadImages />
            <ImagesModal />
            <DocsModal refreshProyectos={fetchProyectos} />
            <MaterialDesperdiciado />
         </div>
         <React.Suspense fallback="Cargando...">
            <TableComp initialCols={proyectos || []} />
         </React.Suspense>
      </main>
   );
}

export default CasosPage;
