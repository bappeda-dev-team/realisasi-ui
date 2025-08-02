'use client'

import { TbLogin } from "react-icons/tb";

export default function () {
    return (
        <div>
            <button className="flex flex-inline items-center gap-3 border border-blue-300 p-3 rounded-md cursor-pointer"
                onClick={() => alert('login clicked')}
            >
                <TbLogin />
                LOGIN
            </button>
        </div>
    )
}
