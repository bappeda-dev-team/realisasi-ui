"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastError } from "@/components/Global/Alert";

export const NetworkErrorListener = () => {
    const [toast, setToast] = useState({ show: false, message: "" });

    const handleClose = useCallback(() => {
        setToast({ show: false, message: "" });
    }, []);

    useEffect(() => {
        const handler = () => {
            setToast({
                show: true,
                message: "Koneksi atau jaringan Anda lemah atau terputus.",
            });
        };

        window.addEventListener("network:error", handler);
        return () => window.removeEventListener("network:error", handler);
    }, []);

    return (
        <ToastError
            isOpen={toast.show}
            onClose={handleClose}
            message={toast.message}
            duration={5000}
        />
    );
};
