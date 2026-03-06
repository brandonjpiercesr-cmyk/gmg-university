// GMG UNIVERSITY v6.2.0 - PROPER BRANDING + INSTANT LOAD + BACKGROUNDS
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

// PROPER BRANDING
const LOGO = {
  gmg: 'https://i.imgur.com/qslzgTU.png',
  aba: 'https://i.imgur.com/0be7HCF.png'
};

// BACKGROUNDS
const BG = {
  pinkSmoke: 'https://i.imgur.com/3RkebB2.jpeg',
  embers: 'https://i.imgur.com/9HZYnlX.png',
  nebula: 'https://i.imgur.com/nLBRQ82.jpeg',
  wetCity: 'https://i.imgur.com/h8zNCw1.jpeg',
  eventHorizon: 'https://i.imgur.com/A44TxCq.jpeg'
};

// Ken Burns Background
const KenBurns = ({ src }) => (
  <div className="fixed inset-0 overflow-hidden -z-10">
    <div 
      className="absolute inset-[-20%] bg-cover bg-center animate-[ken_25s_ease-in-out_infinite_alternate]" 
      style={{ backgroundImage: `url(${src})`, opacity: 0.5 }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
  </div>
);

// Icons
const I = {
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M8 21h8m-4-4v4m-4.5-8a4.5 4.5 0 009 0V5H7.5v8z"/></svg>,
  voice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M19 12a7 7 0 01-14 0m7-8v16m-3-3l3 3 3-3"/></svg>,
  fire: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.5 0-7-2.5-7-7 0-3 2-5.5 3.5-7.5L12 4l3.5 4.5c1.5 2 3.5 4.5 3.5 7.5 0 4.5-3.5 7-7 7z"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 6.5a9 9 0 00-6-2.5c-1 0-2 .2-3 .5v14c1-.3 2-.5 3-.5a9 9 0 016 2.5 9 9 0 016-2.5c1 0 2 .2 3 .5v-14c-1-.3-2-.5-3-.5a9 9 0 00-6 2.5z"/></svg>
};

// CSS for Ken Burns
const style = document.createElement('style');
style.textContent = `@keyframes ken { from { transform: scale(1) translate(0,0); } to { transform: scale(1.1) translate(-2%,-2%); } }`;
document.head.appendChild(style);

const getC = (v, d) => ({ v1: V1_CONTENT, v2: V2_CONTENT, v3: V3_CONTENT }[v]?.[d]);
const VOL = { v1: { t: 'Foundations', f: 'Fundraising Foundations', d: 30 }, v2: { t: 'GMG Way', f: 'The GMG Way', d: 30 }, v3: { t: 'CPP', f: 'CPP Model', d: 15 } };

// Format content for display
const formatContent = (c, name) => {
  if (!c) return `Welcome to today's lesson.`;
  let txt = `${name}, welcome to today's lesson: ${c.title}.\n\n`;
  c.sections?.forEach(s => { txt += `${s.h}\n\n${s.c}\n\n`; });
  if (c.exercise) txt += `Exercise: ${c.exercise}\n\n`;
  if (c.keyTakeaways?.length) txt += `Key Takeaways:\n${c.keyTakeaways.map(t => `• ${t}`).join('\n')}`;
  return txt;
};

export default function App() {
  const [user, setUser] = useState(null), [profile, setProfile] = useState(null), [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'), [vol, setVol] = useState('v1'), [day, setDay] = useState(null);
  const [voice, setVoice] = useState(false), [cohort, setCohort] = useState([]);
  const [msgs, setMsgs] = useState([]), [input, setInput] = useState(''), [typing, setTyping] = useState(false);
  const audioRef = useRef(), endRef = useRef();

  useEffect(() => { onAuthStateChanged(auth, async u => { if (u) { setUser(u); await load(u); } else { setUser(null); setProfile(null); } setLoading(false); }); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const load = async u => {
    const ref = doc(db, 'users', u.uid), snap = await getDoc(ref);
    if (snap.exists()) setProfile(snap.data());
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

  // INSTANT LOAD - show content immediately, then AIR can enhance
  const startLesson = (v, d) => {
    setVol(v); setDay(d); setView('lesson'); setMsgs([]);
    const c = getC(v, d), name = profile?.name?.split(' ')[0] || 'there';
    // Show content INSTANTLY
    const content = formatContent(c, name);
    setMsgs([{ aba: true, text: content }]);
  };

  // Ask ABA a question
  const send = async () => {
    if (!input.trim() || typing) return;
    const msg = input.trim(); setInput(''); setTyping(true);
    setMsgs(p => [...p, { aba: false, text: msg }]);
    const c = getC(vol, day);
    let data = c ? `${c.title}: ` : ''; c?.sections?.forEach(s => { data += `${s.h} - ${s.c.substring(0, 300)} `; });

    try {
      const r = await fetch(AIR, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, user_id: profile?.email, channel: 'gmg_v6',
          context: { systemPrompt: `You are ABA, AI professor at GMG University. Student: ${profile?.name?.split(' ')[0]}. Lesson: ${c?.title}. Content: ${data}. Answer their question helpfully. Be warm and conversational. No markdown symbols.` }
        })
      });
      const res = await r.json();
      setMsgs(p => [...p, { aba: true, text: res.response || res.message || "Let me help with that..." }]);
      if (voice) speak(res.response);
    } catch { setMsgs(p => [...p, { aba: true, text: "Connection issue. Try again?" }]); }
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><KenBurns src={BG.pinkSmoke}/><img src={LOGO.aba} alt="ABA" className="w-20 h-20 animate-pulse relative z-10"/></div>;

  // LOGIN
  if (!user) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      <KenBurns src={BG.pinkSmoke}/>
      <div className="relative z-10 flex flex-col items-center">
        <img src={LOGO.gmg} alt="GMG" className="w-32 h-32 mb-6"/>
        <h1 className="text-3xl font-extralight text-white tracking-tight">GMG <span className="text-violet-400">University</span></h1>
        <p className="text-white/40 text-sm mt-2">Lane-Pierce Fellowship</p>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="mt-10 w-full max-w-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-violet-500/25">Continue with Google</button>
        <p className="text-white/20 text-xs mt-8 tracking-widest">WE ARE ALL ABA</p>
      </div>
    </div>
  );

  // LESSON - INSTANT CONTENT
  if (view === 'lesson' && day) {
    const c = getC(vol, day), done = profile?.completedDays?.includes(`${vol}-d${day}`);
    return (
      <div className="min-h-screen bg-black flex flex-col relative">
        <KenBurns src={BG.embers}/>
        <header className="sticky top-0 z-20 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setView('home')} className="w-8 h-8 text-white/50">{I.back}</button>
          <img src={LOGO.aba} alt="ABA" className="w-8 h-8"/>
          <div className="flex-1"><p className="text-violet-400 text-[10px] tracking-widest">DAY {day} OF {VOL[vol].d}</p><p className="text-white text-sm truncate">{c?.title}</p></div>
          <button onClick={() => setVoice(!voice)} className={`w-8 h-8 ${voice ? 'text-violet-400' : 'text-white/30'}`}>{I.voice}</button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 pb-48 relative z-10">
          {msgs.map((m, i) => (
            <div key={i} className={`mb-5 flex ${m.aba ? 'gap-3' : 'justify-end'}`}>
              {m.aba && <img src={LOGO.aba} alt="ABA" className="w-8 h-8 mt-1 shrink-0"/>}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl backdrop-blur-sm ${m.aba ? 'bg-white/10 border border-white/10 rounded-tl-sm' : 'bg-violet-600/40 border border-violet-500/30 rounded-br-sm'}`}>
                <p className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {typing && <div className="flex gap-3"><img src={LOGO.aba} alt="ABA" className="w-8 h-8"/><div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3"><div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:`${i*100}ms`}}/>)}</div></div></div>}
          <div ref={endRef}/>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 z-20">
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Ask ABA a question..." className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"/>
            <button onClick={send} disabled={!input.trim() || typing} className="bg-violet-600 disabled:bg-white/10 text-white w-12 rounded-xl flex items-center justify-center">{I.send}</button>
          </div>
          <button onClick={complete} className={`w-full mt-3 py-4 rounded-xl font-medium ${done ? 'bg-white/10 text-white/40' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'}`}>{done ? 'Completed' : 'Mark Complete +100 XP'}</button>
        </div>
        <audio ref={audioRef}/>
      </div>
    );
  }

  // LEADERBOARD
  if (view === 'kudos') return (
    <div className="min-h-screen bg-black p-4 relative">
      <KenBurns src={BG.nebula}/>
      <div className="relative z-10">
        <button onClick={() => setView('home')} className="w-8 h-8 text-white/50 mb-4">{I.back}</button>
        <h1 className="text-xl text-white font-light mb-6 flex items-center gap-3"><span className="w-6 h-6 text-amber-400">{I.trophy}</span>Leaderboard</h1>
        <div className="space-y-2">
          {cohort.map((m, i) => (
            <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border ${i === 0 ? 'bg-amber-500/20 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
              <span className={`text-lg font-bold w-6 ${i === 0 ? 'text-amber-400' : 'text-white/30'}`}>{i + 1}</span>
              <img src={m.photoURL || `https://ui-avatars.com/api/?name=${m.name}&background=7c3aed&color=fff`} className="w-10 h-10 rounded-full"/>
              <div className="flex-1"><p className="text-white text-sm">{m.name}</p></div>
              <p className="text-violet-400 font-semibold">{m.xp || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // LEARN (Day Grid)
  if (view === 'learn') {
    const lessons = [...Array(VOL[vol].d)].map((_, i) => ({ d: i + 1, t: (CURRICULUM_TITLES[vol] || [])[i], q: (i + 1) % 5 === 0 }));
    const done = profile?.completedDays || [];
    return (
      <div className="min-h-screen bg-black p-4 relative">
        <KenBurns src={BG.wetCity}/>
        <div className="relative z-10">
          <button onClick={() => setView('home')} className="w-8 h-8 text-white/50 mb-4">{I.back}</button>
          <div className="flex gap-2 mb-6">{Object.entries(VOL).map(([k, v]) => <button key={k} onClick={() => setVol(k)} className={`flex-1 py-3 rounded-xl text-sm font-medium backdrop-blur-sm ${vol === k ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/50 border border-white/10'}`}>{v.t}</button>)}</div>
          <p className="text-white/40 text-xs mb-3">{VOL[vol].f} • {done.filter(d => d.startsWith(vol)).length}/{VOL[vol].d}</p>
          <div className="grid grid-cols-6 gap-2">
            {lessons.map(l => { const k = `${vol}-d${l.d}`, dn = done.includes(k); return (
              <button key={l.d} onClick={() => startLesson(vol, l.d)} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium backdrop-blur-sm ${dn ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/40' : l.q ? 'bg-violet-500/30 text-violet-400 border border-violet-500/40' : 'bg-white/10 text-white/50 border border-white/10'}`}>
                {dn ? <span className="w-4 h-4">{I.check}</span> : l.d}
              </button>
            ); })}
          </div>
        </div>
      </div>
    );
  }

  // HOME
  const cnt = profile?.completedDays?.length || 0, tot = Object.values(VOL).reduce((s, v) => s + v.d, 0), pct = Math.round((cnt / tot) * 100);
  const next = getNext();
  const rank = cohort.findIndex(c => c.id === user?.uid) + 1;

  return (
    <div className="min-h-screen bg-black p-4 pb-8 relative">
      <KenBurns src={BG.pinkSmoke}/>
      <div className="relative z-10">
        {/* Header with logo */}
        <div className="flex items-center gap-4 mb-8">
          <img src={LOGO.aba} alt="ABA" className="w-14 h-14"/>
          <div>
            <h1 className="text-xl text-white">Hey, <span className="text-violet-400">{profile?.name?.split(' ')[0]}</span></h1>
            <p className="text-white/40 text-sm">{cnt === 0 ? 'Ready to start?' : `${pct}% complete`}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-light text-white">{profile?.xp || 0}</p>
            <p className="text-violet-400 text-xs mt-1">XP</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-light text-white flex items-center justify-center gap-1">{profile?.streak || 0}<span className="w-4 h-4 text-amber-400">{I.fire}</span></p>
            <p className="text-amber-400 text-xs mt-1">Streak</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-light text-white">#{rank || '-'}</p>
            <p className="text-emerald-400 text-xs mt-1">Rank</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-2"><span className="text-white/50">Progress</span><span className="text-violet-400">{cnt}/{tot}</span></div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all" style={{ width: `${pct}%` }}/></div>
        </div>

        {/* Next Lesson */}
        {next && (
          <button onClick={() => startLesson(next.vol, next.day)} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-5 mb-4 text-left shadow-lg shadow-violet-500/20">
            <p className="text-white/60 text-xs tracking-wider mb-1">UP NEXT</p>
            <p className="text-white text-lg font-medium">Day {next.day}: {next.title}</p>
            <div className="flex items-center gap-2 mt-3 text-white/80 text-sm"><span className="w-5 h-5">{I.play}</span>Start Lesson</div>
          </button>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setView('learn')} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-left">
            <span className="w-6 h-6 text-violet-400 block mb-2">{I.book}</span>
            <p className="text-white text-sm">All Lessons</p>
          </button>
          <button onClick={() => setView('kudos')} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-left">
            <span className="w-6 h-6 text-amber-400 block mb-2">{I.trophy}</span>
            <p className="text-white text-sm">Leaderboard</p>
          </button>
        </div>

        {/* Sign out */}
        <button onClick={() => signOut(auth)} className="w-full text-white/30 text-sm py-4">Sign Out</button>
      </div>
    </div>
  );
}
