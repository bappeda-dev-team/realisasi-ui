import React from "react";
import RowTujuanComponent from "./RowTujuanComponent";
import { TujuanOpdRealisasiGrouped, JenisRealisasiValue } from "@/types";

interface TableTujuanProps {
  tahun: string;
  kodeOpd: string;
  bulanLabel?: string;
  tujuanOpd: TujuanOpdRealisasiGrouped[];
  handleOpenPrintPreview: () => void;
  onOpenRealisasi?: (targetInfo: {
    kodeTujuanOpd: string;
    kodeIndikator: string;
    kodeTarget: string;
    tujuanOpd: string;
    indikator: string;
    target: string;
    realisasi: number | null;
    satuan: string;
    rumusPerhitungan: string;
    sumberData: string;
    buktiPendukung?: string | null;
    keteranganBuktiPendukung?: string | null;
    jenisRealisasi?: JenisRealisasiValue;
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
              <span>Tujuan</span>
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
            colSpan={4}
            className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center"
          >
            {tahun} - {bulanLabel}
          </th>
          <th
            rowSpan={2}
            className="border-r border-b py-4 px-6 border-gray-300 min-w-[250px] text-center"
          >
            Faktor Penunjang
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
              <span>Target (%)</span>
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
