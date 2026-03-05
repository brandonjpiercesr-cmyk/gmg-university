// GMG UNIVERSITY v5.6.0 - PREMIUM MOBILE-FIRST UI
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

// Premium animated background with Ken Burns
const KenBurns = ({ src, opacity = 55 }) => (
  <div className="fixed inset-0 overflow-hidden">
    <div className="absolute inset-[-20%] bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${src})`, opacity: opacity/100 }}/>
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
  </div>
);

// Fluid ABA Orb with glow
const PALETTES = { idle: [[139,92,246],[167,139,250],[236,72,153]], thinking: [[245,158,11],[251,191,36],[239,68,68]], speaking: [[34,197,94],[16,185,129],[132,204,22]] };

const ABAOrb = ({ size = 80, state = 'idle' }) => {
  const ref = useRef(null), anim = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'), dpr = 2;
    c.width = size*dpr; c.height = size*dpr; ctx.scale(dpr,dpr);
    let t = 0;
    const draw = () => {
      const pal = PALETTES[state]||PALETTES.idle;
      t += state==='thinking'?0.04:0.02;
      ctx.clearRect(0,0,size,size);
      const ctr = size/2;
      for(let l=0;l<3;l++){
        const col=pal[l], r=size*(0.35-l*0.06);
        const wobble = Math.sin(t*2+l)*3 + Math.cos(t*1.5+l*2)*2;
        ctx.beginPath();
        ctx.arc(ctr+wobble*0.3, ctr+Math.cos(t+l)*2, r, 0, Math.PI*2);
        const gr=ctx.createRadialGradient(ctr,ctr,0,ctr,ctr,r*1.2);
        gr.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${0.9-l*0.2})`);
        gr.addColorStop(0.7,`rgba(${col[0]},${col[1]},${col[2]},${0.4-l*0.1})`);
        gr.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle=gr;ctx.fill();
      }
      // Glow ring
      ctx.beginPath();
      ctx.arc(ctr, ctr, size*0.38, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(${pal[0][0]},${pal[0][1]},${pal[0][2]},${0.3+Math.sin(t)*0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      anim.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(anim.current);
  },[size,state]);
  return <canvas ref={ref} style={{width:size,height:size}} className="drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]"/>;
};

// Get content helpers
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
  v1: { title:'Fundraising Foundations', days:30, desc:'Master nonprofit fundraising', icon:'📚' },
  v2: { title:'The GMG Way', days:30, desc:'GMG methodologies', icon:'🎯' },
  v3: { title:'CPP Model', days:15, desc:'Consultant Pipeline', icon:'💼' }
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
    const systemPrompt = `You are ABA, AI professor for GMG University. LESSON: ${content?.title}. STUDENT: ${profile?.name}. CONTENT: ${lessonContext}. ${start ? 'Present lesson conversationally.' : 'Answer based on lesson.'} No emojis. We Are All ABA.`;
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
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: data.response || "Let me think..." }]);
      setOrb('speaking'); setProg(p => Math.min(p + 15, 100)); setStatus('');
      if (voice) speak(data.response);
      setTimeout(() => setOrb('idle'), 2000);
    } catch (e) {
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: "Connection issue. Try again." }]);
      setOrb('idle'); setStatus('');
    } finally { setTyping(false); }
  };

  const speak=async t=>{try{const r=await fetch(TTS_URL,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':TTS_KEY},body:JSON.stringify({text:t?.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});if(audioRef.current){audioRef.current.src=URL.createObjectURL(await r.blob());audioRef.current.play()}}catch(e){console.error(e)}};
  const complete=async()=>{if(!user)return;const k=`${vol}-d${day}`;try{const ref=doc(db,'users',user.uid);await updateDoc(ref,{completedDays:arrayUnion(k),xp:(profile.xp||0)+100,lessonsLog:arrayUnion({day:k,date:new Date().toISOString()})});setProfile(p=>({...p,completedDays:[...(p.completedDays||[]),k],xp:(p.xp||0)+100}));setToday(p=>p+1);await loadCohort();setView('learn')}catch(e){console.error(e)}};
  const send=()=>{if(!input.trim()||typing)return;sendABA(input);setInput('')};
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  // LOADING
  if(loading)return(
    <div className="min-h-screen bg-black flex items-center justify-center">
      <KenBurns src={BG.pinkSmoke} opacity={60}/>
      <div className="relative z-10 text-center animate-pulse">
        <ABAOrb size={100} state="thinking"/>
        <p className="text-white/60 text-xs tracking-[0.3em] mt-8 uppercase">Loading</p>
      </div>
    </div>
  );

  // LOGIN
  if(!user)return(
    <div className="min-h-screen bg-black flex flex-col">
      <KenBurns src={BG.pinkSmoke} opacity={55}/>
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="text-center mb-12">
          <ABAOrb size={90} state="idle"/>
          <h1 className="text-3xl font-light text-white mt-6 tracking-tight">
            GMG <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">University</span>
          </h1>
          <p className="text-white/40 text-sm mt-2 tracking-wide">Lane-Pierce Fellowship</p>
        </div>
        
        <div className="space-y-3 mb-10">
          {[
            { icon: '◆', label: '75-Day Curriculum', sub: 'Fundraising mastery' },
            { icon: '◇', label: 'ABA Intelligence', sub: '89 agents teaching' },
            { icon: '○', label: 'Voice Mode', sub: 'Listen and learn' }
          ].map((f,i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]" style={{animationDelay:`${i*100}ms`}}>
              <span className="text-purple-400 text-lg">{f.icon}</span>
              <div>
                <p className="text-white/90 text-sm font-medium">{f.label}</p>
                <p className="text-white/40 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={signIn} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-medium text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] active:scale-[0.98] transition-transform">
          Continue with Google
        </button>
        
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
          <span className="text-white/30 text-xs tracking-wider">{air?.agents || 89} AGENTS ONLINE</span>
        </div>
      </div>
    </div>
  );

  // LESSON VIEW
  if(view==='lesson'&&day){
    const content=getContent(vol,day);
    return(
      <div className="min-h-screen bg-black flex flex-col">
        <KenBurns src={BG.embers} opacity={45}/>
        
        {/* Header */}
        <header className="relative z-10 safe-top px-4 py-3 flex items-center justify-between">
          <button onClick={()=>setView('learn')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="text-center">
            <p className="text-purple-400 text-[10px] tracking-[0.2em] uppercase">Day {day}</p>
            <p className="text-white text-sm font-medium truncate max-w-[200px]">{content?.title}</p>
          </div>
          <button onClick={()=>setVoice(!voice)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${voice?'bg-purple-500/40':'bg-white/10'}`}>
            <svg className={`w-5 h-5 ${voice?'text-purple-300':'text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>
        </header>

        {/* Progress */}
        <div className="relative z-10 px-4 mb-2">
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-500" style={{width:`${prog}%`}}/>
          </div>
        </div>

        {/* Chat */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            {msgs.map((m,i)=>(
              <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                <div className={`max-w-[85%] ${m.role==='user'?'bg-purple-600/50 rounded-2xl rounded-br-md':'bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl rounded-bl-md'} px-4 py-3`}>
                  {m.role==='assistant'&&(
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                      <ABAOrb size={24} state={i===msgs.length-1?orb:'idle'}/>
                      <span className="text-purple-400 text-[10px] tracking-wider uppercase">ABA</span>
                    </div>
                  )}
                  <p className="text-white/90 text-[13px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {typing&&(
              <div className="flex justify-start">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ABAOrb size={24} state="thinking"/>
                    <span className="text-amber-400 text-[10px] tracking-wider">{status}</span>
                  </div>
                  <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}}/>)}</div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
        </div>

        {/* Input */}
        <div className="relative z-10 safe-bottom px-4 pb-4 pt-2 bg-gradient-to-t from-black via-black/80 to-transparent">
          {prog>=50&&(
            <button onClick={complete} className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium text-sm shadow-lg shadow-emerald-500/30">
              Complete Lesson · +100 XP
            </button>
          )}
          <div className="flex gap-3">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()} 
              placeholder="Ask a question..." 
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50"/>
            <button onClick={send} disabled={!input.trim()||typing} className="px-6 py-3 rounded-xl bg-purple-600 disabled:bg-white/10 text-white disabled:text-white/30 font-medium text-sm">
              Send
            </button>
          </div>
        </div>
        <audio ref={audioRef}/>
      </div>
    );
  }

  // KUDOS BOARD
  if(view==='kudos')return(
    <div className="min-h-screen bg-black">
      <KenBurns src={BG.nebula} opacity={50}/>
      <div className="relative z-10 safe-top px-4 py-4">
        <button onClick={()=>setView('home')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        
        <h1 className="text-2xl font-light text-white mb-1">Leaderboard</h1>
        <p className="text-white/40 text-sm mb-6">Fellowship Rankings</p>
        
        <div className="space-y-3">
          {cohort.map((m,i)=>(
            <div key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl ${i===0?'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30':'bg-white/[0.04] border border-white/[0.06]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i===0?'bg-amber-500 text-black':i===1?'bg-white/20 text-white':i===2?'bg-amber-700/50 text-amber-200':'bg-white/10 text-white/40'}`}>
                {i+1}
              </div>
              <img src={m.photoURL||`https://ui-avatars.com/api/?name=${m.name||'U'}&background=8b5cf6&color=fff`} className="w-10 h-10 rounded-full"/>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{m.name||'Fellow'}</p>
                <p className="text-white/40 text-xs">{m.completedDays?.length||0} lessons</p>
              </div>
              <div className="text-right">
                <p className="text-purple-400 font-bold">{m.xp||0}</p>
                <p className="text-white/30 text-[10px]">XP</p>
              </div>
            </div>
          ))}
          {!cohort.length&&<p className="text-white/30 text-center py-8">No members yet</p>}
        </div>
      </div>
    </div>
  );

  // IEP / PROGRESS
  if(view==='iep')return(
    <div className="min-h-screen bg-black">
      <KenBurns src={BG.eventHorizon} opacity={45}/>
      <div className="relative z-10 safe-top px-4 py-4">
        <button onClick={()=>setView('home')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        
        <h1 className="text-2xl font-light text-white mb-1">Your Progress</h1>
        <p className="text-white/40 text-sm mb-6">Individual Education Plan</p>
        
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"/>
              <h3 className="text-emerald-400 font-medium text-sm">Strengths Identified</h3>
            </div>
            {profile?.iep?.strengths?.length ? (
              <ul className="space-y-2">{profile.iep.strengths.map((s,i)=><li key={i} className="text-white/70 text-sm pl-4 border-l-2 border-emerald-500/30">{s}</li>)}</ul>
            ) : (
              <p className="text-white/30 text-sm">Complete lessons to unlock insights</p>
            )}
          </div>
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"/>
              <h3 className="text-amber-400 font-medium text-sm">Growth Areas</h3>
            </div>
            {profile?.iep?.gaps?.length ? (
              <ul className="space-y-2">{profile.iep.gaps.map((g,i)=><li key={i} className="text-white/70 text-sm pl-4 border-l-2 border-amber-500/30">{g}</li>)}</ul>
            ) : (
              <p className="text-white/30 text-sm">ABA will identify opportunities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // LEARN / CURRICULUM
  if(view==='learn'){
    const lessons=getLessons(vol), done=profile?.completedDays||[];
    return(
      <div className="min-h-screen bg-black">
        <KenBurns src={BG.wetCity} opacity={45}/>
        <div className="relative z-10 safe-top px-4 py-4">
          <button onClick={()=>setView('home')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          {/* Volume Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
            {Object.entries(CUR).map(([k,x])=>(
              <button key={k} onClick={()=>setVol(k)} className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${vol===k?'bg-purple-600 text-white shadow-lg shadow-purple-500/30':'bg-white/[0.06] text-white/60 border border-white/10'}`}>
                {x.icon} {x.title}
              </button>
            ))}
          </div>
          
          {/* Volume Header */}
          <div className="mb-6">
            <h2 className="text-xl font-light text-white mb-1">{CUR[vol].title}</h2>
            <p className="text-white/40 text-sm">{CUR[vol].desc} · {CUR[vol].days} days</p>
          </div>
          
          {today>=2&&(
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-amber-400 text-sm">{today>=3?'Daily limit reached':'1 lesson remaining today'}</p>
            </div>
          )}
          
          {/* Day Grid */}
          <div className="grid grid-cols-5 gap-2">
            {lessons.map(l=>{
              const k=`${vol}-d${l.day}`, dn=done.includes(k), isQ=l.type==='quiz', isCap=l.type==='capstone', c=canStart(l);
              return(
                <button key={l.day} onClick={()=>c.ok&&startLesson(vol,l.day)} disabled={!c.ok&&!dn}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                    dn ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/40' :
                    isQ ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    isCap ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    !c.ok ? 'bg-white/[0.02] text-white/20 border border-white/[0.04]' :
                    'bg-white/[0.04] text-white/70 border border-white/10 active:scale-95'
                  }`}>
                  <span className="text-lg">{l.day}</span>
                  {dn && <span className="text-[8px] mt-0.5">✓</span>}
                  {isQ && !dn && <span className="text-[8px] mt-0.5">QUIZ</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // HOME
  const cnt=profile?.completedDays?.length||0, tot=75;
  const pct = Math.round((cnt/tot)*100);
  
  return(
    <div className="min-h-screen bg-black flex flex-col">
      <KenBurns src={BG.pinkSmoke} opacity={55}/>
      
      <div className="relative z-10 flex-1 safe-top px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ABAOrb size={60} state="idle"/>
          <div>
            <h1 className="text-xl font-light text-white">
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">{profile?.name?.split(' ')[0]||'Fellow'}</span>
            </h1>
            <p className="text-white/40 text-sm">{cnt===0?'Ready to begin your journey?':`${tot-cnt} lessons to go`}</p>
          </div>
        </div>
        
        {/* Stats Ring */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${pct*2.64} 264`} className="transition-all duration-1000"/>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#f472b6"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-light text-white">{pct}%</span>
              <span className="text-white/40 text-xs">Complete</span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Lessons', value: cnt, color: 'from-purple-500/20' },
            { label: 'Streak', value: profile?.streak||0, color: 'from-amber-500/20' },
            { label: 'XP', value: profile?.xp||0, color: 'from-emerald-500/20' }
          ].map((s,i)=>(
            <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} to-transparent border border-white/[0.06]`}>
              <p className="text-2xl font-light text-white">{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        
        {/* Main Actions */}
        <button onClick={()=>setView('learn')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-medium text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] mb-4 active:scale-[0.98] transition-transform">
          Continue Learning
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setView('kudos')} className="py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white/80 font-medium text-sm active:scale-[0.98] transition-transform">
            🏆 Leaderboard
          </button>
          <button onClick={()=>setView('iep')} className="py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white/80 font-medium text-sm active:scale-[0.98] transition-transform">
            📊 My Progress
          </button>
        </div>
      </div>
      
      {/* Bottom Nav */}
      <div className="relative z-10 safe-bottom px-4 pb-4">
        <button onClick={signOff} className="w-full py-3 rounded-xl text-white/30 text-sm">
          Sign Out
        </button>
      </div>
    </div>
  );
}
