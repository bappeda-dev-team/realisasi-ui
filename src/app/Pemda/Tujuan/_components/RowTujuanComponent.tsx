import React from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import ColTargetTujuanComponent from "./ColTargetTujuanComponent";

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
    const indikatorList = tujuan.indikator ?? [];
    const indikator = tujuan.indikator?.[0];
    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} periode={periode} />;
    }

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
            {periode.map((tahun, idx) => {
                const targetData = dataTargetRealisasi.find(
                    (r) =>
                        r.indikatorId === indikator.id.toString() &&
                        r.tahun === tahun.toString(),
                );

                return (
                    <React.Fragment key={`${tujuan.id}-${indikator.id}-${tahun}`}>
                        {targetData && targetData.target ? (
                            <>
                                {idx === 0 && (
                                    <td className="border border-red-400 px-6 py-4 text-center">
                                        <div className="flex flex-col gap-2">
                                            <ButtonGreenBorder
                                                className="flex items-center gap-1 cursor-pointer"
                                                onClick={() => handleOpenModal(tujuan, dataTargetRealisasi)}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                )}

                                <ColTargetTujuanComponent
                                    target={targetData.target}
                                    satuan={targetData.satuan}
                                    realisasi={targetData.realisasi}
                                    capaian={targetData.capaian}
                                />
                            </>
                        ) : (
                            <>
                                <td className="border border-red-400 px-6 py-4 text-center"></td>
                                <td
                                    className="border border-red-400 px-6 py-4 text-center"
                                    colSpan={4}
                                >
                                    Tidak ada target
                                </td>
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </tr>
    );
};

export default RowTujuanComponent;

const EmptyIndikatorRow: React.FC<{
    tujuan: any;
    no: number;
    periode: number[];
}> = ({ tujuan, no, periode }) => {
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
                colSpan={8}
                className="border border-red-400 px-6 py-4 text-center text-gray-500 italic"
            >
                Tidak ada indikator dan target tahun {periode[0]}
            </td>
        </tr>
    );
};
