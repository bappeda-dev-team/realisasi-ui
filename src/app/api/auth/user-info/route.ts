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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ message: "API URL belum dikonfigurasi." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/user-info`, {
    headers: { "X-Session-Id": sessionId },
    cache: "no-store",
  });

  const body = await resp.text();
  const contentType = resp.headers.get("content-type") ?? "application/json";

  return new Response(body, {
    status: resp.status,
    headers: { "Content-Type": contentType },
  });
}
