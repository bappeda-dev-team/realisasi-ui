import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { useSubmitData } from '@/hooks/useSubmitData';
import { FormProps, SasaranOpdTargetRealisasiCapaian, SasaranOpdRealisasi, SasaranOpdRealisasiRequest } from '@/types';
import React, { useEffect, useState } from 'react';

const FormRealisasiSasaranOpd: React.FC<FormProps<SasaranOpdTargetRealisasiCapaian[], SasaranOpdRealisasi[]> & { tahun: number; bulanLabel?: string }> = ({
    requestValues,
    onClose,
    onSuccess,
    tahun,
    bulanLabel
}) => {
    const { url } = useApiUrlContext();
    const { submit, loading, error } = useSubmitData<SasaranOpdRealisasi[]>({ url: `${url}/api/v1/realisasi/sasaran_opd/batch` });
    const [Proses, setProses] = useState(false);
    const [formData, setFormData] = useState<SasaranOpdRealisasiRequest[]>([]);

// fill data awal
    useEffect(() => {
        if (requestValues) {
            const generatedFormData: SasaranOpdRealisasiRequest[] = requestValues.map((indikator) => {
                return ({
                    targetRealisasiId: indikator.targetRealisasiId,
                    sasaranId: indikator.sasaranId.toString(),
                    indikatorId: indikator.indikatorId,
                    targetId: indikator.targetId,
                    target: typeof indikator.target === 'string' 
                        ? indikator.target.replace(',', '.') 
                        : indikator.target,
                    realisasi: indikator.realisasi,
                    satuan: indikator.satuan,
                    tahun: indikator.tahun,
                    bulan: bulanLabel ?? '',
                    jenisRealisasi: 'NAIK',
                    kodeOpd: indikator.kodeOpd
                })
            }
            );
            setFormData(generatedFormData);
        }
    }, [requestValues, bulanLabel]);

    const convertToDisplayString = (value: number | null): string => {
        if (value === null || value === undefined) return '';
        return value.toString().replace('.', ',');
    };

    // handle saat berubah ?
    const handleChange = (indikatorId: string, tahun: string, value: string) => {
        // Allow empty input (store as null) and accept comma decimals.
        const trimmed = value.trim();
        const normalizedValue = trimmed.replace(',', '.');

        let numericReal: number | null = null;
        if (trimmed !== '') {
            const parsed = parseFloat(normalizedValue);
            numericReal = Number.isNaN(parsed) ? null : parsed;
        }

        setFormData((prev) =>
            prev.map((item) =>
                item.indikatorId === indikatorId && item.tahun === tahun
                    ? { ...item, realisasi: numericReal }
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm">
                    {requestValues?.map((ind) => (
                        <div key={ind.targetRealisasiId ?? ind.targetId} className="border p-2 rounded bg-gray-50 shadow-sm flex flex-col col-span-2">
                            <div className="text-center text-xs font-semibold bg-red-500 text-white rounded py-0.5 mb-1">
                                {tahun} - {bulanLabel}
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

export default FormRealisasiSasaranOpd;
