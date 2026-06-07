import { createHash } from "crypto";
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

function readProgress(profileId) {
  const row = db.prepare("SELECT * FROM progress WHERE profileId = ?").get(profileId);
  return {
    profileId,
    currentNodeId: row.currentNodeId,
    unlockedNodeIds: JSON.parse(row.unlockedNodeIds),
    passedNodeIds: JSON.parse(row.passedNodeIds),
    scores: JSON.parse(row.scores),
    updatedAt: row.updatedAt,
  };
}

export async function GET(request) {
  const profile = verify(request);
  if (!profile) return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  return Response.json({ progress: readProgress(profile.id) });
}

export async function POST(request) {
  const profile = verify(request);
  if (!profile) return Response.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json();
  const progress = {
    currentNodeId: body.currentNodeId,
    unlockedNodeIds: body.unlockedNodeIds || [],
    passedNodeIds: body.passedNodeIds || [],
    scores: body.scores || {},
  };
  const now = new Date().toISOString();

  db.prepare(
    "UPDATE progress SET currentNodeId = ?, unlockedNodeIds = ?, passedNodeIds = ?, scores = ?, updatedAt = ? WHERE profileId = ?"
  ).run(
    progress.currentNodeId,
    JSON.stringify(progress.unlockedNodeIds),
    JSON.stringify(progress.passedNodeIds),
    JSON.stringify(progress.scores),
    now,
    profile.id
  );

  return Response.json({ progress: readProgress(profile.id) });
}
