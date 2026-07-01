"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TbBuildingFortress,
  TbBuilding,
  TbUserSquareRounded,
  TbReport
} from "react-icons/tb";
import UserProfile from "@/components/Global/Header/UserProfile";
import TopFilter from "@/components/Global/Header/TopFilter";
import { useUserContext } from "@/context/UserContext";
import { ToastSuccess, ToastError } from "@/components/Global/Alert";
import Login from "@/components/Global/Header/Login";
import FormLogin from "@/components/Global/Header/FormLogin";
import { getAccessibleMenus } from "@/lib/rbac";

export const Header = () => {
  const { user, loading, error, lastLoginAt } = useUserContext();
  const pathname = usePathname();
  const [ShowToastSuccess, setShowToastSuccess] = useState(false);
  const [ShowToastError, setShowToastError] = useState(false);
  const [ModalLogin, setModalLogin] = useState(false);
  const [laporanDropdown, setLaporanDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLaporanDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SUCCESS: hanya ketika login baru
  useEffect(() => {
    if (lastLoginAt) {
      setShowToastSuccess(true);
      setShowToastError(false);
      setModalLogin(false);
    }
  }, [lastLoginAt]);

  // ERROR: hanya ketika user sudah login lalu session invalid
  useEffect(() => {
    if (error && user === null) {
      setShowToastError(true);
      setModalLogin(true);
      setShowToastSuccess(false);
    }
  }, [error]);

  return (
    <>
      <TopFilter user={user} disableOpdLock={pathname.startsWith('/Individu/')} />
      <nav
        className={`inset-x-1 m-1 ml-2 bg-[#1C1D1D] shadow-lg shadow-slate-300 rounded-xl transition duration-300`}
      >
        <div className="mx-auto flex md:justify-start justify-between gap-5 items-center px-4 py-3">
          {user && (
            <ul className="hidden md:flex space-x-6">
              {getAccessibleMenus(user).map((menu) => {
                const isActive =
                  pathname === menu.href || pathname.startsWith(`${menu.href}/`);

                if (menu.href === '/Laporan') {
                  return (
                    <div key={menu.href} className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setLaporanDropdown(!laporanDropdown)}
                        className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 border border-white transition-colors duration-200 ${
                          isActive
                            ? "bg-white text-black"
                            : "text-white hover:text-black hover:bg-white"
                        }`}
                      >
                        <TbReport />
                        {menu.name}
                      </button>
                      {laporanDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-40 bg-[#1C1D1D] rounded-xl shadow-lg py-2 z-50 text-white border border-gray-600">
                          <Link
                            href="/Laporan/Pemda"
                            onClick={() => setLaporanDropdown(false)}
                            className="block px-4 py-2 hover:bg-white hover:text-black font-semibold transition-colors"
                          >
                            Pemda
                          </Link>
                          <Link
                            href="/Laporan/Opd"
                            onClick={() => setLaporanDropdown(false)}
                            className="block px-4 py-2 hover:bg-white hover:text-black font-semibold transition-colors"
                          >
                            OPD
                          </Link>
                          <Link
                            href="/Laporan/Individu"
                            onClick={() => setLaporanDropdown(false)}
                            className="block px-4 py-2 hover:bg-white hover:text-black font-semibold transition-colors"
                          >
                            Individu
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 border border-white transition-colors duration-200 ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white hover:text-black hover:bg-white"
                    }`}
                  >
                    {menu.href === '/Pemda' && <TbBuildingFortress />}
                    {menu.href === '/Opd' && <TbBuilding />}
                    {menu.href === '/Individu' && <TbUserSquareRounded />}
                    {menu.name}
                  </Link>
                );
              })}
            </ul>
          )}
          <div className="flex items-center gap-6 ml-auto">
            {loading && <div className="p-5">Loading...</div>}

            {!loading && !user && <Login onClick={() => setModalLogin(true)} />}

            {!loading && user && <UserProfile user={user} />}
          </div>
        </div>
        <ToastSuccess
          isOpen={ShowToastSuccess}
          onClose={() => setShowToastSuccess(false)}
          message="Login berhasil! Selamat datang 👋"
        />
        <ToastError
          isOpen={ShowToastError}
          onClose={() => setShowToastError(false)}
          message="Silakan login kembali."
        />

        {ModalLogin && (
          <FormLogin
            onClose={() => setModalLogin(false)}
            onSuccess={() => setModalLogin(false)}
          />
        )}
      </nav>
    </>
  );
};
