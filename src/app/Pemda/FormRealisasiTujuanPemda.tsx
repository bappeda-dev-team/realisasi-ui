import React, { useEffect, useState } from 'react';
import { ButtonSky } from '@/components/Global/Button/button';
import { FormProps, TujuanPemda, TujuanRequest } from '@/types';
import { LoadingButtonClip } from '@/components/Global/Loading';

interface RealisasiFormItem {
  indikatorId: string;
  tahun: string;
  target: number;
  satuan: string;
  realisasi: number;
  tujuanId: string;
  jenisRealisasi: 'NAIK' | 'TURUN';
}

const FormRealisasiTujuanPemda: React.FC<FormProps<TujuanPemda, TujuanRequest>> = ({ requestValues, onClose }) => {
  const [Proses, setProses] = useState(false);
  const [formData, setFormData] = useState<RealisasiFormItem[]>([]);

  useEffect(() => {
    if (requestValues) {
      const generatedFormData: RealisasiFormItem[] = requestValues.indikator.flatMap((indikator) =>
        indikator.target.map((t) => ({
          indikatorId: indikator.id,
          tahun: t.tahun,
          target: parseFloat(t.target),
          satuan: t.satuan,
          realisasi: 0,
          tujuanId: requestValues.id.toString(),
          jenisRealisasi: 'NAIK',
        }))
      );
      setFormData(generatedFormData);
    }
  }, [requestValues]);

  const handleChange = (index: number, value: number) => {
    setFormData((prev) => {
      const updated = [...prev];
      updated[index].realisasi = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProses(true);
    try {
      console.log(formData); // Replace with API call
    } finally {
      setProses(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
      {requestValues?.indikator.map((ind) => (
        <div key={ind.id} className="mb-4">
          <h3 className="font-bold">Indikator: {ind.indikator}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-2 text-sm">
            {ind.target.map((t) => {
              const index = formData.findIndex(
                (fd) => fd.indikatorId === ind.id && fd.tahun === t.tahun
              );
              const data = formData[index];
              return (
                <div key={t.tahun} className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col">
                  <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                    {t.tahun}
                  </div>
                  <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="target" >
                    Target:
                  </label>
                  <input type="number" className="w-full border rounded px-2 py-1 text-sm mb-1"
                    value={data?.target ?? ''}
                    onChange={(e) => handleChange(index, parseFloat(e.target.value))}
                    readOnly />
                  <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="target" >
                    Realisasi:
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-sm mb-1"
                    value="0"
                    onChange={(e) => handleChange(index, parseFloat(e.target.value))}
                  />
                  <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="target" >
                    Satuan:
                  </label>
                  <p className="w-full border rounded px-2 py-1 text-sm mb-1">{data?.satuan ?? ''}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <ButtonSky className="w-full mt-3" type="submit">
        {Proses ? (
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

export default FormRealisasiTujuanPemda;
