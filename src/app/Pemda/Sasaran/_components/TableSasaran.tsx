import React from "react";
import { SasaranPemdaRealisasiGrouped, TargetRealisasiCapaianSasaran } from "@/types";
import RowSasaranComponent from "./RowSasaranComponent";

interface TableSasaranProps {
  tahun: number;
  bulanLabel?: string;
  sasaranPemda: SasaranPemdaRealisasiGrouped[];
  canEdit: boolean;
  handleOpenPrintPreview: () => void;
  handleOpenModal: (dataTargetRealisasi: TargetRealisasiCapaianSasaran[]) => void;
  bulanKey?: string;
  onFaktorSuccess?: () => void;
}

function TableSasaran({
  tahun,
  bulanLabel,
  sasaranPemda,
  canEdit,
  handleOpenPrintPreview,
  handleOpenModal,
  bulanKey,
  onFaktorSuccess,
}: TableSasaranProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-white bg-red-400">
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>No</span>
              <span>(1)</span>
            </div>
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Sasaran</span>
              <span>(2)</span>
            </div>
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Indikator</span>
              <span>(3)</span>
            </div>
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[250px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Rumus Perhitungan</span>
              <span>(4)</span>
            </div>
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[250px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Sumber Data</span>
              <span>(5)</span>
            </div>
          </th>
          <th
            key={tahun}
            colSpan={4}
            className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center"
          >
            Realisasi - Sasaran
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[250px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Faktor Penunjang</span>
              <span>(10)</span>
            </div>
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[250px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Faktor Penghambat</span>
              <span>(11)</span>
            </div>
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[120px] text-center"
          >
            <div className="flex flex-col items-center">
              <span>Aksi</span>
              <span>(12)</span>
            </div>
          </th>
        </tr>
        <tr className="text-white bg-red-500">
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            <div className="flex flex-col items-center">
              <span>Target</span>
              <span>(6)</span>
            </div>
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            <div className="flex flex-col items-center">
              <span>Realisasi (%)</span>
              <span>(7)</span>
            </div>
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            <div className="flex flex-col items-center">
              <span>Capaian (%)</span>
              <span>(8)</span>
              <span>(7/6*100)</span>
            </div>
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center">
            <div className="flex flex-col items-center">
              <span>Keterangan Capaian</span>
              <span>(9)</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {sasaranPemda.map((sas, index) => (
          <RowSasaranComponent
            key={sas.sasaranId}
            no={index + 1}
            sasaran={sas}
            tahun={tahun}
            canEdit={canEdit}
            handleOpenPrintPreview={handleOpenPrintPreview}
            handleOpenModal={handleOpenModal}
            bulanKey={bulanKey}
            onFaktorSuccess={onFaktorSuccess}
          />
        ))}
      </tbody>
    </table>
  );
}

export default TableSasaran;
