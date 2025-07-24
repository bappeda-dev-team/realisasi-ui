import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { TujuanOpdPerencanaan, TujuanOpdTargetRealisasiCapaian } from '@/types';

interface RowTujuanComponentProps {
    no: number;
    tujuan: TujuanOpdPerencanaan;
    dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[];
    tahun: number;
    handleOpenModal: (tujuan: TujuanOpdPerencanaan, dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[]) => void;
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    tujuan,
    dataTargetRealisasi,
    tahun,
    handleOpenModal
}) => {
    const indikatorList = tujuan.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} tahun={tahun} />
    }

    return (
        <>
            {indikatorList.map((ind, index) => {
                const targetList = dataTargetRealisasi.filter(r => r.indikatorId === ind.id.toString() && r.tahun === tahun.toString());
                return (
                    <tr key={ind.id || index}>
                        {index === 0 && (
                            <>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{no}</td>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan}</td>
                            </>
                        )}
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.indikator ?? '-'}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.rumus_perhitungan ?? '-'}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.sumber_data ?? '-'}</td>
                        {targetList.length > 0 ? (
                            <React.Fragment key={`${ind.id || index}-target-${tahun}`}>
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
                                {targetList.map((target, idx) => (
                                    <ColTargetTujuanComponent
                                        key={target.targetRealisasiId || idx}
                                        target={target.target}
                                        realisasi={target.realisasi}
                                        satuan={target.satuan}
                                        capaian={target.capaian}
                                    />
                                ))}
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={`${ind.id || index}-target-${tahun}`}>
                                <td className="border border-red-400 px-6 py-4 text-center">
                                </td>
                                <td className="border border-red-400 px-6 py-4 text-center" colSpan={4}>
                                    Tidak ada target
                                </td>
                            </React.Fragment>
                        )}
                    </tr>
                )
            })}
        </>
    );
}

export default RowTujuanComponent;

const EmptyIndikatorRow: React.FC<{
    tujuan: any;
    no: number;
    tahun: number;
}> = ({
    tujuan,
    no,
    tahun
}) => {
        return (
            <tr key={tujuan.id} className="bg-red-300">
                <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan_pemda}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{tujuan.misi}</td>
                <td colSpan={8} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic">
                    Tidak ada indikator dan target tahun {tahun}
                </td>
            </tr>
        )
    }


type TargetColProps = {
    target: string;
    realisasi: number;
    satuan: string;
    capaian: string;
};

const ColTargetTujuanComponent: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian }) => {

    return (
        <>
            <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{realisasi}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{capaian}</td>
        </>
    );
}
