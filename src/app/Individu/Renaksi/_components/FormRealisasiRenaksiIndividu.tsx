'use client'

import React, { useEffect, useMemo, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { FormProps, RenaksiTarget, RenaksiIndividuRealisasiRequest, RenaksiIndividuRealisasiResponse } from "@/types";
import { useFilterContext } from "@/context/FilterContext";
import { useSubmitData } from "@/hooks/useSubmitData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { getSessionId, notifySessionExpired } from "@/lib/session";

type FormRealisasiRenaksiIndividuProps = FormProps<RenaksiTarget[], RenaksiTarget[]>;

const FormRealisasiRenaksiIndividu: React.FC<FormRealisasiRenaksiIndividuProps> = ({ requestValues, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<RenaksiTarget[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { tahun: selectedTahun, bulan: selectedBulan, activatedTahun, activatedBulan } = useFilterContext();

    const submitUrl = '/api/v1/realisasi/renaksi_individu';

    const { submit, loading, error } = useSubmitData<RenaksiIndividuRealisasiResponse>({ url: submitUrl });
    const invalidRealisasiTargets = useMemo(
        () =>
            formData.filter((item) => {
                if (typeof item.realisasi !== "number") return true;
                if (!Number.isFinite(item.realisasi)) return true;
                return item.realisasi <= 0;
            }),
        [formData],
    );
    const activeMonthKey = getMonthKey(activatedBulan);
    const activeMonthLabel = activeMonthKey
        ? getMonthName(activatedBulan) ?? `Bulan ${activeMonthKey}`
        : "Belum diaktifkan";
    const selectedMonthKey = getMonthKey(activatedBulan ?? selectedBulan);

    useEffect(() => {
        if (!requestValues?.length) {
            setFormData([]);
            return;
        }

        setFormData(
            requestValues.map((item) => ({
                ...item,
                tahun: selectedTahun ?? item.tahun,
                bulan: selectedMonthKey ?? getMonthKey(item.bulan) ?? null,
            }))
        );
    }, [requestValues, selectedTahun, selectedBulan, activatedBulan, selectedMonthKey]);

    const handleChange = (targetId: string, tahun: string, value: string) => {
        setFormData((previous) =>
            previous.map((item) =>
                item.targetId === targetId && item.tahun === tahun
                    ? { ...item, realisasi: value === "" ? undefined : (parseFloat(value) || 0) }
                    : item
            )
        );
    };

    const handleKeteranganChange = (targetId: string, tahun: string, value: string) => {
        setFormData((previous) =>
            previous.map((item) =>
                item.targetId === targetId && item.tahun === tahun
                    ? { ...item, keteranganBuktiPendukung: value }
                    : item
            )
        );
    };

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, targetId: string, tahun: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        try {
            const sessionId = getSessionId();
            if (!sessionId) {
                alert("Sesi anda telah berakhir. Silakan login kembali.");
                return;
            }

            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch(`/api/v1/realisasi/renaksi_individu/upload/file`, {
                method: "POST",
                headers: {
                    "X-Session-Id": sessionId,
                },
                credentials: "include",
                body: uploadFormData,
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    notifySessionExpired();
                    throw new Error("Session habis, silakan login kembali.");
                }
                throw new Error("Gagal mengunggah file");
            }
            
            const data = await res.json();
            
            setFormData((previous) =>
                previous.map((item) =>
                    item.targetId === targetId && item.tahun === tahun
                        ? { ...item, buktiPendukung: data.url }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat mengunggah file");
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setValidationError(null);

        if (!formData.length) {
            setValidationError("Data realisasi belum tersedia.");
            return;
        }

        if (invalidRealisasiTargets.length > 0) {
            setValidationError("Realisasi harus diisi dengan angka lebih dari 0 untuk semua target sebelum menyimpan.");
            return;
        }

        const first = formData[0];
        const bulanKey = getMonthKey(first.bulan);

        if (!bulanKey) {
            setValidationError("Bulan belum dipilih atau belum aktif.");
            return;
        }

        const payload: RenaksiIndividuRealisasiRequest = {
            targetRealisasiId: first.targetRealisasiId ?? 0,
            kodeOpd: first.kodeOpd ?? "",
            nip: first.nip,
            kodeSasaran: first.kodeSasaran ?? "",
            kodeRenaksi: first.renaksiId,
            kodeIndikator: first.kodeIndikator ?? "",
            kodeTarget: first.targetId,
            target: first.target,
            paguAnggaran: first.paguAnggaran ?? 0,
            realisasi: first.realisasi ?? 0,
            tahun: first.tahun,
            bulan: bulanKey,
            satuan: first.satuan,
            jenisRealisasi: first.jenisRealisasi,
            buktiPendukung: first.buktiPendukung,
            keteranganBuktiPendukung: first.keteranganBuktiPendukung,
        };

        setIsSubmitting(true);
        const result = await submit(payload);
        setIsSubmitting(false);

        if (result) {
            const updatedTarget: RenaksiTarget = {
                ...first,
                targetRealisasiId: result.id ?? null,
                realisasi: result.realisasi ?? 0,
                satuan: result.satuan ?? first.satuan,
                jenisRealisasi: result.jenisRealisasi ?? first.jenisRealisasi,
                capaian: result.capaian ?? "-",
                keteranganCapaian: result.keteranganCapaian ?? null,
                faktorPenunjang: result.faktorPenunjang ?? "-",
                faktorPenghambat: result.faktorPenghambat ?? "-",
                kodeOpd: result.kodeOpd ?? first.kodeOpd,
                kodeSasaran: result.kodeSasaran ?? first.kodeSasaran,
                kodeIndikator: result.kodeIndikator ?? first.kodeIndikator,
                paguAnggaran: result.paguAnggaran ?? first.paguAnggaran,
                buktiPendukung: result.buktiPendukung ?? first.buktiPendukung,
                keteranganBuktiPendukung: result.keteranganBuktiPendukung ?? first.keteranganBuktiPendukung,
            };
            onSuccess?.([updatedTarget]);
            onClose();
        } else {
            setValidationError(error ?? "Terjadi kesalahan saat menyimpan.");
            console.error("Submission failed:", error);
        }
    };

    const currentPlan = formData[0]?.rencanaKinerja ?? "-";

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
        >
            <div className="mb-4">
                <h3 className="font-bold">Sasaran Kinerja: {currentPlan}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm">
                    {formData.map((target) => (
                        <div
                            key={`${target.targetId}-${target.tahun}`}
                            className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col col-span-2"
                        >
                            <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                                {activatedTahun} - {activeMonthLabel}
                            </div>
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">Target</p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">
                                {target.target}
                            </p>
                            <label className="uppercase text-xs font-bold text-gray-700 mb-2 mt-2" htmlFor="realisasi">
                                Realisasi
                            </label>
                            <input
                                type="number"
                                className="w-full border rounded px-2 py-1 text-sm mb-1"
                                step="0.01"
                                name={`realisasi[${target.targetId}][${target.tahun}]`}
                                value={target.realisasi ?? ""}
                                onChange={(event) =>
                                    handleChange(target.targetId, target.tahun, event.target.value)
                                }
                            />
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2 mt-2">Satuan</p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">
                                {target.satuan}
                            </p>
                            <label className="uppercase text-xs font-bold text-gray-700 mb-2 mt-2" htmlFor={`fileUpload-${target.targetId}`}>
                                Upload Bukti Pendukung:
                            </label>
                            <div className="flex items-center gap-2 mb-2 px-2 py-1 w-full border rounded bg-white">
                                <label className="cursor-pointer shrink-0">
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors border border-gray-300 inline-block font-medium">
                                        Pilih File
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id={`fileUpload-${target.targetId}`}
                                        onChange={(e) => handleUploadFile(e, target.targetId, target.tahun)}
                                    />
                                </label>
                                {(() => {
                                    if (!target.buktiPendukung) return <span className="text-gray-500 text-sm truncate flex-1">Tidak ada File Yang Dipilih</span>;
                                    const rawFileName = target.buktiPendukung.split('/').pop()?.split('?')[0] || 'Lihat File';
                                    const fileName = rawFileName.replace(/^\d+-/, '');
                                    return (
                                        <a 
                                            href={target.buktiPendukung} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors inline-block truncate max-w-[200px] align-middle"
                                            title={fileName}
                                        >
                                            {fileName}
                                        </a>
                                    );
                                })()}
                            </div>

                            <label className="uppercase text-xs font-bold text-gray-700 mb-2 mt-2" htmlFor={`keteranganUpload-${target.targetId}`}>
                                Keterangan Bukti Pendukung:
                            </label>
                            <textarea
                                id={`keteranganUpload-${target.targetId}`}
                                className="w-full border rounded px-2 py-1 text-sm mb-1"
                                rows={2}
                                value={target.keteranganBuktiPendukung || ""}
                                onChange={(e) => handleKeteranganChange(target.targetId, target.tahun, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {validationError ? (
                <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {validationError}
                </div>
            ) : null}
            <ButtonSky className="w-full mt-3" type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <LoadingButtonClip />
                        Menyimpan...
                    </span>
                ) : (
                    "Simpan"
                )}
            </ButtonSky>
        </form>
    );
};

export default FormRealisasiRenaksiIndividu;
