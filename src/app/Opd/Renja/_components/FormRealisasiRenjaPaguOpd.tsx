'use client'

import React, { useEffect, useMemo, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { RenjaPaguOpdBatchRequest, RenjaPaguOpdResponse } from "@/types";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { useFilterContext } from "@/context/FilterContext";
import { useSubmitData } from "@/hooks/useSubmitData";

interface FormRealisasiProps {
    requestValues: any[];
    onClose: () => void;
    onSuccess: (updatedTargets: any[]) => void;
}

const FormRealisasiRenjaPaguOpd: React.FC<FormRealisasiProps> = ({
    requestValues,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { activatedDinas: kodeOpd, activatedTahun, activatedBulan } = useFilterContext();
    const { url } = useApiUrlContext();
    const submitUrl = useMemo(
        () => (url ? `${url}/api/v1/realisasi/renja_pagu/batch` : "/api/v1/realisasi/renja_pagu/batch"),
        [url],
    );
    const { submit, loading, error } = useSubmitData<RenjaPaguOpdResponse[]>({ url: submitUrl });

    useEffect(() => {
        if (!requestValues?.length) {
            setFormData([]);
            return;
        }

        setFormData(requestValues);
    }, [requestValues]);

    const handleChange = (index: number, value: string) => {
        const parsedValue = parseFloat(value);
        setFormData((previous) =>
            previous.map((item, i) =>
                i === index
                    ? { ...item, realistasiPagu: isNaN(parsedValue) ? 0 : parsedValue }
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

const payload: RenjaPaguOpdBatchRequest[] = formData.map((item) => ({
            targetRealisasiId: item.targetRealisasiId ?? 0,
            renjaPaguId: item.renjaPaguId ?? "",
            renjaPagu: item.renja ?? "",
            jenisRenjaPagu: item.jenisRenja ?? "",
            indikatorId: item.indikatorId ?? "",
            indikator: item.indikator ?? "",
            pagu: item.pagu ?? 0,
            targetId: item.targetId ?? "",
            realisasi: item.realistasiPagu ?? 0,
            satuan: item.satuanPagu ?? "",
            tahun: item.tahun,
            bulan: getMonthName(activatedBulan),
            jenisRealisasi: (item.jenisRealisasi || "NAIK") as "NAIK" | "TURUN",
            kodeOpd: kodeOpd ?? "",
            kodeRenja: item.kodeRenja ?? "",
        }));

        setIsSubmitting(true);
        const result = await submit(payload);
        setIsSubmitting(false);

        if (result) {
            const updatedTargets: any[] = formData.map((item, index) => {
                const responseItem = result[index];
                return {
                    ...item,
                    targetRealisasiId: responseItem?.id ?? item.targetRealisasiId,
                    realistasiPagu: responseItem?.realisasi ?? item.realistasiPagu,
                    capaianPagu: responseItem?.capaian ?? item.capaianPagu,
                };
            });
            onSuccess?.(updatedTargets);
            onClose();
        } else {
            setValidationError(error ?? "Terjadi kesalahan saat menyimpan.");
            console.error("Submission failed:", error);
        }
    };

    const currentRenja = formData[0]?.renja ?? "-";
    const currentIndikator = formData[0]?.indikator ?? "-";

    const getMonthName = (month: string | number | null): string => {
        if (!month) return "-";
        const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const monthNum = typeof month === "string" ? parseInt(month) : month;
        return monthNames[monthNum] || "-";
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
        >
            <div className="mb-4">
                <h3 className="font-bold">Rencana Kerja Pagu: {currentRenja}</h3>
                <p className="text-sm text-gray-600 mt-1">Indikator: {currentIndikator}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                    {formData.map((target, index) => (
                        <div
                            key={`${target.kodeRenja}-${target.tahun}`}
                            className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col col-span-2"
                        >
                            <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                                {activatedTahun} - {getMonthName(activatedBulan)}
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
                                name={`realisasi[${index}]`}
                                value={target.realistasiPagu ?? ''}
                                onChange={(event) =>
                                    handleChange(index, event.target.value)
                                }
                            />
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan</p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">
                                {target.satuanPagu || "-"}
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

export default FormRealisasiRenjaPaguOpd;