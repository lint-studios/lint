import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncJudgeme } from "../../../inngest/functions/sync-judgeme";

export const runtime = "nodejs"; // we need Node crypto
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncJudgeme],
});
