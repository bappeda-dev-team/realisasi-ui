import React, { useEffect, useState } from 'react';
import { ButtonSky } from '@/components/Global/Button/button';
import { FormProps, TargetRealisasiCapaian, TujuanRequest, RealisasiTujuan } from '@/types';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useSubmitData } from '@/hooks/useSubmitData'
import { useApiUrlContext } from '@/context/ApiUrlContext';

const FormRealisasiTujuanPemda: React.FC<FormProps<TargetRealisasiCapaian[], TujuanRequest>> = ({ requestValues, onClose }) => {
  const { url, token } = useApiUrlContext();
  const { submit, loading, error } = useSubmitData<RealisasiTujuan>({ url: `${url}/api/v1/realisasi/tujuans/batch`, token });
  const [Proses, setProses] = useState(false);
  const [formData, setFormData] = useState<TujuanRequest[]>([]);
  const [data, setData] = useState<RealisasiTujuan[]>([]);

  // fill data awal
  useEffect(() => {
    if (requestValues) {
      const generatedFormData: TujuanRequest[] = requestValues.map((indikator) => {
        return ({
          tujuanId: indikator.tujuanId,
          indikatorId: indikator.indikatorId,
          tahun: indikator.tahun,
          target: indikator.target,
          satuan: indikator.satuan,
          realisasi: indikator.realisasi,
          jenisRealisasi: 'NAIK',
        })
      }
      );
      setFormData(generatedFormData);
    }
  }, [requestValues]);

  // handle saat berubah ?
  const handleChange = (indikatorId: string, tahun: string, value: string) => {
    const numericReal = parseFloat(value)

    setFormData((prev) =>
      prev.map((item) =>
        item.indikatorId === indikatorId && item.tahun === tahun
          ? { ...item, realisasi: isNaN(numericReal) ? 0 : numericReal }
          : item
      )
    );
  };

  // saat submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProses(loading);

    const result = await submit(formData)

    if (result) {
      console.log("Successfully submitted:", result); // Handle success (e.g., notify user, close modal, etc.)
      onClose();
      setData((prev) => [...prev, result])
    } else {
      console.error("Submission failed:", error); // Handle error
    }
    setProses(loading);
  };

  // ambil indikator pertama (soalnya sama) untuk petunjuk ini indikator apa
  const indikator = requestValues ? requestValues[0].indikator : ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
      <div className="mb-4">
        <h3 className="font-bold">Indikator: {indikator}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-2 text-sm">
          {requestValues?.map((ind) => (
            <div key={ind.targetRealisasiId} className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col">
              <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                {ind.tahun}
              </div>
              <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="target" >
                Target:
              </label>
              <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{ind.target ?? ''}</p>
              <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="target" >
                Realisasi:
              </label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 text-sm mb-1"
                step="0.01"
                value={
                  formData.find((f) => f.indikatorId === ind.indikatorId && f.tahun === ind.tahun)?.realisasi ?? 0
                }
                onChange={(e) => handleChange(ind.indikatorId, ind.tahun, e.target.value)}
              />
              <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="target" >
                Satuan:
              </label>
              <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{ind.satuan ?? ''}</p>
            </div>
          ))}
        </div>
      </div>
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
