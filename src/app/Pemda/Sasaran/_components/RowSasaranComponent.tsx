import React from 'react'
import { Indikator, SasaranPemda } from '@/types'

interface RowTujuanComponentProps {
    no: number;
    sasaran: SasaranPemda;
    tahun: number;
}

const RowSasaranComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    sasaran,
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
                        <ColIndikator indikator={ind} />
                    </tr>
                )
            })}
        </>
    );
}

const EmptyIndikatorRow: React.FC<{ sasaran: SasaranPemda; no: number; tahun: tahun }> = ({
    sasaran, no, tahun
}) => {
    return (
        <tr>
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaran_pemda}</td>
            <td colSpan={6} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic">
                Tidak ada indikator dan target tahun {tahun}
            </td>
        </tr>
    )
}

const ColIndikator: React.FC<{ indikator: Indikator }> = ({ indikator }) => {
    const targetList = indikator.target ?? []
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
                        key={target.id || idx}
                        target={target.target}
                        realisasi={"0"}
                        satuan={target.satuan}
                        capaian={"0%"}
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
    realisasi: string;
    satuan: string;
    capaian: string;
};

const ColTargetSasaran: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian }) => {

    return (
        <React.Fragment>
            <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{realisasi}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{capaian}</td>
        </React.Fragment>
    );
}

export default RowSasaranComponent;
