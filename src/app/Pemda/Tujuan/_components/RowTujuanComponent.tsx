import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import ColTargetTujuanComponent from './ColTargetTujuanComponent';

interface RowTujuanComponentProps {
  no: number;
  tujuan: any;
  dataTargetRealisasi: any[];
  periode: number[];
  handleOpenModal: (tujuan: any, dataTargetRealisasi: any) => void;
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
  no,
  tujuan,
  dataTargetRealisasi,
  periode,
  handleOpenModal,
}) => {
  const indikator = tujuan.indikator?.[0];

  return (
    <tr>
      <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan_pemda}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{tujuan.misi}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{indikator?.indikator ?? '-'}</td>
      <td className="border border-red-400 px-6 py-4 text-center">
        <div className="flex flex-col gap-2">
          <ButtonGreenBorder
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              handleOpenModal(tujuan, dataTargetRealisasi);
            }} >
            Realisasi
          </ButtonGreenBorder>
        </div>
      </td>
      <td className="border border-red-400 px-6 py-4 text-center">{indikator?.rumus_perhitungan ?? '-'}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{indikator?.sumber_data ?? '-'}</td>
      {periode.map((tahun) => {

        const targetData = dataTargetRealisasi.find(r => r.indikatorId === indikator.id.toString() && r.tahun === tahun.toString());

        return targetData ? (
          <ColTargetTujuanComponent key={targetData.targetRealisasiId} target={targetData.target} satuan={targetData.satuan} realisasi={targetData.realisasi} capaian={targetData.capaian} />
        ) : (
          <React.Fragment key={`${tujuan.id}-${tahun}`}>
            <td className="border border-red-400 px-6 py-4 text-center" colSpan={4}></td>
          </React.Fragment>
        );
      })}
      <td className="border-b border-red-400 px-6 py-4 text-center">Keterangan Realisasi</td>
    </tr>
  );
}

export default RowTujuanComponent;
