import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { useUserContext } from '@/context/UserContext';
import { useSubmitData } from '@/hooks/useSubmitData';
import { getMonthKey } from '@/lib/months';
import { canEditOpdRealisasi } from '@/lib/rbac';
import { useFilterContext } from '@/context/FilterContext';
import { TujuanOpdRealisasiResponse, TujuanOpdRealisasiPayload } from '@/types';
import React, { useState } from 'react';

interface FormRealisasiTujuanOpdProps {
  requestValues: {
    kodeTujuanOpd: string;
    kodeIndikatorTujuanOpd: string;
    kodeTargetTujuanOpd: string;
    tujuanOpd: string;
    indikator: string;
    target: string;
    realisasi: number;
    satuan: string;
    rumusPerhitungan: string;
    sumberData: string;
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
  const { url } = useApiUrlContext();
  const { user } = useUserContext();
  const { activatedDinas: kodeOpd } = useFilterContext();
  const canEdit = canEditOpdRealisasi(user);
  const { submit, loading } = useSubmitData<TujuanOpdRealisasiResponse>({ url: `${url}/api/v1/realisasi/tujuan_opd` });
  const normalizedBulan = getMonthKey(bulan);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [realisasiValue, setRealisasiValue] = useState(() => {
    if (requestValues && requestValues.realisasi) {
      return String(requestValues.realisasi).replace('.', ',');
    }
    return '';
  });

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
      kodeIndikatorTujuanOpd: requestValues.kodeIndikatorTujuanOpd,
      kodeTargetTujuanOpd: requestValues.kodeTargetTujuanOpd,
      realisasi: numericReal,
      tahun,
      bulan: parseInt(normalizedBulan, 10),
      kodeOpd: kodeOpd ?? '',
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
              Indikator:
            </p>
            <p className="w-full bg-gray-100 border rounded px-2 py-1 text-sm mb-2">
              {requestValues.indikator}
            </p>
            {requestValues.rumusPerhitungan && requestValues.rumusPerhitungan !== '-' && (
              <>
                <p className="uppercase text-xs font-bold text-gray-700 mb-1">
                  Rumus Perhitungan:
                </p>
                <p className="w-full bg-gray-100 border rounded px-2 py-1 text-sm mb-2">
                  {requestValues.rumusPerhitungan}
                </p>
              </>
            )}
            {requestValues.sumberData && requestValues.sumberData !== '-' && (
              <>
                <p className="uppercase text-xs font-bold text-gray-700 mb-1">
                  Sumber Data:
                </p>
                <p className="w-full bg-gray-100 border rounded px-2 py-1 text-sm mb-2">
                  {requestValues.sumberData}
                </p>
              </>
            )}
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
