import React from 'react';
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilterContext } from "@/context/FilterContext";
import { getMonthName } from "@/lib/months";

export default function TableLaporanTujuanOpd({ laporanType }: { laporanType?: string }) {
    const isTahunan = laporanType === 'Tahunan';
    const isTriwulan = laporanType === 'Triwulan';
    const isBulanan = laporanType === 'Bulanan';
    const { activatedTahun, activatedDinas, activatedBulan } = useFilterContext();
    
    const tahunLabel = activatedTahun ?? "2025";
    const bulanName = getMonthName(activatedBulan) ?? "Januari";

    let fetchUrl: string | null = null;
    if (laporanType && activatedTahun && activatedDinas) {
        const tahun = activatedTahun;
        const jenisLaporan = laporanType.toUpperCase();
        const kodeOpd = activatedDinas;
        
        const params = new URLSearchParams();
        if (isBulanan) {
            params.append('bulan', activatedBulan ?? "1");
        }
        
        const queryString = params.toString();
        fetchUrl = `/api/v1/realisasi/tujuan_opd/laporan/kodeOpd/${kodeOpd}/tahun/${tahun}/jenisLaporan/${jenisLaporan}${queryString ? `?${queryString}` : ''}`;
    }

    const { data: reportData, loading, error } = useFetchData<any>({
        url: fetchUrl
    });

    return (
        <div className="overflow-x-auto mt-4">
            <table className="w-full">
                <thead className="bg-emerald-500 text-white">
                    {isTahunan ? (
                        <>
                            <tr>
                                <th rowSpan={2} className="border-r border-b py-4 px-4 border-gray-300 min-w-[100px] text-center">Indikator</th>
                                <th rowSpan={2} className="border-r border-b py-4 px-4 border-gray-300 min-w-[100px] text-center">Target</th>
                                <th colSpan={12} className="border-r border-b py-3 px-6 border-gray-300 min-w-[200px] text-center">
                                    {tahunLabel}
                                </th>
                                <th rowSpan={2} className="border-r border-b py-4 px-4 border-gray-300 min-w-[100px] text-center">Total Realisasi</th>
                                <th rowSpan={2} className="border-b py-4 px-6 border-gray-300 min-w-[150px] w-[150px] text-center">Aksi</th>
                            </tr>
                            <tr>
                                {[...Array(12)].map((_, i) => (
                                    <th key={i} className="border-b border-r py-4 px-2 border-gray-300 min-w-[50px] text-center">{i + 1}</th>
                                ))}
                            </tr>
                        </>
                    ) : isTriwulan ? (
                        <>
                            <tr>
                                <th rowSpan={2} className="border-r border-b py-4 px-4 border-gray-300 min-w-[100px] text-center">Indikator</th>
                                <th rowSpan={2} className="border-r border-b py-4 px-4 border-gray-300 min-w-[100px] text-center">Target</th>
                                <th colSpan={4} className="border-r border-b py-3 px-6 border-gray-300 min-w-[200px] text-center">
                                    {tahunLabel}
                                </th>
                                <th rowSpan={2} className="border-r border-b py-4 px-4 border-gray-300 min-w-[100px] text-center">Total Realisasi</th>
                                <th rowSpan={2} className="border-b py-4 px-6 border-gray-300 min-w-[150px] w-[150px] text-center">Aksi</th>
                            </tr>
                            <tr>
                                {[...Array(4)].map((_, i) => (
                                    <th key={i} className="border-b border-r py-4 px-2 border-gray-300 min-w-[50px] text-center">TW{i + 1}</th>
                                ))}
                            </tr>
                        </>
                    ) : (
                        <>
                            <tr>
                                <th rowSpan={2} className="border-r border-b py-3 px-6 border-gray-300 min-w-[100px] text-center">Indikator</th>
                                <th rowSpan={2} className="border-r border-b py-3 px-6 border-gray-300 min-w-[100px] text-center">Target</th>
                                <th colSpan={1} className="border-r border-b py-3 px-6 border-gray-300 min-w-[200px] text-center">
                                    {tahunLabel} - {bulanName}
                                </th>
                                <th rowSpan={2} className="border-b py-4 px-6 border-gray-300 min-w-[150px] w-[150px] text-center">Aksi</th>
                            </tr>
                            <tr>
                                <th className="border-b border-r py-4 px-6 border-gray-300 min-w-[100px] text-center">Realisasi</th>
                            </tr>
                        </>
                    )}
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={isTahunan ? 16 : isTriwulan ? 8 : 4} className="text-center py-4">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={isTahunan ? 16 : isTriwulan ? 8 : 4} className="text-center py-4 text-red-500">Error loading data</td>
                        </tr>
                    ) : !fetchUrl ? (
                        <tr>
                            <td colSpan={isTahunan ? 16 : isTriwulan ? 8 : 4} className="text-center py-4 text-gray-500">Pilih laporan realisasi agar data laporan tujuan opd muncul.</td>
                        </tr>
                    ) : (
                        <tr className="bg-white border-b hover:bg-gray-50">
                            {isTahunan ? (
                                <>
                                    <td className="border border-emerald-400 px-4 py-4 text-center">-</td>
                                    <td className="border border-emerald-400 px-4 py-4 text-center">-</td>
                                    {[...Array(12)].map((_, i) => (
                                        <td key={i} className="border border-emerald-400 px-2 py-4 text-center">
                                            {reportData?.list_data?.[i + 1] !== undefined ? reportData.list_data[i + 1] : '-'}
                                        </td>
                                    ))}
                                    <td className="border border-emerald-400 px-4 py-4 text-center">-</td>
                                </>
                            ) : isTriwulan ? (
                                <>
                                    <td className="border border-emerald-400 px-4 py-4 text-center">-</td>
                                    <td className="border border-emerald-400 px-4 py-4 text-center">-</td>
                                    {[...Array(4)].map((_, i) => (
                                        <td key={i} className="border border-emerald-400 px-2 py-4 text-center">
                                            {reportData?.list_data?.[i + 1] !== undefined ? reportData.list_data[i + 1] : '-'}
                                        </td>
                                    ))}
                                    <td className="border border-emerald-400 px-4 py-4 text-center">-</td>
                                </>
                            ) : (
                                <>
                                    <td className="border border-emerald-400 px-6 py-4 text-center">-</td>
                                    <td className="border border-emerald-400 px-6 py-4 text-center">-</td>
                                    <td className="border border-emerald-400 px-6 py-4 text-center">
                                        {reportData?.list_data ? String(Object.values(reportData.list_data)[0] || '-') : '-'}
                                    </td>
                                </>
                            )}
                            <td className="border border-emerald-400 px-6 py-4">
                                <div className="flex justify-center w-full">
                                    <ButtonGreenBorder className="px-6 py-2 text-sm">
                                        Cetak
                                    </ButtonGreenBorder>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
