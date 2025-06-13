import React from 'react';
import { ButtonRed } from "@/components/Global/Button/button";
import { TargetRealisasiCapaian, RealisasiTujuanResponse } from '@/types';
import FormRealisasiTujuanPemda from './FormRealisasiTujuanPemda';

interface ModalTujuanPemdaProps {
  isOpen: boolean;
  onClose: () => void;
  item: TargetRealisasiCapaian[];
  onSuccess: (updated: RealisasiTujuanResponse) => void;
}

export const ModalTujuanPemda: React.FC<ModalTujuanPemdaProps> = ({
  isOpen, onClose, item, onSuccess }) => {

  if (!isOpen) return null;
  const tujuan = item && item.length > 0 ? item[0].tujuanPemda : 'Tidak ada tujuan';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 z-10 w-4/5">
        <div className="w-max-[500px] py-2 my-2 border-b">
          <h1 className="text-xl uppercase">Realisasi Tujuan - {tujuan}</h1>
        </div>
        <FormRealisasiTujuanPemda
          requestValues={item}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <ButtonRed className="w-full mt-5" type="button" onClick={onClose}>
          Batal
        </ButtonRed>
      </div>
    </div>
  )
}
