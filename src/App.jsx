// GMG UNIVERSITY v6.4.0 - BACKGROUNDS THAT ACTUALLY WORK
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { V1_CONTENT, V2_CONTENT, V3_CONTENT, CURRICULUM_TITLES } from './curriculum';

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);

const AIR = 'https://abacia-services.onrender.com/api/air/process';
const AIR_STREAM = 'https://abacia-services.onrender.com/api/air/stream';
const TTS = 'https://api.elevenlabs.io/v1/text-to-speech/AIFDUhRnM6s61433WMNu'; // Kiara voice
const TTS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';

// 911 BACKGROUNDS
const BG = {
  pinkSmoke: 'https://i.imgur.com/3RkebB2.jpeg',
  embers: 'https://i.imgur.com/9HZYnlX.png',
  nebula: 'https://i.imgur.com/nLBRQ82.jpeg',
  wetCity: 'https://i.imgur.com/h8zNCw1.jpeg'
};

// LOGOS
const LOGO = { gmg: 'https://i.imgur.com/qslzgTU.png', aba: 'https://i.imgur.com/0be7HCF.png' };

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

// 911 MOVING BACKGROUND - ACTUALLY WORKS
const MovingBG = ({ src }) => {
  return (
    <>
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden'
      }}>
        <img 
          src={src} 
          alt=""
          style={{
            position: 'absolute',
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
            objectFit: 'cover',
            animation: 'slowZoom 30s ease-in-out infinite',
            opacity: 0.7
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.5))'
        }}/>
      </div>
    </>
  );
};

const getC = (v, d) => ({ v1: V1_CONTENT, v2: V2_CONTENT, v3: V3_CONTENT }[v]?.[d]);
const VOL = { v1: { t: 'Foundations', f: 'Fundraising Foundations', d: 30 }, v2: { t: 'GMG Way', f: 'The GMG Way', d: 30 }, v3: { t: 'CPP', f: 'CPP Model', d: 15 } };

const formatContent = (c, name) => {
  if (!c) return `Welcome to today's lesson.`;
  let txt = `${name}, welcome to today's lesson: ${c.title}.\n\n`;
  c.sections?.forEach(s => { txt += `${s.h}\n\n${s.c}\n\n`; });
  if (c.exercise) txt += `Today's Exercise:\n${c.exercise}\n\n`;
  if (c.keyTakeaways?.length) txt += `Key Takeaways:\n${c.keyTakeaways.map(t => `• ${t}`).join('\n')}`;
  return txt;
};

// TYPEWRITER
const Typewriter = ({ text, speed = 12, onDone }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.substring(0, i + 1)); i++; }
      else { clearInterval(iv); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{displayed}{!done && <span style={{ display: 'inline-block', width: 8, height: 18, background: '#a78bfa', marginLeft: 4, animation: 'pulse 1s infinite' }}/>}</p>;
};

export default function App() {
  const [user, setUser] = useState(null), [profile, setProfile] = useState(null), [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'), [vol, setVol] = useState('v1'), [day, setDay] = useState(null);
  const [voice, setVoice] = useState(false), [cohort, setCohort] = useState([]);
  const [msgs, setMsgs] = useState([]), [input, setInput] = useState(''), [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef(), endRef = useRef();

  useEffect(() => { onAuthStateChanged(auth, async u => { if (u) { setUser(u); await load(u); } else { setUser(null); setProfile(null); } setLoading(false); }); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, isTyping]);

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

  const startLesson = (v, d) => {
    setVol(v); setDay(d); setView('lesson'); setMsgs([]);
    const c = getC(v, d), name = profile?.name?.split(' ')[0] || 'there';
    const content = formatContent(c, name);
    setIsTyping(true);
    setMsgs([{ aba: true, text: content, typing: true }]);
  };

  // ⬡B:roadmap.tier3:STREAMING:gmgu_send:20260323⬡
  // Streaming send — subtitles appear word-by-word, sentences queue for TTS
  const send = async () => {
    if (!input.trim() || typing) return;
    const msg = input.trim(); setInput(''); setTyping(true);
    setMsgs(p => [...p, { aba: false, text: msg }]);
    
    const abaMsgIdx = msgs.length + 1; // index of the ABA message we're about to add
    setMsgs(p => [...p, { aba: true, text: '', streaming: true }]);
    
    try {
      const r = await fetch(AIR_STREAM, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, user_id: profile?.email, userId: profile?.email, channel: 'gmg-university',
          conversationHistory: msgs.slice(-20).map(m => ({ role: m.aba ? 'assistant' : 'user', content: m.text || '' })).filter(m => m.content)
        })
      });
      
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let sentenceBuffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(l => l.startsWith('data: '));
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              accumulated += data.text;
              sentenceBuffer += data.text;
              // Update subtitles in real-time
              setMsgs(p => { const copy = [...p]; const last = copy[copy.length - 1]; if (last?.aba) { copy[copy.length - 1] = { ...last, text: accumulated }; } return copy; });
              
              // Buffer sentences for TTS
              if (voice && sentenceBuffer.match(/[.!?]\s*$/)) {
                speak(sentenceBuffer.trim());
                sentenceBuffer = '';
              }
            } else if (data.type === 'tool_start') {
              setMsgs(p => { const copy = [...p]; const last = copy[copy.length - 1]; if (last?.aba) { copy[copy.length - 1] = { ...last, text: accumulated + '\n_Working on it..._' }; } return copy; });
            } else if (data.type === 'done') {
              setMsgs(p => { const copy = [...p]; const last = copy[copy.length - 1]; if (last?.aba) { copy[copy.length - 1] = { ...last, text: data.fullResponse || accumulated, streaming: false }; } return copy; });
              // Speak any remaining sentence fragment
              if (voice && sentenceBuffer.trim()) speak(sentenceBuffer.trim());
            }
          } catch {}
        }
      }
    } catch { setMsgs(p => [...p.slice(0, -1), { aba: true, text: "Connection issue. Try again?" }]); }
    finally { setTyping(false); setIsTyping(false); }
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

  const glassBg = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16 };
  const glassCard = { ...glassBg, padding: 16 };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MovingBG src={BG.pinkSmoke}/><img src={LOGO.aba} alt="ABA" style={{ width: 80, height: 80, position: 'relative', zIndex: 1 }}/></div>;

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <MovingBG src={BG.pinkSmoke}/>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <img src={LOGO.gmg} alt="GMG" style={{ width: 120, height: 120, marginBottom: 24 }}/>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: 'white' }}>GMG <span style={{ color: '#a78bfa' }}>University</span></h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Lane-Pierce Fellowship</p>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} style={{ marginTop: 40, width: '100%', maxWidth: 280, background: 'linear-gradient(to right, #7c3aed, #c026d3)', color: 'white', padding: '16px 24px', borderRadius: 16, border: 'none', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>Continue with Google</button>
      </div>
    </div>
  );

  if (view === 'lesson' && day) {
    const c = getC(vol, day), done = profile?.completedDays?.includes(`${vol}-d${day}`);
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MovingBG src={BG.embers}/>
        <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setView('home')} style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>{I.back}</button>
          <img src={LOGO.aba} alt="ABA" style={{ width: 32, height: 32 }}/>
          <div style={{ flex: 1 }}><p style={{ color: '#a78bfa', fontSize: 10, letterSpacing: 2 }}>DAY {day} OF {VOL[vol].d}</p><p style={{ color: 'white', fontSize: 14 }}>{c?.title}</p></div>
          <button onClick={() => setVoice(!voice)} style={{ width: 32, height: 32, color: voice ? '#a78bfa' : 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>{I.voice}</button>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, paddingBottom: 200, position: 'relative', zIndex: 1 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: 20, display: 'flex', justifyContent: m.aba ? 'flex-start' : 'flex-end', gap: 12 }}>
              {m.aba && <img src={LOGO.aba} alt="ABA" style={{ width: 32, height: 32, marginTop: 4, flexShrink: 0 }}/>}
              <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: 16, background: m.aba ? 'rgba(255,255,255,0.1)' : 'rgba(139,92,246,0.3)', border: `1px solid ${m.aba ? 'rgba(255,255,255,0.15)' : 'rgba(139,92,246,0.4)'}`, backdropFilter: 'blur(8px)' }}>
                {m.aba && m.typing ? <Typewriter text={m.text} speed={10} onDone={() => { setIsTyping(false); setMsgs(p => p.map((msg, idx) => idx === i ? { ...msg, typing: false } : msg)); if (voice && m.text) speak(m.text); }}/> : <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.text}{m.streaming && <span style={{ display: 'inline-block', width: 8, height: 18, background: '#a78bfa', marginLeft: 4, animation: 'pulse 1s infinite' }}/>}</p>}
              </div>
            </div>
          ))}
          {typing && <div style={{ display: 'flex', gap: 12 }}><img src={LOGO.aba} alt="ABA" style={{ width: 32, height: 32 }}/><div style={{ ...glassCard, display: 'flex', gap: 6 }}>{[0,1,2].map(i=><div key={i} style={{ width: 8, height: 8, background: '#a78bfa', borderRadius: '50%', animation: `bounce 1s infinite ${i*0.15}s` }}/>)}</div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: 16, zIndex: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Ask ABA..." style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', fontSize: 14, outline: 'none' }}/>
            <button onClick={send} disabled={!input.trim() || typing || isTyping} style={{ width: 48, background: '#7c3aed', border: 'none', borderRadius: 12, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.send}</button>
          </div>
          {!isTyping && <button onClick={complete} style={{ width: '100%', marginTop: 12, padding: 16, borderRadius: 12, border: 'none', background: done ? 'rgba(255,255,255,0.1)' : 'linear-gradient(to right, #10b981, #14b8a6)', color: done ? 'rgba(255,255,255,0.4)' : 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>{done ? 'Completed' : 'Mark Complete +100 XP'}</button>}
        </div>
        <audio ref={audioRef}/>
      </div>
    );
  }

  if (view === 'kudos') return (
    <div style={{ minHeight: '100vh', padding: 16 }}>
      <MovingBG src={BG.nebula}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <button onClick={() => setView('home')} style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>{I.back}</button>
        <h1 style={{ fontSize: 20, color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 24, height: 24, color: '#fbbf24' }}>{I.trophy}</span>Leaderboard</h1>
        {cohort.map((m, i) => (
          <div key={m.id} style={{ ...glassCard, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, background: i === 0 ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.08)', borderColor: i === 0 ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.15)' }}>
            <span style={{ width: 24, fontWeight: 700, color: i === 0 ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>{i + 1}</span>
            <img src={m.photoURL || `https://ui-avatars.com/api/?name=${m.name}&background=7c3aed&color=fff`} style={{ width: 40, height: 40, borderRadius: '50%' }}/>
            <div style={{ flex: 1 }}><p style={{ color: 'white', fontSize: 14 }}>{m.name}</p></div>
            <p style={{ color: '#a78bfa', fontWeight: 600 }}>{m.xp || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'learn') {
    const lessons = [...Array(VOL[vol].d)].map((_, i) => ({ d: i + 1, q: (i + 1) % 5 === 0 }));
    const done = profile?.completedDays || [];
    return (
      <div style={{ minHeight: '100vh', padding: 16 }}>
        <MovingBG src={BG.wetCity}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => setView('home')} style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>{I.back}</button>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>{Object.entries(VOL).map(([k, v]) => <button key={k} onClick={() => setVol(k)} style={{ flex: 1, padding: 12, borderRadius: 12, border: vol === k ? 'none' : '1px solid rgba(255,255,255,0.15)', background: vol === k ? '#7c3aed' : 'rgba(255,255,255,0.08)', color: vol === k ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer' }}>{v.t}</button>)}</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 12 }}>{VOL[vol].f} • {done.filter(d => d.startsWith(vol)).length}/{VOL[vol].d}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {lessons.map(l => { const k = `${vol}-d${l.d}`, dn = done.includes(k); return (
              <button key={l.d} onClick={() => startLesson(vol, l.d)} style={{ aspectRatio: '1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, border: `1px solid ${dn ? 'rgba(16,185,129,0.4)' : l.q ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.15)'}`, background: dn ? 'rgba(16,185,129,0.2)' : l.q ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.08)', color: dn ? '#10b981' : l.q ? '#a78bfa' : 'rgba(255,255,255,0.5)', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                {dn ? <span style={{ width: 16, height: 16 }}>{I.check}</span> : l.d}
              </button>
            ); })}
          </div>
        </div>
      </div>
    );
  }

  const cnt = profile?.completedDays?.length || 0, tot = Object.values(VOL).reduce((s, v) => s + v.d, 0), pct = Math.round((cnt / tot) * 100);
  const next = getNext();
  const rank = cohort.findIndex(c => c.id === user?.uid) + 1;

  return (
    <div style={{ minHeight: '100vh', padding: 16, paddingBottom: 32 }}>
      <MovingBG src={BG.pinkSmoke}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <img src={LOGO.aba} alt="ABA" style={{ width: 56, height: 56 }}/>
          <div><h1 style={{ fontSize: 20, color: 'white' }}>Hey, <span style={{ color: '#a78bfa' }}>{profile?.name?.split(' ')[0]}</span></h1><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{cnt === 0 ? 'Ready to start?' : `${pct}% complete`}</p></div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ ...glassCard, flex: 1, textAlign: 'center' }}><p style={{ fontSize: 24, fontWeight: 300, color: 'white' }}>{profile?.xp || 0}</p><p style={{ color: '#a78bfa', fontSize: 12, marginTop: 4 }}>XP</p></div>
          <div style={{ ...glassCard, flex: 1, textAlign: 'center' }}><p style={{ fontSize: 24, fontWeight: 300, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{profile?.streak || 0}<span style={{ width: 16, height: 16, color: '#fbbf24' }}>{I.fire}</span></p><p style={{ color: '#fbbf24', fontSize: 12, marginTop: 4 }}>Streak</p></div>
          <div style={{ ...glassCard, flex: 1, textAlign: 'center' }}><p style={{ fontSize: 24, fontWeight: 300, color: 'white' }}>#{rank || '-'}</p><p style={{ color: '#10b981', fontSize: 12, marginTop: 4 }}>Rank</p></div>
        </div>

        <div style={{ ...glassCard, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}><span style={{ color: 'rgba(255,255,255,0.5)' }}>Progress</span><span style={{ color: '#a78bfa' }}>{cnt}/{tot}</span></div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', background: 'linear-gradient(to right, #7c3aed, #c026d3)', borderRadius: 4, width: `${pct}%`, transition: 'width 0.5s' }}/></div>
        </div>

        {next && (
          <button onClick={() => startLesson(next.vol, next.day)} style={{ width: '100%', background: 'linear-gradient(to right, #7c3aed, #c026d3)', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'left', border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(124,58,237,0.3)' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>UP NEXT</p>
            <p style={{ color: 'white', fontSize: 18, fontWeight: 500 }}>Day {next.day}: {next.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}><span style={{ width: 20, height: 20 }}>{I.play}</span>Start Lesson</div>
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setView('learn')} style={{ ...glassCard, textAlign: 'left', cursor: 'pointer' }}><span style={{ width: 24, height: 24, color: '#a78bfa', display: 'block', marginBottom: 8 }}>{I.book}</span><p style={{ color: 'white', fontSize: 14 }}>All Lessons</p></button>
          <button onClick={() => setView('kudos')} style={{ ...glassCard, textAlign: 'left', cursor: 'pointer' }}><span style={{ width: 24, height: 24, color: '#fbbf24', display: 'block', marginBottom: 8 }}>{I.trophy}</span><p style={{ color: 'white', fontSize: 14 }}>Leaderboard</p></button>
        </div>

        <button onClick={() => signOut(auth)} style={{ width: '100%', color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: 16, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
      </div>
    </div>
  );
}
