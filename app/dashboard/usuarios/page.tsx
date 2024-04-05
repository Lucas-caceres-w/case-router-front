import Tittle from "@/components/title";
import React from "react";
import TableUserComp from "./table/table-users";
import { getUsers } from "@/utils/api/users";
import { DeleteUser } from "./deleteUser";
import EditUser from "./editUser";

async function UsersPages() {
  const users = await getUsers();

  return (
    <main className="ml-24 lg:ml-52 mt-10 !w-[calc(100% - 60px)]">
      <Tittle>Usuarios</Tittle>
      <React.Suspense fallback="Cargando...">
        <DeleteUser />
        <EditUser />
        <TableUserComp initialCols={users || []} />
      </React.Suspense>
    </main>
  );
}

export default UsersPages;
