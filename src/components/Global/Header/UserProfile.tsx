'use client'

import { useEffect, useState } from 'react';
import Login from './Login';
import { authenticate } from '@/lib/auth';
import { User } from '@/types'

export default function () {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authenticate(); // <--- pakai fungsi langsung
                setUser(user);
            } catch (err) {
                console.error('Autentikasi gagal', err);
                setError('Gagal autentikasi');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div className="p-5">Loading...</div>;
    }

    if (error) {
        console.error('Autentikasi gagal', error);
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
