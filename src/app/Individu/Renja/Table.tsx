'use client'

import React from "react";
import { useUserContext } from "@/context/UserContext";
import { ROLES } from "@/constants/roles";
import ProgramTable from "./_components/_tables/ProgramTable";
import KegiatanTable from "./_components/_tables/KegiatanTable";
import SubKegiatanIndividuTable from "./_components/_tables/SubKegiatanTable";

const Table = () => {
  const { user } = useUserContext();
  const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD);

  const userLevel = user?.roles.find(r => r.startsWith('level_'));

  // SUPER_ADMIN / ADMIN_OPD can see all tables
  if (canBypassNip) {
    return (
      <>
        <ProgramTable />
        <div className="mt-6">
          <KegiatanTable />
        </div>
        <div className="mt-6">
          <SubKegiatanIndividuTable />
        </div>
      </>
    );
  }

  // Level 2: only Program
  if (userLevel === ROLES.LEVEL_2) {
    return <ProgramTable />;
  }

  // Level 3: only Kegiatan + SubKegiatan
  if (userLevel === ROLES.LEVEL_3) {
    return (
      <>
        <KegiatanTable />
        <div className="mt-6">
          <SubKegiatanIndividuTable />
        </div>
      </>
    );
  }

  // Fallback: show nothing for unsupported levels
  return null;
};

export default Table;
