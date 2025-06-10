'use client'

import { ButtonRed } from "@/components/Global/Button/button";
import { Modal, TujuanPemda } from '@/types';
import FormRealisasiTujuanPemda from '../FormRealisasiTujuanPemda';

export const ModalTujuanPemda: React.FC<Modal<TujuanPemda>> = ({ isOpen, onClose, item }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
        <div className="w-max-[500px] py-2 my-2 border-b">
          <h1 className="text-xl uppercase">Realisasi Tujuan - {item?.tujuan_pemda}</h1>
        </div>
        <FormRealisasiTujuanPemda requestValues={item} onClose={onClose} />
        <ButtonRed className="w-full mt-5" type="button" onClick={onClose}>
          Batal
        </ButtonRed>
      </div>
    </div>
  )
}
