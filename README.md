# Waypoint

Academic advising interface with a static frontend and a Netlify Edge Function that calls the Anthropic API.

## Deployment

1. Connect the repository to a Netlify project.
2. Set `ANTHROPIC_API_KEY` in the project's environment configuration.
3. Deploy the site and verify the advising request flow.
4. Configure `waypointadvisor.app` in Netlify's domain settings when ready.

The server-side integration is in `netlify/edge-functions/ai.js`. Keep API credentials in the hosting environment rather than frontend files or version control.
