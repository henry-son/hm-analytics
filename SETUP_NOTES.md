Local Realtime Server & Voting

- Default local vote passcode: `letmein` (change via environment variable `VOTE_PASS` when starting the realtime server).
- To run realtime server:

```powershell
npm install
npm start
```

- Static server (PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve-8001.ps1
```

- Test: open two browser windows to `http://localhost:8001`, open a featured poll, sign in with the passcode, and vote. Votes should broadcast across windows when realtime server is running.
