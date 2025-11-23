import React, { useState, useEffect } from "react";
import FormLogin from "./FormLogin";
import { TbLogin } from "react-icons/tb";
import { ToastSuccess } from "@/components/Global/Alert";

export default function LoginButton({ autoOpen = false }) {
    const [ModalLogin, setModalLogin] = useState(false);
    const [ShowToast, setShowToast] = useState(false);

    useEffect(() => {
        if (autoOpen) {
            setModalLogin(true)
        }
    }, [autoOpen])

    return (
        <div>
            <button
                className="flex items-center gap-3 border border-blue-300 p-3 rounded-md cursor-pointer"
                onClick={() => setModalLogin(true)}
            >
                <TbLogin />
                LOGIN
            </button>

            {ModalLogin && (
                <FormLogin
                    onClose={() => setModalLogin(false)}
                    onSuccess={() => setShowToast(true)}
                />
            )}

            <ToastSuccess
                isOpen={ShowToast}
                onClose={() => setShowToast(false)}
                message="Login berhasil! Selamat datang 👋"
            />
        </div>
    );
}
