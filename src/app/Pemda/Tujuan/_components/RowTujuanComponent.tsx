import React from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import ColTargetTujuanComponent from "./ColTargetTujuanComponent";

interface RowTujuanComponentProps {
    no: number;
    tujuan: any;
    dataTargetRealisasi: any[];
    tahun: number;
    handleOpenModal: (tujuan: any, dataTargetRealisasi: any) => void;
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    tujuan,
    dataTargetRealisasi,
    tahun,
    handleOpenModal,
}) => {
    const indikatorList = tujuan.indikator ?? [];
    const indikator = tujuan.indikator?.[0];
    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} tahun={tahun} />;
    }

    const targetData = dataTargetRealisasi.find(
        (r) =>
            r.indikatorId === indikator.id.toString() &&
            r.tahun === tahun.toString(),
    );

    return (
        <tr>
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {tujuan.tujuan_pemda}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {tujuan.misi}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {indikator?.indikator ?? "-"}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {indikator?.rumus_perhitungan ?? "-"}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {indikator?.sumber_data ?? "-"}
            </td>
            {targetData && targetData.target ? (
                <ColTargetTujuanComponent
                    target={targetData.target}
                    satuan={targetData.satuan}
                    realisasi={targetData.realisasi}
                    capaian={targetData.capaian}
                    handleClick={() => handleOpenModal(tujuan, dataTargetRealisasi)}
                />
            ) : (
                <td
                    className="border border-red-400 px-6 py-4 text-center"
                    colSpan={4}
                >
                    Tidak ada target
                </td>
            )}
        </tr>
    );
};

export default RowTujuanComponent;

const EmptyIndikatorRow: React.FC<{
    tujuan: any;
    no: number;
    tahun: number;
}> = ({ tujuan, no, tahun }) => {
    return (
        <tr key={tujuan.id} className="bg-red-300">
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {tujuan.tujuan_pemda}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {tujuan.misi}
            </td>
<td
                colSpan={7}
                className="border border-red-400 px-6 py-4 text-center text-gray-500 italic"
              >
                Tidak ada indikator dan target tahun {tahun}
            </td>
        </tr>
    );
};