# Insight Analytics — Static Site

HM Analytics — Static Site (local copy)

This workspace contains a static landing page matching the HM Analytics site.

Quick start (open locally):

```powershell
start "" index.html
```

Serve via PowerShell script (no Python required):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve-8001.ps1
```

Run the optional realtime server (for authenticated voting and live updates):

```powershell
npm install
npm start
```

Open two browser windows to http://localhost:8001 to test realtime voting and trackers.

Notes / Next steps:
- Wire the contact form to a backend or form service (Mailgun, Netlify Forms, etc.)
- Add real images and dashboards or embed BI iframes
- Deploy to Netlify / Vercel / GitHub Pages for public hosting
