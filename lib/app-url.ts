/**
 * URL pública de la app, detectada de la petición entrante cuando es posible.
 * Funciona con localhost, dominios propios, Vercel y túneles (ngrok) sin tocar env vars.
 */
export function getAppUrl(request?: Request): string {
  if (request) {
    const headers = request.headers;
    const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || headers.get("host");
    const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

    if (host) {
      const proto =
        forwardedProto ||
        (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https");
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL;
  return (configured || "http://localhost:3000").replace(/\/$/, "");
}
