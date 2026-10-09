import { revalidateTag } from "next/cache";

/**
 * Reisen sofort neu laden (z. B. nach Änderungen im reise-CMS):
 *   POST /api/revalidate  Header: x-revalidate-secret: <REVALIDATE_SECRET>
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag("reisen", "max");
  return Response.json({ ok: true });
}
