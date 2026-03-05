// GMG UNIVERSITY v5.9.0 - ABA TEACHES LIVE
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
  send: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
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
const CUR = {
  v1: { title:'Fundraising Foundations', days:30, icon: Icons.book },
  v2: { title:'The GMG Way', days:30, icon: Icons.target },
  v3: { title:'CPP Model', days:15, icon: Icons.briefcase }
};

export default function App() {
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
  const [view,setView]=useState('home'),[vol,setVol]=useState('v1'),[day,setDay]=useState(null);
  const [orb,setOrb]=useState('idle'),[voice,setVoice]=useState(false);
  const [air,setAir]=useState(null),[cohort,setCohort]=useState([]),[today,setToday]=useState(0);
  
  // Lesson state
  const [lessonPhase,setLessonPhase]=useState('loading'); // loading, teaching, ready, asking
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');
  const [typing,setTyping]=useState(false);
  
  const audioRef=useRef(null);
  const endRef=useRef(null);

  useEffect(()=>{fetch(ABA_STATUS).then(r=>r.json()).then(setAir).catch(console.error)},[]);
  useEffect(()=>{const unsub=onAuthStateChanged(auth,async u=>{if(u){setUser(u);await loadProfile(u);await loadCohort()}else{setUser(null);setProfile(null)}setLoading(false)});return()=>unsub()},[]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[messages]);

  const loadProfile=async u=>{try{const ref=doc(db,'users',u.uid),snap=await getDoc(ref);if(snap.exists()){const d=snap.data();setProfile(d);setToday(d.lessonsLog?.filter(l=>new Date(l.date).toDateString()===new Date().toDateString())?.length||0)}else{const np={email:u.email,name:u.displayName||'Fellow',photoURL:u.photoURL,completedDays:[],xp:0,streak:0,lessonsLog:[],iep:{},createdAt:serverTimestamp()};await setDoc(ref,np);setProfile(np)}}catch(e){console.error(e)}};
  const loadCohort=async()=>{try{const q=query(collection(db,'users'),orderBy('xp','desc'),limit(10)),s=await getDocs(q);setCohort(s.docs.map(d=>({id:d.id,...d.data()})))}catch(e){console.error(e)}};
  const signIn=()=>signInWithPopup(auth,googleProvider);
  const signOff=()=>signOut(auth).then(()=>setView('home'));
  
  const getLessons = (v) => Array.from({length: CUR[v]?.days || 0}, (_, i) => ({
    day: i + 1, title: (CURRICULUM_TITLES[v] || [])[i] || `Day ${i + 1}`,
    type: (i + 1) % 5 === 0 ? 'quiz' : i === (CUR[v]?.days - 1) ? 'capstone' : 'lesson'
  }));

  // START LESSON - ABA teaches
  const startLesson = async (v, d) => {
    setVol(v); setDay(d); setView('lesson'); 
    setMessages([]); setLessonPhase('loading'); setOrb('thinking');
    
    const content = getContent(v, d);
    const userName = profile?.name?.split(' ')[0] || 'Fellow';
    
    // Build the lesson content for ABA to teach
    let lessonText = '';
    if (content) {
      lessonText = `Title: ${content.title}\n\n`;
      content.sections?.forEach(s => { lessonText += `${s.h}:\n${s.c}\n\n`; });
      if (content.exercise) lessonText += `Exercise: ${content.exercise}\n\n`;
      if (content.keyTakeaways) lessonText += `Key Takeaways: ${content.keyTakeaways.join('. ')}`;
    }

    // Call AIR to teach the lesson
    try {
      const response = await fetch(ABA_AIR, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Teach me Day ${d}: ${content?.title}`,
          user_id: profile?.email || 'guest',
          channel: 'gmg_university',
          context: {
            systemPrompt: `You are ABA, the AI professor for GMG University's Lane-Pierce Fellowship. You teach fundraising to nonprofit professionals.

STUDENT NAME: ${userName}

YOUR TASK: Teach this lesson conversationally. Do NOT dump all the content at once. Start with a warm greeting, introduce the topic, then teach the first key concept. End by asking if they're ready to continue or have questions.

LESSON TO TEACH:
${lessonText}

TEACHING STYLE:
- Greet the student by name
- Be warm and engaging, like a real professor
- Teach one concept at a time
- Use examples and analogies
- End with a question to check understanding or ask if ready to continue
- No markdown symbols, no asterisks, no hashtags
- Write naturally, conversationally

Start teaching now.`,
            mode: 'teaching',
            lesson: content?.title,
            day: d,
            volume: v
          }
        })
      });
      
      const data = await response.json();
      const teachingResponse = data.response || data.message || `${userName}, let's dive into today's lesson on ${content?.title}.`;
      
      setMessages([{ role: 'assistant', content: teachingResponse }]);
      setLessonPhase('teaching');
      setOrb('speaking');
      if (voice) speak(teachingResponse);
      setTimeout(() => setOrb('idle'), 3000);
      
    } catch (e) {
      // Fallback if AIR fails
      const fallback = `${userName}, welcome to Day ${d}. Today we're covering ${content?.title}. Let me walk you through the key concepts.\n\n${content?.sections?.[0]?.c || 'Loading content...'}\n\nDoes this make sense so far? Let me know if you have questions, or say "continue" to keep going.`;
      setMessages([{ role: 'assistant', content: fallback }]);
      setLessonPhase('teaching');
      setOrb('idle');
    }
  };

  // CONTINUE CONVERSATION
  const sendMessage = async () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', content: userMsg }]);
    setTyping(true); setOrb('thinking');

    const content = getContent(vol, day);
    let lessonText = '';
    if (content) {
      lessonText = `Title: ${content.title}\n`;
      content.sections?.forEach(s => { lessonText += `${s.h}: ${s.c}\n`; });
      if (content.keyTakeaways) lessonText += `Key Takeaways: ${content.keyTakeaways.join('. ')}`;
    }

    try {
      const response = await fetch(ABA_AIR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          user_id: profile?.email || 'guest',
          channel: 'gmg_university',
          context: {
            systemPrompt: `You are ABA teaching ${profile?.name?.split(' ')[0] || 'a student'} at GMG University.

CURRENT LESSON: Day ${day} - ${content?.title}
LESSON CONTENT: ${lessonText}

CONVERSATION SO FAR:
${messages.map(m => `${m.role === 'user' ? 'Student' : 'ABA'}: ${m.content}`).join('\n')}

STUDENT JUST SAID: "${userMsg}"

RESPOND APPROPRIATELY:
- If they said "continue" or similar, teach the next concept from the lesson
- If they asked a question, answer it based on the lesson content
- If they seem confused, clarify with examples
- If they're ready to finish, summarize key takeaways
- Stay conversational and warm
- No markdown symbols
- End with engagement (question or prompt)`,
            mode: 'conversation',
            lesson: content?.title
          }
        })
      });

      const data = await response.json();
      const reply = data.response || data.message || "Let me think about that...";
      setMessages(p => [...p, { role: 'assistant', content: reply }]);
      setOrb('speaking');
      if (voice) speak(reply);
      setTimeout(() => setOrb('idle'), 3000);

    } catch (e) {
      setMessages(p => [...p, { role: 'assistant', content: "I had a connection issue. Could you repeat that?" }]);
      setOrb('idle');
    } finally { setTyping(false); }
  };

  const speak=async t=>{try{const r=await fetch(TTS_URL,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':TTS_KEY},body:JSON.stringify({text:t?.substring(0,1000),model_id:'eleven_turbo_v2_5',voice_settings:{stability:0.5,similarity_boost:0.75}})});if(audioRef.current&&r.ok){audioRef.current.src=URL.createObjectURL(await r.blob());audioRef.current.play()}}catch(e){}};
  
  const complete=async()=>{
    if(!user)return;
    const k=`${vol}-d${day}`;
    if(profile?.completedDays?.includes(k)) { setView('learn'); return; }
    try{
      const ref=doc(db,'users',user.uid);
      await updateDoc(ref,{completedDays:arrayUnion(k),xp:(profile.xp||0)+100,lessonsLog:arrayUnion({day:k,date:new Date().toISOString()})});
      setProfile(p=>({...p,completedDays:[...(p.completedDays||[]),k],xp:(p.xp||0)+100}));
      setToday(p=>p+1);
      await loadCohort();
      setView('learn');
    }catch(e){console.error(e)}
  };

  // LOADING
  if(loading)return(<div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center"><ABAOrb size={80} state="thinking"/></div>);

  // LOGIN
  if(!user)return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <ABAOrb size={80} state="idle"/>
        <h1 className="text-2xl font-light text-white mt-6">GMG <span className="text-purple-400">University</span></h1>
        <p className="text-white/40 text-sm mt-1">Lane-Pierce Fellowship</p>
      </div>
      <button onClick={signIn} className="w-full bg-purple-600 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-3">
        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>
    </div>
  );

  // LESSON - LIVE TEACHING
  if(view==='lesson'&&day){
    const content=getContent(vol,day);
    const isDone = profile?.completedDays?.includes(`${vol}-d${day}`);
    return(
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex flex-col">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={()=>setView('learn')} className="text-white/50 p-1">{Icons.back}</button>
            <div className="text-center flex-1 px-4">
              <p className="text-purple-400 text-[10px] tracking-widest">DAY {day}</p>
              <p className="text-white text-sm truncate">{content?.title}</p>
            </div>
            <button onClick={()=>setVoice(!voice)} className={voice?'text-purple-400':'text-white/30'}>{Icons.speaker}</button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-40">
          {lessonPhase === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20">
              <ABAOrb size={60} state="thinking"/>
              <p className="text-purple-400/60 text-sm mt-4">ABA is preparing your lesson...</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`mb-4 ${m.role === 'user' ? 'flex justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1"><ABAOrb size={32} state={i === messages.length - 1 ? orb : 'idle'}/></div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              )}
              {m.role === 'user' && (
                <div className="bg-purple-600/30 border border-purple-500/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                  <p className="text-white/90">{m.content}</p>
                </div>
              )}
            </div>
          ))}
          
          {typing && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1"><ABAOrb size={32} state="thinking"/></div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay:`${i*100}ms`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="flex gap-3 mb-3">
            <input 
              type="text" 
              value={input} 
              onChange={e=>setInput(e.target.value)} 
              onKeyPress={e=>e.key==='Enter'&&sendMessage()} 
              placeholder="Ask a question or say 'continue'..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50"
            />
            <button onClick={sendMessage} disabled={!input.trim()||typing} className="bg-purple-600 disabled:bg-white/10 text-white p-3 rounded-xl">
              {Icons.send}
            </button>
          </div>
          
          {messages.length >= 2 && (
            <button onClick={complete} className={`w-full py-3 rounded-xl font-medium text-sm ${isDone?'bg-white/5 text-white/50':'bg-emerald-600 text-white'}`}>
              {isDone ? 'Already Completed' : 'Mark Complete +100 XP'}
            </button>
          )}
        </div>
        <audio ref={audioRef}/>
      </div>
    );
  }

  // KUDOS
  if(view==='kudos')return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <button onClick={()=>setView('home')} className="text-white/50 p-1 mb-4">{Icons.back}</button>
      <div className="flex items-center gap-3 mb-6"><div className="text-purple-400">{Icons.trophy}</div><h1 className="text-xl font-light text-white">Leaderboard</h1></div>
      <div className="space-y-2">
        {cohort.map((m,i)=>(<div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${i===0?'bg-amber-500/10 border border-amber-500/30':'bg-white/5 border border-white/10'}`}><span className={`text-lg font-bold w-6 ${i===0?'text-amber-400':'text-white/30'}`}>{i+1}</span><img src={m.photoURL||`https://ui-avatars.com/api/?name=${m.name||'U'}&background=8b5cf6&color=fff`} className="w-10 h-10 rounded-full"/><div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{m.name}</p><p className="text-white/40 text-xs">{m.completedDays?.length||0} lessons</p></div><p className="text-purple-400 font-medium">{m.xp||0} XP</p></div>))}
      </div>
    </div>
  );

  // IEP
  if(view==='iep')return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <button onClick={()=>setView('home')} className="text-white/50 p-1 mb-4">{Icons.back}</button>
      <div className="flex items-center gap-3 mb-6"><div className="text-purple-400">{Icons.clipboard}</div><h1 className="text-xl font-light text-white">Learning Plan</h1></div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4"><p className="text-white/50 text-sm">Your personalized learning plan will be built as you complete lessons.</p></div>
    </div>
  );

  // LEARN
  if(view==='learn'){const lessons=getLessons(vol),done=profile?.completedDays||[];return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <button onClick={()=>setView('home')} className="text-white/50 p-1 mb-4">{Icons.back}</button>
      <div className="flex gap-2 mb-4">
        {Object.entries(CUR).map(([k,x])=>(<button key={k} onClick={()=>setVol(k)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm ${vol===k?'bg-purple-600 text-white':'bg-white/5 text-white/50 border border-white/10'}`}>{x.icon}<span>{k.toUpperCase()}</span></button>))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 flex items-center gap-3">
        {CUR[vol].icon}<div><h2 className="text-white font-medium">{CUR[vol].title}</h2><p className="text-white/40 text-sm">{done.filter(d=>d.startsWith(vol)).length}/{CUR[vol].days}</p></div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {lessons.map(l=>{const k=`${vol}-d${l.day}`,dn=done.includes(k),isQ=l.type==='quiz';return(
          <button key={l.day} onClick={()=>startLesson(vol,l.day)} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${dn?'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40':isQ?'bg-purple-500/20 text-purple-400 border border-purple-500/40':'bg-white/5 text-white/60 border border-white/10'}`}>
            {dn?Icons.check:l.day}
          </button>
        )})}
      </div>
    </div>
  )}

  // HOME
  const cnt=profile?.completedDays?.length||0,tot=Object.values(CUR).reduce((s,v)=>s+v.days,0);
  return(
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <div className="flex items-center gap-4 mb-6"><ABAOrb size={50} state="idle"/><div><h1 className="text-lg text-white">Welcome, <span className="text-purple-400">{profile?.name?.split(' ')[0]}</span></h1><p className="text-white/40 text-sm">{tot-cnt} lessons remaining</p></div></div>
      <div className="grid grid-cols-3 gap-3 mb-6">{[{v:cnt,l:'Done'},{v:profile?.streak||0,l:'Streak'},{v:profile?.xp||0,l:'XP'}].map((s,i)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"><p className="text-xl font-light text-white">{s.v}</p><p className="text-white/40 text-xs">{s.l}</p></div>))}</div>
      <button onClick={()=>setView('learn')} className="w-full bg-purple-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 mb-3">{Icons.play}Continue Learning</button>
      <div className="grid grid-cols-2 gap-3">{[[()=>setView('kudos'),Icons.trophy,'Leaderboard'],[()=>setView('iep'),Icons.clipboard,'My Plan']].map(([fn,ic,lb],i)=>(<button key={i} onClick={fn} className="bg-white/5 border border-white/10 text-white/70 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">{ic}{lb}</button>))}</div>
      <button onClick={signOff} className="w-full text-white/20 text-sm py-4 mt-6">Sign Out</button>
    </div>
  );
}
