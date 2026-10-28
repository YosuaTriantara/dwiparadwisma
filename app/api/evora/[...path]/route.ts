import { NextRequest, NextResponse } from "next/server";

const EVORA_BACKEND_URL =
  process.env.EVORA_API_URL ||
  process.env.NEXT_PUBLIC_EVORA_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.events.my.id"
    : "http://localhost:8080");

async function handleProxy(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const params = await Promise.resolve(context.params);
  const path = (params.path || []).join("/");
  const search = request.nextUrl.search;
  const backendBase = EVORA_BACKEND_URL.replace(/\/$/, "");
  const targetUrl = `${backendBase}/${path}${search}`;

  // Salin header yang relevan dari request
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // Jangan teruskan host, connection, atau content-length agar fetch menghitungnya sendiri
    if (
      lowerKey !== "host" &&
      lowerKey !== "connection" &&
      lowerKey !== "content-length"
    ) {
      forwardHeaders.set(key, value);
    }
  });

  // Baca body jika ada (untuk method POST/PUT/PATCH)
  let body: ArrayBuffer | undefined = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength > 0) {
        body = buffer;
      }
    } catch {
      body = undefined;
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers(res.headers);

    // Hapus header CORS ganda dari server backend lokal yang menyebabkan error browser
    responseHeaders.delete("access-control-allow-origin");
    responseHeaders.delete("Access-Control-Allow-Origin");
    responseHeaders.delete("access-control-allow-credentials");
    responseHeaders.delete("Access-Control-Allow-Credentials");

    const data = await res.arrayBuffer();

    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[EVORA Proxy Error] ${request.method} ${targetUrl}:`, error.message);
    return NextResponse.json(
      {
        error: `Gagal terhubung ke backend EVORA (${targetUrl}): ${error.message}`,
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;

