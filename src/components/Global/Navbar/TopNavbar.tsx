'use client'

import Image from "next/image";
import { useBrandingContext } from "@/context/BrandingContext";
import UserProfile from "@/components/Global/Header/UserProfile";

export default function TopNavbar() {
    const { branding } = useBrandingContext();

    return (
        <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between text-sm">
            <div className="flex gap-2 items-center">
                <Image
                    src={branding.logo}
                    alt="logo"
                    width={40}
                    height={40}
                />
                <div className="d-grid gap-2 items-center">
                    <h3>{branding.title}</h3>
                    <h5>{branding.client}</h5>
                </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
                <UserProfile />
            </div>
        </nav>
    )
}
