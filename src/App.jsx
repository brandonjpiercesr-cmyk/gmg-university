// GMG UNIVERSITY v6.1.0 - PREMIUM EXPERIENCE
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { V1_CONTENT, V2_CONTENT, V3_CONTENT, CURRICULUM_TITLES } from './curriculum';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);

const AIR = 'https://abacia-services.onrender.com/api/air/process';
const TTS = 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL';
const TTS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';

// GMG Brand
const GMG = { navy: '#191970', copper: '#B87333', platinum: '#E5E4E2', pearl: '#F0EAD6' };

// Icons
const I = {
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M8 21h8m-4-4v4m-4.5-8a4.5 4.5 0 009 0V5H7.5v8z"/></svg>,
  voice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M19 12a7 7 0 01-14 0m7-8v16m-3-3l3 3 3-3"/></svg>,
  fire: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.5 0-7-2.5-7-7 0-3 2-5.5 3.5-7.5L12 4l3.5 4.5c1.5 2 3.5 4.5 3.5 7.5 0 4.5-3.5 7-7 7z"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 6.5a9 9 0 00-6-2.5A9 9 0 003 4.5v14a9 9 0 016 2 9 9 0 016-2V4.5a9 9 0 00-3-.5 9 9 0 00-6 2.5z"/></svg>
};

// Orb
const PALS = { idle: [[139,92,246],[167,139,250],[236,72,153],[99,102,241]], think: [[245,158,11],[251,191,36],[239,68,68],[253,224,71]], speak: [[34,197,94],[16,185,129],[132,204,22],[45,212,191]] };
class Noise{constructor(){this.p=[...Array(512)].map(()=>Math.random()*256|0)}n(x,y){const X=x|0&255,Y=y|0&255,u=(x-=x|0)**3*(x*(x*6-15)+10),v=(y-=y|0)**3*(y*(y*6-15)+10),A=this.p[X]+Y,B=this.p[X+1]+Y,g=(h,a,b)=>((h&1)?-((h&2)?b:a):((h&2)?b:a))+((h&2)?-((h&1)?b:a):((h&1)?b:a));return(1-v)*((1-u)*g(this.p[A],x,y)+u*g(this.p[B],x-1,y))+v*((1-u)*g(this.p[A+1],x,y-1)+u*g(this.p[B+1],x-1,y-1))}}

const Orb = ({ size = 120, state = 'idle', glow = true }) => {
  const ref = useRef(), noise = useRef(new Noise()), st = useRef(state);
  useEffect(() => { st.current = state }, [state]);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'), dpr = Math.min(devicePixelRatio, 2);
    c.width = size * dpr; c.height = size * dpr; ctx.scale(dpr, dpr);
    let t = 0, af;
    const draw = () => {
      const p = PALS[st.current] || PALS.idle;
      t += st.current === 'think' ? 0.035 : 0.018;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2, n = noise.current;
      
      // Outer glow
      if (glow) {
        const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, size * 0.5);
        g.addColorStop(0, `rgba(${p[0][0]},${p[0][1]},${p[0][2]},0.3)`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      }
      
      // Layers
      for (let l = 0; l < 4; l++) {
        const col = p[l], r = size * (0.32 - l * 0.045);
        ctx.beginPath();
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          const nr = r + n.n(Math.cos(a) * 2 + t + l, Math.sin(a) * 2 + t) * size * 0.1;
          i === 0 ? ctx.moveTo(cx + Math.cos(a) * nr, cx + Math.sin(a) * nr) : ctx.lineTo(cx + Math.cos(a) * nr, cx + Math.sin(a) * nr);
        }
        ctx.closePath();
        const gr = ctx.createRadialGradient(cx, cx, 0, cx, cx, r * 1.5);
        gr.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${0.95 - l * 0.18})`);
        gr.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle = gr; ctx.fill();
        if (l === 0) { ctx.shadowColor = `rgba(${col[0]},${col[1]},${col[2]},0.8)`; ctx.shadowBlur = 40; ctx.fill(); ctx.shadowBlur = 0; }
      }
      af = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(af);
  }, [size, glow]);
  return <canvas ref={ref} style={{ width: size, height: size }} />;
};

// Progress Ring
const Ring = ({ pct, size = 140 }) => {
  const r = (size - 16) / 2, c = Math.PI * 2 * r, offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-1000"/>
      <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#d946ef"/></linearGradient></defs>
    </svg>
  );
};

const getC = (v, d) => ({ v1: V1_CONTENT, v2: V2_CONTENT, v3: V3_CONTENT }[v]?.[d]);
const VOL = { v1: { t: 'Foundations', f: 'Fundraising Foundations', d: 30, c: '#8b5cf6' }, v2: { t: 'GMG Way', f: 'The GMG Way', d: 30, c: '#f59e0b' }, v3: { t: 'CPP', f: 'CPP Model', d: 15, c: '#10b981' } };

export default function App() {
  const [user, setUser] = useState(null), [profile, setProfile] = useState(null), [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'), [vol, setVol] = useState('v1'), [day, setDay] = useState(null);
  const [orb, setOrb] = useState('idle'), [voice, setVoice] = useState(false), [cohort, setCohort] = useState([]);
  const [msgs, setMsgs] = useState([]), [input, setInput] = useState(''), [typing, setTyping] = useState(false);
  const audioRef = useRef(), endRef = useRef();

  useEffect(() => { onAuthStateChanged(auth, async u => { if (u) { setUser(u); await load(u); } else { setUser(null); setProfile(null); } setLoading(false); }); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const load = async u => {
    const ref = doc(db, 'users', u.uid), snap = await getDoc(ref);
    if (snap.exists()) { setProfile(snap.data()); }
    else { const np = { email: u.email, name: u.displayName, photoURL: u.photoURL, completedDays: [], xp: 0, streak: 0, createdAt: serverTimestamp() }; await setDoc(ref, np); setProfile(np); }
    const s = await getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10)));
    setCohort(s.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const getNext = () => {
    const done = profile?.completedDays || [];
    for (const [v, info] of Object.entries(VOL)) {
      for (let d = 1; d <= info.d; d++) {
        if (!done.includes(`${v}-d${d}`)) return { vol: v, day: d, title: (CURRICULUM_TITLES[v] || [])[d - 1] || `Day ${d}` };
      }
    }
    return null;
  };

  const startLesson = async (v, d) => {
    setVol(v); setDay(d); setView('lesson'); setMsgs([]); setOrb('think');
    const c = getC(v, d), name = profile?.name?.split(' ')[0] || 'there';
    let data = c ? `${c.title}: ` : ''; c?.sections?.forEach(s => { data += `${s.h} - ${s.c.substring(0, 400)} `; });

    try {
      const r = await fetch(AIR, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Teach Day ${d}`, user_id: profile?.email, channel: 'gmg_v6',
          context: { systemPrompt: `You are ABA, the AI professor at GMG University. Student: ${name}. Lesson: Day ${d} - ${c?.title}. Content: ${data}. Greet ${name} warmly. Teach the FIRST concept engagingly with a real example. End with a question. Be conversational. No markdown. No asterisks.` }
        })
      });
      const res = await r.json();
      setMsgs([{ aba: true, text: res.response || res.message || `${name}, let's learn ${c?.title}.` }]);
      setOrb('speak'); if (voice) speak(res.response); setTimeout(() => setOrb('idle'), 2500);
    } catch { setMsgs([{ aba: true, text: `${name}, welcome to Day ${d}! Today: ${c?.title}. ${c?.sections?.[0]?.c?.substring(0, 250)}... Ready to continue?` }]); setOrb('idle'); }
  };

  const send = async () => {
    if (!input.trim() || typing) return;
    const msg = input.trim(); setInput(''); setTyping(true); setOrb('think');
    setMsgs(p => [...p, { aba: false, text: msg }]);
    const c = getC(vol, day);
    let data = c ? `${c.title}: ` : ''; c?.sections?.forEach(s => { data += `${s.h} - ${s.c.substring(0, 250)} `; });

    try {
      const r = await fetch(AIR, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, user_id: profile?.email, channel: 'gmg_v6',
          context: { systemPrompt: `ABA teaching ${profile?.name?.split(' ')[0]}. Lesson: ${c?.title}. Content: ${data}. History: ${msgs.slice(-3).map(m => m.text.substring(0, 80)).join(' | ')}. Student said: "${msg}". If "continue/yes/next", teach NEXT concept. If question, answer. Stay warm. No markdown.` }
        })
      });
      const res = await r.json();
      setMsgs(p => [...p, { aba: true, text: res.response || res.message || "Let me continue..." }]);
      setOrb('speak'); if (voice) speak(res.response); setTimeout(() => setOrb('idle'), 2500);
    } catch { setMsgs(p => [...p, { aba: true, text: "Connection issue. Try again?" }]); setOrb('idle'); }
    finally { setTyping(false); }
  };

  const speak = async t => { if (!t) return; try { const r = await fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json', 'xi-api-key': TTS_KEY }, body: JSON.stringify({ text: t.substring(0, 500), model_id: 'eleven_turbo_v2_5' }) }); if (audioRef.current && r.ok) { audioRef.current.src = URL.createObjectURL(await r.blob()); audioRef.current.play(); } } catch {} };

  const complete = async () => {
    const k = `${vol}-d${day}`;
    if (profile?.completedDays?.includes(k)) { setView('home'); return; }
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { completedDays: arrayUnion(k), xp: (profile.xp || 0) + 100 });
    setProfile(p => ({ ...p, completedDays: [...(p.completedDays || []), k], xp: (p.xp || 0) + 100 }));
    setView('home');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Orb size={100} state="think"/></div>;

  // LOGIN
  if (!user) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <Orb size={140} state="idle"/>
      <h1 className="text-3xl font-extralight text-white mt-8 tracking-tight">GMG <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">University</span></h1>
      <p className="text-white/40 text-sm mt-2">Lane-Pierce Fellowship</p>
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="mt-10 w-full max-w-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-violet-500/25">Continue with Google</button>
      <p className="text-white/20 text-xs mt-8 tracking-widest">WE ARE ALL ABA</p>
    </div>
  );

  // LESSON
  if (view === 'lesson' && day) {
    const c = getC(vol, day), done = profile?.completedDays?.includes(`${vol}-d${day}`);
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setView('home')} className="w-8 h-8 text-white/40 hover:text-white">{I.back}</button>
          <div className="flex-1"><p className="text-violet-400 text-[10px] tracking-widest font-medium">DAY {day} OF {VOL[vol].d}</p><p className="text-white text-sm truncate">{c?.title}</p></div>
          <button onClick={() => setVoice(!voice)} className={`w-8 h-8 ${voice ? 'text-violet-400' : 'text-white/30'}`}>{I.voice}</button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 pb-48">
          {msgs.length === 0 && <div className="flex flex-col items-center py-20"><Orb size={90} state="think"/><p className="text-white/30 text-sm mt-6">Preparing your lesson...</p></div>}
          {msgs.map((m, i) => (
            <div key={i} className={`mb-5 flex ${m.aba ? 'gap-3' : 'justify-end'}`}>
              {m.aba && <div className="shrink-0 mt-1"><Orb size={36} state={i === msgs.length - 1 ? orb : 'idle'} glow={false}/></div>}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${m.aba ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-tl-sm' : 'bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 border border-violet-500/30 rounded-br-sm'}`}>
                <p className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {typing && <div className="flex gap-3"><div className="shrink-0"><Orb size={36} state="think" glow={false}/></div><div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3"><div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:`${i*100}ms`}}/>)}</div></div></div>}
          <div ref={endRef}/>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pt-8 pb-6 px-4">
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Ask or say continue..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"/>
            <button onClick={send} disabled={!input.trim() || typing} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 disabled:from-white/10 disabled:to-white/10 text-white w-12 rounded-xl flex items-center justify-center">{I.send}</button>
          </div>
          {msgs.length >= 2 && <button onClick={complete} className={`w-full mt-3 py-4 rounded-xl font-medium ${done ? 'bg-white/5 text-white/40' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'}`}>{done ? 'Completed' : 'Mark Complete +100 XP'}</button>}
        </div>
        <audio ref={audioRef}/>
      </div>
    );
  }

  // LEADERBOARD
  if (view === 'kudos') return (
    <div className="min-h-screen bg-black p-4">
      <button onClick={() => setView('home')} className="w-8 h-8 text-white/40 mb-4">{I.back}</button>
      <h1 className="text-xl text-white font-light mb-6 flex items-center gap-3"><span className="w-6 h-6 text-amber-400">{I.trophy}</span>Leaderboard</h1>
      <div className="space-y-2">
        {cohort.map((m, i) => (
          <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30' : 'bg-white/[0.02] border-white/[0.06]'}`}>
            <span className={`text-lg font-bold w-6 ${i === 0 ? 'text-amber-400' : i < 3 ? 'text-white/50' : 'text-white/20'}`}>{i + 1}</span>
            <img src={m.photoURL || `https://ui-avatars.com/api/?name=${m.name}&background=7c3aed&color=fff`} className="w-10 h-10 rounded-full"/>
            <div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{m.name}</p><p className="text-white/30 text-xs">{m.completedDays?.length || 0} lessons</p></div>
            <p className="text-violet-400 font-semibold">{m.xp || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // LEARN (Day Grid)
  if (view === 'learn') {
    const lessons = [...Array(VOL[vol].d)].map((_, i) => ({ d: i + 1, t: (CURRICULUM_TITLES[vol] || [])[i], q: (i + 1) % 5 === 0 }));
    const done = profile?.completedDays || [];
    return (
      <div className="min-h-screen bg-black p-4">
        <button onClick={() => setView('home')} className="w-8 h-8 text-white/40 mb-4">{I.back}</button>
        <div className="flex gap-2 mb-6">{Object.entries(VOL).map(([k, v]) => <button key={k} onClick={() => setVol(k)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${vol === k ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'bg-white/5 text-white/40'}`}>{v.t}</button>)}</div>
        <p className="text-white/40 text-xs mb-3">{VOL[vol].f} • {done.filter(d => d.startsWith(vol)).length}/{VOL[vol].d}</p>
        <div className="grid grid-cols-6 gap-2">
          {lessons.map(l => { const k = `${vol}-d${l.d}`, dn = done.includes(k); return (
            <button key={l.d} onClick={() => startLesson(vol, l.d)} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${dn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : l.q ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}>
              {dn ? <span className="w-4 h-4">{I.check}</span> : l.d}
            </button>
          ); })}
        </div>
      </div>
    );
  }

  // HOME
  const cnt = profile?.completedDays?.length || 0, tot = Object.values(VOL).reduce((s, v) => s + v.d, 0), pct = Math.round((cnt / tot) * 100);
  const next = getNext();
  const rank = cohort.findIndex(c => c.id === user?.uid) + 1;

  return (
    <div className="min-h-screen bg-black p-4 pb-8">
      {/* Hero - Orb + Progress */}
      <div className="relative flex flex-col items-center pt-8 pb-6">
        <div className="relative">
          <Ring pct={pct} size={160}/>
          <div className="absolute inset-0 flex items-center justify-center"><Orb size={100} state="idle"/></div>
        </div>
        <p className="text-white text-3xl font-light mt-4">{pct}<span className="text-white/40 text-lg">%</span></p>
        <p className="text-white/40 text-sm">{cnt} of {tot} complete</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-light text-white">{profile?.xp || 0}</p>
          <p className="text-violet-400 text-xs mt-1">XP Earned</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-light text-white flex items-center justify-center gap-1">{profile?.streak || 0}<span className="w-5 h-5 text-amber-400">{I.fire}</span></p>
          <p className="text-amber-400 text-xs mt-1">Day Streak</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-light text-white">#{rank || '-'}</p>
          <p className="text-emerald-400 text-xs mt-1">Rank</p>
        </div>
      </div>

      {/* Next Lesson Card */}
      {next && (
        <button onClick={() => startLesson(next.vol, next.day)} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-5 mb-4 text-left shadow-lg shadow-violet-500/20">
          <p className="text-white/60 text-xs tracking-wider mb-1">UP NEXT</p>
          <p className="text-white text-lg font-medium">Day {next.day}: {next.title}</p>
          <div className="flex items-center gap-2 mt-3 text-white/80 text-sm"><span className="w-5 h-5">{I.play}</span>Start Lesson</div>
        </button>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => setView('learn')} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-left hover:bg-white/[0.05] transition-colors">
          <span className="w-6 h-6 text-violet-400 block mb-2">{I.book}</span>
          <p className="text-white text-sm">All Lessons</p>
          <p className="text-white/30 text-xs mt-1">Browse curriculum</p>
        </button>
        <button onClick={() => setView('kudos')} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-left hover:bg-white/[0.05] transition-colors">
          <span className="w-6 h-6 text-amber-400 block mb-2">{I.trophy}</span>
          <p className="text-white text-sm">Leaderboard</p>
          <p className="text-white/30 text-xs mt-1">See rankings</p>
        </button>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
        <img src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.name}&background=7c3aed&color=fff`} className="w-10 h-10 rounded-full"/>
        <div className="flex-1"><p className="text-white text-sm">{profile?.name}</p><p className="text-white/30 text-xs">{profile?.email}</p></div>
        <button onClick={() => signOut(auth)} className="text-white/30 text-xs hover:text-white/50">Sign Out</button>
      </div>
    </div>
  );
}
