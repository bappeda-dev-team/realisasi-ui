'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout(): Promise<void> {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if (sessionId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            headers: { "X-Session-Id": sessionId }
        })
    }

    cookieStore.delete("sessionId")

    redirect("/")
}