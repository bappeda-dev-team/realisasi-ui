import React from "react";
import { SasaranPemda, TargetRealisasiCapaianSasaran } from "@/types";
import RowSasaranComponent from "./RowSasaranComponent";

interface TableSasaranProps {
  tahun: number;
  bulanLabel?: string;
  sasaranPemda: SasaranPemda[];
  targetRealisasiCapaian: TargetRealisasiCapaianSasaran[];
  handleOpenPrintPreview: () => void;
  handleOpenModal: (
    sasaran: SasaranPemda,
    dataTargetRealisasi: TargetRealisasiCapaianSasaran[],
  ) => void;
}

function TableSasaran({
  tahun,
  bulanLabel,
  sasaranPemda,
  targetRealisasiCapaian,
  handleOpenPrintPreview,
  handleOpenModal,
}: TableSasaranProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-white bg-red-400">
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center"
          >
            No
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center"
          >
            Sasaran
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center"
          >
            Indikator
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center"
          >
            Rumus Perhitungan
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center"
          >
            Sumber Data
          </th>
          <th
            key={tahun}
            colSpan={5}
            className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center"
          >
            {tahun} - {bulanLabel}
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[120px] text-center"
          >
            Aksi
          </th>
        </tr>
        <tr className="text-white bg-red-500">
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            Target
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            Realisasi
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            Satuan
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            Capaian
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center">
            Keterangan Capaian
          </th>
        </tr>
      </thead>
      <tbody>
        {sasaranPemda.map((sas, index) => (
          <RowSasaranComponent
            key={sas.id_sasaran_pemda}
            no={index + 1}
            sasaran={sas}
            dataTargetRealisasi={targetRealisasiCapaian}
            tahun={tahun}
            handleOpenPrintPreview={handleOpenPrintPreview}
            handleOpenModal={handleOpenModal}
          />
        ))}
      </tbody>
    </table>
  );
}

export default TableSasaran;
