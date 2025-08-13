'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { authenticate } from '@/lib/auth';
import { User } from '@/types'

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// context
const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    error: null,
});

export function UserProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authenticate();
                setUser(user);
            } catch (err) {
                setError('Gagal autentikasi');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUserContext must be used witihin a UserProvider")
    }
    return context;
}
