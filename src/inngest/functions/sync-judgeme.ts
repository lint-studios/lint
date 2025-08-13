import { z } from "zod";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { decryptAesGcmHex } from "@/lib/enc";
import { fetchJudgeMePage } from "@/lib/judgeme";

const Payload = z.object({
  organizationId: z.string(),
  maxPages: z.number().optional().default(50),
});

export const syncJudgeme = inngest.createFunction(
  { id: "sync-judgeme-reviews" },
  { event: "reviews/sync.requested" },
  async ({ event, step }) => {
    const { organizationId, maxPages } = Payload.parse(event.data);

    // 1) Load token + shopDomain (stored in api_tokens.plainTextData)
    const tokenRow = await step.run("load-judgeme-token", async () => {
      return prisma.apiToken.findFirst({
        where: { organizationId, service: "judge_me" },
        select: { encryptedToken: true, iv: true, tag: true, plainTextData: true },
      });
    });
    if (!tokenRow) throw new Error("Judge.me token not found");

    const { storeUrl } = (() => {
      try { return JSON.parse(tokenRow.plainTextData ?? "{}"); }
      catch { return {}; }
    })() as { storeUrl?: string };

    const shopDomain = (storeUrl ?? "").replace(/^https?:\/\//, "");
    if (!shopDomain) throw new Error("Shop domain missing in api_tokens.plainTextData");

    const apiToken = decryptAesGcmHex(tokenRow.encryptedToken!, tokenRow.iv!, tokenRow.tag!);

    // 2) Paginate & upsert
    let page = 1, imported = 0, updated = 0, fetched = 0;

    while (page <= maxPages) {
      const items = await step.run(`fetch-page-${page}`, () =>
        fetchJudgeMePage({ apiToken, shopDomain, page, perPage: 100 })
      );
      if (items.length === 0) break;

      // Upsert each review
      for (const r of items as any[]) {
        const data = {
          organizationId,
          externalId: String(r.id),
          productId: r.product_id != null ? String(r.product_id) : null,
          productTitle: r.product_title ?? null,
          rating: Number(r.rating ?? 0),
          title: r.title ?? null,
          body: String(r.body ?? ""),
          reviewerName: r.reviewer_name ?? r.reviewer?.name ?? null,
          reviewerEmail: r.reviewer_email ?? r.reviewer?.email ?? null,
          createdAtRemote: new Date(r.created_at),
          updatedAtRemote: r.updated_at ? new Date(r.updated_at) : null,
          publishedAtRemote: r.published_at ? new Date(r.published_at) : null,
          verified: (() => {
            const verified = r.verified ?? r.verified_buyer;
            if (verified === "verified" || verified === true) return true;
            if (verified === "nothing" || verified === false || verified === null) return false;
            return null; // unknown value
          })(),
          helpful: 0, // Judge.me doesn't send this; keep your default
          source: "judgeme",
          productExternalId: r.product_external_id != null ? String(r.product_external_id) : null,
          productHandle: r.product_handle ?? null,
          media: (r.pictures ?? r.media) ?? null,
          raw: r,
        };

        // Prisma upsert by your composite unique constraint
        const res = await prisma.review.upsert({
          where: {
            reviews_organizationId_externalId_source_key: {
              organizationId,
              externalId: data.externalId,
              source: data.source,
            },
          },
          create: data,
          update: {
            rating: data.rating,
            title: data.title,
            body: data.body,
            reviewerName: data.reviewerName,
            reviewerEmail: data.reviewerEmail,
            productTitle: data.productTitle,
            productHandle: data.productHandle,
            updatedAtRemote: data.updatedAtRemote,
            publishedAtRemote: data.publishedAtRemote,
            verified: data.verified,
            media: data.media,
            raw: data.raw,
            updatedAt: new Date(),
          },
        });

        // crude way to track new vs updated; optional
        if (res.createdAt.getTime() === res.updatedAt.getTime()) imported++;
        else updated++;
      }

      fetched += items.length;
      if (items.length < 100) break;
      page += 1;

      // polite delay
      await step.sleep("delay", "300ms");
    }

    return { ok: true, org: organizationId, shopDomain, fetched, imported, updated };
  }
);
