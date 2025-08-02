'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbBuildingFortress, TbBuilding, TbUserSquareRounded } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";

export const Header = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(true);

    const [Pemda, setPemda] = useState<boolean>(false);
    const [Opd, setOpd] = useState<boolean>(false);
    const [Individu, setIndividu] = useState<boolean>(false);

    const url = usePathname();
    const { branding } = useBrandingContext();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isVisible = prevScrollPos > currentScrollPos;

            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
        };
        window.addEventListener('scroll', handleScroll);

        if (url === '/') {
            setPemda(false);
            setOpd(false);
            setIndividu(false);
        }
        if (url === '/Pemda') {
            setPemda(true);
            setOpd(false);
            setIndividu(false);
        }
        if (url === '/Opd') {
            setPemda(false);
            setOpd(true);
            setIndividu(false);
        }
        if (url === '/Individu') {
            setPemda(false);
            setOpd(false);
            setIndividu(true);
        }
        setIsMobileMenuOpen(false);
        return () => window.removeEventListener('scroll', handleScroll);

    }, [prevScrollPos, url]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`inset-x-1 m-1 ml-2 bg-[#1C1D1D] shadow-lg shadow-slate-300 rounded-xl fixed left-0 top-0 z-50 transition duration-300`}>
            <div className="mx-auto flex md:justify-start justify-between gap-5 items-center px-4 py-3">
                <Link href="/">
                    <Image
                        src={branding.logo}
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </Link>
                <ul className="hidden md:flex space-x-6">
                    <Link href='/Pemda' className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 
                            ${Pemda ? "text-[#1C1D1D] bg-white" : "hover:text-black text-white hover:bg-white border border-white"}
                        `}
                    >
                        <TbBuildingFortress />
                        Pemda
                    </Link>
                    <Link href='/Opd' className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 
                            ${Opd ? "text-[#1C1D1D] bg-white" : "hover:text-black text-white hover:bg-white border border-white"}
                        `}
                    >
                        <TbBuilding />
                        Perangkat Daerah
                    </Link>
                    <Link href='/Individu' className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 
                            ${Individu ? "text-[#1C1D1D] bg-white" : "hover:text-black text-white hover:bg-white border border-white"}
                        `}
                    >
                        <TbUserSquareRounded />
                        Individu
                    </Link>
                </ul>
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className={`focus:outline-none cursor-pointer rounded-lg p-1 border border-white text-white hover:text-[#1C1D1D] hover:bg-white`}
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className={`md:hidden rounded-lg bg-[#1C1D1D] text-white py-2 mt-1 absolute top-full left-0 w-full shadow-md transition ease-in-out duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <ul className="flex flex-col items-center space-y-2 mx-2">
                    <Link href='/Pemda' className={`w-full flex items-center justify-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 
                            ${Pemda ? "text-[#1C1D1D] bg-white" : "hover:text-black text-white hover:bg-white border border-white"}
                        `}
                    >
                        <TbBuildingFortress />
                        Pemda
                    </Link>
                    <Link href='/Opd' className={`w-full flex items-center justify-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 
                            ${Opd ? "text-[#1C1D1D] bg-white" : "hover:text-black text-white hover:bg-white border border-white"}
                        `}
                    >
                        <TbBuilding />
                        Perangkat Daerah
                    </Link>
                    <Link href='/Individu' className={`w-full flex items-center justify-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 
                            ${Individu ? "text-[#1C1D1D] bg-white" : "hover:text-black text-white hover:bg-white border border-white"}
                        `}
                    >
                        <TbUserSquareRounded />
                        Individu
                    </Link>
                </ul>
            </div>
        </nav>
    )
}
