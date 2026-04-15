import { User } from '@/types';

// digunakan di UserContext untuk sign in dan mendapatkan user info
export async function authenticate(sessionId: string): Promise<User> {
    const res = await fetch(`/auth-api/user-info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId
        },
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to authenticate (HTTP ${res.status})`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        throw new Error("Invalid auth response");
    }

    return res.json();
}
