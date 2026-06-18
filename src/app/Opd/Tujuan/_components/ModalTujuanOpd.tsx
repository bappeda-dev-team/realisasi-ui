import React from 'react';
import { ButtonRed } from "@/components/Global/Button/button";
import FormRealisasiTujuanOpd from './FormRealisasiTujuanOpd';

interface ModalTujuanOpdProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    kodeTujuanOpd: string;
    kodeIndikator: string;
    kodeTarget: string;
    tujuanOpd: string;
    target: string;
    realisasi: number | null;
    satuan: string;
  } | null;
  tahun: number;
  bulan: string;
  bulanLabel?: string;
  onSuccess: () => void;
}

export const ModalTujuanOpd: React.FC<ModalTujuanOpdProps> = ({
  isOpen, onClose, target, tahun, bulan, bulanLabel, onSuccess,
}) => {
  if (!isOpen) return null;
  const tujuanName = target?.tujuanOpd ?? 'Tidak ada tujuan';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 z-10 w-full max-w-md">
        <div className="w-max-[500px] py-2 my-2 border-b">
          <h1 className="text-xl uppercase">Realisasi Tujuan - {tujuanName}</h1>
        </div>
        <FormRealisasiTujuanOpd
          requestValues={target}
          tahun={tahun}
          bulan={bulan}
          bulanLabel={bulanLabel}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <ButtonRed className="w-full mt-5" type="button" onClick={onClose}>
          Batal
        </ButtonRed>
      </div>
    </div>
  );
};
