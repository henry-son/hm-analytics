const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const DATA_FILE = path.join(__dirname, 'realtime-data.json');
const PORT = process.env.PORT || 8080;

const defaultState = {
  polls: {
    poll_payments: { id: 'poll_payments', question: 'Do you prefer digital payments over cash?', options: ['Yes, mostly', 'Sometimes', 'No, prefer cash', "I don't use digital"], counts: [780,240,120,60] },
    poll_sme: { id: 'poll_sme', question: 'Has your SME revenue recovered since 2025?', options: ['Yes, fully','Partially','No','Not applicable'], counts: [320,210,150,120] },
    poll_services: { id: 'poll_services', question: 'Are you satisfied with local government services?', options: ['Satisfied','Neutral','Dissatisfied','No opinion'], counts: [290,180,210,120] }
  },
  trackers: {
    county_performance: { id: 'county_performance', title: 'County Performance Dashboard', metrics: { ServiceIndex:72, Healthcare:62, Education:55, Infrastructure:51 } },
    business_health: { id: 'business_health', title: 'Business Health Monitor', metrics: { RevenueIndex:68, ProfitMargin:18, CostIndex:42 } },
    market_sentiment: { id: 'market_sentiment', title: 'Market Sentiment Index', metrics: { SentimentIndex:72, Momentum:3 } }
  },
  documentaries: [],
  subscriptions: {}
};

let state = defaultState;
try{
  if (fs.existsSync(DATA_FILE)){
    state = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || defaultState;
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  }
}catch(e){ console.warn('Data file error, using defaults', e); }

function saveState(){ try{ fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2)); } catch(e){ console.warn('Failed saving state', e); } }

const app = express();
app.use(cors());
app.use(express.json());

// Simple token store for demo authentication
const TOKENS = {};
const VOTE_PASS = process.env.VOTE_PASS || 'letmein';

// Helper: broadcast via WebSocket server (set after wss created)
let wss = null;
function broadcast(obj){ if (!wss) return; const msg = JSON.stringify(obj); wss.clients.forEach(c=>{ if (c.readyState === WebSocket.OPEN) c.send(msg); }); }

// API: get full state
app.get('/state', (req,res)=> res.json(state));

// Auth: login to get token
app.post('/login', (req,res)=>{
  const { passcode, user } = req.body || {};
  if (!passcode || passcode !== VOTE_PASS) return res.status(401).json({ error: 'invalid_passcode' });
  const token = Math.random().toString(36).slice(2);
  TOKENS[token] = { user: user || 'voter', created: Date.now() };
  res.json({ token });
});

// Authoritative vote endpoint (requires token)
app.post('/vote', (req,res)=>{
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  if (!token || !TOKENS[token]) return res.status(401).json({ error: 'unauthorized' });
  const { pollId, choice } = req.body || {};
  if (!pollId || typeof choice !== 'number') return res.status(400).json({ error: 'invalid_payload' });
  const poll = state.polls && state.polls[pollId];
  if (!poll) return res.status(404).json({ error: 'poll_not_found' });
  poll.counts[choice] = (poll.counts[choice]||0) + 1;
  saveState();
  broadcast({ type: 'polls_update', payload: { pollId, counts: poll.counts } });
  res.json({ ok:true, counts: poll.counts });
});

// Documentaries
app.get('/documentaries', (req,res)=> res.json(state.documentaries || []));
app.post('/documentaries', (req,res)=>{
  const { title, url, description } = req.body || {};
  if (!title || !url) return res.status(400).json({ error: 'title_and_url_required' });
  const id = String(Date.now());
  const doc = { id, title, url, description: description||'', publishedAt: new Date().toLocaleDateString() };
  state.documentaries = state.documentaries || [];
  state.documentaries.push(doc);
  saveState();
  res.status(201).json({ ok:true, doc });
});
app.post('/subscribe', (req,res)=>{
  const { email, documentId } = req.body || {};
  if (!email || !documentId) return res.status(400).json({ error: 'email_and_documentId_required' });
  state.subscriptions = state.subscriptions || {};
  state.subscriptions[documentId] = state.subscriptions[documentId] || [];
  if (!state.subscriptions[documentId].includes(email)) state.subscriptions[documentId].push(email);
  saveState();
  res.json({ ok:true });
});

// Start HTTP + WS server
const server = http.createServer(app);
wss = new WebSocket.Server({ server });

wss.on('connection', (ws)=>{
  // Send init payload with polls and trackers
  ws.send(JSON.stringify({ type: 'init', payload: state }));
  ws.on('message', (m)=>{
    try{
      const data = JSON.parse(m.toString());
      if (!data || !data.type) return;
      switch (data.type){
        case 'request_sync': ws.send(JSON.stringify({ type:'init', payload: state })); break;
        case 'poll_vote': {
          const { pollId, counts } = data.payload || {};
          if (pollId && counts && state.polls && state.polls[pollId]){
            state.polls[pollId].counts = counts;
            saveState();
            broadcast({ type: 'polls_update', payload: { pollId, counts } });
          }
          break;
        }
        default: break;
      }
    }catch(e){ console.warn('ws parse', e); }
  });
});

server.listen(PORT, ()=> console.log('Realtime server (HTTP+WS) listening on http://localhost:' + PORT));

process.on('SIGINT', ()=>{ console.log('Shutting down'); server.close(()=>process.exit()); });
