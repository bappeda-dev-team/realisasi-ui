'use client'

import React, { useEffect, useMemo, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { FormProps, SasaranIndividuRealisasiRequest, SasaranIndividuResponse } from "@/types";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { useFilterContext } from "@/context/FilterContext";
import { useSubmitData } from "@/hooks/useSubmitData";
import { getMonthKey, getMonthName } from "@/lib/months";

type FormRealisasiSasaranIndividuProps = FormProps<SasaranIndividuResponse[], SasaranIndividuResponse[]>;

const FormRealisasiSasaranIndividu: React.FC<FormRealisasiSasaranIndividuProps> = ({ requestValues, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<SasaranIndividuRealisasiRequest[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const { tahun: selectedTahun, activatedBulan } = useFilterContext();
    const monthKey = getMonthKey(activatedBulan);
    const monthLabel = getMonthName(activatedBulan);
    const activePeriodLabel = selectedTahun && monthLabel ? `${selectedTahun} - ${monthLabel}` : (selectedTahun ?? "Tahun");

    const { url } = useApiUrlContext();
    const submitUrl = useMemo(
        () => (url ? `${url}/api/v1/realisasi/sasaran_individu/batch` : "/api/v1/realisasi/sasaran_individu/batch"),
        [url]
    );

    const { submit, loading, error } = useSubmitData<SasaranIndividuResponse[]>({ url: submitUrl });

    useEffect(() => {
        if (!requestValues?.length) {
            setFormData([]);
            return;
        }

        const generatedFormData: SasaranIndividuRealisasiRequest[] = requestValues.map((item) => ({
            targetRealisasiId: item.id ?? null,
            renjaId: item.renjaId,
            indikatorId: item.indikatorId,
            targetId: item.targetId,
            target: item.target,
            realisasi: item.realisasi,
            satuan: item.satuan,
            tahun: selectedTahun ?? item.tahun,
            bulan: monthKey ?? item.bulan,
            jenisRealisasi: item.jenisRealisasi,
            nip: item.nip,
            rumusPerhitungan: item.rumusPerhitungan,
            sumberData: item.sumberData,
        }));

        setFormData(generatedFormData);
    }, [requestValues, selectedTahun, monthKey]);

    const convertToDisplayString = (value: number | null): string => {
        if (value === null || value === undefined) return "";
        return value.toString().replace('.', ',');
    };

    const handleChange = (rowKey: string, value: string) => {
        const trimmed = value.trim();
        const normalizedValue = trimmed.replace(',', '.');

        let numericReal: number | null = null;
        if (trimmed !== '') {
            const parsed = parseFloat(normalizedValue);
            numericReal = Number.isNaN(parsed) ? null : parsed;
        }

        setFormData((previous) =>
            previous.map((item) =>
                String(item.targetRealisasiId ?? item.targetId) === rowKey
                    ? { ...item, realisasi: numericReal }
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

        setIsSubmitting(true);
        const result = await submit(formData);
        setIsSubmitting(false);

        if (result) {
            onSuccess?.(result);
            onClose();
        } else {
            setValidationError(error ?? "Terjadi kesalahan saat menyimpan.");
            console.error("Submission failed:", error);
        }
    };

    const indikator = requestValues?.[0]?.indikator ?? "-";
    const selectedForm = formData[0] ?? null;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
                <h3 className="font-bold">Indikator: {indikator}</h3>
                <div className="mt-2 text-sm">
                    {selectedForm && (() => {
                        const rowKey = String(selectedForm.targetRealisasiId ?? selectedForm.targetId);
                        return (
                            <div key={rowKey} className="border p-3 rounded bg-gray-50 shadow-sm flex flex-col">
                                <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                                    {activePeriodLabel}
                                </div>
                                <p className="uppercase text-xs font-bold text-gray-700 mb-2">Target:</p>
                                <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{selectedForm.target ?? ""}</p>
                                <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="realisasi">
                                    Realisasi:
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1 text-sm mb-1"
                                    name={`realisasi[${selectedForm.targetRealisasiId}][${selectedForm.tahun}]`}
                                    value={convertToDisplayString(selectedForm.realisasi ?? null)}
                                    onChange={(e) => handleChange(rowKey, e.target.value)}
                                />
                                <p className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan:</p>
                                <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{selectedForm.satuan ?? ""}</p>
                            </div>
                        );
                    })()}
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

export default FormRealisasiSasaranIndividu;
