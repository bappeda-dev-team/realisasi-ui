'use client'

import React from "react";
import { useUserContext } from "@/context/UserContext";
import { useFilterContext } from "@/context/FilterContext";
import { ROLES } from "@/constants/roles";
import SasaranOpdTable from "./_components/_tables/SasaranOpdTable";
import ProgramTable from "./_components/_tables/ProgramTable";
import KegiatanTable from "./_components/_tables/KegiatanTable";
import SubKegiatanIndividuTable from "./_components/_tables/SubKegiatanTable";

const Table = () => {
  const { user } = useUserContext();
  const { activatedLevelRole } = useFilterContext();
  const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD);

  const userLevel = user?.roles.find(r => r.startsWith('level_'));
  const effectiveLevel = canBypassNip ? activatedLevelRole : userLevel;

  // SUPER_ADMIN / ADMIN_OPD without specific level role filter selected can see all tables
  if (canBypassNip && !activatedLevelRole) {
    return (
      <>
        <SasaranOpdTable />
        <div className="mt-6">
          <ProgramTable />
        </div>
        <div className="mt-6">
          <KegiatanTable />
        </div>
        <div className="mt-6">
          <SubKegiatanIndividuTable />
        </div>
      </>
    );
  }

  // Level 1: only Sasaran OPD
  if (effectiveLevel === ROLES.LEVEL_1) {
    return <SasaranOpdTable />;
  }

  // Level 2: only Program
  if (effectiveLevel === ROLES.LEVEL_2) {
    return <ProgramTable />;
  }

  // Level 3: only Kegiatan + SubKegiatan
  if (effectiveLevel === ROLES.LEVEL_3) {
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
