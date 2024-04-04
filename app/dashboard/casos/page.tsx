import TableComp from "./table/table-casos";
import Tittle from "@/components/title";
import { getCasos } from "@/utils/api/casos";
import AddCaso from "./addCaso";
import UploadModal from "./uploadFile";
import EditCaso from "./editCaso";
import React from "react";
import DeleteCaso from "./deleteCaso";
import RegionEdit from "./editRegion";
import ChangeStatus from "./changeStatus";
import CommentsModal from "./comments";
import UploadImages from "./uploadImages";
import ImagesModal from "./getFotos";

async function CasosPage() {
  const data = await getCasos();
  
  return (
    <div className="ml-24 lg:ml-72 mt-10 !w-[calc(100% - 60px)]">
      <div className="flex justify-between items-center">
        <Tittle>Casos</Tittle>
        <UploadModal />
        <EditCaso />
        <AddCaso />
        <DeleteCaso />
        <RegionEdit />
        <ChangeStatus />
        <CommentsModal />
        <UploadImages />
        <ImagesModal />
      </div>
      <React.Suspense fallback="Cargando...">
        <TableComp initialCols={data || []} />
      </React.Suspense>
    </div>
  );
}

export default CasosPage;
