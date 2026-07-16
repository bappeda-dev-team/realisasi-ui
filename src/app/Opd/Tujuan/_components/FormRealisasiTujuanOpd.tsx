import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useUserContext } from '@/context/UserContext';
import { useSubmitData } from '@/hooks/useSubmitData';
import { getMonthKey } from '@/lib/months';
import { canEditOpdRealisasi } from '@/lib/rbac';
import { useFilterContext } from '@/context/FilterContext';
import { TujuanOpdRealisasiResponse, TujuanOpdRealisasiPayload } from '@/types';
import React, { useState } from 'react';
import { getSessionId, notifySessionExpired } from '@/lib/session';

interface FormRealisasiTujuanOpdProps {
  requestValues: {
    kodeTujuanOpd: string;
    kodeIndikator: string;
    kodeTarget: string;
    tujuanOpd: string;
    target: string;
    realisasi: number | null;
    satuan: string;
    buktiPendukung?: string | null;
    keteranganBuktiPendukung?: string | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
  tahun: number;
  bulan: string;
  bulanLabel?: string;
}

const FormRealisasiTujuanOpd: React.FC<FormRealisasiTujuanOpdProps> = ({
  requestValues,
  onClose,
  onSuccess,
  tahun,
  bulan,
  bulanLabel,
}) => {
  const { user } = useUserContext();
  const { activatedDinas: kodeOpd } = useFilterContext();
  const canEdit = canEditOpdRealisasi(user);
  const { submit, loading } = useSubmitData<TujuanOpdRealisasiResponse>({ url: '/api/v1/realisasi/tujuan_opd' });
  const normalizedBulan = getMonthKey(bulan);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [realisasiValue, setRealisasiValue] = useState(() => {
    if (requestValues && requestValues.realisasi) {
      return String(requestValues.realisasi).replace('.', ',');
    }
    return '';
  });
  const [fileUrl, setFileUrl] = useState<string | null>(requestValues?.buktiPendukung ?? null);
  const [keteranganBuktiPendukung, setKeteranganBuktiPendukung] = useState<string>(requestValues?.keteranganBuktiPendukung ?? '');

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const res = await fetch(`/api/v1/realisasi/tujuan_opd/upload/file`, {
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
        setFileUrl(data.url);
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat mengunggah file");
    }
  };


  if (!requestValues) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!canEdit) {
      alert('Anda tidak memiliki akses untuk melakukan realisasi.');
      return;
    }

    if (!normalizedBulan) {
      alert('Bulan tidak valid. Silakan pilih bulan aktif terlebih dahulu.');
      return;
    }

    const trimmed = realisasiValue.trim();
    const normalizedValue = trimmed.replace(',', '.');
    const parsedCheck = parseFloat(normalizedValue);
    if (trimmed === '' || parsedCheck === 0) {
      setValidationError('Nilai realisasi tidak boleh 0 atau kosong.');
      return;
    }

    let numericReal = 0;
    if (trimmed !== '') {
      const parsed = parseFloat(normalizedValue);
      if (!Number.isNaN(parsed)) {
        numericReal = parsed;
      }
    }

    const payload: TujuanOpdRealisasiPayload = {
      kodeTujuanOpd: requestValues.kodeTujuanOpd,
      kodeIndikator: requestValues.kodeIndikator,
      kodeTarget: requestValues.kodeTarget,
      realisasi: numericReal,
      jenisRealisasi: 'NAIK',
      tahun: String(tahun),
      bulan: normalizedBulan,
      kodeOpd: kodeOpd ?? '',
      buktiPendukung: fileUrl ?? undefined,
      keteranganBuktiPendukung: keteranganBuktiPendukung || undefined,
    };

    const result = await submit(payload);

    if (result) {
      onClose();
      onSuccess();
    } else {
      alert('Terjadi kesalahan saat menyimpan realisasi.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
      <div className="mb-4">
        <div className="mt-2 text-sm">
          <div className="border p-3 rounded bg-gray-50 shadow-sm flex flex-col">
            <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
              {tahun} - {bulanLabel}
            </div>
            <p className="uppercase text-xs font-bold text-gray-700 mb-1">
              Target:
            </p>
            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-2">
              {requestValues.target} {requestValues.satuan}
            </p>
            <label className="uppercase text-xs font-bold text-gray-700 mb-1" htmlFor="realisasi">
              Realisasi:
            </label>
            <div className="flex gap-2 items-center mb-2">
              <input
                id="realisasi"
                type="text"
                className="w-full border rounded px-2 py-1 text-sm"
                value={realisasiValue}
                onChange={(e) => setRealisasiValue(e.target.value)}
              />
              <span className="text-xs text-gray-500">{requestValues.satuan}</span>
            </div>
            <p className="uppercase text-xs font-bold text-gray-700 mb-1">
              Satuan:
            </p>
            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm">
              {requestValues.satuan}
            </p>
            
            <label className="uppercase text-xs font-bold text-gray-700 mb-1 mt-2" htmlFor="fileUpload">
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
                        onChange={handleUploadFile}
                    />
                </label>
                {(() => {
                    if (!fileUrl) return <span className="text-gray-500 text-sm truncate flex-1">Tidak ada File Yang Dipilih</span>;
                    const rawFileName = fileUrl.split('/').pop()?.split('?')[0] || 'Lihat File';
                    const fileName = rawFileName.replace(/^\d+-/, '');
                    return (
                        <a 
                            href={fileUrl} 
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

            <label className="uppercase text-xs font-bold text-gray-700 mb-1" htmlFor="keteranganUpload">
                Keterangan Bukti Pendukung:
            </label>
            <textarea
                className="w-full border rounded px-2 py-1 text-sm mb-1"
                rows={2}
                value={keteranganBuktiPendukung}
                onChange={(e) => setKeteranganBuktiPendukung(e.target.value)}
            />
          </div>
        </div>
      </div>
      {validationError ? (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validationError}
        </div>
      ) : null}
      <ButtonSky className="w-full mt-3" type="submit">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingButtonClip />
            Menyimpan...
          </span>
        ) : (
          'Simpan'
        )}
      </ButtonSky>
    </form>
  );
};

export default FormRealisasiTujuanOpd;
