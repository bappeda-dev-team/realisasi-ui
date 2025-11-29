"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TbBuildingFortress,
  TbBuilding,
  TbUserSquareRounded,
} from "react-icons/tb";
import UserProfile from "@/components/Global/Header/UserProfile";
import TopFilter from "@/components/Global/Header/TopFilter";
import { useUserContext } from "@/context/UserContext";
import { ToastSuccess, ToastError } from "@/components/Global/Alert";

export const Header = () => {
  const { user, error } = useUserContext();
  const [ShowToastSuccess, setShowToastSuccess] = useState(false);
  const [ShowToastError, setShowToastError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowToastError(true);
    }

    if (user) {
      setShowToastSuccess(true);
    }
  }, [user, error]);

  return (
    <>
      <TopFilter user={user} />
      <nav
        className={`inset-x-1 m-1 ml-2 bg-[#1C1D1D] shadow-lg shadow-slate-300 rounded-xl transition duration-300`}
      >
        <div className="mx-auto flex md:justify-start justify-between gap-5 items-center px-4 py-3">
          {user && (
            <ul className="hidden md:flex space-x-6">
              <Link
                href="/Pemda"
                className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 hover:text-black text-white hover:bg-white border border-white`}
              >
                <TbBuildingFortress />
                Pemda
              </Link>
              <Link
                href="/Opd"
                className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 hover:text-black text-white hover:bg-white border border-white`}
              >
                <TbBuilding />
                Perangkat Daerah
              </Link>
              <Link
                href="/Individu"
                className={`flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 hover:text-black text-white hover:bg-white border border-white`}
              >
                <TbUserSquareRounded />
                Individu
              </Link>
            </ul>
          )}
          <div className="flex items-center gap-6 ml-auto">
            <UserProfile />
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
      </nav>
    </>
  );
};
