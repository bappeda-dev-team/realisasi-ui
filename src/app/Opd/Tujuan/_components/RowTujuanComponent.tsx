import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { TujuanOpdPerencanaan, TujuanOpdTargetRealisasiCapaian } from '@/types';

interface RowTujuanComponentProps {
    no: number;
    tujuan: TujuanOpdPerencanaan;
    dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[];
    tahun: number;
    handleOpenPrintPreview: () => void;
    handleOpenModal: (tujuan: TujuanOpdPerencanaan, dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[]) => void;
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    tujuan,
    dataTargetRealisasi,
    tahun,
    handleOpenPrintPreview,
    handleOpenModal
}) => {
    const indikatorList = tujuan.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} tahun={tahun} handleOpenPrintPreview={handleOpenPrintPreview} />
    }

    return (
        <>
            {indikatorList.map((ind, index) => {
                const targetList = dataTargetRealisasi.filter(r => r.indikatorId === ind.id.toString() && r.tahun === tahun.toString());
                const handleClick = () => {
                    const filteredData = dataTargetRealisasi.filter(r => r.indikatorId === ind.id.toString() && r.tahun === tahun.toString());
                    handleOpenModal(tujuan, filteredData);
                };
                return (
                    <tr key={ind.id || index}>
                        {index === 0 && (
                            <>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{no}</td>
                                <td rowSpan={indikatorList.length} className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan}</td>
                            </>
                        )}
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.indikator || '-'}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.rumus_perhitungan || '-'}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{ind?.sumber_data || '-'}</td>
                        {targetList.length > 0 ? (
                            <React.Fragment key={`${ind.id || index}-target-${tahun}`}>
                                {targetList.map((target, idx) => (
                                    <ColTargetTujuanComponent
                                        key={target.targetRealisasiId || idx}
                                        target={target.target}
                                        realisasi={target.realisasi}
                                        satuan={target.satuan}
                                        capaian={target.capaian}
                                        keteranganCapaian={target.keteranganCapaian}
                                        handleClick={handleClick}
                                    />
                                ))}
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={`${ind.id || index}-target-${tahun}`}>
                                <td className="border border-red-400 px-6 py-4 text-center" colSpan={4}>
                                    Tidak ada target
                                </td>
                            </React.Fragment>
                        )}
                        <td className="border border-red-400 px-6 py-4 text-center">
                            <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                                Cetak
                            </ButtonGreenBorder>
                        </td>
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
    handleOpenPrintPreview: () => void;
}> = ({
    tujuan,
    no,
    tahun,
    handleOpenPrintPreview,
}) => {
        return (
            <tr key={tujuan.id}>
                <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan}</td>
                <td colSpan={8} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
                    Tidak ada indikator dan target tahun {tahun}
                </td>
                <td className="border border-red-400 px-6 py-4 text-center">
                    <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                        Cetak
                    </ButtonGreenBorder>
                </td>
            </tr>
        )
    }


type TargetColProps = {
    target: string;
    realisasi: number;
    satuan: string;
    capaian: string;
    keteranganCapaian: string;
    handleClick?: () => void;
};

const ColTargetTujuanComponent: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian, keteranganCapaian, handleClick }) => {

    return (
        <>
            <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <span>{realisasi}</span>
                    {handleClick && (
                        <ButtonGreenBorder
                            className="w-full"
                            onClick={handleClick}
                        >
                            Realisasi
                        </ButtonGreenBorder>
                    )}
                </div>
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{capaian}</td>
            <td className="border border-red-400 px-6 py-4">{keteranganCapaian || '-'}</td>
        </>
    );
}
