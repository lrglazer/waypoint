# Waypoint — AI Academic Advisor

Static site + one Netlify Edge Function (`netlify/edge-functions/ai.js`) that calls the Anthropic API.

Setup:
1. Push this folder to a GitHub repo.
2. Netlify → Add new project → Import from GitHub → pick the repo → Deploy.
3. Netlify → Project configuration → Environment variables → add `ANTHROPIC_API_KEY`.
4. Redeploy, then add the custom domain `waypointadvisor.app` under Domain management.
