// Waypoint AI proxy. Keeps the Anthropic API key on the server and streams the answer back.
const MODELS = { quick: "claude-haiku-5-5", default: "claude-sonnet-5-5", complex: "claude-sonnet-5-5" };
const hits = new Map(); // simple per-instance rate limit

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const key = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!key) return new Response("Server is missing ANTHROPIC_API_KEY", { status: 500 });

  // Only accept calls from this site
  const origin = req.headers.get("origin") || "";
  const host = new URL(req.url).host;
  if (origin && !origin.endsWith(host)) return new Response("Forbidden", { status: 403 });

  // ~30 requests per 10 minutes per visitor
  const ip = context.ip || "anon", now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (list.length >= 30) return new Response("Too many requests", { status: 429 });
  list.push(now); hits.set(ip, list);

  let body;
  try { body = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }
  const raw = JSON.stringify(body.messages || []);
  if (!Array.isArray(body.messages) || raw.length > 6_000_000) return new Response("Bad request", { status: 400 });

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODELS[body.tier] || MODELS.default, max_tokens: 8000, stream: true, messages: body.messages }),
  });
  if (!upstream.ok || !upstream.body) return new Response(await upstream.text(), { status: upstream.status === 429 ? 429 : 502 });
  return new Response(upstream.body, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
};

export const config = { path: "/api/ai" };
