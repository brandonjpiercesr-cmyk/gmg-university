// GMG UNIVERSITY v5.2.0 - KEN BURNS + PINK SMOKE DEFAULT
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app), googleProvider = new GoogleAuthProvider();

const ABA = { air: 'https://abacia-services.onrender.com/api/air/process', status: 'https://abacia-services.onrender.com/api/air/status', tts: 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL' };
const SUPA = { url: 'https://htlxjkbrstpwwtzsbyvb.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUzMjgyMSwiZXhwIjoyMDg2MTA4ODIxfQ.G55zXnfanoUxRAoaYz-tD9FDJ53xHH-pRgDrKss_Iqo' };
const TTS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';

// BACKGROUNDS - Pink Smoke DEFAULT
const BG = {
  pinkSmoke: 'https://i.imgur.com/3RkebB2.jpeg',
  embers: 'https://i.imgur.com/9HZYnlX.png',
  nebula: 'https://i.imgur.com/nLBRQ82.jpeg',
  eventHorizon: 'https://i.imgur.com/A44TxCq.jpeg'
};

// Ken Burns Background
const KenBurns = ({ img, dark = 60 }) => (
  <>
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-10%] bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${img})` }} />
    </div>
    <div className={`absolute inset-0 bg-black/${dark}`} />
  </>
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
      t += st.current==='thinking'?0.025:0.015;
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
        if(l===0){ctx.shadowColor=`rgba(${col[0]},${col[1]},${col[2]},0.5)`;ctx.shadowBlur=30;ctx.fill();ctx.shadowBlur=0}
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

const Glass = ({children,className='',hover=true}) => <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] ${hover?'hover:bg-white/[0.05] hover:border-white/[0.12] transition-all':''} p-6 rounded-2xl ${className}`}>{children}</div>;

export default function App() {
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
  const [view,setView]=useState('home'),[vol,setVol]=useState('v1'),[day,setDay]=useState(null);
  const [msgs,setMsgs]=useState([]),[input,setInput]=useState(''),[typing,setTyping]=useState(false);
  const [orb,setOrb]=useState('idle'),[prog,setProg]=useState(0),[voice,setVoice]=useState(false);
  const [air,setAir]=useState(null),[cohort,setCohort]=useState([]),[today,setToday]=useState(0);
  const endRef=useRef(null),audioRef=useRef(null);

  useEffect(()=>{fetch(ABA.status).then(r=>r.json()).then(setAir).catch(console.error)},[]);
  useEffect(()=>{const unsub=onAuthStateChanged(auth,async u=>{if(u){setUser(u);await loadProfile(u);await loadCohort()}else{setUser(null);setProfile(null)}setLoading(false)});return()=>unsub()},[]);

  const loadProfile=async u=>{try{const ref=doc(db,'users',u.uid),snap=await getDoc(ref);if(snap.exists()){const d=snap.data();setProfile(d);setToday(d.lessonsLog?.filter(l=>new Date(l.date).toDateString()===new Date().toDateString())?.length||0)}else{const np={email:u.email,name:u.displayName||'Fellow',photoURL:u.photoURL,completedDays:[],xp:0,streak:0,lessonsLog:[],iep:{strengths:[],gaps:[],notes:[]},createdAt:serverTimestamp()};await setDoc(ref,np);setProfile(np)}}catch(e){console.error(e)}};
  const loadCohort=async()=>{try{const q=query(collection(db,'users'),orderBy('xp','desc'),limit(10)),s=await getDocs(q);setCohort(s.docs.map(d=>({id:d.id,...d.data()})))}catch(e){console.error(e)}};
  const signIn=()=>signInWithPopup(auth,googleProvider);
  const signOff=()=>signOut(auth).then(()=>setView('home'));
  const canStart=l=>{const k=`${vol}-d${l.day}`;if(profile?.completedDays?.includes(k))return{ok:false,msg:'Done'};if(l.type==='quiz'&&!profile?.completedDays?.includes(`${vol}-d${l.day-1}`))return{ok:false,msg:'Complete previous'};if(today>=3)return{ok:false,msg:'Daily limit'};return{ok:true}};

  const sendABA=async(m,start=false)=>{
    setTyping(true);setOrb('thinking');
    const les=CUR[vol]?.lessons.find(x=>x.day===day);
    const sys=`You are ABA, AI professor for GMG University. ${CUR[vol]?.title}, Day ${day}: ${les?.title}. Student: ${profile?.name}. ${start?'Start warmly, preview content, begin teaching.':'Continue conversationally.'} Warm, professional. No emojis. Never say "happy to help."`;
    try{const r=await fetch(ABA.air,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:m,user_id:profile?.email||'guest',channel:'gmg_university',context:{lesson:les?.title,systemPrompt:sys}})});const d=await r.json();const resp=d.response||d.message||"Let me gather my thoughts...";setMsgs(p=>[...p,{role:'user',content:m},{role:'assistant',content:resp}]);setOrb('speaking');setProg(p=>Math.min(p+15,100));if(voice)speak(resp);setTimeout(()=>setOrb('idle'),2000)}catch(e){setMsgs(p=>[...p,{role:'user',content:m},{role:'assistant',content:"ABA is thinking... please wait or try again."}]);setOrb('idle')}finally{setTyping(false)}
  };
  const speak=async t=>{try{const r=await fetch(ABA.tts,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':TTS_KEY},body:JSON.stringify({text:t.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});if(audioRef.current){audioRef.current.src=URL.createObjectURL(await r.blob());audioRef.current.play()}}catch(e){console.error(e)}};
  const start=(v,d)=>{const l=CUR[v]?.lessons.find(x=>x.day===d);const c=canStart(l);if(!c.ok){alert(c.msg);return}setVol(v);setDay(d);setMsgs([]);setProg(0);setView('lesson');setTimeout(()=>sendABA("I'm ready.",true),500)};
  const complete=async()=>{if(!user)return;const k=`${vol}-d${day}`;try{const ref=doc(db,'users',user.uid);await updateDoc(ref,{completedDays:arrayUnion(k),xp:(profile.xp||0)+100,lessonsLog:arrayUnion({day:k,date:new Date().toISOString()})});setProfile(p=>({...p,completedDays:[...(p.completedDays||[]),k],xp:(p.xp||0)+100}));setToday(p=>p+1);await loadCohort();setView('learn')}catch(e){console.error(e)}};
  const send=()=>{if(!input.trim())return;setOrb('listening');sendABA(input);setInput('')};
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  if(loading)return(<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden"><KenBurns img={BG.pinkSmoke} dark={50}/><div className="relative z-10 text-center"><ABAOrb size={150} state="thinking"/><p className="text-purple-300 font-light mt-6">Initializing...</p></div></div>);

  if(!user)return(
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 overflow-hidden">
      <KenBurns img={BG.pinkSmoke} dark={55}/>
      <div className="relative z-10 max-w-lg w-full animate-fadeIn">
        <div className="text-center mb-10"><ABAOrb size={120} state="idle"/><h1 className="text-5xl font-extralight text-white mt-6">GMG <span className="font-normal text-purple-400">University</span></h1><p className="text-slate-400 text-lg mt-2 font-light">Lane-Pierce Fellowship</p><div className="flex items-center justify-center gap-2 mt-4"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/><span className="text-emerald-400/80 text-sm">{air?`${air.agents} agents`:'Connecting...'}</span></div></div>
        <Glass className="mb-8"><div className="space-y-5">{[{t:'75 Days of Training',d:'Three volumes of mastery',c:'bg-purple-400'},{t:'ABA-Powered Learning',d:'Live AI via 79 agents',c:'bg-amber-400'},{t:'Individual Education Plan',d:'Personalized learning',c:'bg-emerald-400'},{t:'Voice Mode',d:'ABA speaks lessons',c:'bg-cyan-400'}].map((x,i)=>(<div key={i} className="flex items-start gap-4"><div className="w-10 h-10 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center"><div className={`w-2 h-2 rounded-full ${x.c}`}/></div><div><p className="text-white font-medium">{x.t}</p><p className="text-slate-500 text-sm font-light">{x.d}</p></div></div>))}</div></Glass>
        <button onClick={signIn} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-4 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3"><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google</button>
        <p className="text-center text-slate-600 text-sm mt-10 font-light tracking-wider">We Are All ABA.</p>
      </div>
    </div>
  );

  if(view==='lesson'&&day){const les=CUR[vol]?.lessons.find(l=>l.day===day);return(
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col overflow-hidden"><KenBurns img={BG.embers} dark={70}/>
      <header className="relative z-10 backdrop-blur-xl bg-black/30 border-b border-white/[0.05] px-6 py-4"><div className="flex items-center justify-between max-w-5xl mx-auto"><button onClick={()=>setView('learn')} className="text-slate-400 hover:text-white text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Exit</button><div className="text-center flex-1 px-4"><p className="text-purple-400 text-xs font-medium uppercase tracking-wider">Day {day}</p><p className="text-white text-sm font-light truncate">{les?.title}</p></div><button onClick={()=>setVoice(!voice)} className={`w-10 h-10 rounded-xl flex items-center justify-center border ${voice?'bg-purple-500/20 border-purple-500/50 text-purple-400':'bg-white/[0.03] border-white/[0.08] text-slate-500'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg></button></div><div className="mt-4 max-w-5xl mx-auto"><div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all" style={{width:`${prog}%`}}/></div></div></header>
      <div className="relative z-10 flex-1 overflow-y-auto p-6"><div className="max-w-3xl mx-auto space-y-6">{msgs.map((m,i)=>(<div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'} animate-slideUp`}><div className={`max-w-[85%] rounded-2xl px-5 py-4 ${m.role==='user'?'bg-purple-600/30 border border-purple-500/30':'backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]'}`}>{m.role==='assistant'&&<div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.05]"><ABAOrb size={24} state={orb}/><span className="text-purple-400 text-xs font-medium">ABA</span></div>}<p className="text-slate-200 text-sm leading-relaxed font-light whitespace-pre-wrap">{m.content}</p></div></div>))}{typing&&<div className="flex justify-start animate-slideUp"><div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4"><div className="flex items-center gap-3 mb-3"><ABAOrb size={24} state="thinking"/><span className="text-amber-400 text-xs">Processing...</span></div><div className="flex gap-2">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}}/>)}</div></div></div>}<div ref={endRef}/></div></div>
      <div className="relative z-10 backdrop-blur-xl bg-black/30 border-t border-white/[0.05] p-6"><div className="max-w-3xl mx-auto flex gap-4"><input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&send()} placeholder="Type your response..." className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 font-light"/><button onClick={send} disabled={!input.trim()||typing} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium px-8 py-4 rounded-xl">Send</button></div>{prog>=70&&<div className="max-w-3xl mx-auto mt-4"><button onClick={complete} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium py-4 rounded-xl shadow-lg shadow-emerald-500/20">Complete · +100 XP</button></div>}</div>
      <audio ref={audioRef}/>
    </div>
  )}

  if(view==='kudos')return(<div className="min-h-screen bg-[#0a0a0f] p-8 overflow-hidden"><KenBurns img={BG.nebula} dark={60}/><div className="relative z-10 max-w-4xl mx-auto animate-fadeIn"><button onClick={()=>setView('home')} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button><h1 className="text-3xl font-light text-white mb-2">Kudos Board</h1><p className="text-slate-400 font-light mb-8">Fellowship Cohort</p><Glass><div className="space-y-4">{cohort.map((m,i)=>(<div key={m.id} className={`flex items-center gap-4 p-4 rounded-xl ${i===0?'bg-amber-500/10 border border-amber-500/20':'bg-white/[0.02]'}`}><span className={`text-2xl font-bold ${i===0?'text-amber-400':i===1?'text-slate-300':i===2?'text-amber-600':'text-slate-500'}`}>{i+1}</span><img src={m.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name||'U')}&background=8b5cf6&color=fff`} className="w-10 h-10 rounded-xl"/><div className="flex-1"><p className="text-white font-medium">{m.name||'Fellow'}</p><p className="text-slate-500 text-sm">{m.completedDays?.length||0} lessons</p></div><div className="text-right"><p className="text-purple-400 font-bold">{m.xp||0}</p><p className="text-slate-600 text-xs">XP</p></div></div>))}{cohort.length===0&&<p className="text-slate-500 text-center py-8">No members yet</p>}</div></Glass></div></div>);

  if(view==='iep')return(<div className="min-h-screen bg-[#0a0a0f] p-8 overflow-hidden"><KenBurns img={BG.eventHorizon} dark={70}/><div className="relative z-10 max-w-4xl mx-auto animate-fadeIn"><button onClick={()=>setView('home')} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button><h1 className="text-3xl font-light text-white mb-2">Individual Education Plan</h1><p className="text-slate-400 font-light mb-8">Your learning profile</p><div className="grid md:grid-cols-2 gap-6"><Glass><h3 className="text-emerald-400 font-medium mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full"/>Strengths</h3>{profile?.iep?.strengths?.length>0?<ul className="space-y-2">{profile.iep.strengths.map((s,i)=><li key={i} className="text-slate-300 text-sm font-light">{s}</li>)}</ul>:<p className="text-slate-600 text-sm">Complete lessons to identify</p>}</Glass><Glass><h3 className="text-amber-400 font-medium mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-amber-400 rounded-full"/>Development Areas</h3>{profile?.iep?.gaps?.length>0?<ul className="space-y-2">{profile.iep.gaps.map((g,i)=><li key={i} className="text-slate-300 text-sm font-light">{g}</li>)}</ul>:<p className="text-slate-600 text-sm">ABA will identify areas</p>}</Glass></div></div></div>);

  if(view==='learn'){const v=CUR[vol],done=profile?.completedDays||[];return(<div className="min-h-screen bg-[#0a0a0f] p-8 overflow-hidden"><KenBurns img={BG.pinkSmoke} dark={55}/><div className="relative z-10 max-w-5xl mx-auto animate-fadeIn"><button onClick={()=>setView('home')} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button><div className="flex gap-4 mb-8 flex-wrap">{Object.entries(CUR).map(([k,x])=>(<button key={k} onClick={()=>setVol(k)} className={`px-6 py-3 rounded-xl font-medium transition-all ${vol===k?'bg-purple-600 text-white shadow-lg shadow-purple-500/20':'bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white'}`}>{x.title}</button>))}</div><Glass className="mb-8"><h2 className="text-2xl font-light text-white mb-2">{v.title}</h2><p className="text-slate-400 font-light mb-4">{v.desc}</p><div className="flex gap-6 text-sm text-slate-500"><span>{v.days} Days</span><span>{v.lessons.filter(l=>l.type==='lesson').length} Lessons</span></div></Glass>{today>=2&&<div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"><p className="text-amber-400 text-sm">{today>=3?'Daily limit. Return tomorrow.':`${3-today} remaining today.`}</p></div>}<div className="grid grid-cols-5 lg:grid-cols-6 gap-3">{v.lessons.map(l=>{const k=`${vol}-d${l.day}`,dn=done.includes(k),isQ=l.type==='quiz',isCap=l.type==='capstone',isA=l.type==='assessment',c=canStart(l);return(<button key={l.day} onClick={()=>c.ok&&start(vol,l.day)} disabled={!c.ok&&!dn} title={!c.ok?c.msg:l.title} className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all border ${dn?'bg-emerald-500/10 border-emerald-500/30 text-emerald-400':isQ?'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20':isCap?'bg-amber-500/10 border-amber-500/30 text-amber-400':isA?'bg-red-500/10 border-red-500/30 text-red-400':!c.ok?'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed':'bg-white/[0.02] border-white/[0.08] text-white hover:bg-white/[0.05]'}`}><span className="text-lg font-medium">{l.day}</span><span className="text-[10px] mt-1 opacity-60">{dn?'Done':isQ?'Quiz':isCap?'Final':isA?'Eval':''}</span></button>)})}</div></div></div>)}

  const cnt=profile?.completedDays?.length||0,tot=Object.values(CUR).reduce((s,v)=>s+v.lessons.length,0);
  return(<div className="min-h-screen bg-[#0a0a0f] p-8 overflow-hidden"><KenBurns img={BG.pinkSmoke} dark={55}/><div className="relative z-10 max-w-4xl mx-auto animate-fadeIn"><div className="flex items-center gap-8 mb-10"><ABAOrb size={100} state="idle"/><div><h1 className="text-3xl lg:text-4xl font-light text-white">Welcome, <span className="text-purple-400">{profile?.name?.split(' ')[0]||'Fellow'}</span></h1><p className="text-slate-400 font-light mt-2">{cnt===0?'Ready to begin?':`${tot-cnt} lessons remaining`}</p></div></div><div className="grid grid-cols-3 gap-4 mb-8">{[{l:'Completed',v:cnt,c:'text-white'},{l:'Streak',v:profile?.streak||0,c:'text-amber-400'},{l:'XP',v:profile?.xp||0,c:'text-purple-400'}].map((s,i)=>(<Glass key={i} className="text-center"><p className={`text-3xl font-light ${s.c}`}>{s.v}</p><p className="text-slate-500 text-sm font-light mt-1">{s.l}</p></Glass>))}</div><Glass className="mb-8"><div className="flex items-center justify-between mb-4"><h3 className="text-white font-medium">Progress</h3><span className="text-purple-400 font-medium">{Math.round((cnt/tot)*100)}%</span></div><div className="h-2 bg-white/[0.05] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all" style={{width:`${(cnt/tot)*100}%`}}/></div></Glass><div className="grid grid-cols-2 gap-4 mb-8"><button onClick={()=>setView('learn')} className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 text-white font-medium py-5 rounded-xl shadow-lg shadow-purple-500/20 text-lg">Continue Learning</button><button onClick={()=>setView('kudos')} className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] text-white font-medium py-5 rounded-xl">Kudos Board</button></div><div className="grid grid-cols-2 gap-4"><button onClick={()=>setView('iep')} className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] text-white font-medium py-4 rounded-xl">My IEP</button><button onClick={signOff} className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] text-slate-400 font-medium py-4 rounded-xl">Sign Out</button></div></div></div>);
}
