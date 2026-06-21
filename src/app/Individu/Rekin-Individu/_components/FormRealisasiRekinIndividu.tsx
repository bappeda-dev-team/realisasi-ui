'use client'

import React, { useEffect, useMemo, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { FormProps, RekinTarget, RekinRealisasiRequest, RekinIndividuResponse } from "@/types";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useSubmitData } from "@/hooks/useSubmitData";
import { getMonthKey, getMonthName } from "@/lib/months";

type FormRealisasiRekinIndividuProps = FormProps<RekinTarget[], RekinTarget[]>;

const FormRealisasiRekinIndividu: React.FC<FormRealisasiRekinIndividuProps> = ({ requestValues, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<RekinTarget[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [submitErrors, setSubmitErrors] = useState<string[]>([]);
    const { tahun: selectedTahun, activatedBulan, activatedDinas } = useFilterContext();
    const { user } = useUserContext();
    const monthKey = getMonthKey(activatedBulan);
    const monthLabel = getMonthName(activatedBulan);
    const activePeriodLabel = selectedTahun && monthLabel ? `${selectedTahun} - ${monthLabel}` : (selectedTahun ?? "Tahun");
    const { url } = useApiUrlContext();
    const submitUrl = useMemo(
        () => `${url}/api/v1/realisasi/rekin`,
        [url],
    );
    const { submit, loading, error } = useSubmitData<RekinIndividuResponse>({ url: submitUrl });
    const invalidRealisasiTargets = useMemo(
        () =>
            formData.filter((item) => {
                if (typeof item.realisasi !== "number") return true;
                if (!Number.isFinite(item.realisasi)) return true;
                return item.realisasi <= 0;
            }),
        [formData],
    );


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
        setSubmitErrors([]);

        if (!formData.length) {
            setValidationError("Data realisasi belum tersedia.");
            return;
        }

        if (!selectedTahun) {
            setValidationError("Tahun belum dipilih atau belum aktif.");
            return;
        }

        if (!monthKey) {
            setValidationError("Bulan belum dipilih atau belum aktif.");
            return;
        }

        if (invalidRealisasiTargets.length > 0) {
            setValidationError("Realisasi harus diisi dengan angka lebih dari 0 untuk semua target sebelum menyimpan.");
            return;
        }

        if (!user) {
            setValidationError("Data user tidak tersedia.");
            return;
        }

        const kodeOpd = activatedDinas ?? user.kode_opd ?? "";

        setIsSubmitting(true);
        const successfulResults: RekinIndividuResponse[] = [];
        const errors: string[] = [];

        for (const item of formData) {
            const payload: RekinRealisasiRequest = {
                kodeOpd,
                nip: item.nip,
                kodePkRekin: item.rekinId,
                kodeSasaranOpd: "OPD-Dummy",
                kodeIndikatorPKrekin: item.indikatorId,
                kodeTargetPKrekin: item.targetId,
                realisasi: item.realisasi ?? 0,
                tahun: item.tahun ?? selectedTahun,
                bulan: getMonthKey(item.bulan) ?? monthKey,
            };

            const result = await submit(payload);
            if (result) {
                successfulResults.push(result);
            } else {
                errors.push(`Target "${item.target}" (${item.satuan}): ${error ?? "Gagal menyimpan"}`);
            }
        }

        setIsSubmitting(false);

        if (successfulResults.length > 0) {
            const updatedTargets: RekinTarget[] = successfulResults.map((result, index) => {
                const item = formData[index];
                return {
                    targetRealisasiId: result.id,
                    rekinId: result.kodePkRekin,
                    rekin: item?.rekin ?? "",
                    nip: result.nip,
                    indikatorId: result.kodeIndikatorPkRekin,
                    indikator: item?.indikator ?? "",
                    targetId: result.kodeTargetPkRekin,
                    target: item?.target ?? "",
                    realisasi: result.realisasi,
                    satuan: item?.satuan ?? "",
                    tahun: result.tahun,
                    bulan: result.bulan,
                    jenisRealisasi: result.jenisRealisasi as "NAIK" | "TURUN",
                    capaian: null,
                    keteranganCapaian: null,
                    idSasaran: item?.idSasaran ?? null,
                    sasaran: null,
                    faktorPenunjang: result.faktorPenunjang ?? null,
                    faktorPenghambat: result.faktorPenghambat ?? null,
                    kodeOpd: result.kodeOpd ?? null,
                };
            });
            onSuccess?.(updatedTargets);
            onClose();
        }

        if (errors.length > 0) {
            setSubmitErrors(errors);
        }
    };

    const currentPlan = formData[0]?.rekin ?? "-";

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
        >
            <div className="mb-4">
                <h3 className="font-bold">Rencana Kinerja: {currentPlan}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm">
                    {formData.map((target) => (
                        <div
                            key={`${target.targetId}-${target.tahun}`}
                            className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col col-span-2"
                        >
                            <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                                {activePeriodLabel}
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
            {submitErrors.length > 0 ? (
                <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <p className="font-bold mb-1">Gagal menyimpan beberapa target:</p>
                    <ul className="list-disc pl-4">
                        {submitErrors.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
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

export default FormRealisasiRekinIndividu;
