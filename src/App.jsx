// GMG UNIVERSITY v6.0 - PREMIUM
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

const I = {
  back: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>,
  send: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  voice: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>,
  check: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>,
  trophy: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872"/></svg>,
  play: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
};

const PAL = { idle: [[139,92,246],[167,139,250],[236,72,153]], think: [[245,158,11],[251,191,36],[239,68,68]], speak: [[34,197,94],[16,185,129],[132,204,22]] };
class N{constructor(){this.p=Array.from({length:512},()=>Math.floor(Math.random()*256))}n(x,y){const X=Math.floor(x)&255,Y=Math.floor(y)&255;x-=Math.floor(x);y-=Math.floor(y);const u=x*x*x*(x*(x*6-15)+10),v=y*y*y*(y*(y*6-15)+10),A=this.p[X]+Y,B=this.p[X+1]+Y,g=(h,a,b)=>{const hh=h&3;return((hh&1)?-(hh<2?a:b):(hh<2?a:b))+((hh&2)?-(hh<2?b:a):(hh<2?b:a))};return(1-v)*((1-u)*g(this.p[A],x,y)+u*g(this.p[B],x-1,y))+v*((1-u)*g(this.p[A+1],x,y-1)+u*g(this.p[B+1],x-1,y-1))}}

const Orb = ({ size = 50, state = 'idle' }) => {
  const ref = useRef(null), noise = useRef(new N()), st = useRef(state);
  useEffect(() => { st.current = state }, [state]);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'), dpr = 2;
    c.width = size*dpr; c.height = size*dpr; ctx.scale(dpr,dpr);
    let t = 0, af;
    const draw = () => {
      const pal = PAL[st.current] || PAL.idle;
      t += st.current === 'think' ? 0.04 : 0.02;
      ctx.clearRect(0,0,size,size);
      const ctr = size/2, n = noise.current;
      for(let l=0;l<3;l++){
        const col=pal[l], br=size*(0.35-l*0.06);
        ctx.beginPath();
        for(let i=0;i<=60;i++){const a=(i/60)*Math.PI*2, r=br+n.n(Math.cos(a)*2+t+l,Math.sin(a)*2+t)*size*0.08;i===0?ctx.moveTo(ctr+Math.cos(a)*r,ctr+Math.sin(a)*r):ctx.lineTo(ctr+Math.cos(a)*r,ctr+Math.sin(a)*r)}
        ctx.closePath();
        const gr=ctx.createRadialGradient(ctr,ctr,0,ctr,ctr,br*1.5);
        gr.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${0.9-l*0.2})`);
        gr.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle=gr;ctx.fill();
        if(l===0){ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.6)`;ctx.shadowBlur=25;ctx.fill();ctx.shadowBlur=0}
      }
      af=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(af);
  },[size]);
  return <canvas ref={ref} style={{width:size,height:size}} className="shrink-0"/>;
};

const getC = (v, d) => ({ v1: V1_CONTENT, v2: V2_CONTENT, v3: V3_CONTENT }[v]?.[d]);
const VOL = { v1: { t: 'Foundations', d: 30 }, v2: { t: 'GMG Way', d: 30 }, v3: { t: 'CPP', d: 15 } };

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [vol, setVol] = useState('v1');
  const [day, setDay] = useState(null);
  const [orb, setOrb] = useState('idle');
  const [voice, setVoice] = useState(false);
  const [cohort, setCohort] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { onAuthStateChanged(auth, async u => { if (u) { setUser(u); await loadProfile(u); await loadCohort(); } else { setUser(null); setProfile(null); } setLoading(false); }); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const loadProfile = async u => { const ref = doc(db, 'users', u.uid), snap = await getDoc(ref); if (snap.exists()) setProfile(snap.data()); else { const np = { email: u.email, name: u.displayName || 'Fellow', photoURL: u.photoURL, completedDays: [], xp: 0, streak: 0, lessonsLog: [], createdAt: serverTimestamp() }; await setDoc(ref, np); setProfile(np); } };
  const loadCohort = async () => { const s = await getDocs(query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10))); setCohort(s.docs.map(d => ({ id: d.id, ...d.data() }))); };
  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const signOff = () => signOut(auth).then(() => setView('home'));
  const getLessons = v => Array.from({ length: VOL[v]?.d || 0 }, (_, i) => ({ day: i + 1, title: (CURRICULUM_TITLES[v] || [])[i] || `Day ${i + 1}`, quiz: (i + 1) % 5 === 0 }));

  const startLesson = async (v, d) => {
    setVol(v); setDay(d); setView('lesson'); setMsgs([]); setReady(false); setOrb('think');
    const c = getC(v, d), name = profile?.name?.split(' ')[0] || 'there';
    let data = c ? `${c.title}: ` : '';
    c?.sections?.forEach(s => { data += `${s.h} - ${s.c.substring(0, 500)} `; });

    try {
      const r = await fetch(AIR, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Teach Day ${d}`, user_id: profile?.email, channel: 'gmg_v6',
          context: { systemPrompt: `You are ABA, AI professor at GMG University. Student: ${name}. Lesson: Day ${d} - ${c?.title}. Content: ${data}. 

TEACH THIS LESSON. Greet ${name} warmly. Introduce the topic. Teach the FIRST key concept with a real example. End by asking if they understand or want to continue.

Be conversational, engaging, warm. ONE concept at a time. No markdown symbols. No asterisks.` }
        })
      });
      const res = await r.json();
      setMsgs([{ aba: true, text: res.response || res.message || `${name}, let's learn ${c?.title} today.` }]);
      setOrb('speak'); if (voice) speak(res.response); setTimeout(() => setOrb('idle'), 2000);
    } catch (e) {
      setMsgs([{ aba: true, text: `${name}, welcome to Day ${d}! Today: ${c?.title}.\n\n${c?.sections?.[0]?.c?.substring(0, 300)}...\n\nReady to continue?` }]);
      setOrb('idle');
    }
  };

  const send = async () => {
    if (!input.trim() || typing) return;
    const msg = input.trim(); setInput(''); setTyping(true); setOrb('think');
    setMsgs(p => [...p, { aba: false, text: msg }]);
    const c = getC(vol, day);
    let data = c ? `${c.title}: ` : '';
    c?.sections?.forEach(s => { data += `${s.h} - ${s.c.substring(0, 300)} `; });

    try {
      const r = await fetch(AIR, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg, user_id: profile?.email, channel: 'gmg_v6',
          context: { systemPrompt: `ABA teaching ${profile?.name?.split(' ')[0]}. Lesson: ${c?.title}. Content: ${data}. History: ${msgs.slice(-3).map(m => m.text.substring(0, 100)).join(' | ')}. Student said: "${msg}". If "continue/yes/next", teach NEXT concept. If question, answer it. Stay warm. No markdown.` }
        })
      });
      const res = await r.json();
      setMsgs(p => [...p, { aba: true, text: res.response || res.message || "Let me continue..." }]);
      setOrb('speak'); if (voice) speak(res.response); setTimeout(() => setOrb('idle'), 2000); setReady(true);
    } catch (e) {
      setMsgs(p => [...p, { aba: true, text: "Connection issue. Try again?" }]); setOrb('idle');
    } finally { setTyping(false); }
  };

  const speak = async t => { if (!t) return; try { const r = await fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json', 'xi-api-key': TTS_KEY }, body: JSON.stringify({ text: t.substring(0, 600), model_id: 'eleven_turbo_v2_5' }) }); if (audioRef.current && r.ok) { audioRef.current.src = URL.createObjectURL(await r.blob()); audioRef.current.play(); } } catch (e) { } };

  const complete = async () => {
    const k = `${vol}-d${day}`;
    if (profile?.completedDays?.includes(k)) { setView('learn'); return; }
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { completedDays: arrayUnion(k), xp: (profile.xp || 0) + 100, lessonsLog: arrayUnion({ day: k, date: new Date().toISOString() }) });
    setProfile(p => ({ ...p, completedDays: [...(p.completedDays || []), k], xp: (p.xp || 0) + 100 }));
    await loadCohort(); setView('learn');
  };

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Orb size={60} state="think"/></div>;

  if (!user) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <Orb size={80} state="idle"/>
        <h1 className="text-2xl font-light text-white mt-6">GMG <span className="text-violet-400">University</span></h1>
        <p className="text-white/40 text-sm mt-1">Lane-Pierce Fellowship</p>
      </div>
      <button onClick={signIn} className="w-full bg-violet-600 text-white py-4 rounded-2xl font-medium">Continue with Google</button>
    </div>
  );

  if (view === 'lesson' && day) {
    const c = getC(vol, day), done = profile?.completedDays?.includes(`${vol}-d${day}`);
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col">
        <header className="sticky top-0 z-10 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setView('learn')} className="text-white/40">{I.back}</button>
          <div className="flex-1"><p className="text-violet-400 text-[10px] tracking-widest">DAY {day}</p><p className="text-white text-sm truncate">{c?.title}</p></div>
          <button onClick={() => setVoice(!voice)} className={voice ? 'text-violet-400' : 'text-white/30'}>{I.voice}</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-48">
          {msgs.length === 0 && <div className="flex flex-col items-center py-16"><Orb size={70} state="think"/><p className="text-white/40 text-sm mt-4">ABA is preparing...</p></div>}
          {msgs.map((m, i) => (
            <div key={i} className={`mb-4 flex ${m.aba ? 'gap-3' : 'justify-end'}`}>
              {m.aba && <Orb size={32} state={i === msgs.length - 1 ? orb : 'idle'}/>}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${m.aba ? 'bg-white/5 border border-white/10 rounded-tl-sm' : 'bg-violet-600/30 border border-violet-500/30 rounded-br-sm'}`}>
                <p className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {typing && <div className="flex gap-3"><Orb size={32} state="think"/><div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3"><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce" style={{animationDelay:`${i*100}ms`}}/>)}</div></div></div>}
          <div ref={endRef}/>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-[#09090b] border-t border-white/5 p-4">
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Type here..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"/>
            <button onClick={send} disabled={!input.trim() || typing} className="bg-violet-600 disabled:bg-white/10 text-white p-3 rounded-xl">{I.send}</button>
          </div>
          {(ready || msgs.length >= 2) && <button onClick={complete} className={`w-full mt-3 py-3 rounded-xl font-medium ${done ? 'bg-white/5 text-white/40' : 'bg-emerald-600 text-white'}`}>{done ? 'Done' : 'Complete +100 XP'}</button>}
        </div>
        <audio ref={audioRef}/>
      </div>
    );
  }

  if (view === 'kudos') return (
    <div className="min-h-screen bg-[#09090b] p-4">
      <button onClick={() => setView('home')} className="text-white/40 mb-4">{I.back}</button>
      <h1 className="text-xl text-white mb-4 flex items-center gap-2">{I.trophy} Leaderboard</h1>
      {cohort.map((m, i) => <div key={m.id} className={`flex items-center gap-3 p-3 mb-2 rounded-xl ${i === 0 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-white/5 border border-white/10'}`}><span className={`w-6 font-bold ${i === 0 ? 'text-amber-400' : 'text-white/30'}`}>{i + 1}</span><img src={m.photoURL || `https://ui-avatars.com/api/?name=${m.name}&background=7c3aed&color=fff`} className="w-9 h-9 rounded-full"/><div className="flex-1"><p className="text-white text-sm">{m.name}</p></div><p className="text-violet-400 font-medium">{m.xp || 0}</p></div>)}
    </div>
  );

  if (view === 'learn') {
    const lessons = getLessons(vol), done = profile?.completedDays || [];
    return (
      <div className="min-h-screen bg-[#09090b] p-4">
        <button onClick={() => setView('home')} className="text-white/40 mb-4">{I.back}</button>
        <div className="flex gap-2 mb-4">{Object.entries(VOL).map(([k, x]) => <button key={k} onClick={() => setVol(k)} className={`flex-1 py-2 rounded-xl text-sm ${vol === k ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50'}`}>{x.t}</button>)}</div>
        <div className="grid grid-cols-6 gap-2">
          {lessons.map(l => { const k = `${vol}-d${l.day}`, dn = done.includes(k); return (
            <button key={l.day} onClick={() => startLesson(vol, l.day)} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${dn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : l.quiz ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40' : 'bg-white/5 text-white/50 border border-white/10'}`}>
              {dn ? I.check : l.day}
            </button>
          ); })}
        </div>
      </div>
    );
  }

  const cnt = profile?.completedDays?.length || 0, tot = Object.values(VOL).reduce((s, v) => s + v.d, 0);
  return (
    <div className="min-h-screen bg-[#09090b] p-4">
      <div className="flex items-center gap-4 mb-6"><Orb size={50} state="idle"/><div><h1 className="text-lg text-white">Hey, <span className="text-violet-400">{profile?.name?.split(' ')[0]}</span></h1><p className="text-white/40 text-sm">{tot - cnt} lessons left</p></div></div>
      <div className="grid grid-cols-3 gap-3 mb-6">{[{ v: cnt, l: 'Done' }, { v: profile?.streak || 0, l: 'Streak' }, { v: profile?.xp || 0, l: 'XP' }].map((s, i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"><p className="text-xl text-white">{s.v}</p><p className="text-white/40 text-xs">{s.l}</p></div>)}</div>
      <button onClick={() => setView('learn')} className="w-full bg-violet-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 mb-3">{I.play} Continue</button>
      <button onClick={() => setView('kudos')} className="w-full bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">{I.trophy} Leaderboard</button>
      <button onClick={signOff} className="w-full text-white/20 text-sm py-4 mt-4">Sign Out</button>
    </div>
  );
}
