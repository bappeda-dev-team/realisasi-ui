import { User } from '@/types';

// digunakan di UserContext untuk sign in dan mendapatkan user info
export async function authenticate(sessionId?: string): Promise<User> {
  const url = sessionId ? `/auth-api/user-info` : `/api/auth/user-info`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionId) headers["X-Session-Id"] = sessionId;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    let errMsg = "Failed to authenticate";
    try {
      const errJson = (await res.json()) as { message?: string };
      if (errJson?.message) errMsg = errJson.message;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return res.json();
}
