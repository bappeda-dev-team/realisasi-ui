import React, { useState, useEffect } from "react";
import Login from './Login';
import { useUserContext } from "@/context/UserContext"
import { ToastError } from "@/components/Global/Alert";

export default function () {
    const [ShowToast, setShowToast] = useState(false);
    const { user: user, loading: loading, error: error } = useUserContext();

    useEffect(() => {
        if (error) {
            setShowToast(true);
        }
    }, [error]);

    if (loading) {
        return <div className="p-5">Loading...</div>;
    }

    if (error) {
        return (
            <>
                <Login autoOpen={true} />

                <ToastError
                    isOpen={ShowToast}
                    onClose={() => setShowToast(false)}
                    message="Silakan login kembali."
                />
            </>
        );
    }

    const roleColors: Record<string, string> = {
        super_admin: "bg-amber-100 text-amber-700",
        admin_opd: "bg-sky-100 text-sky-700",
        admin_kecamatan: "bg-sky-100 text-sky-700",
        reviewer: "bg-teal-100 text-teal-700",
        level_1: "bg-red-100 text-red-700",
        level_2: "bg-blue-100 text-blue-700",
        level_3: "bg-green-100 text-green-700",
        level_4: "bg-stone-100 text-stone-700",
        staff: "bg-stone-100 text-stone-700",
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-wrap gap-2 items-center">
                role aktif:
                {user?.roles?.map((role, i) => (
                    <span
                        key={i}
                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center justify-center border-2
                           ${roleColors[role] || "bg-gray-100 text-gray-700"}`} >
                        {role}
                    </span>
                ))}
            </div>
            <div className="border py-2 px-4 border-blue-700 rounded-md cursor-pointer">
                {user?.firstName}
            </div>
        </div>
    );
}
