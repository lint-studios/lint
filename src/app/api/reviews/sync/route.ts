import { NextResponse } from "next/server";
import { inngest } from "../../../../inngest/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { organizationId, maxPages } = await req.json();
  if (!organizationId) {
    return NextResponse.json({ error: "organizationId required" }, { status: 400 });
  }

  await inngest.send({
    name: "reviews/sync.requested",
    data: { organizationId, maxPages: Number(maxPages ?? 50) },
  });

  return NextResponse.json({ queued: true });
}
