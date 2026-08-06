'use client'

import React from "react";
import { useUserContext } from "@/context/UserContext";
import { useFilterContext } from "@/context/FilterContext";
import { ROLES } from "@/constants/roles";
import SasaranOpdTable from "./_components/_tables/SasaranOpdTable";
import ProgramTable from "./_components/_tables/ProgramTable";
import KegiatanSubKegiatanTable from "./_components/_tables/KegiatanSubKegiatanTable";

const Table = () => {
  const { user } = useUserContext();
  const { activatedLevelRole } = useFilterContext();
  const isLevel1 = activatedLevelRole === "LEVEL_1" || user?.roles.includes(ROLES.LEVEL_1);
  const isLevel2 = activatedLevelRole === "LEVEL_2" || user?.roles.includes(ROLES.LEVEL_2);
  const isLevel3 = activatedLevelRole === "LEVEL_3" || user?.roles.includes(ROLES.LEVEL_3);

  return (
    <>
      {!isLevel3 && (
        <>
          {!isLevel2 && <SasaranOpdTable />}
          {!isLevel1 && (
            <div className="mt-6">
              <ProgramTable />
            </div>
          )}
        </>
      )}
      {!isLevel2 && !isLevel1 && (
        <div className="mt-6">
          <KegiatanSubKegiatanTable />
        </div>
      )}
    </>
  );
};

export default Table;
