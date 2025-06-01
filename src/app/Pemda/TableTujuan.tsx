'use client'

import { ButtonGreenBorder, ButtonRedBorder } from "@/components/Global/Button/button";
import { TbPencil, TbCircleCheckFilled } from "react-icons/tb";
import { LoadingButtonClip } from "@/components/Global/Loading/LoadingButton";
import { ModalTujuanPemda } from "./Modal/ModalTujuan";
import { useState } from "react";

const TableTujuan = () => {

    const [Loading, setLoading] = useState<boolean>(false);
    
    // Modal
    const [OpenModal, setOpenModal] = useState<boolean>(false);

    return (
        <div className="overflow-auto mt-2 rounded-t-lg border border-red-400">
            <table className="w-full">
                <thead>
                    <tr className="text-white bg-red-400">
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center">No</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center">Tujuan</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Visi/Misi</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Indikator</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Aksi</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Rumus Perhitungan</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Sumber Data</th>
                        <th colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2020</th>
                        <th colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2021</th>
                        <th colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2022</th>
                        <th colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2023</th>
                        <th colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2024</th>
                        <th colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2025</th>
                        <th rowSpan={2} className="border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Keterangan</th>
                    </tr>
                    <tr className="text-white bg-red-500">
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>

                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>

                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>

                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>

                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>

                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan={3} className="border-b border-red-400 px-6 py-4 text-center">1</td>
                    </tr>
                    <tr>
                        <td className="border border-red-400 px-6 py-4 text-center">Tujuan Pemda Pertama</td>
                        <td className="border border-red-400 px-6 py-4 text-center">Visi & Misi</td>
                        <td className="border border-red-400 px-6 py-4 text-center">Indikator</td>
                        <td className="border border-red-400 px-6 py-4 text-center">
                            <div className="flex flex-col gap-2">
                                <ButtonGreenBorder
                                    className="flex items-center gap-1 cursor-pointer"
                                    // disabled={Loading}
                                    onClick={() => {
                                        setLoading((prev) => !prev);
                                        setOpenModal(true);
                                    }}
                                >
                                    {Loading ?
                                        <LoadingButtonClip />
                                        :
                                        <TbCircleCheckFilled />
                                    }
                                    Realisasi
                                </ButtonGreenBorder>
                            </div>
                        </td>
                        <td className="border border-red-400 px-6 py-4 text-center">Rumus Perhitungan</td>
                        <td className="border border-red-400 px-6 py-4 text-center">Sumber Data</td>

                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>

                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>

                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>

                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>

                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>
                        <td className="border border-red-400 px-6 py-4 text-center">-</td>

                        <td className="border-b border-red-400 px-6 py-4 text-center">Keterangan</td>
                    </tr>
                </tbody>
            </table>
            <ModalTujuanPemda 
                isOpen={OpenModal}
                onClose={() => {
                    setOpenModal(false);
                    setLoading(false);
                }}
            />
        </div>
    )
}
export default TableTujuan;