import { cookies } from "next/headers";

function buildTargetUrl(reqUrl: string, baseUrl: string, path: string[]) {
  const incoming = new URL(reqUrl);
  const base = baseUrl.replace(/\/$/, "");
  const proxiedPath = path.map(encodeURIComponent).join("/");
  const target = new URL(`${base}/${proxiedPath}`);
  target.search = incoming.search;
  return target.toString();
}

async function proxy(req: Request, path: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return new Response(JSON.stringify({ message: "API URL belum dikonfigurasi." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  // Jika caller sudah mengirim X-Session-Id, biarkan.
  if (!req.headers.get("X-Session-Id") && sessionId) {
    headers.set("X-Session-Id", sessionId);
  }

  const method = req.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const targetUrl = buildTargetUrl(req.url, baseUrl, path);
  const resp = await fetch(targetUrl, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const respBody = await resp.arrayBuffer();
  const outHeaders = new Headers();
  const respContentType =
    resp.headers.get("content-type") ?? "application/json";
  outHeaders.set("Content-Type", respContentType);

  // Forward set-cookie agar sesi HttpOnly tersimpan di browser.
  const setCookie = resp.headers.get("set-cookie");
  if (setCookie) outHeaders.set("Set-Cookie", setCookie);

  return new Response(respBody, {
    status: resp.status,
    headers: outHeaders,
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}
