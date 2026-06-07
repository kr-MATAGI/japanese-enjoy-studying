import { createHash, randomUUID } from "crypto";
import db from "../../lib/db";

export const runtime = "nodejs";

function verify(request) {
  const profileId = request.headers.get("x-profile-id");
  const key = request.headers.get("x-access-key");
  if (!profileId || !key) return null;
  const profile = db.prepare("SELECT * FROM profiles WHERE id = ?").get(profileId);
  if (!profile) return null;
  const expected = createHash("sha256").update(`${profile.id}:${profile.pinHash}`).digest("hex");
  return expected === key ? profile : null;
}

export async function POST(request) {
  const profile = verify(request);
  if (!profile) return Response.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { nodeId, score, total, passed } = await request.json();
  db.prepare("INSERT INTO attempts (id, profileId, nodeId, score, total, passed, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    randomUUID(),
    profile.id,
    nodeId,
    Number(score),
    Number(total),
    passed ? 1 : 0,
    new Date().toISOString()
  );

  return Response.json({ ok: true });
}
