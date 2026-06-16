import React, { useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { SasaranPemdaRealisasiGrouped, TargetRealisasiCapaianSasaran } from "@/types";
import { formatPercentageText } from "@/lib/formatPercentageText";
import FormFaktorPenunjangSasaran from "./FormFaktorPenunjangSasaran";
import FormFaktorPenghambatSasaran from "./FormFaktorPenghambatSasaran";

interface RowSasaranComponentProps {
  no: number;
  sasaran: SasaranPemdaRealisasiGrouped;
  tahun: number;
  canEdit: boolean;
  handleOpenPrintPreview: () => void;
  handleOpenModal: (dataTargetRealisasi: TargetRealisasiCapaianSasaran[]) => void;
  bulanKey?: string;
  onFaktorSuccess?: () => void;
}

export default function RowSasaranComponent({
  no,
  sasaran,
  tahun,
  canEdit,
  handleOpenPrintPreview,
  handleOpenModal,
  bulanKey,
  onFaktorSuccess,
}: RowSasaranComponentProps) {
  const indikatorList = sasaran.indikator ?? [];
  const [faktorTarget, setFaktorTarget] = useState<{
    target: TargetRealisasiCapaianSasaran;
    indikatorId: string;
    jenis: 'penunjang' | 'penghambat';
  } | null>(null);

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
              faktorPenunjang={target.faktorPenunjang}
              faktorPenghambat={target.faktorPenghambat}
              canEdit={canEdit}
              handleClick={canEdit && index === 0 ? () => handleOpenModal(indikatorList.flatMap((row) => row.targets)) : undefined}
              onEditFaktorPenunjang={canEdit ? () => setFaktorTarget({ target, indikatorId: indikator.id, jenis: 'penunjang' }) : undefined}
              onEditFaktorPenghambat={canEdit ? () => setFaktorTarget({ target, indikatorId: indikator.id, jenis: 'penghambat' }) : undefined}
            />
          ) : (
            <td
              colSpan={6}
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

      {faktorTarget?.jenis === 'penunjang' && (
        <FormModal
          isOpen={true}
          onClose={() => setFaktorTarget(null)}
          title={`Faktor Penunjang - ${faktorTarget.target.indikator}`}
        >
          <FormFaktorPenunjangSasaran
            sasaranId={sasaran.sasaranId}
            indikatorId={faktorTarget.indikatorId}
            targetId={faktorTarget.target.targetId}
            tahun={String(tahun)}
            bulan={bulanKey ?? ''}
            currentValue={faktorTarget.target.faktorPenunjang ?? ''}
            onClose={() => setFaktorTarget(null)}
            onSuccess={() => {
              setFaktorTarget(null);
              onFaktorSuccess?.();
            }}
          />
        </FormModal>
      )}

      {faktorTarget?.jenis === 'penghambat' && (
        <FormModal
          isOpen={true}
          onClose={() => setFaktorTarget(null)}
          title={`Faktor Penghambat - ${faktorTarget.target.indikator}`}
        >
          <FormFaktorPenghambatSasaran
            sasaranId={sasaran.sasaranId}
            indikatorId={faktorTarget.indikatorId}
            targetId={faktorTarget.target.targetId}
            tahun={String(tahun)}
            bulan={bulanKey ?? ''}
            currentValue={faktorTarget.target.faktorPenghambat ?? ''}
            onClose={() => setFaktorTarget(null)}
            onSuccess={() => {
              setFaktorTarget(null);
              onFaktorSuccess?.();
            }}
          />
        </FormModal>
      )}
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
        colSpan={9}
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
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  canEdit?: boolean;
  handleClick?: () => void;
  onEditFaktorPenunjang?: () => void;
  onEditFaktorPenghambat?: () => void;
}> = ({ target, realisasi, capaian, keteranganCapaian, faktorPenunjang, faktorPenghambat, canEdit, handleClick, onEditFaktorPenunjang, onEditFaktorPenghambat }) => {
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
      <td className="border border-red-400 px-6 py-4">
        <div className="flex flex-col items-center gap-1">
          <span>{faktorPenunjang || '-'}</span>
          {canEdit && onEditFaktorPenunjang && (
            <ButtonGreenBorder className="w-full text-xs py-0.5" onClick={onEditFaktorPenunjang}>
              Faktor
            </ButtonGreenBorder>
          )}
        </div>
      </td>
      <td className="border border-red-400 px-6 py-4">
        <div className="flex flex-col items-center gap-1">
          <span>{faktorPenghambat || '-'}</span>
          {canEdit && onEditFaktorPenghambat && (
            <ButtonGreenBorder className="w-full text-xs py-0.5" onClick={onEditFaktorPenghambat}>
              Faktor
            </ButtonGreenBorder>
          )}
        </div>
      </td>
    </>
  );
};
