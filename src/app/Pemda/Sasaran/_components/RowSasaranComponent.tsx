import React from 'react'
import { Indikator, SasaranPemda, TargetRealisasiCapaianSasaran } from '@/types'

interface RowTujuanComponentProps {
    no: number;
    sasaran: SasaranPemda;
    dataTargetRealisasi: TargetRealisasiCapaianSasaran[];
    tahun: number;
}

const RowSasaranComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    sasaran,
    dataTargetRealisasi,
    tahun
}) => {
    const indikatorList = sasaran.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} sasaran={sasaran} tahun={tahun} />;
    }

    return (
        <>
            {indikatorList.map((ind, index) => {
                return (
                    <tr key={ind.id || index} >
                        {index === 0 && (
                            <>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{no}</td>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaran_pemda}</td>
                            </>
                        )}
                        <ColIndikator indikator={ind} realisasi={dataTargetRealisasi} tahun={tahun} />
                    </tr>
                )
            })}
        </>
    );
}

const EmptyIndikatorRow: React.FC<{ sasaran: SasaranPemda; no: number; tahun: number; }> = ({
    sasaran, no, tahun
}) => {
    return (
        <tr key={sasaran.id} className="bg-red-300">
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaran_pemda}</td>
            <td colSpan={6} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic">
                Tidak ada indikator dan target tahun {tahun}
            </td>
        </tr>
    )
}

const ColIndikator: React.FC<{ indikator: Indikator; realisasi: TargetRealisasiCapaianSasaran[]; tahun: number }> = ({
    indikator,
    realisasi,
    tahun
}) => {
    const targetList = realisasi.filter(r => r.indikatorId === indikator.id.toString() && r.tahun === tahun.toString());

    return (
        <>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.indikator ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.rumus_perhitungan ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.sumber_data ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                <div className="flex flex-col gap-2">
                </div>
            </td>
            {targetList.length > 0 ? (
                targetList.map((target, idx) => (
                    <ColTargetSasaran
                        key={target.targetRealisasiId || idx}
                        target={target.target}
                        realisasi={target.realisasi}
                        satuan={target.satuan}
                        capaian={target.capaian}
                    />
                ))
            ) : (
                <td className="border border-red-400 px-6 py-4 text-center text-gray-400 italic">
                    Tidak ada target
                </td>
            )}
            <td className="border-b border-red-400 px-6 py-4 text-center">Keterangan Realisasi</td>
        </>
    );
}

type TargetColProps = {
    target: string;
    realisasi: number;
    satuan: string;
    capaian: string;
};

const ColTargetSasaran: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian }) => {

    return (
        <>
            <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{realisasi}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{capaian}</td>
        </>
    );
}

export default RowSasaranComponent;
