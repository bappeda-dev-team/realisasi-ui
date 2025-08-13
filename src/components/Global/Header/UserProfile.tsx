import Login from './Login';
import { useUserContext } from "@/context/UserContext"

export default function () {
    const { user: user, loading: loading, error: error } = useUserContext();

    if (loading) {
        return <div className="p-5">Loading...</div>;
    }

    if (error) {
        return <Login />;
    }

    return (
        <div className="flex gap-3">
            <div className="d-grid gap-2 items-center">
            </div>
            <button className="border py-2 px-4 border-blue-700 rounded-md cursor-pointer">
                {user?.firstName}
            </button>
        </div>
    );
}
