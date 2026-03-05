// GMG UNIVERSITY v5.1.0 ECHO - SOPHISTICATED ABA OS DESIGN
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const ABA_ENDPOINTS = { air: 'https://abacia-services.onrender.com/api/air/process', status: 'https://abacia-services.onrender.com/api/air/status', elevenlabs: 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL' };
const SUPABASE = { url: 'https://htlxjkbrstpwwtzsbyvb.supabase.co', serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUzMjgyMSwiZXhwIjoyMDg2MTA4ODIxfQ.G55zXnfanoUxRAoaYz-tD9FDJ53xHH-pRgDrKss_Iqo' };
const ELEVENLABS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';
const BACKGROUNDS = { eventHorizon: 'https://i.imgur.com/A44TxCq.jpeg', nebula: 'https://i.imgur.com/nLBRQ82.jpeg', particleLights: 'https://i.imgur.com/wLi9sGD.jpeg', blackLandscape: 'https://i.imgur.com/ZwVdgzN.jpeg' };

const STATE_PALETTES = {
  idle: { colors: [[139,92,246],[167,139,250],[236,72,153],[99,102,241]], glow: [139,92,246] },
  thinking: { colors: [[245,158,11],[251,191,36],[239,68,68],[253,224,71]], glow: [245,158,11] },
  speaking: { colors: [[34,197,94],[16,185,129],[132,204,22],[45,212,191]], glow: [34,197,94] },
  listening: { colors: [[6,182,212],[59,130,246],[139,92,246],[147,197,253]], glow: [6,182,212] }
};

class NoiseGen { constructor(){this.p=Array.from({length:512},()=>Math.floor(Math.random()*256))} n(x,y){const X=Math.floor(x)&255,Y=Math.floor(y)&255;x-=Math.floor(x);y-=Math.floor(y);const u=x*x*x*(x*(x*6-15)+10),v=y*y*y*(y*(y*6-15)+10),A=this.p[X]+Y,B=this.p[X+1]+Y;const g=(h,a,b)=>{const hh=h&3,uu=hh<2?a:b,vv=hh<2?b:a;return((hh&1)?-uu:uu)+((hh&2)?-vv:vv)};return(1-v)*((1-u)*g(this.p[A],x,y)+u*g(this.p[B],x-1,y))+v*((1-u)*g(this.p[A+1],x,y-1)+u*g(this.p[B+1],x-1,y-1))}}

const ABAConsciousness = ({ size = 200, state = 'idle' }) => {
  const canvasRef = useRef(null), animRef = useRef(null), noiseRef = useRef(new NoiseGen()), stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio||1,2);
    canvas.width = size*dpr; canvas.height = size*dpr; ctx.scale(dpr,dpr);
    const center = size/2, noise = noiseRef.current; let time = 0;
    const animate = () => {
      const palette = STATE_PALETTES[stateRef.current]||STATE_PALETTES.idle;
      const speed = stateRef.current==='thinking'?0.025:stateRef.current==='speaking'?0.018:0.015;
      time += speed; ctx.clearRect(0,0,size,size);
      for(let layer=0;layer<4;layer++){
        const color=palette.colors[layer], baseR=size*(0.28-layer*0.03);
        ctx.beginPath();
        for(let i=0;i<=100;i++){
          const angle=(i/100)*Math.PI*2;
          const n1=noise.n(Math.cos(angle)*2+time+layer*0.7,Math.sin(angle)*2+time*0.7);
          const n2=noise.n(Math.cos(angle)*4+time*1.3,Math.sin(angle)*4+time*0.9)*0.5;
          const r=baseR+(n1+n2)*0.3*size*0.15;
          const x=center+Math.cos(angle)*r, y=center+Math.sin(angle)*r;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.closePath();
        const grad=ctx.createRadialGradient(center+Math.sin(time*2)*10,center+Math.cos(time*1.5)*10,0,center,center,baseR*1.5);
        const alpha=0.7-layer*0.12;
        grad.addColorStop(0,`rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
        grad.addColorStop(0.5,`rgba(${color[0]},${color[1]},${color[2]},${alpha*0.6})`);
        grad.addColorStop(1,`rgba(${color[0]},${color[1]},${color[2]},0)`);
        ctx.fillStyle=grad; ctx.fill();
        if(layer===0){ctx.shadowColor=`rgba(${color[0]},${color[1]},${color[2]},0.5)`;ctx.shadowBlur=30;ctx.fill();ctx.shadowBlur=0;}
      }
      animRef.current=requestAnimationFrame(animate);
    };
    animate();
    return()=>{if(animRef.current)cancelAnimationFrame(animRef.current)};
  },[size]);
  return <canvas ref={canvasRef} style={{width:size,height:size}}/>;
};

const CURRICULUM = {
  v1: { title:'Fundraising Foundations', days:30, description:'Master nonprofit fundraising fundamentals',
    lessons: Array.from({length:30},(_, i)=>({day:i+1,title:['The Four Sources of Money','Why People Actually Give','The Donor Lifecycle','The Donor Pyramid','Assessment: Days 1-4','Annual Giving Programs','Foundation Grants Reality','Corporate Partnerships','Earned Revenue Strategies','Assessment: Days 6-9','Board Fundraising Responsibility','Grant Research Deep Dive','Donor Retention Strategies','Fundraising Systems and Tools','Assessment: Days 11-14','Grant Writing Basics','Major Donor Identification','Planned Giving Introduction','Corporate Sponsorship Models','Assessment: Days 16-19','Digital Fundraising Tactics','Storytelling for Impact','Capital Campaigns Overview','Monthly Giving Programs','Assessment: Days 21-24','Board Development','Prospect Research Methods','Fundraising Metrics That Matter','Strategic Planning for Development','Volume 1 Capstone'][i],type:(i+1)%5===0?'quiz':i===29?'capstone':'lesson'}))
  },
  v2: { title:'The GMG Way', days:30, description:'Learn GMG methodology', lessons:Array.from({length:30},(_,i)=>({day:i+1,title:`GMG Method Day ${i+1}`,type:(i+1)%5===0?'quiz':i===29?'capstone':'lesson'})) },
  v3: { title:'CPP Consultant Model', days:15, description:'LAYERED Assessment', lessons:Array.from({length:15},(_,i)=>({day:i+1,title:`Assessment ${i+1}`,type:i===14?'capstone':'assessment'})) }
};

const GlassCard = ({children,className='',hover=true,padding=true}) => (
  <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] ${hover?'hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300':''} ${padding?'p-6':''} rounded-2xl ${className}`}>{children}</div>
);

export default function GMGUniversity() {
  const [user,setUser]=useState(null),[userProfile,setUserProfile]=useState(null),[loading,setLoading]=useState(true);
  const [view,setView]=useState('home'),[selectedVolume,setSelectedVolume]=useState('v1'),[selectedDay,setSelectedDay]=useState(null);
  const [messages,setMessages]=useState([]),[inputValue,setInputValue]=useState(''),[isTyping,setIsTyping]=useState(false);
  const [abaState,setAbaState]=useState('idle'),[lessonProgress,setLessonProgress]=useState(0),[voiceMode,setVoiceMode]=useState(false);
  const [airStatus,setAirStatus]=useState(null),[cohortMembers,setCohortMembers]=useState([]),[todayLessons,setTodayLessons]=useState(0);
  const [isMobile,setIsMobile]=useState(false);
  const messagesEndRef=useRef(null),audioRef=useRef(null);

  useEffect(()=>{const c=()=>setIsMobile(window.innerWidth<1024);c();window.addEventListener('resize',c);return()=>window.removeEventListener('resize',c)},[]);
  useEffect(()=>{fetch(ABA_ENDPOINTS.status).then(r=>r.json()).then(setAirStatus).catch(console.error)},[]);
  useEffect(()=>{const unsub=onAuthStateChanged(auth,async(u)=>{if(u){setUser(u);await loadUserProfile(u);await loadCohort();}else{setUser(null);setUserProfile(null);}setLoading(false)});return()=>unsub()},[]);

  const loadUserProfile=async(u)=>{try{const ref=doc(db,'users',u.uid),snap=await getDoc(ref);if(snap.exists()){const d=snap.data();setUserProfile(d);setTodayLessons(d.lessonsLog?.filter(l=>new Date(l.date).toDateString()===new Date().toDateString())?.length||0);}else{const np={email:u.email,name:u.displayName||'Fellow',photoURL:u.photoURL,completedDays:[],xp:0,streak:0,lessonsLog:[],iep:{strengths:[],gaps:[],notes:[]},createdAt:serverTimestamp()};await setDoc(ref,np);setUserProfile(np);}}catch(e){console.error(e)}};
  const loadCohort=async()=>{try{const q=query(collection(db,'users'),orderBy('xp','desc'),limit(10)),snap=await getDocs(q);setCohortMembers(snap.docs.map(d=>({id:d.id,...d.data()})))}catch(e){console.error(e)}};
  const handleSignIn=()=>signInWithPopup(auth,googleProvider).catch(console.error);
  const handleSignOut=()=>signOut(auth).then(()=>setView('home'));
  const canStartLesson=(lesson)=>{const key=`${selectedVolume}-d${lesson.day}`;if(userProfile?.completedDays?.includes(key))return{allowed:false,reason:'Completed'};if(lesson.type==='quiz'&&!userProfile?.completedDays?.includes(`${selectedVolume}-d${lesson.day-1}`))return{allowed:false,reason:'Complete previous first'};if(todayLessons>=3)return{allowed:false,reason:'Daily limit reached'};return{allowed:true}};

  const sendToABA=async(msg,isStart=false)=>{
    setIsTyping(true);setAbaState('thinking');
    const lesson=CURRICULUM[selectedVolume]?.lessons.find(l=>l.day===selectedDay);
    const sys=`You are ABA, the AI professor for GMG University. Volume: ${CURRICULUM[selectedVolume]?.title}, Day ${selectedDay}: ${lesson?.title}. Student: ${userProfile?.name}. ${isStart?'Start the lesson warmly, preview content, begin teaching.':'Continue teaching conversationally.'} Be warm, professional. Never use emojis. Never say "I'd be happy to help."`;
    try{const r=await fetch(ABA_ENDPOINTS.air,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,user_id:userProfile?.email||'guest',channel:'gmg_university',context:{lesson:lesson?.title,systemPrompt:sys}})});const d=await r.json();const resp=d.response||d.message||"Let me gather my thoughts...";setMessages(p=>[...p,{role:'user',content:msg},{role:'assistant',content:resp}]);setAbaState('speaking');setLessonProgress(p=>Math.min(p+15,100));if(voiceMode)speakTTS(resp);setTimeout(()=>setAbaState('idle'),2000)}catch(e){setMessages(p=>[...p,{role:'user',content:msg},{role:'assistant',content:"Connection issue. Let's try again."}]);setAbaState('idle')}finally{setIsTyping(false)}
  };
  const speakTTS=async(t)=>{try{const r=await fetch(ABA_ENDPOINTS.elevenlabs,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':ELEVENLABS_KEY},body:JSON.stringify({text:t.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});const b=await r.blob();if(audioRef.current){audioRef.current.src=URL.createObjectURL(b);audioRef.current.play()}}catch(e){console.error(e)}};
  const startLesson=(v,d)=>{const l=CURRICULUM[v]?.lessons.find(x=>x.day===d);const c=canStartLesson(l);if(!c.allowed){alert(c.reason);return}setSelectedVolume(v);setSelectedDay(d);setMessages([]);setLessonProgress(0);setView('lesson');setTimeout(()=>sendToABA("I'm ready.",true),500)};
  const completeLesson=async()=>{if(!user)return;const key=`${selectedVolume}-d${selectedDay}`;try{const ref=doc(db,'users',user.uid);await updateDoc(ref,{completedDays:arrayUnion(key),xp:(userProfile.xp||0)+100,lessonsLog:arrayUnion({day:key,date:new Date().toISOString()})});setUserProfile(p=>({...p,completedDays:[...(p.completedDays||[]),key],xp:(p.xp||0)+100}));setTodayLessons(p=>p+1);await loadCohort();setView('learn')}catch(e){console.error(e)}};
  const handleSend=()=>{if(!inputValue.trim())return;setAbaState('listening');sendToABA(inputValue);setInputValue('')};
  useEffect(()=>{messagesEndRef.current?.scrollIntoView({behavior:'smooth'})},[messages]);

  if(loading)return(<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center" style={{backgroundImage:`url(${BACKGROUNDS.nebula})`,backgroundSize:'cover'}}><div className="absolute inset-0 bg-black/60"/><div className="relative text-center"><ABAConsciousness size={150} state="thinking"/><p className="text-purple-300 font-light mt-6">Initializing...</p></div></div>);

  if(!user)return(
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6" style={{backgroundImage:`url(${BACKGROUNDS.eventHorizon})`,backgroundSize:'cover'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-950/30 to-black/80"/>
      <div className="relative z-10 max-w-lg w-full">
        <div className="text-center mb-10"><ABAConsciousness size={120} state="idle"/><h1 className="text-5xl font-extralight text-white mt-6">GMG <span className="font-normal text-purple-400">University</span></h1><p className="text-slate-400 text-lg mt-2 font-light">Lane-Pierce Fellowship Program</p><div className="flex items-center justify-center gap-2 mt-4"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/><span className="text-emerald-400/80 text-sm">{airStatus?`${airStatus.agents} agents`:'Connecting...'}</span></div></div>
        <GlassCard className="mb-8"><div className="space-y-6">{[{t:'75 Days of Training',d:'Three volumes of fundraising mastery',c:'bg-purple-400'},{t:'ABA-Powered Learning',d:'Live AI via 79 agents',c:'bg-amber-400'},{t:'Individual Education Plan',d:'Personalized learning path',c:'bg-emerald-400'},{t:'Voice Mode',d:'ABA speaks lessons aloud',c:'bg-cyan-400'}].map((x,i)=>(<div key={i} className="flex items-start gap-4"><div className="w-10 h-10 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center"><div className={`w-2 h-2 rounded-full ${x.c}`}/></div><div><p className="text-white font-medium">{x.t}</p><p className="text-slate-500 text-sm font-light">{x.d}</p></div></div>))}</div></GlassCard>
        <button onClick={handleSignIn} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium py-4 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3"><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google</button>
        <p className="text-center text-slate-600 text-sm mt-10 font-light tracking-wider">We Are All ABA.</p>
      </div>
    </div>
  );

  // LESSON VIEW
  if(view==='lesson'&&selectedDay){const lesson=CURRICULUM[selectedVolume]?.lessons.find(l=>l.day===selectedDay);return(
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col" style={{backgroundImage:`url(${BACKGROUNDS.particleLights})`,backgroundSize:'cover'}}><div className="absolute inset-0 bg-black/70"/>
      <header className="relative z-10 backdrop-blur-xl bg-black/30 border-b border-white/[0.05] px-6 py-4"><div className="flex items-center justify-between max-w-5xl mx-auto"><button onClick={()=>setView('learn')} className="text-slate-400 hover:text-white text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Exit</button><div className="text-center flex-1 px-4"><p className="text-purple-400 text-xs font-medium uppercase tracking-wider">Day {selectedDay}</p><p className="text-white text-sm font-light truncate">{lesson?.title}</p></div><button onClick={()=>setVoiceMode(!voiceMode)} className={`w-10 h-10 rounded-xl flex items-center justify-center border ${voiceMode?'bg-purple-500/20 border-purple-500/50 text-purple-400':'bg-white/[0.03] border-white/[0.08] text-slate-500'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg></button></div><div className="mt-4 max-w-5xl mx-auto"><div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all" style={{width:`${lessonProgress}%`}}/></div></div></header>
      <div className="relative z-10 flex-1 overflow-y-auto p-6"><div className="max-w-3xl mx-auto space-y-6">{messages.map((m,i)=>(<div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-5 py-4 ${m.role==='user'?'bg-purple-600/30 border border-purple-500/30':'backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]'}`}>{m.role==='assistant'&&<div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.05]"><ABAConsciousness size={24} state={abaState}/><span className="text-purple-400 text-xs font-medium tracking-wider">ABA</span></div>}<p className="text-slate-200 text-sm leading-relaxed font-light whitespace-pre-wrap">{m.content}</p></div></div>))}{isTyping&&<div className="flex justify-start"><div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4"><div className="flex items-center gap-3 mb-3"><ABAConsciousness size={24} state="thinking"/><span className="text-amber-400 text-xs">Processing...</span></div><div className="flex gap-2">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" style={{animationDelay:`${i*200}ms`}}/>)}</div></div></div>}<div ref={messagesEndRef}/></div></div>
      <div className="relative z-10 backdrop-blur-xl bg-black/30 border-t border-white/[0.05] p-6"><div className="max-w-3xl mx-auto flex gap-4"><input type="text" value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleSend()} placeholder="Type your response..." className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 font-light"/><button onClick={handleSend} disabled={!inputValue.trim()||isTyping} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium px-8 py-4 rounded-xl">Send</button></div>{lessonProgress>=70&&<div className="max-w-3xl mx-auto mt-4"><button onClick={completeLesson} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-medium py-4 rounded-xl shadow-lg shadow-emerald-500/20">Complete Lesson · +100 XP</button></div>}</div>
      <audio ref={audioRef}/>
    </div>
  )}

  // KUDOS BOARD
  if(view==='kudos')return(
    <div className="min-h-screen bg-[#0a0a0f] p-8" style={{backgroundImage:`url(${BACKGROUNDS.blackLandscape})`,backgroundSize:'cover'}}><div className="absolute inset-0 bg-black/60"/>
      <div className="relative z-10 max-w-4xl mx-auto">
        <button onClick={()=>setView('home')} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button>
        <h1 className="text-3xl font-light text-white mb-2">Kudos Board</h1><p className="text-slate-400 font-light mb-8">Lane-Pierce Fellowship Cohort</p>
        <GlassCard><div className="space-y-4">{cohortMembers.map((m,i)=>(<div key={m.id} className={`flex items-center gap-4 p-4 rounded-xl ${i===0?'bg-amber-500/10 border border-amber-500/20':'bg-white/[0.02]'}`}><span className={`text-2xl font-bold ${i===0?'text-amber-400':i===1?'text-slate-300':i===2?'text-amber-600':'text-slate-500'}`}>{i+1}</span><img src={m.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name||'U')}&background=8b5cf6&color=fff`} className="w-10 h-10 rounded-xl"/><div className="flex-1"><p className="text-white font-medium">{m.name||'Fellow'}</p><p className="text-slate-500 text-sm">{m.completedDays?.length||0} lessons</p></div><div className="text-right"><p className="text-purple-400 font-bold">{m.xp||0}</p><p className="text-slate-600 text-xs">XP</p></div></div>))}{cohortMembers.length===0&&<p className="text-slate-500 text-center py-8">No members yet</p>}</div></GlassCard>
      </div>
    </div>
  );

  // IEP VIEW
  if(view==='iep')return(
    <div className="min-h-screen bg-[#0a0a0f] p-8" style={{backgroundImage:`url(${BACKGROUNDS.blackLandscape})`,backgroundSize:'cover'}}><div className="absolute inset-0 bg-black/70"/>
      <div className="relative z-10 max-w-4xl mx-auto">
        <button onClick={()=>setView('home')} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button>
        <h1 className="text-3xl font-light text-white mb-2">Individual Education Plan</h1><p className="text-slate-400 font-light mb-8">Your personalized learning profile</p>
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard><h3 className="text-emerald-400 font-medium mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full"/>Strengths</h3>{userProfile?.iep?.strengths?.length>0?<ul className="space-y-2">{userProfile.iep.strengths.map((s,i)=><li key={i} className="text-slate-300 text-sm font-light">{s}</li>)}</ul>:<p className="text-slate-600 text-sm">Complete lessons to identify strengths</p>}</GlassCard>
          <GlassCard><h3 className="text-amber-400 font-medium mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-amber-400 rounded-full"/>Areas for Development</h3>{userProfile?.iep?.gaps?.length>0?<ul className="space-y-2">{userProfile.iep.gaps.map((g,i)=><li key={i} className="text-slate-300 text-sm font-light">{g}</li>)}</ul>:<p className="text-slate-600 text-sm">ABA will identify areas as you learn</p>}</GlassCard>
        </div>
      </div>
    </div>
  );

  // LEARN VIEW
  if(view==='learn'){const vol=CURRICULUM[selectedVolume],completed=userProfile?.completedDays||[];return(
    <div className="min-h-screen bg-[#0a0a0f] p-8" style={{backgroundImage:`url(${BACKGROUNDS.blackLandscape})`,backgroundSize:'cover'}}><div className="absolute inset-0 bg-black/60"/>
      <div className="relative z-10 max-w-5xl mx-auto">
        <button onClick={()=>setView('home')} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back</button>
        <div className="flex gap-4 mb-8">{Object.entries(CURRICULUM).map(([k,v])=>(<button key={k} onClick={()=>setSelectedVolume(k)} className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedVolume===k?'bg-purple-600 text-white shadow-lg shadow-purple-500/20':'bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white'}`}>{v.title}</button>))}</div>
        <GlassCard className="mb-8"><h2 className="text-2xl font-light text-white mb-2">{vol.title}</h2><p className="text-slate-400 font-light mb-4">{vol.description}</p><div className="flex gap-6 text-sm text-slate-500"><span>{vol.days} Days</span><span>{vol.lessons.filter(l=>l.type==='lesson').length} Lessons</span><span>{vol.lessons.filter(l=>l.type==='quiz').length} Assessments</span></div></GlassCard>
        {todayLessons>=2&&<div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"><p className="text-amber-400 text-sm">{todayLessons>=3?'Daily limit reached. Return tomorrow.':`${3-todayLessons} lesson${3-todayLessons===1?'':'s'} remaining today.`}</p></div>}
        <div className="grid grid-cols-5 lg:grid-cols-6 gap-3">{vol.lessons.map(l=>{const key=`${selectedVolume}-d${l.day}`,done=completed.includes(key),isQ=l.type==='quiz',isCap=l.type==='capstone',isA=l.type==='assessment',check=canStartLesson(l);return(<button key={l.day} onClick={()=>check.allowed&&startLesson(selectedVolume,l.day)} disabled={!check.allowed&&!done} title={!check.allowed?check.reason:l.title} className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all border ${done?'bg-emerald-500/10 border-emerald-500/30 text-emerald-400':isQ?'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20':isCap?'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20':isA?'bg-red-500/10 border-red-500/30 text-red-400':!check.allowed?'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed':'bg-white/[0.02] border-white/[0.08] text-white hover:bg-white/[0.05]'}`}><span className="text-lg font-medium">{l.day}</span><span className="text-[10px] mt-1 opacity-60">{done?'Done':isQ?'Quiz':isCap?'Final':isA?'Eval':''}</span></button>)})}</div>
      </div>
    </div>
  )}

  // HOME VIEW
  const completedCount=userProfile?.completedDays?.length||0,totalLessons=Object.values(CURRICULUM).reduce((s,v)=>s+v.lessons.length,0);
  return(
    <div className="min-h-screen bg-[#0a0a0f] p-8" style={{backgroundImage:`url(${BACKGROUNDS.nebula})`,backgroundSize:'cover'}}><div className="absolute inset-0 bg-black/60"/>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-8 mb-10"><ABAConsciousness size={isMobile?80:120} state="idle"/><div><h1 className="text-3xl lg:text-4xl font-light text-white">Welcome back, <span className="text-purple-400">{userProfile?.name?.split(' ')[0]||'Fellow'}</span></h1><p className="text-slate-400 font-light mt-2">{completedCount===0?'Ready to begin?':`${totalLessons-completedCount} lessons remaining`}</p></div></div>
        <div className="grid grid-cols-3 gap-4 mb-8">{[{l:'Completed',v:completedCount,c:'text-white'},{l:'Streak',v:userProfile?.streak||0,c:'text-amber-400'},{l:'XP',v:userProfile?.xp||0,c:'text-purple-400'}].map((s,i)=>(<GlassCard key={i} className="text-center"><p className={`text-3xl font-light ${s.c}`}>{s.v}</p><p className="text-slate-500 text-sm font-light mt-1">{s.l}</p></GlassCard>))}</div>
        <GlassCard className="mb-8"><div className="flex items-center justify-between mb-4"><h3 className="text-white font-medium">Progress</h3><span className="text-purple-400 font-medium">{Math.round((completedCount/totalLessons)*100)}%</span></div><div className="h-2 bg-white/[0.05] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all" style={{width:`${(completedCount/totalLessons)*100}%`}}/></div></GlassCard>
        <div className="grid grid-cols-2 gap-4 mb-8"><button onClick={()=>setView('learn')} className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 text-white font-medium py-5 rounded-xl shadow-lg shadow-purple-500/20 text-lg">Continue Learning</button><button onClick={()=>setView('kudos')} className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] text-white font-medium py-5 rounded-xl">Kudos Board</button></div>
        <div className="grid grid-cols-2 gap-4"><button onClick={()=>setView('iep')} className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] text-white font-medium py-4 rounded-xl">My IEP</button><button onClick={handleSignOut} className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] text-slate-400 font-medium py-4 rounded-xl">Sign Out</button></div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.animate-fadeIn{animation:fadeIn .3s ease-out}`}</style>
    </div>
  );
}
