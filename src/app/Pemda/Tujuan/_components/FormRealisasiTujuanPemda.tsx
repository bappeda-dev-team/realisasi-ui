import React, { useEffect, useState, useMemo } from 'react';
import { ButtonSky } from '@/components/Global/Button/button';
import { FormProps, TargetRealisasiCapaian, TujuanRequest, RealisasiTujuan } from '@/types';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { useSubmitData } from '@/hooks/useSubmitData'
import { getMonthKey } from '@/lib/months';
import { getSessionId, notifySessionExpired } from '@/lib/session';

const FormRealisasiTujuanPemda: React.FC<FormProps<TargetRealisasiCapaian[], RealisasiTujuan[]> & { tahun: number; bulan: string; bulanLabel?: string }> = ({
    requestValues,
    tahun,
    bulan,
    bulanLabel,
    onClose,
    onSuccess
}) => {
    const { submit, loading, error } = useSubmitData<RealisasiTujuan>({ url: `/api/v1/realisasi/tujuans` });
    const [Proses, setProses] = useState(false);
    const [formData, setFormData] = useState<TujuanRequest[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const normalizedBulan = getMonthKey(bulan);

    const filteredRequestValues = useMemo(() => 
        requestValues?.filter((item) => item.tahun === (tahun ?? new Date().getFullYear()).toString()) ?? [],
        [requestValues, tahun]
    );

    // fill data awal
useEffect(() => {
        const generatedFormData: TujuanRequest[] = filteredRequestValues.map((indikator) => {
            return ({
                targetRealisasiId: indikator.targetRealisasiId,
                tujuanId: indikator.tujuanId,
                visiMisi: indikator.visiMisi ?? '-',
                indikatorId: indikator.indikatorId,
                rumusPerhitungan: indikator.rumusPerhitungan ?? '-',
                sumberData: indikator.sumberData ?? '-',
                tahun: indikator.tahun,
                bulan: (indikator.bulan || normalizedBulan) ?? '',
                targetId: indikator.targetId,
                target: typeof indikator.target === 'string'
                    ? indikator.target.replace(',', '.')
                    : indikator.target,
                satuan: indikator.satuan,
                realisasi: indikator.realisasi,
                jenisRealisasi: 'NAIK',
                buktiPendukung: indikator.buktiPendukung ?? '',
                keteranganBuktiPendukung: indikator.keteranganBuktiPendukung ?? '',
            })
        });
        setFormData(generatedFormData);
    }, [filteredRequestValues, normalizedBulan]);

    const invalidRealisasiTargets = useMemo(
        () =>
            formData.filter((item) => {
                if (typeof item.realisasi !== "number") return true;
                if (!Number.isFinite(item.realisasi)) return true;
                return item.realisasi <= 0;
            }),
        [formData],
    );

    const convertToDisplayString = (value: number | '' | null | undefined): string => {
        if (value === '' || value === null || value === undefined) return '';
        return value.toString().replace('.', ',');
    };

    // handle saat berubah ?
    const handleChange = (indikatorId: string, tahun: string, targetId: string, value: string) => {
        const trimmed = value.trim();
        const normalizedValue = trimmed.replace(',', '.');
        const numericReal = trimmed === '' ? '' : parseFloat(normalizedValue);

        setFormData((prev) =>
            prev.map((item) =>
                item.indikatorId === indikatorId && item.tahun === tahun && item.targetId === targetId
                    ? { ...item, realisasi: isNaN(Number(numericReal)) || numericReal === '' ? '' : numericReal }
                    : item
            )
        );
    };

    const handleUploadFile = async (indikatorId: string, tahun: string, targetId: string, file: File) => {
        try {
            const sessionId = getSessionId();
            if (!sessionId) {
                alert("Sesi anda telah berakhir. Silakan login kembali.");
                return;
            }

            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch(`/api/v1/realisasi/tujuans/upload/file`, {
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
            const url = data.url;

            setFormData((prev) =>
                prev.map((item) =>
                    item.indikatorId === indikatorId && item.tahun === tahun && item.targetId === targetId
                        ? { ...item, buktiPendukung: url }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat mengunggah file");
        }
    };

    const handleKeteranganChange = (indikatorId: string, tahun: string, targetId: string, value: string) => {
        setFormData((prev) =>
            prev.map((item) =>
                item.indikatorId === indikatorId && item.tahun === tahun && item.targetId === targetId
                    ? { ...item, keteranganBuktiPendukung: value }
                    : item
            )
        );
    };

    // saat submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!normalizedBulan) {
            setValidationError('Bulan tidak valid. Silakan pilih bulan aktif terlebih dahulu.');
            return;
        }

        if (invalidRealisasiTargets.length > 0) {
            setValidationError("Realisasi harus diisi dengan angka lebih dari 0 untuk semua target sebelum menyimpan.");
            return;
        }

        setProses(true);

        const results: RealisasiTujuan[] = [];
        for (const item of formData) {
            const result = await submit(item);
            if (result) {
                results.push(result);
            } else {
                console.error("Gagal menyimpan:", item);
            }
        }

        if (results.length > 0) {
            onClose();
            onSuccess?.(results);
        } else {
            alert("Terjadi kesalahan saat menyimpan semua data.");
        }
        setProses(false);
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
                                value={convertToDisplayString(formData.find((f) => f.indikatorId === ind.indikatorId && f.tahun === ind.tahun && f.targetId === ind.targetId)?.realisasi ?? null)}
                                onChange={(e) => handleChange(ind.indikatorId, ind.tahun, ind.targetId, e.target.value)}
                            />
                            <p className="uppercase text-xs font-bold text-gray-700 mb-2">
                                Satuan:
                            </p>
                            <p className="w-full bg-gray-300 border rounded px-2 py-1 text-sm mb-1">{ind.satuan ?? ''}</p>
                            
                            <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="fileUpload">
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
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleUploadFile(ind.indikatorId, ind.tahun, ind.targetId, e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                                {(() => {
                                    const fileUrl = formData.find((f) => f.indikatorId === ind.indikatorId && f.tahun === ind.tahun && f.targetId === ind.targetId)?.buktiPendukung;
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

                            <label className="uppercase text-xs font-bold text-gray-700 mb-2" htmlFor="keteranganUpload">
                                Keterangan Bukti Pendukung:
                            </label>
                            <textarea
                                className="w-full border rounded px-2 py-1 text-sm mb-1"
                                rows={2}
                                value={formData.find((f) => f.indikatorId === ind.indikatorId && f.tahun === ind.tahun && f.targetId === ind.targetId)?.keteranganBuktiPendukung ?? ''}
                                onChange={(e) => handleKeteranganChange(ind.indikatorId, ind.tahun, ind.targetId, e.target.value)}
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
