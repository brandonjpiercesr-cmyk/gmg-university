// GMG UNIVERSITY v5.7.0 - SVG ICONS, MOBILE-PROPER
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

const BG = { pinkSmoke: 'https://i.imgur.com/3RkebB2.jpeg', wetCity: 'https://i.imgur.com/kJhWrrX.jpeg', embers: 'https://i.imgur.com/9HZYnlX.png', nebula: 'https://i.imgur.com/nLBRQ82.jpeg' };

// SVG Icons
const Icons = {
  book: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>,
  target: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0m9-5a5 5 0 110 10 5 5 0 010-10m0 3a2 2 0 110 4 2 2 0 010-4"/></svg>,
  briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>,
  trophy: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.66 6.66 0 01-2.48.501 6.66 6.66 0 01-2.48-.5m4.96 0a7.454 7.454 0 01-.982 3.172M14.98 9.728a6.022 6.022 0 01-5.957 0"/></svg>,
  clipboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>,
  check: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  back: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>,
  play: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg>,
  speaker: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>,
  star: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>,
  lock: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
};

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

const getContent = (vol, day) => ({ v1: V1_CONTENT, v2: V2_CONTENT, v3: V3_CONTENT }[vol]?.[day]);
const formatLessonContent = (content) => {
  if (!content) return "Loading...";
  let text = `**${content.title}**\n\n`;
  content.sections?.forEach(s => { text += `**${s.h}**\n${s.c}\n\n`; });
  if (content.exercise) text += `**Today's Exercise**\n${content.exercise}\n\n`;
  if (content.keyTakeaways) text += `**Key Takeaways**\n${content.keyTakeaways.map(t => `• ${t}`).join('\n')}`;
  return text;
};

const CUR = {
  v1: { title:'Fundraising Foundations', days:30, desc:'Master nonprofit fundraising', icon: Icons.book, color:'purple' },
  v2: { title:'The GMG Way', days:30, desc:'GMG methodologies', icon: Icons.target, color:'amber' },
  v3: { title:'CPP Model', days:15, desc:'Consultant Pipeline', icon: Icons.briefcase, color:'emerald' }
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
  
  const getLessons = (v) => Array.from({length: CUR[v]?.days || 0}, (_, i) => ({
    day: i + 1, title: (CURRICULUM_TITLES[v] || [])[i] || `Day ${i + 1}`,
    type: (i + 1) % 5 === 0 ? 'quiz' : i === (CUR[v]?.days - 1) ? 'capstone' : 'lesson'
  }));
  
  const canStart = (l) => {
    const k = `${vol}-d${l.day}`;
    if (profile?.completedDays?.includes(k)) return { ok: false, done: true };
    if (l.type === 'quiz' && !profile?.completedDays?.includes(`${vol}-d${l.day - 1}`)) return { ok: false };
    if (today >= 3) return { ok: false };
    return { ok: true };
  };

  const startLesson = (v, d) => {
    const lessons = getLessons(v), l = lessons.find(x => x.day === d), c = canStart(l);
    if (!c.ok && !c.done) return;
    if (c.done) { setVol(v); setDay(d); setView('lesson'); return; }
    setVol(v); setDay(d); setMsgs([]); setProg(0); setView('lesson');
    const content = getContent(v, d);
    if (content) {
      const lessonText = formatLessonContent(content);
      setMsgs([{ role: 'user', content: "I'm ready." }, { role: 'assistant', content: `${profile?.name?.split(' ')[0] || 'Fellow'}, welcome to Day ${d}.\n\n${lessonText}` }]);
      setProg(20); setOrb('speaking'); setTimeout(() => setOrb('idle'), 2000);
    }
  };

  const sendABA = async (m) => {
    setTyping(true); setOrb('thinking'); setStatus('Thinking...');
    const content = getContent(vol, day);
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 60000);
      const response = await fetch(ABA_AIR, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: m, user_id: profile?.email || 'guest', channel: 'gmg_university', context: { lesson: content?.title, systemPrompt: `You are ABA. LESSON: ${content?.title}. CONTENT: ${formatLessonContent(content)}. Answer based on lesson. Be warm, professional. No emojis.`, mode: 'teaching' } }),
        signal: controller.signal
      });
      const data = await response.json();
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: data.response || data.message || "Let me think..." }]);
      setOrb('speaking'); setProg(p => Math.min(p + 15, 100)); setStatus('');
      if (voice) speak(data.response);
      setTimeout(() => setOrb('idle'), 2000);
    } catch (e) {
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: "Connection issue. Try again." }]);
      setOrb('idle'); setStatus('');
    } finally { setTyping(false); }
  };

  const speak=async t=>{try{const r=await fetch(TTS_URL,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':TTS_KEY},body:JSON.stringify({text:t?.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});if(audioRef.current&&r.ok){audioRef.current.src=URL.createObjectURL(await r.blob());audioRef.current.play()}}catch(e){}};
  const complete=async()=>{if(!user)return;const k=`${vol}-d${day}`;try{const ref=doc(db,'users',user.uid);await updateDoc(ref,{completedDays:arrayUnion(k),xp:(profile.xp||0)+100,lessonsLog:arrayUnion({day:k,date:new Date().toISOString()})});setProfile(p=>({...p,completedDays:[...(p.completedDays||[]),k],xp:(p.xp||0)+100}));setToday(p=>p+1);await loadCohort();setView('learn')}catch(e){console.error(e)}};
  const send=()=>{if(!input.trim()||typing)return;sendABA(input);setInput('')};
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  // LOADING
  if(loading)return(<div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center"><div className="text-center"><ABAOrb size={80} state="thinking"/><p className="text-purple-400/60 text-xs mt-4 tracking-widest">LOADING</p></div></div>);

  // LOGIN
  if(!user)return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <ABAOrb size={80} state="idle"/>
        <h1 className="text-2xl font-light text-white mt-6">GMG <span className="text-purple-400">University</span></h1>
        <p className="text-white/40 text-sm mt-1">Lane-Pierce Fellowship</p>
        <div className="flex items-center gap-2 mt-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/><span className="text-emerald-400/60 text-xs">{air?`${air.agents} agents`:'...'}</span></div>
      </div>
      <button onClick={signIn} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-3">
        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>
    </div>
  );

  // LESSON VIEW
  if(view==='lesson'&&day){const content=getContent(vol,day);return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex flex-col">
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={()=>setView('learn')} className="text-white/50 p-1">{Icons.back}</button>
          <div className="text-center flex-1 px-4"><p className="text-purple-400 text-[10px] tracking-widest">DAY {day}</p><p className="text-white text-sm truncate">{content?.title}</p></div>
          <button onClick={()=>setVoice(!voice)} className={voice?'text-purple-400':'text-white/30'}>{Icons.speaker}</button>
        </div>
        <div className="mt-3 h-1 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full" style={{width:`${prog}%`}}/></div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 pb-40">
        {msgs.map((m,i)=>(<div key={i} className={`mb-4 flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role==='user'?'bg-purple-600/40':'bg-white/5 border border-white/10'}`}>{m.role==='assistant'&&<div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10"><ABAOrb size={20} state={orb}/><span className="text-purple-400 text-xs">ABA</span></div>}<p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p></div></div>))}
        {typing&&<div className="flex justify-start"><div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3"><div className="flex items-center gap-2 mb-2"><ABAOrb size={20} state="thinking"/><span className="text-amber-400 text-xs">{status}</span></div><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce" style={{animationDelay:`${i*100}ms`}}/>)}</div></div></div>}
        <div ref={endRef}/>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="flex gap-3"><input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()} placeholder="Ask a question..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"/><button onClick={send} disabled={!input.trim()||typing} className="bg-purple-600 disabled:bg-white/10 text-white px-5 py-3 rounded-xl text-sm">Send</button></div>
        {prog>=50&&!profile?.completedDays?.includes(`${vol}-d${day}`)&&<button onClick={complete} className="w-full mt-3 bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium">Complete +100 XP</button>}
      </div>
      <audio ref={audioRef}/>
    </div>
  )}

  // KUDOS
  if(view==='kudos')return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <button onClick={()=>setView('home')} className="text-white/50 p-1 mb-4">{Icons.back}</button>
      <div className="flex items-center gap-3 mb-6"><div className="text-purple-400">{Icons.trophy}</div><h1 className="text-xl font-light text-white">Leaderboard</h1></div>
      <div className="space-y-2">
        {cohort.map((m,i)=>(<div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${i===0?'bg-amber-500/10 border border-amber-500/30':'bg-white/5 border border-white/10'}`}><span className={`text-lg font-bold w-6 ${i===0?'text-amber-400':i<3?'text-white/60':'text-white/30'}`}>{i+1}</span><img src={m.photoURL||`https://ui-avatars.com/api/?name=${m.name||'U'}&background=8b5cf6&color=fff`} className="w-10 h-10 rounded-full"/><div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{m.name||'Fellow'}</p><p className="text-white/40 text-xs">{m.completedDays?.length||0} lessons</p></div><div className="text-right"><p className="text-purple-400 font-medium">{m.xp||0}</p><p className="text-white/30 text-[10px]">XP</p></div></div>))}
      </div>
    </div>
  );

  // IEP
  if(view==='iep')return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <button onClick={()=>setView('home')} className="text-white/50 p-1 mb-4">{Icons.back}</button>
      <div className="flex items-center gap-3 mb-6"><div className="text-purple-400">{Icons.clipboard}</div><h1 className="text-xl font-light text-white">Learning Plan</h1></div>
      <div className="space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4"><h3 className="text-emerald-400 text-sm font-medium mb-3">Strengths</h3>{profile?.iep?.strengths?.length?<ul className="space-y-2">{profile.iep.strengths.map((s,i)=><li key={i} className="text-white/70 text-sm">{s}</li>)}</ul>:<p className="text-white/30 text-sm">Complete lessons to identify</p>}</div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"><h3 className="text-amber-400 text-sm font-medium mb-3">Growth Areas</h3>{profile?.iep?.gaps?.length?<ul className="space-y-2">{profile.iep.gaps.map((g,i)=><li key={i} className="text-white/70 text-sm">{g}</li>)}</ul>:<p className="text-white/30 text-sm">ABA will identify areas</p>}</div>
      </div>
    </div>
  );

  // LEARN - PROPER MOBILE GRID
  if(view==='learn'){const lessons=getLessons(vol),done=profile?.completedDays||[];return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <button onClick={()=>setView('home')} className="text-white/50 p-1 mb-4">{Icons.back}</button>
      
      {/* Volume Tabs */}
      <div className="flex gap-2 mb-4">
        {Object.entries(CUR).map(([k,x])=>(<button key={k} onClick={()=>setVol(k)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm ${vol===k?'bg-purple-600 text-white':'bg-white/5 text-white/50 border border-white/10'}`}><span className={vol===k?'text-white':'text-white/40'}>{x.icon}</span>{k.toUpperCase()}</button>))}
      </div>

      {/* Volume Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3"><div className="text-purple-400">{CUR[vol].icon}</div><div><h2 className="text-white font-medium">{CUR[vol].title}</h2><p className="text-white/40 text-sm">{CUR[vol].desc}</p></div></div>
      </div>

      {today>=2&&<div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 flex items-center gap-2"><span className="text-amber-400">{Icons.lock}</span><p className="text-amber-400 text-sm">{today>=3?'Daily limit reached':'1 lesson left today'}</p></div>}

      {/* PROPER DAY GRID - 6 columns, small squares */}
      <div className="grid grid-cols-6 gap-2">
        {lessons.map(l=>{
          const k=`${vol}-d${l.day}`,dn=done.includes(k),isQ=l.type==='quiz',isCap=l.type==='capstone',c=canStart(l);
          return(
            <button key={l.day} onClick={()=>startLesson(vol,l.day)} className={`
              aspect-square rounded-lg flex items-center justify-center text-sm font-medium
              ${dn?'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40':
                isQ?'bg-purple-500/20 text-purple-400 border border-purple-500/40':
                isCap?'bg-amber-500/20 text-amber-400 border border-amber-500/40':
                c.ok?'bg-white/5 text-white/60 border border-white/10 active:bg-white/10':'bg-white/[0.02] text-white/20 border border-white/5'}
            `}>
              {dn?<span className="text-emerald-400">{Icons.check}</span>:l.day}
            </button>
          );
        })}
      </div>
    </div>
  )}

  // HOME
  const cnt=profile?.completedDays?.length||0,tot=Object.values(CUR).reduce((s,v)=>s+v.days,0),pct=Math.round((cnt/tot)*100);
  return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <ABAOrb size={50} state="idle"/>
        <div><h1 className="text-lg text-white">Welcome, <span className="text-purple-400">{profile?.name?.split(' ')[0]}</span></h1><p className="text-white/40 text-sm">{cnt===0?'Ready to begin?':`${tot-cnt} lessons remaining`}</p></div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{v:cnt,l:'Done',c:'purple'},{v:profile?.streak||0,l:'Streak',c:'amber'},{v:profile?.xp||0,l:'XP',c:'emerald'}].map((s,i)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"><p className={`text-xl font-light text-${s.c}-400`}>{s.v}</p><p className="text-white/40 text-xs">{s.l}</p></div>))}
      </div>

      {/* Progress */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm mb-2"><span className="text-white/50">Progress</span><span className="text-purple-400">{pct}%</span></div>
        <div className="h-2 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full" style={{width:`${pct}%`}}/></div>
      </div>

      {/* Actions */}
      <button onClick={()=>setView('learn')} className="w-full bg-purple-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 mb-3"><span className="text-white/80">{Icons.play}</span>Continue Learning</button>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={()=>setView('kudos')} className="bg-white/5 border border-white/10 text-white/70 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"><span className="text-white/50">{Icons.trophy}</span>Leaderboard</button>
        <button onClick={()=>setView('iep')} className="bg-white/5 border border-white/10 text-white/70 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"><span className="text-white/50">{Icons.clipboard}</span>My Plan</button>
      </div>

      {/* Volumes */}
      <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Volumes</p>
      <div className="space-y-2">
        {Object.entries(CUR).map(([k,x])=>{const vd=(profile?.completedDays||[]).filter(d=>d.startsWith(k)).length;return(
          <button key={k} onClick={()=>{setVol(k);setView('learn')}} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className={`text-${x.color}-400`}>{x.icon}</div>
            <div className="flex-1 text-left"><p className="text-white text-sm">{x.title}</p><p className="text-white/40 text-xs">{vd}/{x.days}</p></div>
            <div className="w-10 h-10 relative"><svg className="w-10 h-10 -rotate-90"><circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/><circle cx="20" cy="20" r="16" fill="none" stroke={k==='v1'?'#a78bfa':k==='v2'?'#fbbf24':'#34d399'} strokeWidth="2" strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100-(vd/x.days)*100}/></svg><span className="absolute inset-0 flex items-center justify-center text-white/50 text-[10px]">{Math.round((vd/x.days)*100)}%</span></div>
          </button>
        )})}
      </div>

      <button onClick={signOff} className="w-full text-white/20 text-sm py-4 mt-4">Sign Out</button>
    </div>
  );
}
