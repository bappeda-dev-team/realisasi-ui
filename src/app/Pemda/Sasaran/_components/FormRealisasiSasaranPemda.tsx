import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { useSubmitData } from '@/hooks/useSubmitData';
import { FormProps, RealisasiSasaran, TargetRealisasiCapaianSasaran, SasaranRequest } from '@/types';
import React, { useEffect, useState, useMemo } from 'react';

const FormRealisasiSasaranPemda: React.FC<FormProps<TargetRealisasiCapaianSasaran[], RealisasiSasaran[]> & { tahun: number }> = ({
    requestValues,
    tahun,
    onClose,
    onSuccess
}) => {
    const { url } = useApiUrlContext();
    const { submit, loading, error } = useSubmitData<RealisasiSasaran[]>({ url: `${url}/api/v1/realisasi/sasarans/batch` });
    const [Proses, setProses] = useState(false);
    const [formData, setFormData] = useState<SasaranRequest[]>([]);

    const filteredRequestValues = useMemo(() => 
        requestValues?.filter((item) => item.tahun === tahun.toString()) ?? [],
        [requestValues, tahun]
    );

    // fill data awal
    useEffect(() => {
        const generatedFormData: SasaranRequest[] = filteredRequestValues.map((indikator) => {
            return ({
                targetRealisasiId: indikator.targetRealisasiId,
                sasaranId: indikator.sasaranId,
                indikatorId: indikator.indikatorId,
                targetId: indikator.targetId,
                target: typeof indikator.target === 'string'
                    ? indikator.target.replace(',', '.')
                    : indikator.target,
                realisasi: indikator.realisasi,
                satuan: indikator.satuan,
                tahun: indikator.tahun,
                jenisRealisasi: 'NAIK',
            })
        });
        setFormData(generatedFormData);
    }, [filteredRequestValues]);

    const convertToDisplayString = (value: number | null): string => {
        if (value === null || value === undefined) return '';
        return value.toString().replace('.', ',');
    };

    // handle saat berubah ?
const handleChange = (indikatorId: string, tahun: string, value: string) => {
        const normalizedValue = value.replace(',', '.');
        const numericReal = value === '' ? 0 : parseFloat(normalizedValue);

        setFormData((prev) =>
            prev.map((item) =>
                item.indikatorId === indikatorId && item.tahun === tahun
                    ? { ...item, realizesi: isNaN(numericReal) ? 0 : numericReal }
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
            onClose();
            onSuccess?.(result)
        } else {
            alert("Terjadi kesalahan")
            console.error("Submission failed:", error);
        }
        setProses(loading);
    };

    // ambil indikator pertama (soalnya sama) untuk petunjuk ini indikator apa
    const indikator = filteredRequestValues && filteredRequestValues.length > 0 ? filteredRequestValues[0].indikator : ''

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div className="mb-4">
                <h3 className="font-bold">Indikator: {indikator}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm">
                    {filteredRequestValues?.map((ind) => (
                        <div key={ind.targetRealisasiId ?? ind.targetId} className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col col-span-2">
                            <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                                {ind.tahun}
                            </div>
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">
                                Target:
                            </p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{ind.target ?? ''}</p>
                            <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="realisasi" >
                                Realisasi:
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded px-2 py-1 text-sm mb-1"
                                name={`realisasi[${ind.targetRealisasiId}][${ind.tahun}]`}
                                value={convertToDisplayString(formData.find((f) => f.indikatorId === ind.indikatorId && f.tahun === ind.tahun)?.realisasi ?? null)}
                                onChange={(e) => handleChange(ind.indikatorId, ind.tahun, e.target.value)}
                            />
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">
                                Satuan:
                            </p>
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

export default FormRealisasiSasaranPemda;
