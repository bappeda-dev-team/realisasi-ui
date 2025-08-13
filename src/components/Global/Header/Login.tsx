import { TbLogin } from "react-icons/tb";
import { useApiUrlContext } from '@/context/ApiUrlContext';

export default function () {
    const { authUrl } = useApiUrlContext();
    return (
        <div>
            <button className="flex flex-inline items-center gap-3 border border-blue-300 p-3 rounded-md cursor-pointer"
                onClick={() => window.location.href = authUrl}
            >
                <TbLogin />
                LOGIN
            </button>
        </div>
    )
}
