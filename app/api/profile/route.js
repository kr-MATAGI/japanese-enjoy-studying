import { createHash, randomUUID } from "crypto";
import db from "../../lib/db";
import { skillNodes } from "../../learningData";

export const runtime = "nodejs";

function hashPin(name, pin) {
  return createHash("sha256").update(`${name.trim().toLowerCase()}:${pin}`).digest("hex");
}

function accessKey(profileId, pinHash) {
  return createHash("sha256").update(`${profileId}:${pinHash}`).digest("hex");
}

function defaultProgress(profileId) {
  return {
    profileId,
    currentNodeId: skillNodes[0].id,
    unlockedNodeIds: [skillNodes[0].id],
    passedNodeIds: [],
    scores: {},
  };
}

export async function POST(request) {
  const { name, pin } = await request.json();
  const cleanName = String(name || "").trim();
  const cleanPin = String(pin || "").trim();

  if (cleanName.length < 1 || cleanName.length > 20) {
    return Response.json({ error: "이름은 1~20자로 입력해주세요." }, { status: 400 });
  }

  if (!/^\d{4}$/.test(cleanPin)) {
    return Response.json({ error: "PIN은 숫자 4자리입니다." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const pinHash = hashPin(cleanName, cleanPin);
  const existing = db.prepare("SELECT * FROM profiles WHERE name = ?").get(cleanName);

  if (existing && existing.pinHash !== pinHash) {
    return Response.json({ error: "PIN이 맞지 않습니다." }, { status: 401 });
  }

  const profile =
    existing ||
    (() => {
      const id = randomUUID();
      db.prepare("INSERT INTO profiles (id, name, pinHash, createdAt, lastSeenAt) VALUES (?, ?, ?, ?, ?)").run(
        id,
        cleanName,
        pinHash,
        now,
        now
      );
      const progress = defaultProgress(id);
      db.prepare(
        "INSERT INTO progress (profileId, currentNodeId, unlockedNodeIds, passedNodeIds, scores, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(
        id,
        progress.currentNodeId,
        JSON.stringify(progress.unlockedNodeIds),
        JSON.stringify(progress.passedNodeIds),
        JSON.stringify(progress.scores),
        now
      );
      return { id, name: cleanName, pinHash };
    })();

  db.prepare("UPDATE profiles SET lastSeenAt = ? WHERE id = ?").run(now, profile.id);

  return Response.json({
    profile: { id: profile.id, name: profile.name },
    accessKey: accessKey(profile.id, pinHash),
  });
}
