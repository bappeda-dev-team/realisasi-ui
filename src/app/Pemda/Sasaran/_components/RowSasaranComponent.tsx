import React from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { SasaranPemdaRealisasiGrouped, TargetRealisasiCapaianSasaran } from "@/types";
import { formatPercentageText } from "@/lib/formatPercentageText";

interface RowSasaranComponentProps {
  no: number;
  sasaran: SasaranPemdaRealisasiGrouped;
  tahun: number;
  canEdit: boolean;
  handleOpenPrintPreview: () => void;
  handleOpenModal: (dataTargetRealisasi: TargetRealisasiCapaianSasaran[]) => void;
}

export default function RowSasaranComponent({
  no,
  sasaran,
  tahun,
  canEdit,
  handleOpenPrintPreview,
  handleOpenModal,
}: RowSasaranComponentProps) {
  const indikatorList = sasaran.indikator ?? [];

  if (indikatorList.length === 0) {
    return <EmptyIndikatorRow no={no} sasaran={sasaran} tahun={tahun} handleOpenPrintPreview={handleOpenPrintPreview} />;
  }

  const detailRows = indikatorList.flatMap((indikator) => {
    if (!indikator.targets.length) {
      return [{ indikator, target: null as TargetRealisasiCapaianSasaran | null }];
    }

    return indikator.targets.map((target) => ({ indikator, target }));
  });

  return (
    <>
      {detailRows.map(({ indikator, target }, index) => (
        <tr key={`${sasaran.sasaranId}-${indikator.id}-${target?.targetId ?? index}`}>
          {index === 0 && (
            <>
              <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">{no}</td>
              <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaranPemda}</td>
            </>
          )}
          <td className="border border-red-400 px-6 py-4 text-center">{indikator.indikator ?? "-"}</td>
          <td className="border border-red-400 px-6 py-4 text-center">{indikator.rumusPerhitungan || "-"}</td>
          <td className="border border-red-400 px-6 py-4 text-center">{indikator.sumberData || "-"}</td>
          {target ? (
            <ColTargetSasaran
              target={target.target}
              realisasi={target.realisasi}
              capaian={target.capaian}
              keteranganCapaian={target.keteranganCapaian}
              handleClick={canEdit && index === 0 ? () => handleOpenModal(indikatorList.flatMap((row) => row.targets)) : undefined}
            />
          ) : (
            <td
              colSpan={4}
              className="border border-red-400 px-6 py-4 text-center text-gray-400 italic"
            >
              Tidak ada target
            </td>
          )}
          {index === 0 && (
            <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">
              <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                Cetak
              </ButtonGreenBorder>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}

const EmptyIndikatorRow: React.FC<{
  sasaran: SasaranPemdaRealisasiGrouped;
  no: number;
  tahun: number;
  handleOpenPrintPreview: () => void;
}> = ({ sasaran, no, tahun, handleOpenPrintPreview }) => {
  return (
    <tr key={sasaran.sasaranId} className="bg-red-300">
      <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
      <td className="border border-red-400 px-6 py-4 text-center">
        {sasaran.sasaranPemda}
      </td>
      <td
        colSpan={7}
        className="border border-red-400 px-6 py-4 text-center text-gray-500 italic"
      >
        Tidak ada indikator dan target tahun {tahun}
      </td>
      <td className="border border-red-400 px-6 py-4 text-center">
        <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
          Cetak
        </ButtonGreenBorder>
      </td>
    </tr>
  );
};

const ColTargetSasaran: React.FC<{
  target: string;
  realisasi: number;
  capaian: string;
  keteranganCapaian: string;
  handleClick?: () => void;
}> = ({ target, realisasi, capaian, keteranganCapaian, handleClick }) => {
  return (
    <>
      <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
      <td className="border border-red-400 px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <span>{realisasi}</span>
          {handleClick && (
            <ButtonGreenBorder
              className="w-full"
              onClick={handleClick}
            >
              Realisasi
            </ButtonGreenBorder>
          )}
        </div>
      </td>
      <td className="border border-red-400 px-6 py-4 text-center">{formatPercentageText(capaian)}</td>
      <td className="border border-red-400 px-6 py-4">{formatPercentageText(keteranganCapaian || "-")}</td>
    </>
  );
};
