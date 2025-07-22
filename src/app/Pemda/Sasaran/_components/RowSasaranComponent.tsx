import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { SasaranPemda, TargetRealisasiCapaianSasaran } from '@/types'

interface RowSasaranComponentProps {
    no: number;
    sasaran: SasaranPemda;
    dataTargetRealisasi: TargetRealisasiCapaianSasaran[];
    tahun: number;
    handleOpenModal: (sasaran: SasaranPemda, dataTargetRealisasi: TargetRealisasiCapaianSasaran[]) => void;
}

export default function RowSasaranComponent({
    no,
    sasaran,
    dataTargetRealisasi,
    tahun,
    handleOpenModal
}: RowSasaranComponentProps) {
    const indikatorList = sasaran.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} sasaran={sasaran} tahun={tahun} />;
    }

    return (
        <>
            {indikatorList.map((ind, index) => {
                const targetList = dataTargetRealisasi.filter(r => r.indikatorId === ind.id.toString() && r.tahun === tahun.toString());

                return (
                    <tr key={ind.id || index} >
                        {index === 0 && (
                            <>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{no}</td>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaran_pemda}</td>
                            </>
                        )}
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.indikator ?? '-'}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.rumus_perhitungan ?? '-'}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.sumber_data ?? '-'}</td>
                        {targetList.length > 0 ? (
                            <>
                                <td className="border border-red-400 px-6 py-4 text-center">
                                    <div className="flex flex-col gap-2">
                                        <ButtonGreenBorder
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => {
                                                handleOpenModal(sasaran, dataTargetRealisasi);
                                            }}
                                        >
                                            Realisasi
                                        </ButtonGreenBorder>
                                    </div>
                                </td>
                                {targetList.map((target, idx) => (
                                    <ColTargetSasaran
                                        key={target.targetRealisasiId || idx}
                                        target={target.target}
                                        realisasi={target.realisasi}
                                        satuan={target.satuan}
                                        capaian={target.capaian}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <td className="border border-red-400 px-6 py-4 text-center text-gray-400 italic">
                                </td>
                                <td colSpan={4} className="border border-red-400 px-6 py-4 text-center text-gray-400 italic">
                                    Tidak ada target
                                </td>
                            </>
                        )}
                    </tr>
                )
            })}
        </>
    );
}

const EmptyIndikatorRow: React.FC<{
    sasaran: SasaranPemda;
    no: number;
    tahun: number;
}> = ({
    sasaran,
    no,
    tahun
}) => {
        return (
            <tr key={sasaran.id} className="bg-red-300">
                <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaran_pemda}</td>
                <td colSpan={8} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic">
                    Tidak ada indikator dan target tahun {tahun}
                </td>
            </tr>
        )
    }

const ColTargetSasaran: React.FC<{
    target: string;
    realisasi: number;
    satuan: string;
    capaian: string;
}> = ({
    target,
    realisasi,
    satuan,
    capaian
}) => {
        return (
            <>
                <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{realisasi}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{capaian}</td>
            </>
        );
    }
