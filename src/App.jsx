// GMG UNIVERSITY v5.3.1 - BOLD BACKGROUNDS + WORKING CONNECTION
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app), googleProvider = new GoogleAuthProvider();

const ABA_AIR = 'https://abacia-services.onrender.com/api/air/process';
const ABA_STATUS = 'https://abacia-services.onrender.com/api/air/status';
const TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL';
const TTS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';

// ALL YOUR BACKGROUNDS - BOLD AND VISIBLE
const BG = {
  pinkSmoke: 'https://i.imgur.com/3RkebB2.jpeg',
  wetCity: 'https://i.imgur.com/kJhWrrX.jpeg',
  embers: 'https://i.imgur.com/9HZYnlX.png',
  nebula: 'https://i.imgur.com/nLBRQ82.jpeg',
  eventHorizon: 'https://i.imgur.com/A44TxCq.jpeg',
  particleLights: 'https://i.imgur.com/wLi9sGD.jpeg',
  blackLandscape: 'https://i.imgur.com/ZwVdgzN.jpeg',
  glassWindows: 'https://i.imgur.com/FQrnPXh.jpeg'
};

// Ken Burns Background Component - BOLD 50-60% opacity
const KenBurns = ({ src, opacity = 50 }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div 
      className="absolute inset-[-15%] bg-cover bg-center animate-kenburns"
      style={{ backgroundImage: `url(${src})`, opacity: opacity/100 }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
  </div>
);

const PALETTES = {
  idle: { c: [[139,92,246],[167,139,250],[236,72,153],[99,102,241]] },
  thinking: { c: [[245,158,11],[251,191,36],[239,68,68],[253,224,71]] },
  speaking: { c: [[34,197,94],[16,185,129],[132,204,22],[45,212,191]] },
  listening: { c: [[6,182,212],[59,130,246],[139,92,246],[147,197,253]] }
};

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
        for(let i=0;i<=100;i++){
          const a=(i/100)*Math.PI*2, n1=n.n(Math.cos(a)*2+t+l*0.7,Math.sin(a)*2+t*0.7), r=br+(n1+n.n(Math.cos(a)*4+t*1.3,Math.sin(a)*4)*0.5)*0.3*size*0.15;
          i===0?ctx.moveTo(ctr+Math.cos(a)*r,ctr+Math.sin(a)*r):ctx.lineTo(ctr+Math.cos(a)*r,ctr+Math.sin(a)*r);
        }
        ctx.closePath();
        const gr=ctx.createRadialGradient(ctr+Math.sin(t*2)*10,ctr+Math.cos(t*1.5)*10,0,ctr,ctr,br*1.5), al=0.7-l*0.12;
        gr.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${al})`);
        gr.addColorStop(0.5,`rgba(${col[0]},${col[1]},${col[2]},${al*0.6})`);
        gr.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
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

const CUR = {
  v1: { title:'Fundraising Foundations', days:30, desc:'Master nonprofit fundraising', lessons:Array.from({length:30},(_,i)=>({day:i+1,title:['Four Sources of Money','Why People Give','Donor Lifecycle','Donor Pyramid','Quiz 1-4','Annual Giving','Foundation Grants','Corporate Partners','Earned Revenue','Quiz 6-9','Board Responsibility','Grant Research','Donor Retention','Systems & Tools','Quiz 11-14','Grant Writing','Major Donors','Planned Giving','Sponsorship','Quiz 16-19','Digital Fundraising','Storytelling','Capital Campaigns','Monthly Giving','Quiz 21-24','Board Development','Prospect Research','Metrics','Strategic Planning','Capstone'][i],type:(i+1)%5===0?'quiz':i===29?'capstone':'lesson'}))},
  v2: { title:'The GMG Way', days:30, desc:'GMG methodology', lessons:Array.from({length:30},(_,i)=>({day:i+1,title:`GMG Day ${i+1}`,type:(i+1)%5===0?'quiz':i===29?'capstone':'lesson'}))},
  v3: { title:'CPP Model', days:15, desc:'LAYERED Assessment', lessons:Array.from({length:15},(_,i)=>({day:i+1,title:`Assessment ${i+1}`,type:i===14?'capstone':'assessment'}))}
};

const Glass = ({children, className=''}) => <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 ${className}`}>{children}</div>;

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
  const canStart=l=>{const k=`${vol}-d${l.day}`;if(profile?.completedDays?.includes(k))return{ok:false,msg:'Done'};if(l.type==='quiz'&&!profile?.completedDays?.includes(`${vol}-d${l.day-1}`))return{ok:false,msg:'Complete previous'};if(today>=3)return{ok:false,msg:'Daily limit'};return{ok:true}};

  const sendABA = async (m, start = false) => {
    setTyping(true); setOrb('thinking'); setStatus('Connecting to ABA...');
    const les = CUR[vol]?.lessons.find(x => x.day === day);
    const sys = `You are ABA, AI professor for GMG University. LESSON: ${CUR[vol]?.title} - Day ${day}: ${les?.title}. STUDENT: ${profile?.name}. ${start ? 'Start warmly. Greet by first name. Preview content. Begin teaching.' : 'Continue teaching conversationally.'} Warm, professional. No emojis. We Are All ABA.`;

    try {
      setStatus('ABA is thinking...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 seconds
      
      const response = await fetch(ABA_AIR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: m,
          user_id: profile?.email || 'guest',
          channel: 'gmg_university',
          context: { lesson: les?.title, systemPrompt: sys }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const resp = data.response || data.message || "Let me try again...";
      
      setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: resp }]);
      setOrb('speaking'); 
      setProg(p => Math.min(p + 15, 100));
      setStatus('');
      if (voice) speak(resp);
      setTimeout(() => setOrb('idle'), 2000);
      
    } catch (error) {
      console.error('ABA Error:', error);
      setStatus('');
      if (error.name === 'AbortError') {
        setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: "ABA took too long to respond. The backend might be cold-starting. Please try again." }]);
      } else {
        setMsgs(p => [...p, { role: 'user', content: m }, { role: 'assistant', content: `Connection error: ${error.message}. Please try again.` }]);
      }
      setOrb('idle');
    } finally {
      setTyping(false);
    }
  };

  const speak=async t=>{try{const r=await fetch(TTS_URL,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':TTS_KEY},body:JSON.stringify({text:t.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});if(audioRef.current){audioRef.current.src=URL.createObjectURL(await r.blob());audioRef.current.play()}}catch(e){console.error(e)}};
  const startLesson=(v,d)=>{const l=CUR[v]?.lessons.find(x=>x.day===d);const c=canStart(l);if(!c.ok){alert(c.msg);return}setVol(v);setDay(d);setMsgs([]);setProg(0);setView('lesson');setTimeout(()=>sendABA("I'm ready for today's lesson.",true),500)};
  const complete=async()=>{if(!user)return;const k=`${vol}-d${day}`;try{const ref=doc(db,'users',user.uid);await updateDoc(ref,{completedDays:arrayUnion(k),xp:(profile.xp||0)+100,lessonsLog:arrayUnion({day:k,date:new Date().toISOString()})});setProfile(p=>({...p,completedDays:[...(p.completedDays||[]),k],xp:(p.xp||0)+100}));setToday(p=>p+1);await loadCohort();setView('learn')}catch(e){console.error(e)}};
  const send=()=>{if(!input.trim()||typing)return;sendABA(input);setInput('')};
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  // LOADING - Pink Smoke
  if(loading)return(
    <div className="min-h-screen bg-black flex items-center justify-center">
      <KenBurns src={BG.pinkSmoke} opacity={60} />
      <div className="relative z-10 text-center"><ABAOrb size={140} state="thinking"/><p className="text-purple-300 font-light mt-6 tracking-widest text-sm">INITIALIZING</p></div>
    </div>
  );

  // LOGIN - Pink Smoke
  if(!user)return(
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <KenBurns src={BG.pinkSmoke} opacity={55} />
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-10"><ABAOrb size={130} state="idle"/><h1 className="text-4xl font-extralight text-white mt-8">GMG <span className="font-light text-purple-400">University</span></h1><p className="text-white/50 mt-2 font-light">Lane-Pierce Fellowship</p><div className="flex items-center justify-center gap-2 mt-6"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/><span className="text-emerald-400/80 text-xs">{air?`${air.agents} AGENTS`:'CONNECTING'}</span></div></div>
        <Glass className="mb-8"><div className="space-y-4">{[{t:'75 Days of Training',c:'bg-purple-500'},{t:'ABA-Powered Learning',c:'bg-amber-500'},{t:'Individual Education Plan',c:'bg-emerald-500'},{t:'Voice Mode',c:'bg-cyan-500'}].map((x,i)=>(<div key={i} className="flex items-center gap-4"><div className={`w-2.5 h-2.5 rounded-full ${x.c}`}/><span className="text-white/70 text-sm font-light">{x.t}</span></div>))}</div></Glass>
        <button onClick={signIn} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-4 rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-3"><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google</button>
        <p className="text-center text-white/20 text-xs mt-10 tracking-[0.2em]">WE ARE ALL ABA</p>
      </div>
    </div>
  );

  // LESSON - Embers
  if(view==='lesson'&&day){const les=CUR[vol]?.lessons.find(l=>l.day===day);return(
    <div className="min-h-screen bg-black flex flex-col">
      <KenBurns src={BG.embers} opacity={50} />
      <header className="relative z-10 backdrop-blur-xl bg-black/40 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button onClick={()=>setView('learn')} className="text-white/60 hover:text-white flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Exit</button>
          <div className="text-center"><p className="text-purple-400 text-xs tracking-widest">DAY {day}</p><p className="text-white font-light">{les?.title}</p></div>
          <button onClick={()=>setVoice(!voice)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${voice?'bg-purple-500/30 text-purple-400':'bg-white/10 text-white/50'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg></button>
        </div>
        <div className="mt-4 max-w-4xl mx-auto h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all" style={{width:`${prog}%`}}/></div>
      </header>
      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {msgs.map((m,i)=>(
            <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${m.role==='user'?'bg-purple-600/40 border border-purple-500/40':'bg-black/40 backdrop-blur-xl border border-white/10'}`}>
                {m.role==='assistant'&&<div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10"><ABAOrb size={28} state={orb}/><span className="text-purple-400 text-xs font-medium">ABA</span></div>}
                <p className="text-white/90 text-sm leading-relaxed font-light whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {typing&&(
            <div className="flex justify-start">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3 mb-3"><ABAOrb size={28} state="thinking"/><span className="text-amber-400 text-xs">{status||'THINKING'}</span></div>
                <div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
      </div>
      <div className="relative z-10 backdrop-blur-xl bg-black/40 border-t border-white/10 p-6">
        <div className="max-w-3xl mx-auto flex gap-4">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()} placeholder="Type your response..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 font-light"/>
          <button onClick={send} disabled={!input.trim()||typing} className="bg-purple-600 hover:bg-purple-500 disabled:bg-white/10 disabled:text-white/30 text-white font-medium px-8 py-4 rounded-xl transition-colors">Send</button>
        </div>
        {prog>=70&&<div className="max-w-3xl mx-auto mt-4"><button onClick={complete} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl">Complete · +100 XP</button></div>}
      </div>
      <audio ref={audioRef}/>
    </div>
  )}

  // KUDOS - Nebula
  if(view==='kudos')return(
    <div className="min-h-screen bg-black p-8">
      <KenBurns src={BG.nebula} opacity={50} />
      <div className="relative z-10 max-w-2xl mx-auto">
        <button onClick={()=>setView('home')} className="text-white/50 hover:text-white mb-8 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button>
        <h1 className="text-3xl font-extralight text-white mb-8">Kudos Board</h1>
        <Glass>{cohort.map((m,i)=>(<div key={m.id} className={`flex items-center gap-4 p-4 rounded-xl mb-3 ${i===0?'bg-amber-500/20 border border-amber-500/30':'bg-white/5'}`}><span className={`text-2xl font-bold w-8 ${i===0?'text-amber-400':'text-white/30'}`}>{i+1}</span><img src={m.photoURL||`https://ui-avatars.com/api/?name=${m.name||'U'}&background=8b5cf6&color=fff`} className="w-10 h-10 rounded-xl"/><div className="flex-1"><p className="text-white">{m.name||'Fellow'}</p><p className="text-white/40 text-sm">{m.completedDays?.length||0} lessons</p></div><p className="text-purple-400 font-bold">{m.xp||0} XP</p></div>))}{!cohort.length&&<p className="text-white/30 text-center py-8">No members yet</p>}</Glass>
      </div>
    </div>
  );

  // IEP - Event Horizon
  if(view==='iep')return(
    <div className="min-h-screen bg-black p-8">
      <KenBurns src={BG.eventHorizon} opacity={45} />
      <div className="relative z-10 max-w-2xl mx-auto">
        <button onClick={()=>setView('home')} className="text-white/50 hover:text-white mb-8 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button>
        <h1 className="text-3xl font-extralight text-white mb-8">Education Plan</h1>
        <div className="space-y-6">
          <Glass><div className="flex items-center gap-3 mb-4"><div className="w-3 h-3 bg-emerald-500 rounded-full"/><h3 className="text-emerald-400 font-medium">Strengths</h3></div>{profile?.iep?.strengths?.length?<ul className="space-y-2">{profile.iep.strengths.map((s,i)=><li key={i} className="text-white/70 text-sm">{s}</li>)}</ul>:<p className="text-white/30 text-sm">Complete lessons to identify</p>}</Glass>
          <Glass><div className="flex items-center gap-3 mb-4"><div className="w-3 h-3 bg-amber-500 rounded-full"/><h3 className="text-amber-400 font-medium">Development Areas</h3></div>{profile?.iep?.gaps?.length?<ul className="space-y-2">{profile.iep.gaps.map((g,i)=><li key={i} className="text-white/70 text-sm">{g}</li>)}</ul>:<p className="text-white/30 text-sm">ABA will identify areas</p>}</Glass>
        </div>
      </div>
    </div>
  );

  // LEARN - Wet City
  if(view==='learn'){const v=CUR[vol],done=profile?.completedDays||[];return(
    <div className="min-h-screen bg-black p-8">
      <KenBurns src={BG.wetCity} opacity={45} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <button onClick={()=>setView('home')} className="text-white/50 hover:text-white mb-8 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button>
        <div className="flex gap-3 mb-8 flex-wrap">{Object.entries(CUR).map(([k,x])=>(<button key={k} onClick={()=>setVol(k)} className={`px-6 py-3 rounded-xl font-medium ${vol===k?'bg-purple-600 text-white':'bg-white/10 text-white/60 hover:text-white'}`}>{x.title}</button>))}</div>
        <Glass className="mb-8"><h2 className="text-2xl font-extralight text-white mb-2">{v.title}</h2><p className="text-white/50">{v.desc}</p></Glass>
        {today>=2&&<div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl"><p className="text-amber-400 text-sm">{today>=3?'Daily limit. Return tomorrow.':`${3-today} remaining today.`}</p></div>}
        <div className="grid grid-cols-5 lg:grid-cols-6 gap-3">{v.lessons.map(l=>{const k=`${vol}-d${l.day}`,dn=done.includes(k),isQ=l.type==='quiz',isCap=l.type==='capstone',c=canStart(l);return(<button key={l.day} onClick={()=>c.ok&&startLesson(vol,l.day)} disabled={!c.ok&&!dn} title={l.title} className={`aspect-square rounded-xl flex flex-col items-center justify-center border ${dn?'bg-emerald-500/20 border-emerald-500/40 text-emerald-400':isQ?'bg-purple-500/20 border-purple-500/40 text-purple-400':isCap?'bg-amber-500/20 border-amber-500/40 text-amber-400':!c.ok?'bg-white/5 border-white/10 text-white/20':'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}><span className="text-lg font-medium">{l.day}</span>{(dn||isQ||isCap)&&<span className="text-[9px] mt-1">{dn?'DONE':isQ?'QUIZ':'FINAL'}</span>}</button>)})}</div>
      </div>
    </div>
  )}

  // HOME - Pink Smoke
  const cnt=profile?.completedDays?.length||0,tot=Object.values(CUR).reduce((s,v)=>s+v.lessons.length,0);
  return(
    <div className="min-h-screen bg-black p-8">
      <KenBurns src={BG.pinkSmoke} opacity={50} />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-8 mb-12"><ABAOrb size={100} state="idle"/><div><h1 className="text-3xl font-extralight text-white">Welcome, <span className="text-purple-400">{profile?.name?.split(' ')[0]||'Fellow'}</span></h1><p className="text-white/50 font-light mt-1">{cnt===0?'Ready to begin?':`${tot-cnt} lessons remaining`}</p></div></div>
        <div className="grid grid-cols-3 gap-4 mb-8">{[{l:'Completed',v:cnt},{l:'Streak',v:profile?.streak||0},{l:'XP',v:profile?.xp||0}].map((s,i)=>(<Glass key={i} className="text-center"><p className="text-3xl font-light text-white">{s.v}</p><p className="text-white/40 text-sm mt-1">{s.l}</p></Glass>))}</div>
        <Glass className="mb-8"><div className="flex justify-between mb-3"><span className="text-white/60 text-sm">Progress</span><span className="text-purple-400">{Math.round((cnt/tot)*100)}%</span></div><div className="h-2 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full" style={{width:`${(cnt/tot)*100}%`}}/></div></Glass>
        <div className="grid grid-cols-2 gap-4 mb-4"><button onClick={()=>setView('learn')} className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-5 rounded-xl text-lg">Continue Learning</button><button onClick={()=>setView('kudos')} className="bg-white/10 hover:bg-white/15 text-white font-medium py-5 rounded-xl">Kudos Board</button></div>
        <div className="grid grid-cols-2 gap-4"><button onClick={()=>setView('iep')} className="bg-white/10 hover:bg-white/15 text-white/80 py-4 rounded-xl">My IEP</button><button onClick={signOff} className="bg-white/10 hover:bg-white/15 text-white/50 py-4 rounded-xl">Sign Out</button></div>
      </div>
    </div>
  );
}
