'use client'

import React from "react";
import SasaranOpdTable from "./_components/_tables/SasaranOpdTable";
import ProgramTable from "./_components/_tables/ProgramTable";
import KegiatanTable from "./_components/_tables/KegiatanTable";
import SubKegiatanIndividuTable from "./_components/_tables/SubKegiatanTable";


// tampilkan semua role sementara, karena di kepegawaian belum tersambung role-nya
const Table = () => {
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
};

export default Table;
