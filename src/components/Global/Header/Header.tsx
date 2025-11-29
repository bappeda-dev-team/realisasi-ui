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
import Login from "@/components/Global/Header/Login";
import FormLogin from "@/components/Global/Header/FormLogin";

export const Header = () => {
  const { user, loading, error, lastLoginAt } = useUserContext();
  const [ShowToastSuccess, setShowToastSuccess] = useState(false);
  const [ShowToastError, setShowToastError] = useState(false);
  const [ModalLogin, setModalLogin] = useState(false);

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
