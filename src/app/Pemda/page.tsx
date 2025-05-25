'use client'

import React, { useState } from "react";
import TableTujuan from "./TableTujuan";
import TableIku from "./TableIku";

const Pemda = () => {

    const [Tujuan, setTujuan] = useState<boolean>(true);
    const [Sasaran, setSasaran] = useState<boolean>(false);
    const [Iku, setIku] = useState<boolean>(false);

    const handleTujuan = () => {
        setTujuan(true);
        setSasaran(false);
        setIku(false);
    }
    const handleSasaran = () => {
        setTujuan(false);
        setSasaran(true);
        setIku(false);
    }
    const handleIku= () => {
        setTujuan(false);
        setSasaran(false);
        setIku(true);
    }

    return(
        <div className="flex flex-col">
            <div className="w-full flex flex-wrap items-center justify-start gap-2">
                <button 
                    onClick={handleTujuan}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Tujuan ? "bg-red-400 text-white border-red-400" : "text-[#1C1D1D] hover:bg-red-600 hover:text-white"}`}
                >
                    Tujuan
                </button>
                <button 
                    onClick={handleSasaran}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Sasaran ? "bg-green-600 text-white border-green-600" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    Sasaran
                </button>
                <button 
                    onClick={handleIku}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Iku ? "bg-sky-600 text-white border-sky-600" : "text-[#1C1D1D] hover:bg-sky-800 hover:text-white"}`}
                >
                    IKU
                </button>
            </div>
            <div className="mt-2">
                {Tujuan &&
                    <div className="transition-all ease-in-out duration-500">
                        <TableTujuan />
                    </div>
                }
                {Sasaran &&
                    <div className="transition-all ease-in-out duration-500">
                        Halaman Sasaran
                    </div>
                }
                {Iku &&
                    <div className="transition-all ease-in-out duration-500">
                        <TableIku />
                    </div>
                }
            </div>
        </div>
    )
}

export default Pemda;