// GMG UNIVERSITY v9.0 — iMessage Chat Style
// ⬡B:gmg_university.ui_redesign:BUILD:chat_style_v9:20260403⬡
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
// Firestore removed — progress lives in Supabase brain via backend API
import { CURRICULUM_TITLES } from './curriculum';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app);

const AIR_STREAM = 'https://abacia-services.onrender.com/api/air/stream';
const PROGRESS_API = 'https://abacia-services.onrender.com/api/gmg-university/progress';
const TTS_URL = 'https://abacia-services.onrender.com/api/tts/speak';
// TTS via backend proxy — no API key needed in frontend
// ABA energy blob replaces static avatar image
const GMG_LOGO = 'https://i.imgur.com/qslzgTU.png';

const BG_IMAGES = [
  'https://i.imgur.com/3RkebB2.jpeg',
  'https://i.imgur.com/9HZYnlX.png',
  'https://i.imgur.com/nLBRQ82.jpeg',
  'https://i.imgur.com/h8zNCw1.jpeg'
];

/* ━━━ ABA ENERGY BLOB — replaces static purple circle ━━━ */
function AbaBlob({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative', flexShrink: 0
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%',
        background: 'linear-gradient(135deg, rgba(139,92,246,.85), rgba(236,72,153,.6), rgba(99,102,241,.7))',
        filter: 'blur(0.5px)',
        boxShadow: '0 0 ' + (size/3) + 'px rgba(139,92,246,.35)',
        animation: 'abaBlob 4s ease-in-out infinite'
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '55% 45% 40% 60% / 60% 35% 65% 40%',
        background: 'linear-gradient(225deg, rgba(167,139,250,.5), rgba(45,212,191,.3), rgba(132,204,22,.2))',
        filter: 'blur(1px)',
        animation: 'abaBlob 4s ease-in-out -2s infinite',
        mixBlendMode: 'screen'
      }}/>
    </div>
  );
}
const VOL_META = {
  v1: { name: 'Fundraising Foundations', days: 30 },
  v2: { name: 'The GMG Way', days: 30 },
  v3: { name: 'CPP Model', days: 15 }
};

/* ━━━ ANIMATIONS ━━━ */
const STYLES = `
@keyframes kenBurns{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.12) translate(-2%,-1%)}100%{transform:scale(1) translate(0,0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)}50%{box-shadow:0 0 0 12px rgba(124,58,237,0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes abaBlob{0%,100%{border-radius:42% 58% 55% 45%/48% 42% 58% 52%}25%{border-radius:55% 45% 40% 60%/60% 35% 65% 40%}50%{border-radius:38% 62% 58% 42%/45% 55% 45% 55%}75%{border-radius:60% 40% 45% 55%/38% 62% 42% 58%}}
`;

/* ━━━ CINEMATIC BACKGROUND ━━━ */
function CinematicBG() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % BG_IMAGES.length); setFade(true); }, 800);
    }, 45000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <img src={BG_IMAGES[idx]} alt="" style={{
        position: 'absolute', width: '120%', height: '120%', top: '-10%', left: '-10%',
        objectFit: 'cover', animation: 'kenBurns 30s ease-in-out infinite',
        opacity: fade ? 0.55 : 0, transition: 'opacity 0.8s ease'
      }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.3) 40%, rgba(10,10,15,0.75) 100%)' }}/>
    </div>
  );
}

/* ━━━ LESSON SIDEBAR ━━━ */
function LessonSidebar({ show, onClose, completedDays, onSelect, onReset, currentLesson }) {
  if (!show) return null;
  const completed = completedDays || [];
  const totalDone = completed.length;
  const totalAll = Object.values(VOL_META).reduce((s, v) => s + v.days, 0);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}/>
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, maxWidth: '85vw',
        background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 91,
        animation: 'slideRight 0.25s ease-out', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Curriculum</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', padding: 4 }}>×</button>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 2, width: `${(totalDone / totalAll) * 100}%`, transition: 'width 0.4s' }}/>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, whiteSpace: 'nowrap' }}>{totalDone}/{totalAll}</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {Object.entries(VOL_META).map(([vol, meta]) => (
            <div key={vol}>
              <div style={{ padding: '12px 16px 6px', color: '#a78bfa', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>{meta.name}</div>
              {(CURRICULUM_TITLES[vol] || []).map((title, i) => {
                const dayNum = i + 1;
                const key = `${vol}-d${dayNum}`;
                const done = completed.includes(key);
                const isCurrent = currentLesson?.vol === vol && currentLesson?.day === dayNum;
                return (
                  <button key={key} onClick={() => { onSelect(vol, dayNum); onClose(); }} style={{
                    width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    background: isCurrent ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderLeft: isCurrent ? '3px solid #7c3aed' : '3px solid transparent'
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600, flexShrink: 0,
                      background: done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                      color: done ? '#10b981' : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`
                    }}>{done ? '✓' : dayNum}</span>
                    <span style={{ color: done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.3 }}>{title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { if (window.confirm('Reset ALL progress to 0/75? This cannot be undone.')) onReset(); }} style={{
            width: '100%', padding: 10, borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)',
            color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 500
          }}>Reset Progress</button>
        </div>
      </div>
    </>
  );
}

/* ━━━ TYPING DOTS ━━━ */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '4px 16px', animation: 'msgIn 0.2s ease-out' }}>
      <AbaBlob size={28}/>
      <div style={{
        background: 'rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 4px',
        padding: '12px 16px', display: 'flex', gap: 5, border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}


/* ━━━ DECK PANEL — Interactive content from GURU ━━━ */
function DeckPanel({ deck, onClose }) {
  if (!deck) return null;
  const glass = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, maxWidth: '90vw',
      background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(24px)',
      borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 40,
      display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease-out',
      transform: 'translateX(0)'
    }}>
      <style>{'@keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}'}</style>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>{deck.title || 'Interactive'}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

        {deck.type === 'quiz' && (<div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>{deck.question}</p>
          {(deck.options || []).map((opt, i) => (
            <button key={i} style={{ ...glass, width: '100%', marginBottom: 8, textAlign: 'left', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{opt}</button>
          ))}
        </div>)}

        {deck.type === 'matching' && (<div>
          {(deck.pairs || []).map((p, i) => (
            <div key={i} style={{ ...glass, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{p.left}</span>
              <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 500 }}>{p.right}</span>
            </div>
          ))}
        </div>)}

        {deck.type === 'sorting' && (<div>
          {(deck.items || []).map((item, i) => (
            <div key={i} style={{ ...glass, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: 14, width: 20 }}>{i + 1}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item}</span>
            </div>
          ))}
        </div>)}

        {deck.type === 'scenario' && (<div>
          <div style={{ ...glass, marginBottom: 14, borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6 }}>{deck.situation}</p>
          </div>
          {deck.prompt && <p style={{ color: '#a78bfa', fontSize: 13, fontWeight: 500 }}>{deck.prompt}</p>}
        </div>)}

        {deck.type === 'document' && (<div>
          <div style={{ ...glass, fontFamily: 'Georgia, serif' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{deck.content}</p>
          </div>
        </div>)}

        {deck.type === 'progress' && (<div style={{ textAlign: 'center', padding: 20 }}>
          <p style={{ color: 'white', fontSize: 36, fontWeight: 300, marginBottom: 4 }}>{deck.completed}/{deck.total}</p>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 3, width: Math.round(((deck.completed||0)/Math.max(deck.total||1,1))*100)+'%' }}/>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{deck.message || Math.round(((deck.completed||0)/Math.max(deck.total||1,1))*100)+'% complete'}</p>
        </div>)}

      </div>
    </div>
  );
}

/* ━━━ MAIN APP ━━━ */
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [initDone, setInitDone] = useState(false);
  const [deckContent, setDeckContent] = useState(null);
  const [adminView, setAdminView] = useState(false);
  const [adminStudents, setAdminStudents] = useState([]);
  const [adminInterviews, setAdminInterviews] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', name: '', cohort: 'NEW_COHORT', track: 'UNASSIGNED', group: 'UNASSIGNED' });

  const ADMIN_API = 'https://abacia-services.onrender.com/api/gmg-university/admin';
  const isAdmin = user?.email && ['brandonjpiercesr@gmail.com','brandon@globalmajoritygroup.com','eric@globalmajoritygroup.com','ericreeselanesr@gmail.com'].includes(user.email.toLowerCase());

  async function loadAdmin() {
    if (!isAdmin) return;
    setAdminLoading(true);
    try {
      const [sRes, iRes] = await Promise.all([
        fetch(ADMIN_API + '/students?email=' + encodeURIComponent(user.email)),
        fetch(ADMIN_API + '/interviews?email=' + encodeURIComponent(user.email))
      ]);
      if (sRes.ok) setAdminStudents((await sRes.json()).students || []);
      if (iRes.ok) setAdminInterviews((await iRes.json()).interviews || []);
    } catch (e) { console.error('[GMG-U]', e.message); }
    setAdminLoading(false);
  }

  async function addStudent() {
    if (!addForm.email.trim()) return;
    try {
      const r = await fetch(ADMIN_API + '/students', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email, student_email: addForm.email, student_name: addForm.name,
          cohort_type: addForm.cohort, gmg_track: addForm.track, gmg_group: addForm.group
        })
      });
      if (r.ok) { setShowAddForm(false); setAddForm({ email: '', name: '', cohort: 'NEW_COHORT', track: 'UNASSIGNED', group: 'UNASSIGNED' }); loadAdmin(); }
    } catch (e) { console.error('[GMG-U]', e.message); }
  }

  async function resetStudent(hamId) {
    if (!window.confirm('Reset ' + hamId + ' progress?')) return;
    try {
      await fetch(ADMIN_API + '/students/' + hamId + '/reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      loadAdmin();
    } catch (e) { console.error('[GMG-U]', e.message); }
  }

  // updateStudent removed — dead code (M1)

  const endRef = useRef(null);
  const audioRef = useRef(null);
  const audioUnlocked = useRef(false);
  useEffect(() => {
    const unlock = () => { if (audioRef.current && !audioUnlocked.current) { audioRef.current.play().then(() => { audioRef.current.pause(); audioRef.current.currentTime = 0; audioUnlocked.current = true; }).catch(() => {}); } };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    return () => { document.removeEventListener('click', unlock); document.removeEventListener('touchstart', unlock); };
  }, []);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // ━━━ AUTH ━━━
  // ⬡B:audra.gmg_university.H15:FIX:unified_progress_standalone:20260404⬡
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        // Load progress from unified Supabase backend (not Firestore)
        try {
          const r = await fetch(PROGRESS_API + '?email=' + encodeURIComponent(u.email));
          if (r.ok) {
            const progress = await r.json();
            setProfile({ email: u.email, name: u.displayName, photoURL: u.photoURL, ...progress });
          } else {
            setProfile({ email: u.email, name: u.displayName, photoURL: u.photoURL, completedDays: [], xp: 0 });
          }
        } catch (e) {
          console.error('[GMG-U] Progress load error:', e.message);
          setProfile({ email: u.email, name: u.displayName, photoURL: u.photoURL, completedDays: [], xp: 0 });
        }
      } else {
        setUser(null); setProfile(null); setMessages([]); setInitDone(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ━━━ AUTO-SCROLL ━━━
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streaming]);

  // ━━━ AUTO-INIT: ABA greets on login ━━━
  useEffect(() => {
    if (user && profile && !initDone && !streaming) {
      setInitDone(true);
      const completed = profile.completedDays || [];
      const next = getNextLesson(completed);
      const name = profile.name?.split(' ')[0] || 'there';
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      let msg = `Good ${greeting}, this is ${name}. I just opened GMG University.`;
      if (next) {
        msg += ` My next lesson is Day ${next.day} of ${VOL_META[next.vol].name}: "${next.title}". I have completed ${completed.length} of ${Object.values(VOL_META).reduce((s,v)=>s+v.days,0)} lessons. Check my cohort_type and proceed accordingly.`;
        setCurrentLesson(next);
      } else {
        msg += ` I've completed all 75 lessons!`;
      }
      streamFromAIR(msg, true);
    }
  }, [user, profile, initDone]);

  // ━━━ SPEECH RECOGNITION ━━━
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = e => {
        const t = Array.from(e.results).map(r => r[0].transcript).join('');
        setInput(t);
        if (e.results[0].isFinal) setListening(false);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  // ━━━ HELPERS ━━━
  function getNextLesson(completed) {
    for (const [vol, meta] of Object.entries(VOL_META)) {
      for (let d = 1; d <= meta.days; d++) {
        if (!completed.includes(`${vol}-d${d}`)) {
          return { vol, day: d, title: (CURRICULUM_TITLES[vol] || [])[d - 1] || `Day ${d}` };
        }
      }
    }
    return null;
  }

  // ━━━ TTS WITH QUEUE ━━━
  async function speakText(text) {
    if (!voiceOn || !text?.trim()) return;
    try {
      const r = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 500) })
      });
      if (r.ok) {
        const url = URL.createObjectURL(await r.blob());
        audioQueue.current.push(url);
        playNext();
      }
    } catch (e) { console.error('[GMG-U]', e.message); }
  }

  function playNext() {
    if (isPlaying.current || audioQueue.current.length === 0) return;
    isPlaying.current = true;
    const url = audioQueue.current.shift();
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.onended = () => { isPlaying.current = false; URL.revokeObjectURL(url); playNext(); };
      audioRef.current.onerror = () => { isPlaying.current = false; URL.revokeObjectURL(url); playNext(); };
      audioRef.current.play().catch(() => { isPlaying.current = false; playNext(); });
    }
  }

  // ━━━ STREAM FROM AIR ━━━
  async function streamFromAIR(userMsg, isAutoInit = false) {
    if (streaming) return;
    setStreaming(true);
    if (!isAutoInit) setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessages(prev => [...prev, { role: 'aba', text: '', streaming: true }]);

    let accumulated = '';
    let sentenceBuf = '';

    try {
      const history = messages.slice(-20).map(m => ({
        role: m.role === 'aba' ? 'assistant' : 'user', content: m.text || ''
      })).filter(m => m.content);

      const r = await fetch(AIR_STREAM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg, user_id: profile?.email, userId: profile?.email,
          channel: 'gmg-university', conversationHistory: history
        })
      });

      const reader = r.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              accumulated += data.text;
              sentenceBuf += data.text;
              setMessages(prev => {
                const copy = [...prev]; const last = copy[copy.length - 1];
                if (last?.role === 'aba') copy[copy.length - 1] = { ...last, text: accumulated };
                return copy;
              });
              if (sentenceBuf.match(/[.!?]\s*$/)) { speakText(sentenceBuf.trim()); sentenceBuf = ''; }
            } else if (data.type === 'done') {
              const final = data.fullResponse || accumulated;
              // ⬡B:gmg_university.deck:DETECT:extract_deck_tags:20260403⬡
              let displayText = final;
              const deckMatch = final.match(/\[DECK\](.*?)\[\/DECK\]/s);
              if (deckMatch) {
                try {
                  const deckData = JSON.parse(deckMatch[1].trim());
                  setDeckContent(deckData);
                } catch (e) { console.error('[GMG-U]', e.message); }
                displayText = final.replace(/\[DECK\].*?\[\/DECK\]/s, '').trim();
              }
              setMessages(prev => {
                const copy = [...prev]; const last = copy[copy.length - 1];
                if (last?.role === 'aba') copy[copy.length - 1] = { ...last, text: displayText, streaming: false };
                return copy;
              });
              if (sentenceBuf.trim()) speakText(sentenceBuf.trim());
              if (final.includes('LESSON_COMPLETE') || final.toLowerCase().includes('lesson is complete')) markComplete();
            }
          } catch (e) { console.error('[GMG-U]', e.message); }
        }
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev]; const last = copy[copy.length - 1];
        if (last?.role === 'aba') copy[copy.length - 1] = { ...last, text: "I'm having trouble connecting. Try again.", streaming: false };
        return copy;
      });
    } finally { setStreaming(false); }
  }

  // ━━━ SEND ━━━
  function handleSend() {
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    streamFromAIR(msg);
  }

  // ━━━ MIC ━━━
  function toggleMic() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      if (input.trim()) setTimeout(() => handleSend(), 200);
    } else {
      setInput('');
      setListening(true);
      recognitionRef.current.start();
    }
  }

  // ━━━ COMPLETE ━━━
  async function markComplete() {
    if (!currentLesson || !user?.email) return;
    const key = `${currentLesson.vol}-d${currentLesson.day}`;
    if (profile?.completedDays?.includes(key)) return;
    try {
      const r = await fetch(PROGRESS_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, completedKey: key })
      });
      if (r.ok) {
        const updated = await r.json();
        setProfile(p => ({ ...p, ...updated }));
        setCurrentLesson(getNextLesson(updated.completedDays || []));
      }
    } catch (e) { console.error('[GMG-U] Complete error:', e.message); }
  }

  // ━━━ SELECT FROM SIDEBAR ━━━
  function selectLesson(vol, day) {
    const title = (CURRICULUM_TITLES[vol] || [])[day - 1] || `Day ${day}`;
    setCurrentLesson({ vol, day, title });
    const name = profile?.name?.split(' ')[0] || 'there';
    streamFromAIR(`${name} here. I want to do Day ${day} of ${VOL_META[vol].name}: "${title}". Check my cohort_type and proceed accordingly.`);
  }

  // ━━━ RESET ━━━
  async function resetProgress() {
    if (!user?.email) return;
    try {
      await fetch(PROGRESS_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, completedDays: [], xp: 0 })
      });
      setProfile(p => ({ ...p, completedDays: [], xp: 0 }));
      setMessages([]); setInitDone(false); setCurrentLesson(null);
    } catch (e) { console.error('[GMG-U] Reset error:', e.message); }
  }

  // ━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{STYLES}</style>
      <CinematicBG/>
      <div style={{ position: 'relative', zIndex: 1 }}><AbaBlob size={56}/></div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <style>{STYLES}</style>
      <CinematicBG/>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 320, animation: 'fadeIn 0.6s ease-out' }}>
        <img src={GMG_LOGO} alt="GMG" style={{ width: 96, height: 96, marginBottom: 20 }}/>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: 'white', fontFamily: 'Georgia, serif', letterSpacing: 1 }}>
          GMG <span style={{ color: '#a78bfa' }}>University</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: 6, fontSize: 13 }}>Lane-Pierce Fellowship Program</p>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} style={{
          marginTop: 36, width: '100%', padding: '15px 24px', borderRadius: 14,
          background: 'linear-gradient(135deg, #7c3aed, #9333ea)', color: 'white',
          border: 'none', fontSize: 15, fontWeight: 500, cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(124,58,237,0.3)'
        }}>Continue with Google</button>
      </div>
    </div>
  );

  // ━━━ CHAT VIEW ━━━
  const totalDone = (profile?.completedDays || []).length;
  const pct = Math.round((totalDone / 75) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{STYLES}</style>
      <CinematicBG/>
      <audio ref={audioRef}/>

      {/* HEADER — looks like iMessage/WhatsApp top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10
      }}>
        {/* Hamburger */}
        <button onClick={() => setShowSidebar(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6,
          color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: 3
        }}>
          <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 1 }}/>
          <span style={{ width: 14, height: 2, background: 'currentColor', borderRadius: 1 }}/>
          <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 1 }}/>
        </button>

        {/* ABA avatar + name */}
        <AbaBlob size={34}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 600, margin: 0 }}>ABA</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentLesson ? `Day ${currentLesson.day} · ${currentLesson.title}` : `${pct}% · ${totalDone}/75 lessons`}
          </p>
        </div>

        {/* Voice toggle */}
        <button onClick={() => setVoiceOn(!voiceOn)} style={{
          background: voiceOn ? 'rgba(124,58,237,0.15)' : 'transparent',
          border: `1px solid ${voiceOn ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
          color: voiceOn ? '#a78bfa' : 'rgba(255,255,255,0.25)', fontSize: 12
        }}>{voiceOn ? '🔊' : '🔇'}</button>

        {/* Sign out */}
        {isAdmin && <button onClick={() => { if (!adminView) loadAdmin(); setAdminView(!adminView); }} style={{
          background: adminView ? 'rgba(124,58,237,0.2)' : 'transparent',
          border: '1px solid ' + (adminView ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'),
          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
          color: adminView ? '#a78bfa' : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500
        }}>{adminView ? 'Chat' : 'Admin'}</button>}
        <button onClick={() => signOut(auth)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: 11, cursor: 'pointer'
        }}>Out</button>
      </header>

      {/* ADMIN PANEL */}
      {adminView && isAdmin && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', position: 'relative', zIndex: 1 }}>
          {adminLoading ? <p style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)' }}>Loading...</p> : <>
          <div style={{ marginBottom: 16 }}>
            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>+ Add Student by Email</button>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 }}>
                <input value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} placeholder="Email address" style={{ width: '100%', marginBottom: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none' }}/>
                <input value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} placeholder="Full name" style={{ width: '100%', marginBottom: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none' }}/>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <select value={addForm.cohort} onChange={e => setAddForm({...addForm, cohort: e.target.value})} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                    <option value="NEW_COHORT">New Cohort</option><option value="FOUNDING_LINE">Founding Line</option><option value="INTERVIEW_MODE">Interview Mode</option>
                  </select>
                  <select value={addForm.group} onChange={e => setAddForm({...addForm, group: e.target.value})} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                    <option value="UNASSIGNED">No Group</option><option value="THE_COLLECTIVE">The Collective</option><option value="THE_MAJORITY">The Majority</option>
                  </select>
                </div>
                <select value={addForm.track} onChange={e => setAddForm({...addForm, track: e.target.value})} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                  <option value="UNASSIGNED">No Track Yet</option><option value="CDO_VP_HEAD_FUNDRAISING">CDO / VP / Head of Fundraising</option><option value="DEVELOPMENT_MANAGER">Development Manager</option><option value="PROGRAMS">Programs</option><option value="OPERATIONS">Operations</option><option value="TECHNOLOGY">Technology</option>
                </select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addStudent} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#7c3aed', color: 'white', fontSize: 13, cursor: 'pointer' }}>Add</button>
                  <button onClick={() => setShowAddForm(false)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Students ({adminStudents.length})</p>
          {adminStudents.map(s => (
            <div key={s.ham_id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div><p style={{ color: 'white', fontSize: 14, fontWeight: 500, margin: 0 }}>{s.name}</p><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{s.email}</p></div>
                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: s.cohort_type === 'INTERVIEW_MODE' ? 'rgba(251,191,36,0.15)' : s.cohort_type === 'FOUNDING_LINE' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)', color: s.cohort_type === 'INTERVIEW_MODE' ? '#fbbf24' : s.cohort_type === 'FOUNDING_LINE' ? '#10b981' : '#a78bfa' }}>{s.cohort_type}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.gmg_track !== 'NOT_SET' && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{s.gmg_track}</span>}
                {s.gmg_group !== 'NOT_SET' && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{s.gmg_group}</span>}
                <button onClick={() => resetStudent(s.ham_id)} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#ef4444', fontSize: 10, cursor: 'pointer' }}>Reset</button>
              </div>
            </div>
          ))}
          {adminInterviews.length > 0 && <>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Interview Content ({adminInterviews.length})</p>
            {adminInterviews.slice(0, 20).map((iv, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#a78bfa', fontSize: 10, fontWeight: 600 }}>{iv.ham_name || iv.ham || '?'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{iv.created_at?.substring(0, 10) || ''}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{(iv.founder_answer || '').substring(0, 200)}{(iv.founder_answer || '').length > 200 ? '...' : ''}</p>
              </div>
            ))}
          </>}
          </>}
        </div>
      )}

      {/* MESSAGES AREA */}
      {!adminView && <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 100, position: 'relative', zIndex: 1 }}>
        {messages.length === 0 && !streaming && (
          <div style={{ textAlign: 'center', padding: '60px 32px', color: 'rgba(255,255,255,0.12)' }}>
            <div style={{ marginBottom: 12, opacity: 0.5 }}><AbaBlob size={48}/></div>
            <p style={{ fontSize: 13, fontWeight: 400 }}>Starting your session...</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isAba = msg.role === 'aba';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              justifyContent: isAba ? 'flex-start' : 'flex-end',
              padding: '3px 14px',
              animation: i === messages.length - 1 ? 'msgIn 0.2s ease-out' : 'none'
            }}>
              {isAba && <AbaBlob size={28}/>}
              <div style={{
                maxWidth: '82%', padding: '10px 14px',
                borderRadius: isAba ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                background: isAba ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.25)',
                border: `1px solid ${isAba ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.3)'}`,
                backdropFilter: 'blur(8px)'
              }}>
                <p style={{
                  color: 'rgba(255,255,255,0.9)', fontSize: 14.5, lineHeight: 1.65,
                  whiteSpace: 'pre-wrap', margin: 0
                }}>
                  {(msg.text || '').split(/(\*\*.*?\*\*)/g).map((part, pi) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={pi} style={{ color: '#a78bfa', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                  {msg.streaming && <span style={{ display: 'inline-block', width: 2, height: 16, background: '#a78bfa', marginLeft: 2, animation: 'pulse 0.8s infinite', verticalAlign: 'text-bottom' }}/>}
                </p>
              </div>
            </div>
          );
        })}

        {streaming && messages[messages.length - 1]?.text === '' && <TypingDots/>}
        <div ref={endRef}/>
      </div>}}

      {/* INPUT BAR — iMessage style */}
      {!adminView && <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 10px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {/* Text field with inline send button */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.06)', borderRadius: 22,
            border: `1px solid ${listening ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
            padding: '2px 4px 2px 16px', minHeight: 42, transition: 'border-color 0.2s'
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={listening ? 'Listening...' : 'Message ABA...'}
              rows={1}
              disabled={streaming}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: listening ? '#a78bfa' : 'rgba(255,255,255,0.9)',
                fontSize: 15, padding: '9px 0', resize: 'none',
                lineHeight: 1.4, maxHeight: 120
              }}
            />
            {input.trim() && (
              <button onClick={handleSend} disabled={streaming} style={{
                width: 30, height: 30, borderRadius: '50%', border: 'none',
                background: '#7c3aed', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, margin: 4
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            )}
          </div>

          {/* Mic button — prominent when no text */}
          {!input.trim() && (
            <button onClick={toggleMic} disabled={streaming} style={{
              width: 42, height: 42, borderRadius: '50%', border: 'none',
              background: listening ? '#7c3aed' : 'rgba(124,58,237,0.15)',
              color: listening ? 'white' : '#a78bfa',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s',
              animation: listening ? 'micPulse 1.5s infinite' : 'none'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
                <rect x={9} y={2} width={6} height={11} rx={3}/>
                <path d="M5 11a7 7 0 0014 0"/>
                <line x1={12} y1={18} x2={12} y2={22}/>
              </svg>
            </button>
          )}
        </div>
      </div>}

      <LessonSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        completedDays={profile?.completedDays}
        onSelect={selectLesson}
        onReset={resetProgress}
        currentLesson={currentLesson}
      />
      <DeckPanel deck={deckContent} onClose={() => setDeckContent(null)}/>
    </div>
  );
}
