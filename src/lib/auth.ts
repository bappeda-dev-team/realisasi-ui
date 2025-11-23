import { User } from '@/types';

// digunakan di UserContext untuk sign in dan mendapatkan user info
export async function authenticate(sessionId: string): Promise<User> {
    const res = await fetch(`/auth-api/user-info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId
        },
    });

    if (!res.ok) {
        throw new Error('Failed to authenticate');
    }

    return res.json();
}
