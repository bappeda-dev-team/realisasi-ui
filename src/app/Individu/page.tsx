'use client'

import { useState } from "react";

const Individu = () => {

    const [Renja, setRenja] = useState<boolean>(true);
    const [Renaksi, setRenaksi] = useState<boolean>(false);
    const [Rencana, setRencana] = useState<boolean>(false);

    const handleRenja = () => {
        setRenja(true);
        setRenaksi(false);
        setRencana(false);
    }
    const handleRenaksi = () => {
        setRenja(false);
        setRenaksi(true);
        setRencana(false);
    }
    const handleRencana= () => {
        setRenja(false);
        setRenaksi(false);
        setRencana(true);
    }

    return(
        <div className="flex flex-col">
            <div className="w-full flex flex-wrap items-center justify-start gap-2">
                <button 
                    onClick={handleRenja}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Renja ? "bg-[#00923F] text-white border-[#00923F]" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    Renja Individu
                </button>
                <button 
                    onClick={handleRenaksi}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Renaksi ? "bg-[#00923F] text-white border-[#00923F]" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    Renaksi Individu
                </button>
                <button 
                    onClick={handleRencana}
                    className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${Rencana ? "bg-[#00923F] text-white border-[#00923F]" : "text-[#1C1D1D] hover:bg-green-700 hover:text-white"}`}
                >
                    Rencana Kerja
                </button>
            </div>
            <div className="mt-2">
                {Renja &&
                    <>
                        Halaman Rencana Hasil Kerja Individu
                    </>
                }
                {Renaksi &&
                    <>
                        Halaman Rencana Aksi Individu
                    </>
                }
                {Rencana &&
                    <>
                        Halaman Rencana Kerja
                    </>
                }
            </div>
        </div>
    )
}

export default Individu;