import React from "react";
import RowTujuanComponent from "./RowTujuanComponent";
import { TujuanOpdRealisasiGrouped } from "@/types";

interface TableTujuanProps {
  tahun: string;
  kodeOpd: string;
  bulanLabel?: string;
  tujuanOpd: TujuanOpdRealisasiGrouped[];
  handleOpenPrintPreview: () => void;
  onOpenRealisasi?: (targetInfo: {
    kodeTujuanOpd: string;
    kodeIndikatorTujuanOpd: string;
    kodeTargetTujuanOpd: string;
    tujuanOpd: string;
    indikator: string;
    target: string;
    realisasi: number | null;
    satuan: string;
    rumusPerhitungan: string;
    sumberData: string;
  }) => void;
  bulanKey?: string;
  onFaktorSuccess?: () => void;
}

function TableTujuan({
  tahun,
  kodeOpd,
  bulanLabel,
  tujuanOpd,
  handleOpenPrintPreview,
  onOpenRealisasi,
  bulanKey,
  onFaktorSuccess,
}: TableTujuanProps) {
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
            Tujuan
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
            colSpan={6}
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
            Realisasi (%)
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">
            Capaian
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center">
            Keterangan Capaian
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center">
            Faktor Penunjang
          </th>
          <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center">
            Faktor Penghambat
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(tujuanOpd) && tujuanOpd.length > 0 ? (
          tujuanOpd.map((tuj, index) => (
            <RowTujuanComponent
              key={tuj.tujuanId}
              no={index + 1}
              tujuan={tuj}
              tahun={tahun}
              kodeOpd={kodeOpd}
              handleOpenPrintPreview={handleOpenPrintPreview}
              onOpenRealisasi={onOpenRealisasi}
              bulanKey={bulanKey}
              onFaktorSuccess={onFaktorSuccess}
            />
          ))
        ) : (
          <tr>
              <td colSpan={12} className="p-4 text-center text-gray-500">
                Tidak ada data tujuan OPD
              </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TableTujuan;
