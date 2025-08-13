export async function fetchJudgeMePage(params: {
  apiToken: string;
  shopDomain: string; // "lint-review-aggregator-dev.myshopify.com"
  page?: number;
  perPage?: number;
}) {
  const { apiToken, shopDomain, page = 1, perPage = 100 } = params;
  const url = new URL("https://judge.me/api/v1/reviews");
  url.searchParams.set("api_token", apiToken);
  url.searchParams.set("shop_domain", shopDomain);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const r = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  const text = await r.text();
  if (!r.ok) throw new Error(`Judge.me ${r.status}: ${text.slice(0,300)}`);
  const data = JSON.parse(text);
  
  // Log the response for debugging
  console.log(`Judge.me API response type: ${typeof data}`);
  console.log(`Judge.me API response keys: ${Array.isArray(data) ? 'array' : Object.keys(data || {}).join(', ')}`);
  console.log(`Judge.me API response preview: ${JSON.stringify(data).slice(0,200)}...`);
  
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected Judge.me response (expected array, got ${typeof data}): ${JSON.stringify(data).slice(0,300)}`);
  }
  return data as unknown[];
}
