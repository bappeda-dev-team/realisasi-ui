import React, { useState } from 'react';
import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { getMonthKey } from '@/lib/months';
import { useSubmitData } from '@/hooks/useSubmitData';
import { SasaranOpdFaktorPenghambatResponse, SasaranOpdFaktorPenghambatPayload } from '@/types';

interface FormFaktorPenghambatSasaranOpdProps {
  kodeOpd: string;
  kodeSasaranOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  currentValue: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FormFaktorPenghambatSasaranOpd: React.FC<FormFaktorPenghambatSasaranOpdProps> = ({
  kodeOpd,
  kodeSasaranOpd,
  kodeIndikator,
  kodeTarget,
  tahun,
  bulan,
  currentValue,
  onClose,
  onSuccess,
}) => {
  const { url } = useApiUrlContext();
  const { submit, loading } = useSubmitData<SasaranOpdFaktorPenghambatResponse>({ url: `${url}/api/v1/realisasi/sasaran_opd/faktor-penghambat` });
  const [value, setValue] = useState(currentValue);

  const normalizedBulan = getMonthKey(bulan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedBulan) {
      alert('Bulan tidak valid.');
      return;
    }

    const payload: SasaranOpdFaktorPenghambatPayload = {
      kodeOpd,
      kodeSasaranOpd,
      kodeIndikator,
      kodeTarget,
      tahun,
      bulan: normalizedBulan,
      faktorPenghambat: value,
    };

    const result = await submit(payload);

    if (result) {
      onSuccess();
    } else {
      alert('Terjadi kesalahan saat menyimpan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="uppercase text-xs font-bold text-gray-700">
        Faktor Penghambat
      </label>
      <textarea
        className="w-full border rounded px-2 py-1 text-sm min-h-[100px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Masukkan faktor penghambat..."
      />
      <ButtonSky className="w-full mt-3" type="submit" disabled={loading}>
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

export default FormFaktorPenghambatSasaranOpd;
