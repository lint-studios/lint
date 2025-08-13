"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SyncReviewsButton({ organizationId }: { organizationId: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button disabled={busy} onClick={async () => {
      setBusy(true);
      const res = await fetch("/api/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId, maxPages: 10 }),
      });
      const j = await res.json();
      setBusy(false);
      alert(res.ok ? "Sync queued!" : j.error);
    }}>
      {busy ? "Queuing…" : "Sync Judge.me Reviews"}
    </Button>
  );
}
