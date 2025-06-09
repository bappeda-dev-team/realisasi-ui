import React from 'react';
import useFetch from '@/hooks/useFetchPerencanaanTujuan';
import { PerencanaanTujuanPemdaResponse } from '@/types';
import TargetCol from './TargetCol';
import { LoadingBeat } from '@/components/Global/Loading';

const TableTujuan = () => {
  const { data, loading, error } = useFetch<PerencanaanTujuanPemdaResponse>();
  const periode = [2025, 2026, 2027, 2028, 2029, 2030];

  if (loading) return <LoadingBeat loading={loading} />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-auto mt-2 rounded-t-lg border border-red-400">
      <table className="w-full">
        <thead>
          <tr className="text-white bg-red-400">
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center">No</th>
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center">Tujuan</th>
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Visi/Misi</th>
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Indikator</th>
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Aksi</th>
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Rumus Perhitungan</th>
            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Sumber Data</th>
            {periode.map((tahun) => (
              <th colSpan={4} key={tahun} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">
                {tahun}
              </th>
            ))}
            <th rowSpan={2} className="border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Keterangan</th>
          </tr>
          <tr className="text-white bg-red-500">
            {periode.map(tahun => (
              <React.Fragment key={tahun}>
                <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.data.map((item, indexAtas) =>
            item.tujuan_pemda.map((tujuan, index) => {
              const indikator = tujuan.indikator?.[0];

              return (
                <tr key={`${item.pokin_id}-${index}`}>
                  <td className="border-b border-red-400 px-6 py-4 text-center">{index + indexAtas + 1}</td>
                  <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuan_pemda}</td>
                  <td className="border border-red-400 px-6 py-4 text-center">{tujuan.misi}</td>
                  <td className="border border-red-400 px-6 py-4 text-center">{indikator?.indikator ?? '-'}</td>
                  <td className="border border-red-400 px-6 py-4 text-center">{/* Add actions if needed */}</td>
                  <td className="border border-red-400 px-6 py-4 text-center">{indikator?.rumus_perhitungan ?? '-'}</td>
                  <td className="border border-red-400 px-6 py-4 text-center">{indikator?.sumber_data ?? '-'}</td>
                  {periode.map((tahun) => {
                    const targetData = indikator?.target?.find(target => target.tahun === tahun.toString());

                    return targetData ? (
                      <TargetCol key={targetData.id} target={targetData.target} satuan={targetData.satuan} />
                    ) : (
                      <React.Fragment key={`${item.pokin_id}-${tahun}`}>
                        <td className="border border-red-400 px-6 py-4 text-center" colSpan={4}>-</td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border-b border-red-400 px-6 py-4 text-center">Keterangan Realisasi</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableTujuan;
