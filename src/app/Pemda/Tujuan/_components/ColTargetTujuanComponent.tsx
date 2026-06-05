import React from 'react';
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { formatPercentageText } from "@/lib/formatPercentageText";

type TargetColProps = {
  target: string;
  realisasi: string;
  satuan: string;
  capaian: string;
  keteranganCapaian: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  canEdit: boolean;
  handleClick?: () => void;
  onEditFaktorPenunjang?: () => void;
  onEditFaktorPenghambat?: () => void;
};

const convertToDisplayString = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return value.toString().replace(/\./g, ',');
};

const ColTargetTujuanComponent: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian, keteranganCapaian, faktorPenunjang, faktorPenghambat, canEdit, handleClick, onEditFaktorPenunjang, onEditFaktorPenghambat }) => {

  return (
    <React.Fragment>
      <td className="border border-red-400 px-6 py-4 text-center">{convertToDisplayString(target)}</td>
      <td className="border border-red-400 px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <span>{convertToDisplayString(realisasi)}</span>
          {canEdit && handleClick && (
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
      <td className="border border-red-400 px-6 py-4">{formatPercentageText(keteranganCapaian || '-')}</td>
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
    </React.Fragment>
  );
}

export default ColTargetTujuanComponent;
