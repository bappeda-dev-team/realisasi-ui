'use client'

import React, { useEffect, useMemo, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { FormProps, RenaksiTarget, RenaksiRealisasiRequest, RenaksiIndividuHierarchyResponse } from "@/types";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { useFilterContext } from "@/context/FilterContext";
import { useSubmitData } from "@/hooks/useSubmitData";
import { getMonthKey, getMonthName } from "@/lib/months";

type FormRealisasiRenaksiIndividuProps = FormProps<RenaksiTarget[], RenaksiTarget[]>;

const FormRealisasiRenaksiIndividu: React.FC<FormRealisasiRenaksiIndividuProps> = ({ requestValues, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<RenaksiTarget[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { tahun: selectedTahun, bulan: selectedBulan, activatedTahun, activatedBulan } = useFilterContext();
    const { url } = useApiUrlContext();
    const submitUrl = useMemo(
        () => (url ? `${url}/api/v1/realisasi/renaksi` : "/renaksi"),
        [url],
    );
    const { submit, loading, error } = useSubmitData<RenaksiIndividuHierarchyResponse>({ url: submitUrl });
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

        const payload: RenaksiRealisasiRequest = {
            id: first.targetRealisasiId ?? 0,
            kodeOpd: first.kodeOpd ?? "",
            nip: first.nip,
            kodeSasaran: first.kodeSasaran ?? "",
            kodeRenaksi: first.renaksiId,
            kodeIndikator: first.kodeIndikator ?? "",
            kodeTarget: first.targetId,
            target: parseFloat(first.target) || 0,
            realisasi: first.realisasi ?? 0,
            jenisRealisasi: first.jenisRealisasi,
            paguAnggaran: first.paguAnggaran ?? 0,
            tahun: first.tahun,
            bulan: bulanKey,
        };

        setIsSubmitting(true);
        const result = await submit(payload);
        setIsSubmitting(false);

        if (result) {
            const updatedTarget: RenaksiTarget = {
                targetRealisasiId: result.targets[0]?.id ?? null,
                renaksiId: result.renaksis[0]?.kodeRenaksi ?? "",
                renaksi: result.renaksis[0]?.renaksi ?? "-",
                nip: result.sasaran.nip,
                namaPegawai: result.sasaran.nip,
                rekinId: "",
                rekin: result.sasaran.sasaran ?? "-",
                targetId: result.targets[0]?.kodeTarget ?? "",
                target: String(result.targets[0]?.target ?? "-"),
                realisasi: result.targets[0]?.realisasi ?? 0,
                satuan: result.targets[0]?.satuan ?? "-",
                bulan: result.sasaran.bulan,
                tahun: result.sasaran.tahun,
                jenisRealisasi: result.targets[0]?.jenisRealisasi ?? "NAIK",
                capaian: result.targets[0]?.capaian ?? "-",
                keteranganCapaian: result.targets[0]?.keteranganCapaian ?? null,
                rencanaKinerja: result.sasaran.sasaran ?? "-",
                kodeOpd: result.sasaran.kodeOpd,
                anggaran: String(result.targets[0]?.paguAnggaran ?? "-"),
                faktorPenunjang: result.targets[0]?.faktorPenunjang ?? "-",
                faktorPenghambat: result.targets[0]?.faktorPenghambat ?? "-",
                kodeSasaran: result.sasaran.kodeSasaran,
                kodeIndikator: result.indikators[0]?.kodeIndikator ?? "",
                paguAnggaran: result.targets[0]?.paguAnggaran,
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
                            <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="realisasi">
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
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan</p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">
                                {target.satuan}
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

export default FormRealisasiRenaksiIndividu;
