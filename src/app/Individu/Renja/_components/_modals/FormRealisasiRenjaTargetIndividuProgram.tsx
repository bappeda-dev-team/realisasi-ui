'use client'

import React, { useEffect, useState } from "react";
import { ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { FormProps, RenjaTarget, RenjaProgramIndividuResponse } from "@/types";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useSubmitData } from "@/hooks/useSubmitData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { getSessionId, notifySessionExpired } from "@/lib/session";

type FormRealisasiRenjaTargetIndividuProgramProps = FormProps<RenjaTarget[], RenjaTarget[]>;

interface ProgramRealisasiRequest {
  kodeOpd: string;
  tahun: string;
  bulan: string;
  nip: string;
  kodeProgram: string;
  kodeIndikator: string;
  kodeTarget: string;
  kodePagu: string;
  target: number;
  pagu: number;
  realisasi: number;
  buktiPendukung?: string | null;
  keteranganBuktiPendukung?: string | null;
}

const FormRealisasiRenjaTargetIndividuProgram: React.FC<FormRealisasiRenjaTargetIndividuProgramProps> = ({ requestValues, onClose, onSuccess }) => {
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

  const submitUrl = '/api/v1/realisasi/renja_individu/program';

  const { submit, loading, error } = useSubmitData<RenjaProgramIndividuResponse>({ url: submitUrl });

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
          ? { ...item, realisasi: isNaN(parsedValue) ? 0 : parsedValue }
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

        const res = await fetch(`/api/v1/realisasi/renja_individu/upload/file`, {
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

    const payload: ProgramRealisasiRequest = {
      kodeOpd: effectiveKodeOpd,
      tahun: item.tahun,
      bulan: monthKey,
      nip: item.nip,
      kodeProgram: item.kodeRenja,
      kodeIndikator: item.idIndikator,
      kodeTarget: item.targetId,
      kodePagu: item.kodePagu ?? "",
      target: parseFloat(item.target) || 0,
      pagu: item.pagu ?? 0,
      realisasi: item.realisasi,
      buktiPendukung: item.buktiPendukung,
      keteranganBuktiPendukung: item.keteranganBuktiPendukung,
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
            realisasi: result.realisasi ?? orig.realisasi,
            capaian: String(result.capaian ?? orig.capaian ?? ""),
            keteranganCapaian: result.keteranganCapaian ?? orig.keteranganCapaian,
            faktorPenunjang: result.faktorPenunjang ?? orig.faktorPenunjang,
            faktorPenghambat: result.faktorPenghambat ?? orig.faktorPenghambat,
            buktiPendukung: result.buktiPendukung ?? orig.buktiPendukung,
            keteranganBuktiPendukung: result.keteranganBuktiPendukung ?? orig.keteranganBuktiPendukung,
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
              <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                {activePeriodLabel}
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
                value={target.realisasi || ''}
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

export default FormRealisasiRenjaTargetIndividuProgram;
