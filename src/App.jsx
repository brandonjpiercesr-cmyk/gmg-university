// GMG UNIVERSITY v5.6.0 - PREMIUM MOBILE UI
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { V1_CONTENT, V2_CONTENT, V3_CONTENT, CURRICULUM_TITLES } from './curriculum';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app), googleProvider = new GoogleAuthProvider();

const ABA_AIR = 'https://abacia-services.onrender.com/api/air/process';
const ABA_STATUS = 'https://abacia-services.onrender.com/api/air/status';
const TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL';
const TTS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';

const BG = { pinkSmoke: 'https://i.imgur.com/3RkebB2.jpeg', wetCity: 'https://i.imgur.com/kJhWrrX.jpeg', embers: 'https://i.imgur.com/9HZYnlX.png', nebula: 'https://i.imgur.com/nLBRQ82.jpeg', eventHorizon: 'https://i.imgur.com/A44TxCq.jpeg' };

const KenBurns = ({ src, opacity = 50 }) => (<div className="fixed inset-0 overflow-hidden"><div className="absolute inset-[-15%] bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${src})`, opacity: opacity/100 }}/><div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" /></div>);

const PALETTES = { idle: { c: [[139,92,246],[167,139,250],[236,72,153],[99,102,241]] }, thinking: { c: [[245,158,11],[251,191,36],[239,68,68],[253,224,71]] }, speaking: { c: [[34,197,94],[16,185,129],[132,204,22],[45,212,191]] } };

class Noise{constructor(){this.p=Array.from({length:512},()=>Math.floor(Math.random()*256))}n(x,y){const X=Math.floor(x)&255,Y=Math.floor(y)&255;x-=Math.floor(x);y-=Math.floor(y);const u=x*x*x*(x*(x*6-15)+10),v=y*y*y*(y*(y*6-15)+10),A=this.p[X]+Y,B=this.p[X+1]+Y,g=(h,a,b)=>{const hh=h&3;return((hh&1)?-(hh<2?a:b):(hh<2?a:b))+((hh&2)?-(hh<2?b:a):(hh<2?b:a))};return(1-v)*((1-u)*g(this.p[A],x,y)+u*g(this.p[B],x-1,y))+v*((1-u)*g(this.p[A+1],x,y-1)+u*g(this.p[B+1],x-1,y-1))}}

const ABAOrb = ({ size = 200, state = 'idle' }) => {
  const ref = useRef(null), anim = useRef(null), noise = useRef(new Noise()), st = useRef(state);
  useEffect(() => { st.current = state }, [state]);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'), dpr = Math.min(devicePixelRatio||1,2);
    c.width = size*dpr; c.height = size*dpr; ctx.scale(dpr,dpr);
    const ctr = size/2, n = noise.current; let t = 0;
    const draw = () => {
      const pal = PALETTES[st.current]||PALETTES.idle;
      t += st.current==='thinking'?0.03:0.015;
      ctx.clearRect(0,0,size,size);
      for(let l=0;l<4;l++){
        const col=pal.c[l], br=size*(0.28-l*0.03);
        ctx.beginPath();
        for(let i=0;i<=100;i++){const a=(i/100)*Math.PI*2, n1=n.n(Math.cos(a)*2+t+l*0.7,Math.sin(a)*2+t*0.7), r=br+(n1+n.n(Math.cos(a)*4+t*1.3,Math.sin(a)*4)*0.5)*0.3*size*0.15;i===0?ctx.moveTo(ctr+Math.cos(a)*r,ctr+Math.sin(a)*r):ctx.lineTo(ctr+Math.cos(a)*r,ctr+Math.sin(a)*r)}
        ctx.closePath();
        const gr=ctx.createRadialGradient(ctr+Math.sin(t*2)*10,ctr+Math.cos(t*1.5)*10,0,ctr,ctr,br*1.5), al=0.7-l*0.12;
        gr.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${al})`);gr.addColorStop(0.5,`rgba(${col[0]},${col[1]},${col[2]},${al*0.6})`);gr.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle=gr;ctx.fill();
        if(l===0){ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.7)`;ctx.shadowBlur=50;ctx.fill();ctx.shadowBlur=0}
      }
      anim.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(anim.current);
  },[size]);
  return <canvas ref={ref} style={{width:size,height:size}}/>;
};

const getContent = (vol, day) => {
  if (vol === 'v1') return V1_CONTENT[day];
  if (vol === 'v2') return V2_CONTENT[day];
  if (vol === 'v3') return V3_CONTENT[day];
  return null;
};

const formatLessonContent = (content) => {
  if (!content) return "Loading...";
  let text = `**${content.title}**\n\n`;
  content.sections?.forEach(s => { text += `**${s.h}**\n${s.c}\n\n`; });
  if (content.exercise) text += `**Today's Exercise**\n${content.exercise}\n\n`;
  if (content.keyTakeaways) text += `**Key Takeaways**\n${content.keyTakeaways.map(t => `• ${t}`).join('\n')}`;
  return text;
};

const CUR = {
  v1: { title:'Fundraising Foundations', days:30, desc:'Master nonprofit fundraising', icon:'📚', color:'from-purple-500 to-violet-600' },
  v2: { title:'The GMG Way', days:30, desc:'GMG methodologies', icon:'🎯', color:'from-amber-500 to-orange-600' },
  v3: { title:'CPP Model', days:15, desc:'Consultant Pipeline', icon:'💼', color:'from-emerald-500 to-teal-600' }
};

// Stat Card with gradient border
const StatCard = ({ value, label, accent = 'purple' }) => {
  const colors = { purple: 'from-purple-500/50 to-violet-500/50', amber: 'from-amber-500/50 to-orange-500/50', emerald: 'from-emerald-500/50 to-teal-500/50' };
  return (
    <div className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${colors[accent]}`}>
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 text-center h-full">
        <p className="text-3xl font-light text-white">{value}</p>
        <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
};

// Action Button with icon
const ActionButton = ({ onClick, icon, label, primary, small }) => (
  <button onClick={onClick} className={`
    relative overflow-hidden group
    ${primary ? 'bg-gradient-to-r from-purple-600 to-violet-600' : 'bg-white/[0.05]'}
    ${small ? 'p-4' : 'p-5'}
    rounded-2xl w-full flex items-center justify-center gap-3
    border ${primary ? 'border-purple-500/30' : 'border-white/[0.08]'}
    transition-all duration-300
    ${primary ? 'shadow-lg shadow-purple-500/20' : ''}
  `}>
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    <span className="text-xl">{icon}</span>
    <span className={`font-medium ${primary ? 'text-white' : 'text-white/70'} ${small ? 'text-sm' : ''}`}>{label}</span>
  </button>
);

// Progress Ring
const ProgressRing = ({ progress, size = 120 }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000" />
        <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-light text-white">{progress}%</span>
      </div>
    </div>
  );
};

export default function App() {
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
  const [view,setView]=useState('home'),[vol,setVol]=useState('v1'),[day,setDay]=useState(null);
  const [msgs,setMsgs]=useState([]),[input,setInput]=useState(''),[typing,setTyping]=useState(false);
  const [orb,setOrb]=useState('idle'),[prog,setProg]=useState(0),[voice,setVoice]=useState(false);
  const [air,setAir]=useState(null),[cohort,setCohort]=useState([]),[today,setToday]=useState(0);
  const [status,setStatus]=useState('');
  const endRef=useRef(null),audioRef=useRef(null);

  useEffect(()=>{fetch(ABA_STATUS).then(r=>r.json()).then(setAir).catch(console.error)},[]);
  useEffect(()=>{const unsub=onAuthStateChanged(auth,async u=>{if(u){setUser(u);await loadProfile(u);await loadCohort()}else{setUser(null);setProfile(null)}setLoading(false)});return()=>unsub()},[]);

  const loadProfile=async u=>{try{const ref=doc(db,'users',u.uid),snap=await getDoc(ref);if(snap.exists()){const d=snap.data();setProfile(d);setToday(d.lessonsLog?.filter(l=>new Date(l.date).toDateString()===new Date().toDateString())?.length||0)}else{const np={email:u.email,name:u.displayName||'Fellow',photoURL:u.photoURL,completedDays:[],xp:0,streak:0,lessonsLog:[],iep:{strengths:[],gaps:[],notes:[]},createdAt:serverTimestamp()};await setDoc(ref,np);setProfile(np)}}catch(e){console.error(e)}};
  const loadCohort=async()=>{try{const q=query(collection(db,'users'),orderBy('xp','desc'),limit(10)),s=await getDocs(q);setCohort(s.docs.map(d=>({id:d.id,...d.data()})))}catch(e){console.error(e)}};
  const signIn=()=>signInWithPopup(auth,googleProvider);
  const signOff=()=>signOut(auth).then(()=>setView('home'));
  
  const getLessons = (v) => {
    const titles = CURRICULUM_TITLES[v] || [];
    return Array.from({length: CUR[v]?.days || 0}, (_, i) => ({
      day: i + 1, title: titles[i] || `Day ${i + 1}`,
      type: (i + 1) % 5 === 0 ? 'quiz' : i === (CUR[v]?.days - 1) ? 'capstone' : 'lesson'
    }));
  };
  
  const canStart = (l) => {
    const k = `${vol}-d${l.day}`;
    if (profile?.completedDays?.includes(k)) return { ok: false, msg: 'Done' };
    if (l.type === 'quiz' && !profile?.completedDays?.includes(`${vol}-d${l.day - 1}`)) return { ok: false, msg: 'Complete previous' };
    if (today >= 3) return { ok: false, msg: 'Daily limit' };
    return { ok: true };
  };

  const startLesson = (v, d) => {
    const lessons = getLessons(v);
    const l = lessons.find(x => x.day === d);
    const c = canStart(l);
    if (!c.ok) { alert(c.msg); return; }
    setVol(v); setDay(d); setMsgs([]); setProg(0); setView('lesson');
    const content = getContent(v, d);
    if (content) {
      const lessonText = formatLessonContent(content);
      const greeting = `${profile?.name?.split(' ')[0] || 'Fellow'}, welcome to Day ${d}.\n\n${lessonText}`;
      setMsgs([{ role: 'user', content: "I'm ready." }, { role: 'assistant', content: greeting }]);
      setProg(20); setOrb('speaking');
      setTimeout(() => setOrb('idle'), 2000);
    } else {
      setTimeout(() => sendABA("I'm ready for today's lesson.", true), 300);
    }
  };

  const sendABA = async (m, start = false) => {
    setTyping(true); setOrb('thinking'); setStatus('ABA is thinking...');
    const content = getContent(vol, day);
    const lessonContext = content ? formatLessonContent(content) : '';
    const systemPrompt = `You are ABA, AI professor for GMG University. LESSON: ${CUR[vol]?.title} - Day ${day}: ${content?.title}. STUDENT: ${profile?.name}.\n\nLESSON CONTENT:\n${lessonContext}\n\n${start ? 'Greet student, present lesson conversationally.' : 'Answer their question using lesson content.'} Warm, professional. No emojis. We Are All ABA.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      const response = await fetch(ABA_AIR, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: m, user_id: profile?.email || 'guest', channel: 'gmg_university', context: { lesson: content?.title, systemPrompt, mode: 'teaching' } }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      const resp = data.response || data.message || "Let me think about that...";
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: resp }]);
      setOrb('speaking'); setProg(p => Math.min(p + 15, 100)); setStatus('');
      if (voice) speak(resp);
      setTimeout(() => setOrb('idle'), 2000);
    } catch (error) {
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: "Connection issue. Please try again." }]);
      setOrb('idle'); setStatus('');
    } finally { setTyping(false); }
  };

  const speak=async t=>{try{const r=await fetch(TTS_URL,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':TTS_KEY},body:JSON.stringify({text:t.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});if(audioRef.current){audioRef.current.src=URL.createObjectURL(await r.blob());audioRef.current.play()}}catch(e){console.error(e)}};
  const complete=async()=>{if(!user)return;const k=`${vol}-d${day}`;try{const ref=doc(db,'users',user.uid);await updateDoc(ref,{completedDays:arrayUnion(k),xp:(profile.xp||0)+100,lessonsLog:arrayUnion({day:k,date:new Date().toISOString()})});setProfile(p=>({...p,completedDays:[...(p.completedDays||[]),k],xp:(p.xp||0)+100}));setToday(p=>p+1);await loadCohort();setView('learn')}catch(e){console.error(e)}};
  const send=()=>{if(!input.trim()||typing)return;sendABA(input);setInput('')};
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  // LOADING
  if(loading)return(<div className="min-h-screen bg-black flex items-center justify-center"><KenBurns src={BG.pinkSmoke} opacity={60}/><div className="relative z-10 text-center"><ABAOrb size={120} state="thinking"/><p className="text-purple-300/80 font-light mt-6 tracking-widest text-xs uppercase">Initializing</p></div></div>);

  // LOGIN
  if(!user)return(
    <div className="min-h-screen bg-black flex flex-col justify-between p-6 pb-10">
      <KenBurns src={BG.pinkSmoke} opacity={55}/>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <ABAOrb size={100} state="idle"/>
        <h1 className="text-3xl font-extralight text-white mt-6">GMG <span className="text-purple-400">University</span></h1>
        <p className="text-white/40 text-sm mt-2">Lane-Pierce Fellowship</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/>
          <span className="text-emerald-400/70 text-xs">{air?`${air.agents} agents online`:'Connecting...'}</span>
        </div>
      </div>
      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[{t:'75 Days',s:'Training'},{t:'AI-Powered',s:'Learning'},{t:'Personal',s:'IEP'},{t:'Voice',s:'Mode'}].map((x,i)=>(
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
              <p className="text-white/80 text-sm font-medium">{x.t}</p>
              <p className="text-white/30 text-xs">{x.s}</p>
            </div>
          ))}
        </div>
        <button onClick={signIn} className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium py-4 rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <p className="text-center text-white/15 text-[10px] tracking-[0.3em] uppercase">We Are All ABA</p>
      </div>
    </div>
  );

  // LESSON
  if(view==='lesson'&&day){const content=getContent(vol,day);return(
    <div className="min-h-screen bg-black flex flex-col">
      <KenBurns src={BG.embers} opacity={45}/>
      <header className="relative z-10 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <button onClick={()=>setView('learn')} className="text-white/60 p-2 -ml-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
          <div className="text-center flex-1"><p className="text-purple-400 text-[10px] tracking-widest uppercase">Day {day}</p><p className="text-white text-sm font-light truncate px-4">{content?.title || `Lesson ${day}`}</p></div>
          <button onClick={()=>setVoice(!voice)} className={`p-2 -mr-2 rounded-xl ${voice?'text-purple-400':'text-white/40'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg></button>
        </div>
        <div className="mt-3 h-1 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full transition-all" style={{width:`${prog}%`}}/></div>
      </header>
      <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-32">
        <div className="space-y-4">
          {msgs.map((m,i)=>(<div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[90%] rounded-2xl px-4 py-3 ${m.role==='user'?'bg-purple-600/50 border border-purple-500/30':'bg-black/60 backdrop-blur-xl border border-white/10'}`}>{m.role==='assistant'&&<div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10"><ABAOrb size={24} state={orb}/><span className="text-purple-400 text-xs">ABA</span></div>}<p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p></div></div>))}
          {typing&&(<div className="flex justify-start"><div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3"><div className="flex items-center gap-2 mb-2"><ABAOrb size={24} state="thinking"/><span className="text-amber-400 text-xs">{status||'Thinking'}</span></div><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}}/>)}</div></div></div>)}
          <div ref={endRef}/>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 safe-area-bottom">
        <div className="flex gap-3">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()} placeholder="Ask a question..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 text-sm"/>
          <button onClick={send} disabled={!input.trim()||typing} className="bg-purple-600 disabled:bg-white/10 text-white disabled:text-white/30 font-medium px-5 py-3 rounded-xl">Send</button>
        </div>
        {prog>=50&&<button onClick={complete} className="w-full mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-500/20">Complete +100 XP</button>}
      </div>
      <audio ref={audioRef}/>
    </div>
  )}

  // KUDOS
  if(view==='kudos')return(
    <div className="min-h-screen bg-black">
      <KenBurns src={BG.nebula} opacity={50}/>
      <div className="relative z-10 p-4 safe-area-top">
        <button onClick={()=>setView('home')} className="text-white/60 p-2 -ml-2 mb-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
        <h1 className="text-2xl font-extralight text-white mb-6 flex items-center gap-3"><span className="text-3xl">🏆</span>Leaderboard</h1>
        <div className="space-y-3">
          {cohort.map((m,i)=>(
            <div key={m.id} className={`relative p-[1px] rounded-2xl ${i===0?'bg-gradient-to-r from-amber-500 to-orange-500':'bg-gradient-to-r from-white/10 to-white/5'}`}>
              <div className="flex items-center gap-4 p-4 bg-black/80 backdrop-blur-xl rounded-2xl">
                <span className={`text-2xl font-bold w-8 ${i===0?'text-amber-400':i===1?'text-slate-300':i===2?'text-amber-600':'text-white/30'}`}>{i+1}</span>
                <img src={m.photoURL||`https://ui-avatars.com/api/?name=${m.name||'U'}&background=8b5cf6&color=fff`} className="w-12 h-12 rounded-full border-2 border-white/20"/>
                <div className="flex-1 min-w-0"><p className="text-white font-medium truncate">{m.name||'Fellow'}</p><p className="text-white/40 text-sm">{m.completedDays?.length||0} lessons</p></div>
                <div className="text-right"><p className="text-purple-400 font-bold text-lg">{m.xp||0}</p><p className="text-white/30 text-xs">XP</p></div>
              </div>
            </div>
          ))}
          {!cohort.length&&<p className="text-white/30 text-center py-8">No members yet</p>}
        </div>
      </div>
    </div>
  );

  // IEP
  if(view==='iep')return(
    <div className="min-h-screen bg-black">
      <KenBurns src={BG.eventHorizon} opacity={45}/>
      <div className="relative z-10 p-4 safe-area-top">
        <button onClick={()=>setView('home')} className="text-white/60 p-2 -ml-2 mb-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
        <h1 className="text-2xl font-extralight text-white mb-6 flex items-center gap-3"><span className="text-3xl">📋</span>My Learning Plan</h1>
        <div className="space-y-4">
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-emerald-500/50 to-teal-500/50">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4"><div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"/><h3 className="text-emerald-400 font-medium">Strengths</h3></div>
              {profile?.iep?.strengths?.length?<ul className="space-y-2">{profile.iep.strengths.map((s,i)=><li key={i} className="text-white/70 text-sm flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span>{s}</li>)}</ul>:<p className="text-white/30 text-sm">Complete lessons to identify your strengths</p>}
            </div>
          </div>
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-amber-500/50 to-orange-500/50">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4"><div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"/><h3 className="text-amber-400 font-medium">Growth Areas</h3></div>
              {profile?.iep?.gaps?.length?<ul className="space-y-2">{profile.iep.gaps.map((g,i)=><li key={i} className="text-white/70 text-sm flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span>{g}</li>)}</ul>:<p className="text-white/30 text-sm">ABA will identify areas for development</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // LEARN
  if(view==='learn'){const lessons=getLessons(vol),done=profile?.completedDays||[];return(
    <div className="min-h-screen bg-black pb-6">
      <KenBurns src={BG.wetCity} opacity={45}/>
      <div className="relative z-10 p-4 safe-area-top">
        <button onClick={()=>setView('home')} className="text-white/60 p-2 -ml-2 mb-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
        
        {/* Volume Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {Object.entries(CUR).map(([k,x])=>(
            <button key={k} onClick={()=>setVol(k)} className={`flex-shrink-0 px-4 py-2.5 rounded-xl flex items-center gap-2 ${vol===k?`bg-gradient-to-r ${x.color} shadow-lg`:'bg-white/[0.05] border border-white/[0.08]'}`}>
              <span>{x.icon}</span>
              <span className={`text-sm font-medium ${vol===k?'text-white':'text-white/60'}`}>{x.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Volume Header */}
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/30 to-amber-500/30 mb-6">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{CUR[vol].icon}</div>
              <div><h2 className="text-xl font-light text-white">{CUR[vol].title}</h2><p className="text-white/40 text-sm">{CUR[vol].desc}</p></div>
            </div>
          </div>
        </div>

        {today>=2&&<div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3"><span className="text-xl">⚠️</span><p className="text-amber-400 text-sm">{today>=3?'Daily limit reached. Return tomorrow.':`${3-today} lesson${3-today>1?'s':''} remaining today`}</p></div>}

        {/* Day Grid */}
        <div className="grid grid-cols-5 gap-2">
          {lessons.map(l=>{
            const k=`${vol}-d${l.day}`,dn=done.includes(k),isQ=l.type==='quiz',isCap=l.type==='capstone',c=canStart(l);
            return(
              <button key={l.day} onClick={()=>c.ok&&startLesson(vol,l.day)} disabled={!c.ok&&!dn} className={`
                aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden
                ${dn?'bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-emerald-500/50':
                  isQ?'bg-gradient-to-br from-purple-500/30 to-violet-500/30 border-purple-500/50':
                  isCap?'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-amber-500/50':
                  !c.ok?'bg-white/[0.02] border-white/[0.05]':'bg-white/[0.05] border-white/[0.1] active:scale-95'}
                border transition-transform
              `}>
                {dn&&<div className="absolute inset-0 flex items-center justify-center"><svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>}
                {!dn&&<span className={`text-lg font-medium ${!c.ok?'text-white/20':isQ?'text-purple-400':isCap?'text-amber-400':'text-white/70'}`}>{l.day}</span>}
                {!dn&&(isQ||isCap)&&<span className={`text-[8px] mt-0.5 ${isQ?'text-purple-400/70':'text-amber-400/70'}`}>{isQ?'QUIZ':'FINAL'}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )}

  // HOME
  const cnt=profile?.completedDays?.length||0,tot=Object.values(CUR).reduce((s,v)=>s+v.days,0),pct=Math.round((cnt/tot)*100);
  return(
    <div className="min-h-screen bg-black pb-6">
      <KenBurns src={BG.pinkSmoke} opacity={50}/>
      <div className="relative z-10 p-4 safe-area-top">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ABAOrb size={60} state="idle"/>
          <div className="flex-1">
            <h1 className="text-xl font-light text-white">Welcome back, <span className="text-purple-400">{profile?.name?.split(' ')[0]||'Fellow'}</span></h1>
            <p className="text-white/40 text-sm">{cnt===0?'Ready to start your journey?':`${tot-cnt} lessons to go`}</p>
          </div>
        </div>

        {/* Progress Ring + Stats */}
        <div className="flex items-center gap-6 mb-8">
          <ProgressRing progress={pct} size={100}/>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <StatCard value={cnt} label="Completed" accent="purple"/>
            <StatCard value={profile?.xp||0} label="XP" accent="amber"/>
            <StatCard value={profile?.streak||0} label="Day Streak" accent="emerald"/>
            <StatCard value={tot-cnt} label="Remaining" accent="purple"/>
          </div>
        </div>

        {/* Main Actions */}
        <div className="space-y-3 mb-6">
          <ActionButton onClick={()=>setView('learn')} icon="📚" label="Continue Learning" primary/>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton onClick={()=>setView('kudos')} icon="🏆" label="Leaderboard" small/>
            <ActionButton onClick={()=>setView('iep')} icon="📋" label="My Plan" small/>
          </div>
        </div>

        {/* Quick Access Volumes */}
        <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">Volumes</h3>
        <div className="space-y-2 mb-6">
          {Object.entries(CUR).map(([k,x])=>{
            const volDone = (profile?.completedDays||[]).filter(d=>d.startsWith(k)).length;
            const volPct = Math.round((volDone/x.days)*100);
            return(
              <button key={k} onClick={()=>{setVol(k);setView('learn')}} className="w-full relative p-[1px] rounded-xl bg-gradient-to-r from-white/10 to-white/5">
                <div className="flex items-center gap-4 p-4 bg-black/80 backdrop-blur-xl rounded-xl">
                  <span className="text-2xl">{x.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white text-sm font-medium">{x.title}</p>
                    <p className="text-white/40 text-xs">{volDone}/{x.days} completed</p>
                  </div>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90"><circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/><circle cx="24" cy="24" r="20" fill="none" stroke={k==='v1'?'#8b5cf6':k==='v2'?'#f59e0b':'#10b981'} strokeWidth="3" strokeLinecap="round" strokeDasharray={125.6} strokeDashoffset={125.6-(volPct/100)*125.6}/></svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">{volPct}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sign Out */}
        <button onClick={signOff} className="w-full text-white/30 text-sm py-3">Sign Out</button>
      </div>
    </div>
  );
}
