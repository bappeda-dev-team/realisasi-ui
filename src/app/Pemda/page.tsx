'use client'

import { useState } from "react";

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
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Tujuan ? "bg-[#00923F] text-white border-[#00923F]" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    Tujuan
                </button>
                <button 
                    onClick={handleSasaran}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Sasaran ? "bg-[#00923F] text-white border-[#00923F]" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    Sasaran
                </button>
                <button 
                    onClick={handleIku}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Iku ? "bg-[#00923F] text-white border-[#00923F]" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    IKU
                </button>
            </div>
            <div className="mt-2">
                {Tujuan &&
                    <>
                        Halaman Tujuan
                    </>
                }
                {Sasaran &&
                    <>
                        Halaman Sasaran
                    </>
                }
                {Iku &&
                    <>
                        Halaman Iku
                    </>
                }
            </div>
        </div>
    )
}

export default Pemda;