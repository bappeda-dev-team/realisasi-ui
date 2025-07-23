import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { TujuanOpd, TujuanOpdTargetRealisasiCapaian } from '@/types';

interface RowTujuanComponentProps {
    no: number;
    tujuan: TujuanOpd;
    dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[];
    periode: number[];
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    tujuan,
    dataTargetRealisasi,
    periode,
}) => {
    const indikatorList = tujuan.indikator ?? [];
    const indikator = tujuan.indikator?.[0];
    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} periode={periode} />
    }

    return (
        <tr key={tujuan.id_tujuan_opd}>
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.indikator ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.rumus_perhitungan ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.sumber_data ?? '-'}</td>
            {periode.map((tahun) => {

                const targetData = dataTargetRealisasi.find(r => r.indikatorId === indikator.id.toString() && r.tahun === tahun.toString());

                return targetData && targetData?.target ? (
                    <React.Fragment key={`${tujuan.id_tujuan_opd}-${tahun}`}>
                        <td className="border border-red-400 px-6 py-4 text-center">
                            <div className="flex flex-col gap-2">
                                <ButtonGreenBorder
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => {
                                        console.log('modal-tujuan-opd-clicked');
                                    }} >
                                    Realisasi
                                </ButtonGreenBorder>
                            </div>
                        </td>
                        <ColTargetTujuanComponent key={targetData.targetRealisasiId} target={targetData.target} satuan={targetData.satuan} realisasi={targetData.realisasi} capaian={targetData.capaian} />
                    </React.Fragment>
                ) : (
                    <React.Fragment key={`${tujuan.id_tujuan_opd}-${tahun}`}>
                        <td className="border border-red-400 px-6 py-4 text-center">
                        </td>
                        <td className="border border-red-400 px-6 py-4 text-center" colSpan={4}>
                            Tidak ada target
                        </td>
                    </React.Fragment>
                );
            })}
        </tr>
    );
}

export default RowTujuanComponent;

const EmptyIndikatorRow: React.FC<{
    tujuan: any;
    no: number;
    periode: number[];
}> = ({
    tujuan,
    no,
    periode
}) => {
        return (
            <tr key={tujuan.id} className="bg-red-300">
                <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan_pemda}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{tujuan.misi}</td>
                <td colSpan={8} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic">
                    Tidak ada indikator dan target tahun {periode[0]}
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
