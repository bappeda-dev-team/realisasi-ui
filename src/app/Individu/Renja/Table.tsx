'use client'

import React from "react";
import { useUserContext } from "@/context/UserContext";
import { ROLES } from "@/constants/roles";
import SasaranOpdTable from "./_components/_tables/SasaranOpdTable";
import ProgramTable from "./_components/_tables/ProgramTable";
import KegiatanTable from "./_components/_tables/KegiatanTable";
import SubKegiatanIndividuTable from "./_components/_tables/SubKegiatanTable";

const Table = () => {
  const { user } = useUserContext();
  const isLevel2 = user?.roles.includes(ROLES.LEVEL_2);
  const isLevel3 = user?.roles.includes(ROLES.LEVEL_3);

  return (
    <>
      {!isLevel3 && (
        <>
          <SasaranOpdTable />
          <div className="mt-6">
            <ProgramTable />
          </div>
        </>
      )}
      {!isLevel2 && (
        <>
          <div className="mt-6">
            <KegiatanTable />
          </div>
          <div className="mt-6">
            <SubKegiatanIndividuTable />
          </div>
        </>
      )}
    </>
  );
};

export default Table;
