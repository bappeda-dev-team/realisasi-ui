'use client'

import React, { useEffect, useState } from "react";
import { ButtonGreenBorder, ButtonSky } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import FormRealisasiRenaksiIndividu from "./_components/FormRealisasiRenaksiIndividu";
import FormFaktorPenunjangRenaksiIndividu from "./_components/FormFaktorPenunjangRenaksiIndividu";
import FormFaktorPenghambatRenaksiIndividu from "./_components/FormFaktorPenghambatRenaksiIndividu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { formatPercentageText } from "@/lib/formatPercentageText";
import { RenaksiIndividuItem, RenaksiTarget } from "@/types";
import { getHeaderColor } from "@/lib/userLevelStyle";
import { ROLES } from "@/constants/roles";
import { canEditIndividuRenaksiRealisasi } from "@/lib/rbac";
import { TbRefresh } from "react-icons/tb";
import { getSessionId } from "@/lib/session";

interface RenaksiRow {
  id: number;
  renaksi: string;
  nama_pegawai: string;
  nip: string;
  rekin: string;
  targets: RenaksiTarget[];
  anggaran: string;
}

const Table = () => {
  const [rows, setRows] = useState<RenaksiRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<RenaksiRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("renaksi-individu.pdf");
  const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);
  const [selectedFaktorRow, setSelectedFaktorRow] = useState<RenaksiRow | null>(null);
  const [isFaktorPenunjangModalOpen, setIsFaktorPenunjangModalOpen] = useState(false);
  const [isFaktorPenghambatModalOpen, setIsFaktorPenghambatModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { activatedDinas, activatedTahun, activatedBulan, namaDinas, activatedLevelRole, activatedNamaPegawai } = useFilterContext();
  const { user } = useUserContext();
  const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD);
  const isAdmin = user?.roles?.includes(ROLES.SUPER_ADMIN) || user?.roles?.includes(ROLES.ADMIN_OPD);
  const isOpdScopedView = canBypassNip && Boolean(activatedDinas);
  const canEditRealisasi = canEditIndividuRenaksiRealisasi(user) && !isOpdScopedView;

  const userLevel = user?.roles.find(r => r.startsWith('level_'));

  const getHeaderColor = (level: string | undefined) => {
    switch (level) {
      case ROLES.LEVEL_1: return 'bg-red-600 text-white';
      case ROLES.LEVEL_2: return 'bg-blue-600 text-white';
      case ROLES.LEVEL_3: return 'bg-green-600 text-white';
      case ROLES.LEVEL_4: return 'bg-orange-600 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const getHeaderFillColor = (level: string | undefined): [number, number, number] => {
    switch (level) {
      case ROLES.LEVEL_1: return [220, 38, 38];
      case ROLES.LEVEL_2: return [37, 99, 235];
      case ROLES.LEVEL_3: return [22, 163, 74];
      case ROLES.LEVEL_4: return [234, 88, 12];
      default: return [16, 185, 129];
    }
  };

  const headerColor = getHeaderColor(userLevel);
  const headerFillColor = getHeaderFillColor(userLevel);

  const yearLabel = activatedTahun;
  const monthKey = getMonthKey(activatedBulan);
  const monthLabel = getMonthName(activatedBulan);
  const nip = user?.nip;
  const kodeOpd = activatedDinas || user?.kode_opd;
  let apiUrl = null;
  if (kodeOpd && yearLabel) {
      let safeNip = null;
      if (isOpdScopedView && activatedNamaPegawai) {
          safeNip = activatedNamaPegawai.replace(/-$/, "");
      } else if (!isOpdScopedView && nip) {
          safeNip = nip.replace(/-$/, "");
      }

      if (safeNip) {
          apiUrl = `/api/v1/realisasi/renaksi_individu/nip/${encodeURIComponent(safeNip)}/kodeOpd/${encodeURIComponent(kodeOpd)}/tahun/${encodeURIComponent(yearLabel)}/penetapan`;
      }
  }

  const { data, loading, error, refetch } = useFetchData<any>({
    url: apiUrl,
  });

  useEffect(() => {
    if (!data || !user || !data.rekins) {
      setRows([]);
      return;
    }

    const namaPegawai = data.nama || [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || user.username || "-";

    const flattened: RenaksiRow[] = [];
    let idCounter = 1;

    data.rekins.forEach((rekin: any) => {
      rekin.renaksis?.forEach((renaksi: any) => {
        renaksi.pelaksanaans?.forEach((pelaksanaan: any) => {
          flattened.push({
            id: idCounter++,
            renaksi: renaksi.nama_renaksi ?? "-",
            nama_pegawai: namaPegawai,
            nip: data.pegawai_id ?? user?.nip ?? "-",
            rekin: rekin.rekin ?? "-",
            targets: [
              {
                targetRealisasiId: pelaksanaan.id,
                renaksiId: renaksi.kode_renaksi,
                renaksi: renaksi.nama_renaksi ?? "-",
                nip: data.pegawai_id ?? user?.nip ?? "-",
                namaPegawai,
                rekinId: rekin.kode_pk,
                rekin: rekin.rekin ?? "-",
                targetId: pelaksanaan.kode_pelaksanaan,
                target: pelaksanaan.bobot_pelaksanaan,
                realisasi: pelaksanaan.realisasi,
                satuan: "%",
                tahun: yearLabel ?? "",
                bulan: pelaksanaan.bulan_pelaksanaan.toString(),
                jenisRealisasi: pelaksanaan.jenis_realisasi || "NAIK",
                capaian: pelaksanaan.capaian ?? "-",
                keteranganCapaian: pelaksanaan.keterangan_capaian ?? "-",
                faktorPenunjang: pelaksanaan.faktor_penunjang || "-",
                faktorPenghambat: pelaksanaan.faktor_penghambat || "-",
                buktiPendukung: pelaksanaan.bukti_pendukung || null,
                keteranganBuktiPendukung: pelaksanaan.keterangan_bukti_pendukung || null,
                rencanaKinerja: rekin.rekin ?? "-",
                kodeOpd: data.kode_opd ?? "",
                anggaran: String(renaksi.anggaran_renaksi ?? "-"),
                kodeRekin: rekin.kode_pk,
                paguAnggaran: renaksi.anggaran_renaksi,
              },
            ],
            anggaran: String(renaksi.anggaran_renaksi ?? "-"),
          });
        });
      });
    });

    setRows(flattened);
  }, [data, user, monthKey, yearLabel]);

  const monthColumnLabel = `${activatedTahun} - ${monthLabel}`;

  const openModal = (row: RenaksiRow) => {
    if (!canEditRealisasi) return;
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleOpenFaktorPenunjang = (row: RenaksiRow) => {
    if (!canEditRealisasi) return;
    setSelectedFaktorRow(row);
    setIsFaktorPenunjangModalOpen(true);
  };

  const handleCloseFaktorPenunjang = () => {
    setIsFaktorPenunjangModalOpen(false);
    setSelectedFaktorRow(null);
  };

  const handleOpenFaktorPenghambat = (row: RenaksiRow) => {
    if (!canEditRealisasi) return;
    setSelectedFaktorRow(row);
    setIsFaktorPenghambatModalOpen(true);
  };

  const handleCloseFaktorPenghambat = () => {
    setIsFaktorPenghambatModalOpen(false);
    setSelectedFaktorRow(null);
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

  const createPdfDocument = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const periodLabel = `${monthColumnLabel}`;
    const opdTitle = namaDinas ? ` - ${namaDinas}` : "";

    doc.setFontSize(14);
    doc.text(`Renaksi Individu${opdTitle}`, 40, 40);
    doc.setFontSize(10);
    doc.text(`Periode: ${periodLabel}`, 40, 58);

    const tableHead = [[
      "No",
      "Sasaran Kinerja",
      "Nama Pemilik",
      "Rencana Aksi",
      "Anggaran",
      "Target (%)",
      "Realisasi (%)",
      "Capaian (%)",
      "Keterangan Capaian",
      "Faktor Penunjang",
      "Faktor Penghambat",
    ]];

    const tableBody: any[] = [];

    rows.forEach((item, index) => {
      const targets = item.targets.length ? item.targets : [null];

      targets.forEach((target, targetIndex) => {
        const detailRow = [
          target?.target || "-",
          target?.realisasi ?? "-",
          formatPercentageText(target?.capaian || "-").replace(/%$/, ""),
          formatPercentageText(target?.keteranganCapaian || "-"),
          target?.faktorPenunjang || "-",
          target?.faktorPenghambat || "-",
        ];

        if (targetIndex === 0) {
          tableBody.push([
            { content: index + 1, rowSpan: targets.length },
            { content: item.rekin || "-", rowSpan: targets.length },
            { content: `${item.nama_pegawai || "-"} (${item.nip || "-"})`, rowSpan: targets.length },
            { content: item.renaksi || "-", rowSpan: targets.length },
            { content: item.anggaran || "-", rowSpan: targets.length },
            ...detailRow,
          ]);
          return;
        }

        tableBody.push(detailRow);
      });
    });

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 72,
      styles: {
        fontSize: 8,
        cellPadding: 4,
        lineColor: [16, 185, 129],
        lineWidth: 0.5,
        textColor: [31, 41, 55],
        valign: "top",
      },
      headStyles: {
        fillColor: headerFillColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        lineColor: [255, 255, 255],
        lineWidth: 0.5,
      },
      tableWidth: "auto",
      margin: { top: 72, right: 40, bottom: 40, left: 40 },
      theme: "grid",
    });

    const safeMonthLabel = String(monthLabel || "bulan").replace(/\s+/g, "-").toLowerCase();
    const safeYearLabel = String(yearLabel || "tahun").replace(/\s+/g, "-").toLowerCase();
    const fileName = `renaksi-individu-${safeYearLabel}-${safeMonthLabel}.pdf`;
    return { doc, fileName };
  };

  const handleOpenPrintPreview = () => {
    const { doc, fileName } = createPdfDocument();
    const previewUrl = String(doc.output("bloburl"));

    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }

    setPreviewDoc(doc);
    setPdfFileName(fileName);
    setPdfPreviewUrl(previewUrl);
    setIsPrintPreviewOpen(true);
  };

  const handleClosePrintPreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }

    setIsPrintPreviewOpen(false);
    setPdfPreviewUrl(null);
    setPreviewDoc(null);
  };

  const handleDownloadPdf = () => {
    if (!previewDoc) return;
    previewDoc.save(pdfFileName);
  };

  const handleSync = async () => {
    const nipToSync = (isAdmin ? activatedNamaPegawai : nip)?.replace(/-$/, "");
    if (!nipToSync || !kodeOpd || !yearLabel) return;

    setIsSyncing(true);
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/v1/realisasi/renaksi_individu/nip/${encodeURIComponent(nipToSync)}/kodeOpd/${encodeURIComponent(kodeOpd)}/tahun/${encodeURIComponent(yearLabel)}/sync/penetapan`, {
        method: "POST",
        headers: {
          "X-Session-Id": sessionId ?? "",
        },
      });
      if (!response.ok) {
        console.error("Failed to sync data");
      }
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      console.error("Error during sync:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const renderSyncButton = () => {
    const nipToSync = (isAdmin ? activatedNamaPegawai : nip)?.replace(/-$/, "");
    const canSync = nipToSync && kodeOpd && yearLabel;

    return (
      <div className="flex justify-end mb-2 mr-2 mt-2">
        <ButtonSky className="px-5 py-2 text-base font-medium" onClick={() => setIsSyncModalOpen(true)} disabled={!canSync || isSyncing || loading}>
          {isSyncing ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Syncing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TbRefresh size={20} />
              <span>Sinkronisasi</span>
            </div>
          )}
        </ButtonSky>
      </div>
    );
  };

  const infoMessage = !user || (!user?.nip && !canBypassNip)
    ? "Silakan login terlebih dahulu untuk melihat data renaksi individu."
    : canBypassNip && !activatedDinas
      ? "Pilih dan aktifkan OPD, tahun, dan bulan agar data renaksi individu muncul."
      : !activatedTahun || !monthLabel
        ? "Pilih dan aktifkan tahun dan bulan agar data renaksi individu muncul."
        : undefined;

  if (infoMessage) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        {infoMessage}
      </div>
    );
  }

  if (loading) {
    return (
      <>
        {renderSyncButton()}
        <div className="rounded border border-emerald-200 px-4 py-6 text-center">
          <LoadingBeat loading={true} />
          <p className="text-sm text-gray-600 mt-2">
            Memuat data renaksi individu...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {renderSyncButton()}
        <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
          Gagal memuat data renaksi: {error}
        </div>
      </>
    );
  }

  if (!rows.length) {
    return (
      <>
        {renderSyncButton()}
        <div className="rounded border border-red-200 px-4 py-6 text-center text-sm text-gray-600">
          Data renaksi individu tidak ada.
        </div>
      </>
    );
  }

  return (
    <>
      {renderSyncButton()}
      <div className="overflow-auto m-2 rounded-t-xl">
        <table id="print-area-renaksi" className="w-full">
          <thead>
            <tr className={`text-xm ${headerColor}`}>
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
                Sasaran Kinerja
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
                className="border-r border-b px-6 py-3 min-w-[150px] text-center"
              >
                Anggaran
              </td>
              <th
                colSpan={4}
                className="border-l border-b px-6 py-3 min-w-[100px]"
              >
                Data Pelaksanaan
              </th>
              <th
                rowSpan={2}
                className="border-l border-b px-6 py-3 min-w-[150px] text-center"
              >
                Faktor Penunjang
              </th>
              <th
                rowSpan={2}
                className="border-l border-b px-6 py-3 min-w-[150px] text-center"
              >
                Faktor Penghambat
              </th>
              <td
                rowSpan={2}
                className="border-l border-b px-6 py-3 min-w-[120px] text-center"
              >
                Aksi
              </td>
            </tr>
            <tr className={headerColor}>
              <th className="border-l border-b px-6 py-3 min-w-[50px]">Target (%)</th>
              <th className="border-l border-b px-6 py-3 min-w-[50px]">
                Realisasi (%)
              </th>
              <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian (%)</th>
              <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const target = row.targets[0];
              const isTargetActive = target?.bulan === (monthKey || "0");
              const isRealisasiFilled = target?.realisasi !== null && target?.realisasi !== undefined && Number(target.realisasi) !== 0;
              return (
                <tr key={row.id} className={isTargetActive ? "bg-blue-50" : "bg-white opacity-70"}>
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
                    {row.anggaran || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {target?.target || "-"}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span>{target?.realisasi ?? "-"}</span>
                      {canEditRealisasi && isTargetActive && (
                        <ButtonGreenBorder
                          className="w-full"
                          onClick={() => openModal(row)}
                        >
                          Realisasi
                        </ButtonGreenBorder>
                      )}
                    </div>
                  </td>
                  <td className="border-r border-b border-emerald-500 px-10 py-4">
                    {formatPercentageText(target?.capaian || "-").replace(/%$/, "")}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    {formatPercentageText(target?.keteranganCapaian || "-")}
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span>{target?.faktorPenunjang || "-"}</span>
                      {canEditRealisasi && (
                        <ButtonGreenBorder
                          className="w-full text-xs py-0.5"
                          onClick={isRealisasiFilled ? () => handleOpenFaktorPenunjang(row) : undefined}
                          disabled={!isRealisasiFilled}
                        >
                          Faktor
                        </ButtonGreenBorder>
                      )}
                    </div>
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span>{target?.faktorPenghambat || "-"}</span>
                      {canEditRealisasi && (
                        <ButtonGreenBorder
                          className="w-full text-xs py-0.5"
                          onClick={isRealisasiFilled ? () => handleOpenFaktorPenghambat(row) : undefined}
                          disabled={!isRealisasiFilled}
                        >
                          Faktor
                        </ButtonGreenBorder>
                      )}
                    </div>
                  </td>
                  <td className="border-r border-b border-emerald-500 px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <ButtonGreenBorder
                        className="w-full"
                        onClick={handleOpenPrintPreview}
                      >
                        Cetak
                      </ButtonGreenBorder>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {canEditRealisasi && (
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
      )}

      {canEditRealisasi && (
        <FormModal
          isOpen={isFaktorPenunjangModalOpen}
          onClose={handleCloseFaktorPenunjang}
          title={`Faktor Penunjang - ${selectedFaktorRow?.renaksi ?? ""}`}
        >
          <FormFaktorPenunjangRenaksiIndividu
            renaksiId={selectedFaktorRow?.targets[0]?.renaksiId ?? ""}
            targetId={selectedFaktorRow?.targets[0]?.targetId ?? ""}
            tahun={String(activatedTahun ?? "")}
            bulan={String(activatedBulan ?? "")}
            nip={selectedFaktorRow?.nip ?? ""}
            currentValue={selectedFaktorRow?.targets[0]?.faktorPenunjang ?? ""}
            kodeOpd={selectedFaktorRow?.targets[0]?.kodeOpd ?? ""}
            kodeRekin={selectedFaktorRow?.targets[0]?.kodeRekin ?? ""}
            onClose={handleCloseFaktorPenunjang}
            onSuccess={() => { handleCloseFaktorPenunjang(); refetch(); }}
          />
        </FormModal>
      )}
      {canEditRealisasi && (
        <FormModal
          isOpen={isFaktorPenghambatModalOpen}
          onClose={handleCloseFaktorPenghambat}
          title={`Faktor Penghambat - ${selectedFaktorRow?.renaksi ?? ""}`}
        >
          <FormFaktorPenghambatRenaksiIndividu
            renaksiId={selectedFaktorRow?.targets[0]?.renaksiId ?? ""}
            targetId={selectedFaktorRow?.targets[0]?.targetId ?? ""}
            tahun={String(activatedTahun ?? "")}
            bulan={String(activatedBulan ?? "")}
            nip={selectedFaktorRow?.nip ?? ""}
            currentValue={selectedFaktorRow?.targets[0]?.faktorPenghambat ?? ""}
            kodeOpd={selectedFaktorRow?.targets[0]?.kodeOpd ?? ""}
            kodeRekin={selectedFaktorRow?.targets[0]?.kodeRekin ?? ""}
            onClose={handleCloseFaktorPenghambat}
            onSuccess={() => { handleCloseFaktorPenghambat(); refetch(); }}
          />
        </FormModal>
      )}

      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={handleClosePrintPreview}
          ></div>
          <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 border-b pb-2">
              <h2 className="text-lg font-semibold uppercase">Preview Cetak Renaksi Individu</h2>
              <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
            </div>

            <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
              {pdfPreviewUrl ? (
                <iframe
                  title="Preview PDF Renaksi Individu"
                  src={pdfPreviewUrl}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Gagal memuat preview PDF.
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClosePrintPreview}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsSyncModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Konfirmasi Sinkronisasi</h2>
            <p className="text-gray-600 mb-6">Apakah Anda ingin melakukan sinkronisasi?</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSyncModalOpen(false);
                  handleSync();
                }}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
