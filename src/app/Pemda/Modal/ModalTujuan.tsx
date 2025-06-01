'use client'

import { useState, useEffect } from "react";
import { ButtonRed, ButtonSky } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading/LoadingButton";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    id?: string;
}


export const ModalTujuanPemda: React.FC<modal> = ({ isOpen, onClose }) => {

    const [GambaranUmum, setGambaranUmum] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase">Realisasi - Nama Indikator</h1>
                    </div>
                    <form
                        // onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5 gap-2"
                    >
                        {/* 2020 */}
                        <div className="border border-gray-400 rounded-xl px-3 py-4">
                            <label className="p-1 font-bold text-center rounded-lg bg-red-500 text-white">2020</label>
                            <div className="flex items-center gap-1">
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Target:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">30</div>
                                </div>
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Realisasi:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">(input)</div>
                                </div>
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Satuan:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">%</div>
                                </div>
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Capaian:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">logic realisasi (otomatis)</div>
                                </div>
                            </div>
                        </div>
                        {/* 2021 */}
                        <div className="border border-gray-400 rounded-xl px-3 py-4">
                            <label className="p-1 font-bold text-center rounded-lg bg-red-500 text-white">2021</label>
                            <div className="flex items-center gap-1">
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Target:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">30</div>
                                </div>
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Realisasi:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">(input)</div>
                                </div>
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Satuan:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">%</div>
                                </div>
                                <div className="flex flex-col py-2 w-full">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 mb-2"
                                        htmlFor="gambaran_umum"
                                    >
                                        Capaian:
                                    </label>
                                    <div className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-200">logic realisasi (otomatis)</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                            <ButtonSky className="w-full" type="submit">
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menyimpan...
                                    </span>
                                    :
                                    "Simpan"
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full" type="button" onClick={onClose}>
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}