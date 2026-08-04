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

    const raw = (await res.json()) as Partial<User>;

    // Normalisasi response user-info agar selalu memiliki field yang
    // dibutuhkan aplikasi, terutama untuk user level 1-3 di production
    // yang hanya mengirim username, firstName, kode_opd, nip, dan roles
    // (role Keycloak default, tanpa level_*).
    return {
        ...raw,
        id: raw.id || raw.username,
        username: raw.username || "",
        firstName: raw.firstName || raw.username || "",
        lastName: raw.lastName || "",
        roles: raw.roles || [],
    } as User;
}
