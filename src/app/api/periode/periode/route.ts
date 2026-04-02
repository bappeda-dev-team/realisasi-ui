import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) {
    return new Response(JSON.stringify({ message: "Silakan login." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_PERIODE_URL;
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ message: "API periode URL belum dikonfigurasi." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const resp = await fetch(`${baseUrl}/periode`, {
    headers: { "X-Session-Id": sessionId },
  });

  const body = await resp.text();
  return new Response(body, {
    status: resp.status,
    headers: { "Content-Type": "application/json" },
  });
}
