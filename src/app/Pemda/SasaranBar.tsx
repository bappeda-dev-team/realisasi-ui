'use client'

import { useState, useEffect } from "react";
import { TbArrowBadgeDownFilled, TbPencil, TbTrash } from "react-icons/tb";
import { ButtonGreenBorder, ButtonRedBorder } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading/LoadingButton";

const SasaranBar = () => {

    const [Show, setShow] = useState<boolean>(false);

    const [Loading, setLoading] = useState<boolean>(false);

    return (
        <div className="flex flex-col m-2">
            <div
                className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${Show ? "bg-emerald-500 text-white" : ""}`}
                onClick={() => setShow((prev) => !prev)}
            >
                <h1 className="font-semibold">Tematik - Tematik Pertama</h1>
                <div className="flex items-center">
                    <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl`} />
                </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out border-x border-b  border-emerald-500 ${Show ? "opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                <div className="overflow-auto rounded-t-xl border border-emerald-500">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xm bg-emerald-500 text-white">
                                <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[50px] text-center">No</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Strategic Pemda</td>
                                <td rowSpan={2} colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Sasaran Pemda</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Rumus Perhitungan</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Sumber Data</td>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">2020</th>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">2021</th>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">2022</th>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">2023</th>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">2024</th>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">2025</th>
                            </tr>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Pembanding</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Pembanding</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Pembanding</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Pembanding</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Pembanding</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Pembanding</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">1</td>
                                <td className="px-6 py-4 border-r border-emerald-500">Meningkatnya proses produksi beras bulog</td>
                                <td className="px-6 py-4 border-r border-emerald-500">Realisasi swasembada pangan nasional tahun 2025</td>
                                <td className="px-6 py-4 border-r border-emerald-500">
                                    <div className="flex flex-col gap-2">
                                        <ButtonGreenBorder
                                            className="flex items-center gap-1"
                                            // disabled={Loading}
                                            onClick={() => setLoading((prev) => !prev)}
                                        >
                                            {Loading ?
                                                <LoadingButtonClip />
                                                :
                                                <TbPencil />
                                            }
                                            Realisasi
                                        </ButtonGreenBorder>
                                        <ButtonRedBorder
                                            className="flex items-center gap-1"
                                        >
                                            <TbTrash />
                                            Hapus
                                        </ButtonRedBorder>
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-r border-emerald-500">Tingkat produksi petani setiap daerah</td>
                                <td className="px-6 py-4 border-r border-emerald-500">Presentase hasil produksi</td>
                                <td className="px-6 py-4 border-r border-emerald-500">Bulog</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                                <td className="px-6 py-4 border-r border-emerald-500 text-center">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SasaranBar;