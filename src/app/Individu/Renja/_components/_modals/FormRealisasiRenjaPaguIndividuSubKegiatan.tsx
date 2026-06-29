'use client'

import React, { useEffect, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { FormProps, RenjaTarget, RenjaSubKegiatanIndividuResponse } from "@/types";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useSubmitData } from "@/hooks/useSubmitData";
import { getMonthKey, getMonthName } from "@/lib/months";

type FormRealisasiRenjaPaguIndividuSubKegiatanProps = FormProps<RenjaTarget[], RenjaTarget[]>;

interface SubkegiatanPaguRealisasiRequest {
    kodeOpd: string;
    tahun: string;
    bulan: string;
    nip: string;
    kodeSubKegiatan: string;
    kodeIndikator: string;
    kodeTarget: string;
    kodePagu: string;
    target_realisasi: number;
    pagu: number;
    realisasi_target: number;
    realisasi_pagu: number;
}

const FormRealisasiRenjaPaguIndividuSubKegiatan: React.FC<FormRealisasiRenjaPaguIndividuSubKegiatanProps> = ({ requestValues, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<RenjaTarget[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { tahun: selectedTahun, activatedBulan, activatedDinas } = useFilterContext();
    const { user } = useUserContext();
    const monthKey = getMonthKey(activatedBulan);
    const monthLabel = getMonthName(activatedBulan);
    const activePeriodLabel = selectedTahun && monthLabel ? `${selectedTahun} - ${monthLabel}` : (selectedTahun ?? "Tahun");

    // Determine kodeOpd: prefer activatedDinas if admin-scoped, fall back to user's kode_opd
    const effectiveKodeOpd =
        activatedDinas ?? user?.kode_opd ?? "";

    const submitUrl = '/api/v1/realisasi/renja_individu/subkegiatan';

    const { submit, loading, error } = useSubmitData<RenjaSubKegiatanIndividuResponse>({ url: submitUrl });

    useEffect(() => {
        if (!requestValues?.length) {
            setFormData([]);
            return;
        }

        setFormData(
            requestValues.map((item) => ({
                ...item,
                tahun: selectedTahun ?? item.tahun,
                bulan: monthKey ?? item.bulan,
            }))
        );
    }, [requestValues, selectedTahun, monthKey]);

    const handleChange = (targetId: string, tahun: string, value: string) => {
        const parsedValue = parseFloat(value);
        setFormData((previous) =>
            previous.map((item) =>
                item.targetId === targetId && item.tahun === tahun
                    ? { ...item, realisasiPagu: isNaN(parsedValue) ? 0 : parsedValue }
                    : item
            )
        );
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setValidationError(null);

        if (!formData.length) {
            setValidationError("Data realisasi belum tersedia.");
            return;
        }

        if (!monthKey) {
            setValidationError("Bulan belum dipilih atau belum aktif.");
            return;
        }

        // Build the single request body from the first (and only) target item
        const item = formData[0];
        if (!item) {
            setValidationError("Data target tidak ditemukan.");
            return;
        }

        const payload: SubkegiatanPaguRealisasiRequest = {
            kodeOpd: effectiveKodeOpd,
            tahun: item.tahun,
            bulan: monthKey,
            nip: item.nip,
            kodeSubKegiatan: item.kodeRenja,
            kodeIndikator: item.idIndikator,
            kodeTarget: item.targetId,
            kodePagu: item.kodePagu ?? "",
            target_realisasi: parseFloat(item.target) || 0,
            pagu: item.pagu ?? 0,
            realisasi_target: item.realisasi,
            realisasi_pagu: item.realisasiPagu ?? 0,
        };

        setIsSubmitting(true);
        const result = await submit(payload);
        setIsSubmitting(false);

        if (result) {
            // Map the single response back into RenjaTarget[] for the onSuccess callback
            const updatedTargets: RenjaTarget[] = formData.map((orig, index) => {
                if (index === 0) {
                    return {
                        ...orig,
                        targetRealisasiId: result.id ?? orig.targetRealisasiId,
                        realisasi: result.realisasiTarget ?? orig.realisasi,
                        capaian: String(result.capaian ?? orig.capaian ?? ""),
                        keteranganCapaian: result.keteranganCapaian ?? orig.keteranganCapaian,
                        realisasiPagu: result.realisasiPagu ?? orig.realisasiPagu,
                        capaianPagu: String(result.capaianPagu ?? orig.capaianPagu ?? ""),
                        keteranganCapaianPagu: result.keteranganCapaianPagu ?? orig.keteranganCapaianPagu,
                        faktorPenunjang: result.faktorPenunjang ?? orig.faktorPenunjang,
                        faktorPenghambat: result.faktorPenghambat ?? orig.faktorPenghambat,
                    };
                }
                // For additional targets (if any), just keep the original
                return orig;
            });
            onSuccess?.(updatedTargets);
            onClose();
        } else {
            setValidationError(error ?? "Terjadi kesalahan saat menyimpan.");
            console.error("Submission failed:", error);
        }
    };

    const currentIndikator = formData[0]?.indikator ?? "-";

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
        >
            <div className="mb-4">
                <p className="text-sm text-gray-600 mt-1">Indikator: {currentIndikator}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                    {formData.map((target) => (
                        <div
                            key={`${target.targetId}-${target.tahun}`}
                            className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col col-span-2"
                        >
                            <div className="text-center text-xs font-semibold bg-red-600 text-white rounded py-0.5 mb-1">
                                {activePeriodLabel}
                            </div>
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">Pagu</p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">
                                {target.pagu != null ? target.pagu.toLocaleString() : "-"}
                            </p>
                            <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="realisasi">
                                Realisasi
                            </label>
                            <input
                                type="number"
                                className="w-full border rounded px-2 py-1 text-sm mb-1"
                                step="0.01"
                                name={`realisasi[${target.targetId}][${target.tahun}]`}
                                value={target.realisasiPagu ?? ''}
                                onChange={(event) =>
                                    handleChange(target.targetId, target.tahun, event.target.value)
                                }
                            />
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan</p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">
                                {target.satuanPagu || target.satuan || "-"}
                            </p>
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

export default FormRealisasiRenjaPaguIndividuSubKegiatan;
