'use client'

import React, { useEffect, useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import FormRealisasiRenaksiIndividu from "./_components/FormRealisasiRenaksiIndividu";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useFetchData } from "@/hooks/useFetchData";
import { formatMonthHeader, getMonthName } from "@/lib/months";
import { RenaksiIndividuResponse, RenaksiTarget } from "@/types";

interface RenaksiRow {
  id: number;
  renaksi: string;
  nama_pegawai: string;
  nip: string;
  rekin: string;
  targets: RenaksiTarget[];
}

const Table = () => {
  const [rows, setRows] = useState<RenaksiRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<RenaksiRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { activatedBulan } = useFilterContext();
  const { user } = useUserContext();

  const monthLabel = getMonthName(activatedBulan);
  const apiUrl =
    monthLabel && user?.nip
      ? `/api/v1/realisasi/renaksi/by-nip/${encodeURIComponent(
          user.nip,
        )}/by-bulan/${encodeURIComponent(monthLabel)}`
      : null;

  const { data, loading, error } = useFetchData<RenaksiIndividuResponse[]>({
    url: apiUrl,
  });

  useEffect(() => {
    if (!data) {
      setRows([]);
      return;
    }

    const namaPegawaiParts = [user?.firstName, user?.lastName].filter(Boolean);
    const namaPegawai = namaPegawaiParts.join(" ").trim() || "Pengguna";

    setRows(
      data.map((item) => {
        const target: RenaksiTarget = {
          targetRealisasiId: item.id ?? null,
          renaksiId: item.renaksiId,
          renaksi: item.renaksi ?? "-",
          nip: item.nip ?? user?.nip ?? "-",
          rekinId: item.rekinId,
          rekin: item.rekin ?? "-",
          targetId: item.targetId,
          target: item.target,
          realisasi: item.realisasi,
          satuan: item.satuan,
          tahun: item.tahun,
          bulan: item.bulan,
          jenisRealisasi: item.jenisRealisasi,
          capaian: item.capaian ?? "-",
          keteranganCapaian: item.keteranganCapaian ?? "-",
          rencanaKinerja: item.rekin,
        };

        return {
          id: item.id,
          renaksi: item.renaksi ?? "-",
          nama_pegawai: namaPegawai,
          nip: item.nip ?? user?.nip ?? "-",
          rekin: item.rekin ?? "-",
          targets: [target],
        };
      }),
    );
  }, [data, user]);

  const monthColumnLabel = formatMonthHeader(activatedBulan, "Bulan 5");

  const openModal = (row: RenaksiRow) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleRealisasiSuccess = (updatedTargets: RenaksiTarget[]) => {
    if (!selectedRow) return;
    setRows((previous) =>
      previous.map((row) =>
        row.id === selectedRow.id ? { ...row, targets: updatedTargets } : row
      )
    );
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const infoMessage = !user?.nip
    ? "Silakan login terlebih dahulu untuk melihat data renaksi individu."
    : !monthLabel
      ? "Pilih dan aktifkan bulan agar data renaksi individu muncul."
      : undefined;

  if (infoMessage) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
        {infoMessage}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center">
        <LoadingBeat loading={true} />
        <p className="text-sm text-gray-600 mt-2">
          Memuat data renaksi individu...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
        Gagal memuat data renaksi: {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
        Data renaksi untuk {monthLabel} belum tersedia.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-auto m-2 rounded-t-xl">
        <table className="w-full">
          <thead>
            <tr className="text-xm bg-emerald-500 text-white">
              <td
                rowSpan={2}
                className="border-r border-b px-6 py-3 max-w-[100px] text-center"
              >
                No
              </td>
              <td
                rowSpan={2}
                className="border-r border-b px-6 py-3 min-w-[180px]"
              >
                Rencana Kinerja
              </td>
              <td
                rowSpan={2}
                className="border-r border-b px-6 py-3 min-w-[200px]"
              >
                Nama Pemilik
              </td>
              <td
                rowSpan={2}
                className="border-r border-b px-6 py-3 min-w-[400px] text-center"
              >
                Rencana Aksi
              </td>
              <td
                rowSpan={2}
                className="border-r border-b px-6 py-3 min-w-[140px] text-center"
              >
                Aksi
              </td>
              <th
                colSpan={5}
                className="border-l border-b px-6 py-3 min-w-[100px]"
              >
                {monthColumnLabel}
              </th>
            </tr>
            <tr className="bg-emerald-500 text-white">
              <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
              <th className="border-l border-b px-6 py-3 min-w-[50px]">
                Realisasi
              </th>
              <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
              <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
              <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const target = row.targets[0];
              return (
                <tr key={row.id}>
                  <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                    {index + 1}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {row.rekin || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {row.nama_pegawai || "-"} ({row.nip || "-"})
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {row.renaksi || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <ButtonGreenBorder
                        className="flex items-center gap-1 justify-center"
                        onClick={() => openModal(row)}
                      >
                        Realisasi
                      </ButtonGreenBorder>
                    </div>
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {target?.target || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {target?.realisasi ?? "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {target?.satuan || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {target?.capaian || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {target?.keteranganCapaian || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Realisasi Renaksi - ${selectedRow?.nama_pegawai ?? selectedRow?.renaksi ?? ""}`}
      >
        <FormRealisasiRenaksiIndividu
          requestValues={selectedRow?.targets ?? []}
          onClose={closeModal}
          onSuccess={handleRealisasiSuccess}
        />
      </FormModal>
    </>
  );
};

export default Table;
