export const dynamic = "force-dynamic";

export function GET() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate" },
  });
}
