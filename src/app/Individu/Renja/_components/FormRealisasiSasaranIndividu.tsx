'use client'

import React, { useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { SasaranTargetRealisasiInfo, SasaranIndividuPenetapanPayload } from "@/types";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { useFilterContext } from "@/context/FilterContext";
import { getMonthKey } from "@/lib/months";
import { getSessionId, notifySessionExpired } from "@/lib/session";

type FormRealisasiSasaranIndividuProps = {
    targetInfo: SasaranTargetRealisasiInfo;
    onClose: () => void;
    onSuccess: () => void;
};

const FormRealisasiSasaranIndividu: React.FC<FormRealisasiSasaranIndividuProps> = ({ targetInfo, onClose, onSuccess }) => {
    const [realisasiValue, setRealisasiValue] = useState<string>(
        targetInfo.realisasi != null ? String(targetInfo.realisasi).replace('.', ',') : ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { tahun: selectedTahun, activatedBulan } = useFilterContext();
    const bulanKey = getMonthKey(activatedBulan);

    const { url } = useApiUrlContext();
    const submitUrl = url ? `${url}/sasaran_individu` : "/sasaran_individu";

    const handleChange = (value: string) => {
        setRealisasiValue(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);

        const trimmed = realisasiValue.trim();
        const normalizedValue = trimmed.replace(',', '.');
        let numericReal: number | null = null;
        if (trimmed !== '') {
            const parsed = parseFloat(normalizedValue);
            if (Number.isNaN(parsed)) {
                setSubmitError("Nilai realisasi tidak valid.");
                return;
            }
            numericReal = parsed;
        }

        const payload: SasaranIndividuPenetapanPayload = {
            kodeSasaranOpd: targetInfo.kodeSasaranOpd,
            kodeIndikator: targetInfo.kodeIndikator,
            kodeTarget: targetInfo.kodeTarget,
            realisasi: numericReal,
            tahun: selectedTahun ?? "",
            bulan: bulanKey ?? "",
            kodeOpd: targetInfo.kodeOpd,
            nip: targetInfo.nip,
            namaPegawai: targetInfo.namaPegawai,
        };

        setIsSubmitting(true);

        try {
            const sessionId = getSessionId();
            if (!sessionId) {
                setSubmitError("Silakan login terlebih dahulu.");
                return;
            }

            const response = await fetch(submitUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Id": sessionId,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notifySessionExpired();
                    throw new Error("Session habis, silakan login kembali.");
                }
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }

            onSuccess();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
                <h3 className="font-bold">Sasaran: {targetInfo.sasaranOpd}</h3>
                <p className="text-sm text-gray-600 mt-1">Indikator: {targetInfo.indikator}</p>
                <div className="mt-2 text-sm">
                    <div className="border p-3 rounded bg-gray-50 shadow-sm flex flex-col">
                        <p className="uppercase text-xs font-bold text-gray-700 mb-2">Target:</p>
                        <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{targetInfo.target ?? ""}</p>
                        <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="realisasi">
                            Realisasi:
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded px-2 py-1 text-sm mb-1"
                            value={realisasiValue}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        <p className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan:</p>
                        <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{targetInfo.satuan ?? ""}</p>
                    </div>
                </div>
            </div>

            {submitError ? (
                <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {submitError}
                </div>
            ) : null}

            <ButtonSky className="w-full mt-3" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
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
