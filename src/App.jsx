// GMG UNIVERSITY v9.0 — iMessage Chat Style
// ⬡B:gmg_university.ui_redesign:BUILD:chat_style_v9:20260403⬡
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
// Firestore removed — progress lives in Supabase brain via backend API
// Note: curriculum.js also exports V1_CONTENT, V2_CONTENT, V3_CONTENT (65K) but only TITLES is used
import { CURRICULUM_TITLES } from './curriculum';

// ⬡B:audra.gmg_university:FIX:real_aba_logo_standalone:20260405⬡
// Real ABAConsciousness canvas component — Brandon's organic energy blob
const STATE_PALETTES = {
  idle: {
    colors: [
      [139, 92, 246],   // Purple
      [167, 139, 250],  // Light purple
      [236, 72, 153],   // Pink
      [99, 102, 241],   // Indigo
    ],
    glow: [139, 92, 246]
  },
  thinking: {
    colors: [
      [245, 158, 11],   // Orange
      [251, 191, 36],   // Yellow
      [239, 68, 68],    // Red
      [253, 224, 71],   // Light yellow
    ],
    glow: [245, 158, 11]
  },
  speaking: {
    colors: [
      [34, 197, 94],    // Green
      [16, 185, 129],   // Emerald
      [132, 204, 22],   // Lime
      [45, 212, 191],   // Teal
    ],
    glow: [34, 197, 94]
  },
  listening: {
    colors: [
      [6, 182, 212],    // Cyan
      [59, 130, 246],   // Blue
      [139, 92, 246],   // Purple
      [147, 197, 253],  // Light blue
    ],
    glow: [6, 182, 212]
  }
};

// v1.7.8-P7-S1 | UTIL | Simplex-style noise for organic shapes
class NoiseGenerator {
  constructor() {
    this.perm = [];
    for (let i = 0; i < 512; i++) {
      this.perm[i] = Math.floor(Math.random() * 256);
    }
  }
  
  noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const A = this.perm[X] + Y;
    const B = this.perm[X + 1] + Y;
    return this.lerp(v,
      this.lerp(u, this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y)),
      this.lerp(u, this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1))
    );
  }
  
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t, a, b) { return a + t * (b - a); }
  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
}

// v1.7.8-P7-S1 | COMP | Organic Energy ABA
// v1.18.1-P18-S6 | ABA | Animated consciousness orb with mood-based glow states
const ABAConsciousness = ({ size = 200, state = 'idle' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const noiseRef = useRef(new NoiseGenerator());
  const stateRef = useRef(state);
  
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    const center = size / 2;
    const noise = noiseRef.current;
    
    let time = 0;
    
    const animate = () => {
      const palette = STATE_PALETTES[stateRef.current] || STATE_PALETTES.idle;
      const speed = stateRef.current === 'thinking' ? 0.025 : 
                   stateRef.current === 'speaking' ? 0.018 :
                   stateRef.current === 'listening' ? 0.012 : 0.015;
      
      time += speed;
      
      // Clear completely - transparent background
      ctx.clearRect(0, 0, size, size);
      
      // Draw multiple blob layers
      for (let layer = 0; layer < 4; layer++) {
        const color = palette.colors[layer];
        const layerOffset = layer * 0.7;
        const baseRadius = size * (0.28 - layer * 0.03);
        
        ctx.beginPath();
        
        // Create organic blob shape with noise
        const points = 120;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          
          // Multiple noise octaves for organic feel
          const n1 = noise.noise2D(
            Math.cos(angle) * 2 + time + layerOffset,
            Math.sin(angle) * 2 + time * 0.7
          );
          const n2 = noise.noise2D(
            Math.cos(angle) * 4 + time * 1.3 + layerOffset,
            Math.sin(angle) * 4 + time * 0.9
          ) * 0.5;
          const n3 = noise.noise2D(
            Math.cos(angle) * 8 + time * 0.5 + layerOffset,
            Math.sin(angle) * 8 + time * 1.1
          ) * 0.25;
          
          const noiseVal = (n1 + n2 + n3) * 0.4;
          const radius = baseRadius + noiseVal * size * 0.15;
          
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        
        // Create gradient fill
        const gradient = ctx.createRadialGradient(
          center + Math.sin(time * 2 + layer) * 10,
          center + Math.cos(time * 1.5 + layer) * 10,
          0,
          center,
          center,
          baseRadius * 1.5
        );
        
        const alpha = 0.7 - layer * 0.12;
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Soft edge glow
        if (layer === 0) {
          ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
          ctx.shadowBlur = 30;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      
      // Add inner energy wisps
      for (let w = 0; w < 3; w++) {
        const wispColor = palette.colors[w % palette.colors.length];
        const wispTime = time * (1 + w * 0.3);
        
        ctx.beginPath();
        
        const wispPoints = 60;
        const wispRadius = size * 0.15;
        const wispOffsetX = Math.sin(wispTime + w * 2) * size * 0.08;
        const wispOffsetY = Math.cos(wispTime * 0.7 + w * 2) * size * 0.08;
        
        for (let i = 0; i <= wispPoints; i++) {
          const angle = (i / wispPoints) * Math.PI * 2;
          const n = noise.noise2D(
            Math.cos(angle) * 3 + wispTime + w,
            Math.sin(angle) * 3 + wispTime * 0.8
          );
          
          const r = wispRadius + n * size * 0.1;
          const x = center + wispOffsetX + Math.cos(angle) * r;
          const y = center + wispOffsetY + Math.sin(angle) * r;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        
        const wispGradient = ctx.createRadialGradient(
          center + wispOffsetX, center + wispOffsetY, 0,
          center + wispOffsetX, center + wispOffsetY, wispRadius
        );
        wispGradient.addColorStop(0, `rgba(255, 255, 255, 0.4)`);
        wispGradient.addColorStop(0.3, `rgba(${wispColor[0]}, ${wispColor[1]}, ${wispColor[2]}, 0.3)`);
        wispGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = wispGradient;
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };


// ⬡B:audra.gmg_university.M17:FIX:error_boundary:20260404⬡
class GMGErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[GMG-U] Error boundary caught:', error, info); }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', { style: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'rgba(255,255,255,0.5)', padding: 32, textAlign: 'center' } },
        React.createElement('p', { style: { fontSize: 16, marginBottom: 12 } }, 'Something went wrong.'),
        React.createElement('p', { style: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20 } }, this.state.error?.message || ''),
        React.createElement('button', { onClick: () => window.location.reload(), style: { padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', cursor: 'pointer', fontSize: 13 } }, 'Reload')
      );
    }
    return this.props.children;
  }
}

const firebaseConfig = { apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g", authDomain: "gmg-university.firebaseapp.com", projectId: "gmg-university", storageBucket: "gmg-university.firebasestorage.app", messagingSenderId: "85247972370", appId: "1:85247972370:web:18e62a01313037292d74cb" };
const app = initializeApp(firebaseConfig), auth = getAuth(app);

const AIR_STREAM = 'https://abacia-services.onrender.com/api/air/stream';
const PROGRESS_API = 'https://abacia-services.onrender.com/api/gmg-university/progress';
const TTS_URL = 'https://abacia-services.onrender.com/api/tts/speak';
// TTS via backend proxy — no API key needed in frontend
// ABA energy blob replaces static avatar image
const GMG_LOGO = 'https://i.imgur.com/qslzgTU.png';

const BG_IMAGES = [
  'https://i.imgur.com/3RkebB2.jpeg',
  'https://i.imgur.com/9HZYnlX.png',
  'https://i.imgur.com/nLBRQ82.jpeg',
  'https://i.imgur.com/h8zNCw1.jpeg'
];

/* ━━━ ABA ENERGY BLOB — replaces static purple circle ━━━ */
// AbaBlob removed — real ABAConsciousness below>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%',
        background: 'linear-gradient(135deg, rgba(139,92,246,.85), rgba(236,72,153,.6), rgba(99,102,241,.7))',
        filter: 'blur(0.5px)',
        boxShadow: '0 0 ' + (size/3) + 'px rgba(139,92,246,.35)',
        animation: 'abaBlob 4s ease-in-out infinite'
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '55% 45% 40% 60% / 60% 35% 65% 40%',
        background: 'linear-gradient(225deg, rgba(167,139,250,.5), rgba(45,212,191,.3), rgba(132,204,22,.2))',
        filter: 'blur(1px)',
        animation: 'abaBlob 4s ease-in-out -2s infinite',
        mixBlendMode: 'screen'
      }}/>
    </div>
  );
}
const VOL_META = {
  v1: { name: 'Fundraising Foundations', days: 30 },
  v2: { name: 'The GMG Way', days: 30 },
  v3: { name: 'CPP Model', days: 15 }
};

/* ━━━ ANIMATIONS ━━━ */
const STYLES = `
@keyframes kenBurns{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.12) translate(-2%,-1%)}100%{transform:scale(1) translate(0,0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)}50%{box-shadow:0 0 0 12px rgba(124,58,237,0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

`;

/* ━━━ CINEMATIC BACKGROUND ━━━ */
function CinematicBG() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % BG_IMAGES.length); setFade(true); }, 800);
    }, 45000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <img src={BG_IMAGES[idx]} alt="" style={{
        position: 'absolute', width: '120%', height: '120%', top: '-10%', left: '-10%',
        objectFit: 'cover', animation: 'kenBurns 30s ease-in-out infinite',
        opacity: fade ? 0.55 : 0, transition: 'opacity 0.8s ease'
      }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.3) 40%, rgba(10,10,15,0.75) 100%)' }}/>
    </div>
  );
}

/* ━━━ LESSON SIDEBAR ━━━ */
function LessonSidebar({ show, onClose, completedDays, onSelect, onReset, currentLesson }) {
  if (!show) return null;
  const completed = completedDays || [];
  const totalDone = completed.length;
  const totalAll = Object.values(VOL_META).reduce((s, v) => s + v.days, 0);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}/>
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, maxWidth: '85vw',
        background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 91,
        animation: 'slideRight 0.25s ease-out', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Curriculum</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', padding: 4 }}>×</button>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 2, width: `${(totalDone / totalAll) * 100}%`, transition: 'width 0.4s' }}/>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, whiteSpace: 'nowrap' }}>{totalDone}/{totalAll}</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {Object.entries(VOL_META).map(([vol, meta]) => (
            <div key={vol}>
              <div style={{ padding: '12px 16px 6px', color: '#a78bfa', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>{meta.name}</div>
              {(CURRICULUM_TITLES[vol] || []).map((title, i) => {
                const dayNum = i + 1;
                const key = `${vol}-d${dayNum}`;
                const done = completed.includes(key);
                const isCurrent = currentLesson?.vol === vol && currentLesson?.day === dayNum;
                return (
                  <button key={key} onClick={() => { onSelect(vol, dayNum); onClose(); }} style={{
                    width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    background: isCurrent ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderLeft: isCurrent ? '3px solid #7c3aed' : '3px solid transparent'
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600, flexShrink: 0,
                      background: done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                      color: done ? '#10b981' : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`
                    }}>{done ? '✓' : dayNum}</span>
                    <span style={{ color: done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.3 }}>{title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { if (window.confirm('Reset ALL progress to 0/75? This cannot be undone.')) onReset(); }} style={{
            width: '100%', padding: 10, borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)',
            color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 500
          }}>Reset Progress</button>
        </div>
      </div>
    </>
  );
}

/* ━━━ TYPING DOTS ━━━ */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '4px 16px', animation: 'msgIn 0.2s ease-out' }}>
      <ABAConsciousness size={28}/>
      <div style={{
        background: 'rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 4px',
        padding: '12px 16px', display: 'flex', gap: 5, border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}


/* ━━━ QUIZ DECK — Interactive quiz with scoring ━━━ */
// ⬡B:audra.gmg_university.L6:FIX:quiz_interactivity:20260404⬡
function QuizDeck({ deck, glass }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const correct = deck.correct;
  const handlePick = (opt, i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };
  const isCorrect = (opt, i) => {
    if (!revealed) return null;
    if (opt === correct || String.fromCharCode(65 + i) === correct) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };
  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>{deck.question}</p>
      {(deck.options || []).map((opt, i) => {
        const result = isCorrect(opt, i);
        return (
          <button key={i} onClick={() => handlePick(opt, i)} style={{
            ...glass, width: '100%', marginBottom: 8, textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
            color: result === 'correct' ? '#10b981' : result === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.8)',
            fontSize: 13,
            borderColor: result === 'correct' ? 'rgba(16,185,129,0.4)' : result === 'wrong' ? 'rgba(239,68,68,0.4)' : undefined,
            background: result === 'correct' ? 'rgba(16,185,129,0.12)' : result === 'wrong' ? 'rgba(239,68,68,0.08)' : undefined
          }}>
            {String.fromCharCode(65 + i)}. {opt} {result === 'correct' && ' ✓'}{result === 'wrong' && ' ✗'}
          </button>
        );
      })}
      {revealed && <p style={{ color: selected !== null && isCorrect(deck.options[selected], selected) === 'correct' ? '#10b981' : '#ef4444', fontSize: 13, marginTop: 8, fontWeight: 500 }}>
        {isCorrect(deck.options[selected], selected) === 'correct' ? 'Correct!' : 'Not quite. The answer is ' + correct + '.'}
      </p>}
    </div>
  );
}

/* ━━━ DECK PANEL — Interactive content from GURU ━━━ */
function DeckPanel({ deck, onClose }) {
  if (!deck) return null;
  const glass = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, maxWidth: '90vw',
      background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(24px)',
      borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 40,
      display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease-out',
      transform: 'translateX(0)'
    }}>
      <style>{'@keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}'}</style>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>{deck.title || 'Interactive'}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

        {deck.type === 'quiz' && (<QuizDeck deck={deck} glass={glass}/>)}

        {deck.type === 'matching' && (<div>
          {(deck.pairs || []).map((p, i) => (
            <div key={i} style={{ ...glass, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{p.left}</span>
              <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 500 }}>{p.right}</span>
            </div>
          ))}
        </div>)}

        {deck.type === 'sorting' && (<div>
          {(deck.items || []).map((item, i) => (
            <div key={i} style={{ ...glass, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: 14, width: 20 }}>{i + 1}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item}</span>
            </div>
          ))}
        </div>)}

        {deck.type === 'scenario' && (<div>
          <div style={{ ...glass, marginBottom: 14, borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6 }}>{deck.situation}</p>
          </div>
          {deck.prompt && <p style={{ color: '#a78bfa', fontSize: 13, fontWeight: 500 }}>{deck.prompt}</p>}
        </div>)}

        {deck.type === 'document' && (<div>
          <div style={{ ...glass, fontFamily: 'Georgia, serif' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{deck.content}</p>
          </div>
        </div>)}

        {deck.type === 'progress' && (<div style={{ textAlign: 'center', padding: 20 }}>
          <p style={{ color: 'white', fontSize: 36, fontWeight: 300, marginBottom: 4 }}>{deck.completed}/{deck.total}</p>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 3, width: Math.round(((deck.completed||0)/Math.max(deck.total||1,1))*100)+'%' }}/>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{deck.message || Math.round(((deck.completed||0)/Math.max(deck.total||1,1))*100)+'% complete'}</p>
        </div>)}

      </div>
    </div>
  );
}

/* ━━━ MAIN APP ━━━ */
function AppInner() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [initDone, setInitDone] = useState(false);
  const [deckContent, setDeckContent] = useState(null);
  const [adminView, setAdminView] = useState(false);
  const [adminStudents, setAdminStudents] = useState([]);
  const [adminInterviews, setAdminInterviews] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', name: '', cohort: 'NEW_COHORT', track: 'UNASSIGNED', group: 'UNASSIGNED' });

  const ADMIN_API = 'https://abacia-services.onrender.com/api/gmg-university/admin';
  // ⬡B:audra.gmg_university.M8:FIX:send_auth_token:20260404⬡
  const getAuthHeaders = async () => {
    try { const token = await user.getIdToken(); return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; }
    catch { return { 'Content-Type': 'application/json' }; }
  };
  const isAdmin = user?.email && ['brandonjpiercesr@gmail.com','brandon@globalmajoritygroup.com','eric@globalmajoritygroup.com','ericreeselanesr@gmail.com'].includes(user.email.toLowerCase());

  async function loadAdmin() {
    if (!isAdmin) return;
    setAdminLoading(true);
    try {
      const [sRes, iRes] = await Promise.all([
        fetch(ADMIN_API + '/students?email=' + encodeURIComponent(user.email), { headers: { 'Authorization': 'Bearer ' + (await user.getIdToken().catch(() => '')) } }),
        fetch(ADMIN_API + '/interviews?email=' + encodeURIComponent(user.email), { headers: { 'Authorization': 'Bearer ' + (await user.getIdToken().catch(() => '')) } })
      ]);
      if (sRes.ok) setAdminStudents((await sRes.json()).students || []);
      if (iRes.ok) setAdminInterviews((await iRes.json()).interviews || []);
    } catch (e) { console.error('[GMG-U]', e.message); }
    setAdminLoading(false);
  }

  async function addStudent() {
    if (!addForm.email.trim()) return;
    try {
      const r = await fetch(ADMIN_API + '/students', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email, student_email: addForm.email, student_name: addForm.name,
          cohort_type: addForm.cohort, gmg_track: addForm.track, gmg_group: addForm.group
        })
      });
      if (r.ok) { setShowAddForm(false); setAddForm({ email: '', name: '', cohort: 'NEW_COHORT', track: 'UNASSIGNED', group: 'UNASSIGNED' }); loadAdmin(); }
    } catch (e) { console.error('[GMG-U]', e.message); }
  }

  async function resetStudent(hamId) {
    if (!window.confirm('Reset ' + hamId + ' progress?')) return;
    try {
      await fetch(ADMIN_API + '/students/' + hamId + '/reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      loadAdmin();
    } catch (e) { console.error('[GMG-U]', e.message); }
  }

  // updateStudent removed — dead code (M1)

  const endRef = useRef(null);
  const audioRef = useRef(null);
  const audioUnlocked = useRef(false);
  useEffect(() => {
    const unlock = () => { if (audioRef.current && !audioUnlocked.current) { audioRef.current.play().then(() => { audioRef.current.pause(); audioRef.current.currentTime = 0; audioUnlocked.current = true; }).catch(() => {}); } };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    return () => { document.removeEventListener('click', unlock); document.removeEventListener('touchstart', unlock); };
  }, []);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // ━━━ AUTH ━━━
  // ⬡B:audra.gmg_university.H15:FIX:unified_progress_standalone:20260404⬡
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser(u);
        // Load progress from unified Supabase backend (not Firestore)
        try {
          const r = await fetch(PROGRESS_API + '?email=' + encodeURIComponent(u.email));
          if (r.ok) {
            const progress = await r.json();
            setProfile({ email: u.email, name: u.displayName, photoURL: u.photoURL, ...progress });
          } else {
            setProfile({ email: u.email, name: u.displayName, photoURL: u.photoURL, completedDays: [], xp: 0 });
          }
        } catch (e) {
          console.error('[GMG-U] Progress load error:', e.message);
          setProfile({ email: u.email, name: u.displayName, photoURL: u.photoURL, completedDays: [], xp: 0 });
        }
      } else {
        setUser(null); setProfile(null); setMessages([]); setInitDone(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ━━━ AUTO-SCROLL ━━━
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streaming]);

  // ━━━ AUTO-INIT: ABA greets on login ━━━
  useEffect(() => {
    if (user && profile && !initDone && !streaming) {
      setInitDone(true);
      const completed = profile.completedDays || [];
      const next = getNextLesson(completed);
      const name = profile.name?.split(' ')[0] || 'there';
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      let msg = `Good ${greeting}, this is ${name}. I just opened GMG University.`;
      if (next) {
        msg += ` My next lesson is Day ${next.day} of ${VOL_META[next.vol].name}: "${next.title}". I have completed ${completed.length} of ${Object.values(VOL_META).reduce((s,v)=>s+v.days,0)} lessons. Check my cohort_type and proceed accordingly.`;
        setCurrentLesson(next);
      } else {
        msg += ` I've completed all 75 lessons!`;
      }
      streamFromAIR(msg, true);
    }
  }, [user, profile, initDone]);

  // ━━━ SPEECH RECOGNITION ━━━
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = e => {
        const t = Array.from(e.results).map(r => r[0].transcript).join('');
        setInput(t);
        if (e.results[0].isFinal) setListening(false);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  // ━━━ HELPERS ━━━
  function getNextLesson(completed) {
    for (const [vol, meta] of Object.entries(VOL_META)) {
      for (let d = 1; d <= meta.days; d++) {
        if (!completed.includes(`${vol}-d${d}`)) {
          return { vol, day: d, title: (CURRICULUM_TITLES[vol] || [])[d - 1] || `Day ${d}` };
        }
      }
    }
    return null;
  }

  // ━━━ TTS WITH QUEUE ━━━
  async function speakText(text) {
    if (!voiceOn || !text?.trim()) return;
    try {
      const r = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 500) })
      });
      if (r.ok) {
        const url = URL.createObjectURL(await r.blob());
        audioQueue.current.push(url);
        playNext();
      }
    } catch (e) { console.error('[GMG-U]', e.message); }
  }

  function playNext() {
    if (isPlaying.current || audioQueue.current.length === 0) return;
    isPlaying.current = true;
    const url = audioQueue.current.shift();
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.onended = () => { isPlaying.current = false; URL.revokeObjectURL(url); playNext(); };
      audioRef.current.onerror = () => { isPlaying.current = false; URL.revokeObjectURL(url); playNext(); };
      audioRef.current.play().catch(() => { isPlaying.current = false; playNext(); });
    }
  }

  // ━━━ STREAM FROM AIR ━━━
  async function streamFromAIR(userMsg, isAutoInit = false) {
    if (streaming) return;
    setStreaming(true);
    if (!isAutoInit) setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessages(prev => [...prev, { role: 'aba', text: '', streaming: true }]);

    let accumulated = '';
    let sentenceBuf = '';

    try {
      const history = messages.slice(-20).map(m => ({
        role: m.role === 'aba' ? 'assistant' : 'user', content: m.text || ''
      })).filter(m => m.content);

      const r = await fetch(AIR_STREAM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg, user_id: profile?.email, userId: profile?.email,
          channel: 'gmg-university', conversationHistory: history
        })
      });

      const reader = r.body.getReader();
      const decoder = new TextDecoder();

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
              sentenceBuf += data.text;
              setMessages(prev => {
                const copy = [...prev]; const last = copy[copy.length - 1];
                if (last?.role === 'aba') copy[copy.length - 1] = { ...last, text: accumulated };
                return copy;
              });
              if (sentenceBuf.match(/[.!?]\s*$/)) { speakText(sentenceBuf.trim()); sentenceBuf = ''; }
            } else if (data.type === 'done') {
              const final = data.fullResponse || accumulated;
              // ⬡B:gmg_university.deck:DETECT:extract_deck_tags:20260403⬡
              let displayText = final;
              const deckMatch = final.match(/\[DECK\](.*?)\[\/DECK\]/s);
              if (deckMatch) {
                try {
                  const deckData = JSON.parse(deckMatch[1].trim());
                  setDeckContent(deckData);
                } catch (e) { console.error('[GMG-U]', e.message); }
                displayText = final.replace(/\[DECK\].*?\[\/DECK\]/s, '').trim();
              }
              setMessages(prev => {
                const copy = [...prev]; const last = copy[copy.length - 1];
                if (last?.role === 'aba') copy[copy.length - 1] = { ...last, text: displayText, streaming: false };
                return copy;
              });
              if (sentenceBuf.trim()) speakText(sentenceBuf.trim());
              // ⬡B:audra.gmg_university.L16:FIX:structured_completion_signal:20260404⬡
              displayText = displayText.replace(/\[LESSON_STARTED\]/g, '').replace(/\[LESSON_COMPLETE\]/g, '').trim(); if (final.includes('[LESSON_COMPLETE]')) markComplete();
            }
          } catch (e) { console.error('[GMG-U]', e.message); }
        }
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev]; const last = copy[copy.length - 1];
        if (last?.role === 'aba') copy[copy.length - 1] = { ...last, text: "I'm having trouble connecting. Try again.", streaming: false };
        return copy;
      });
    } finally { setStreaming(false); }
  }

  // ━━━ SEND ━━━
  function handleSend() {
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    streamFromAIR(msg);
  }

  // ━━━ MIC ━━━
  function toggleMic() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      if (input.trim()) setTimeout(() => handleSend(), 200);
    } else {
      setInput('');
      setListening(true);
      recognitionRef.current.start();
    }
  }

  // ━━━ COMPLETE ━━━
  async function markComplete() {
    if (!currentLesson || !user?.email) return;
    const key = `${currentLesson.vol}-d${currentLesson.day}`;
    if (profile?.completedDays?.includes(key)) return;
    try {
      const r = await fetch(PROGRESS_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, completedKey: key })
      });
      if (r.ok) {
        const updated = await r.json();
        setProfile(p => ({ ...p, ...updated }));
        setCurrentLesson(getNextLesson(updated.completedDays || []));
      }
    } catch (e) { console.error('[GMG-U] Complete error:', e.message); }
  }

  // ━━━ SELECT FROM SIDEBAR ━━━
  function selectLesson(vol, day) {
    const title = (CURRICULUM_TITLES[vol] || [])[day - 1] || `Day ${day}`;
    setCurrentLesson({ vol, day, title });
    const name = profile?.name?.split(' ')[0] || 'there';
    streamFromAIR(`${name} here. I want to do Day ${day} of ${VOL_META[vol].name}: "${title}". Check my cohort_type and proceed accordingly.`);
  }

  // ━━━ RESET ━━━
  async function resetProgress() {
    if (!user?.email) return;
    try {
      await fetch(PROGRESS_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, completedDays: [], xp: 0 })
      });
      setProfile(p => ({ ...p, completedDays: [], xp: 0 }));
      setMessages([]); setInitDone(false); setCurrentLesson(null);
    } catch (e) { console.error('[GMG-U] Reset error:', e.message); }
  }

  // ━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{STYLES}</style>
      <CinematicBG/>
      <div style={{ position: 'relative', zIndex: 1 }}><ABAConsciousness size={56}/></div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <style>{STYLES}</style>
      <CinematicBG/>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 320, animation: 'fadeIn 0.6s ease-out' }}>
        <img src={GMG_LOGO} alt="GMG" style={{ width: 96, height: 96, marginBottom: 20 }}/>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: 'white', fontFamily: 'Georgia, serif', letterSpacing: 1 }}>
          GMG <span style={{ color: '#a78bfa' }}>University</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: 6, fontSize: 13 }}>Lane-Pierce Fellowship Program</p>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} style={{
          marginTop: 36, width: '100%', padding: '15px 24px', borderRadius: 14,
          background: 'linear-gradient(135deg, #7c3aed, #9333ea)', color: 'white',
          border: 'none', fontSize: 15, fontWeight: 500, cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(124,58,237,0.3)'
        }}>Continue with Google</button>
      </div>
    </div>
  );

  // ━━━ CHAT VIEW ━━━
  const totalDone = (profile?.completedDays || []).length;
  const pct = Math.round((totalDone / 75) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{STYLES}</style>
      <CinematicBG/>
      <audio ref={audioRef}/>

      {/* HEADER — looks like iMessage/WhatsApp top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10
      }}>
        {/* Hamburger */}
        <button onClick={() => setShowSidebar(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6,
          color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: 3
        }}>
          <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 1 }}/>
          <span style={{ width: 14, height: 2, background: 'currentColor', borderRadius: 1 }}/>
          <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 1 }}/>
        </button>

        {/* ABA avatar + name */}
        <ABAConsciousness size={34}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: 15, fontWeight: 600, margin: 0 }}>ABA</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentLesson ? `Day ${currentLesson.day} · ${currentLesson.title}` : `${pct}% · ${totalDone}/75 lessons`}
          </p>
        </div>

        {/* Voice toggle */}
        <button onClick={() => setVoiceOn(!voiceOn)} style={{
          background: voiceOn ? 'rgba(124,58,237,0.15)' : 'transparent',
          border: `1px solid ${voiceOn ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
          color: voiceOn ? '#a78bfa' : 'rgba(255,255,255,0.25)', fontSize: 12
        }}>{voiceOn ? '🔊' : '🔇'}</button>

        {/* Sign out */}
        {isAdmin && <button onClick={() => { if (!adminView) loadAdmin(); setAdminView(!adminView); }} style={{
          background: adminView ? 'rgba(124,58,237,0.2)' : 'transparent',
          border: '1px solid ' + (adminView ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'),
          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
          color: adminView ? '#a78bfa' : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500
        }}>{adminView ? 'Chat' : 'Admin'}</button>}
        <button onClick={() => signOut(auth)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: 11, cursor: 'pointer'
        }}>Out</button>
      </header>

      {/* ADMIN PANEL */}
      {adminView && isAdmin && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', position: 'relative', zIndex: 1 }}>
          {adminLoading ? <p style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)' }}>Loading...</p> : <>
          <div style={{ marginBottom: 16 }}>
            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>+ Add Student by Email</button>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 }}>
                <input value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} placeholder="Email address" style={{ width: '100%', marginBottom: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none' }}/>
                <input value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} placeholder="Full name" style={{ width: '100%', marginBottom: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none' }}/>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <select value={addForm.cohort} onChange={e => setAddForm({...addForm, cohort: e.target.value})} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                    <option value="NEW_COHORT">New Cohort</option><option value="FOUNDING_LINE">Founding Line</option><option value="INTERVIEW_MODE">Interview Mode</option>
                  </select>
                  <select value={addForm.group} onChange={e => setAddForm({...addForm, group: e.target.value})} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                    <option value="UNASSIGNED">No Group</option><option value="THE_COLLECTIVE">The Collective</option><option value="THE_MAJORITY">The Majority</option>
                  </select>
                </div>
                <select value={addForm.track} onChange={e => setAddForm({...addForm, track: e.target.value})} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                  <option value="UNASSIGNED">No Track Yet</option><option value="CDO_VP_HEAD_FUNDRAISING">CDO / VP / Head of Fundraising</option><option value="DEVELOPMENT_MANAGER">Development Manager</option><option value="PROGRAMS">Programs</option><option value="OPERATIONS">Operations</option><option value="TECHNOLOGY">Technology</option>
                </select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addStudent} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#7c3aed', color: 'white', fontSize: 13, cursor: 'pointer' }}>Add</button>
                  <button onClick={() => setShowAddForm(false)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Students ({adminStudents.length})</p>
          {adminStudents.map(s => (
            <div key={s.ham_id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div><p style={{ color: 'white', fontSize: 14, fontWeight: 500, margin: 0 }}>{s.name}</p><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{s.email}</p></div>
                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: s.cohort_type === 'INTERVIEW_MODE' ? 'rgba(251,191,36,0.15)' : s.cohort_type === 'FOUNDING_LINE' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)', color: s.cohort_type === 'INTERVIEW_MODE' ? '#fbbf24' : s.cohort_type === 'FOUNDING_LINE' ? '#10b981' : '#a78bfa' }}>{s.cohort_type}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.gmg_track !== 'NOT_SET' && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{s.gmg_track}</span>}
                {s.gmg_group !== 'NOT_SET' && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{s.gmg_group}</span>}
                <button onClick={() => resetStudent(s.ham_id)} style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#ef4444', fontSize: 10, cursor: 'pointer' }}>Reset</button>
              </div>
            </div>
          ))}
          {adminInterviews.length > 0 && <>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Interview Content ({adminInterviews.length})</p>
            {adminInterviews.slice(0, 20).map((iv, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#a78bfa', fontSize: 10, fontWeight: 600 }}>{iv.ham_name || iv.ham || '?'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{iv.created_at?.substring(0, 10) || ''}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{(iv.founder_answer || '').substring(0, 200)}{(iv.founder_answer || '').length > 200 ? '...' : ''}</p>
              </div>
            ))}
          </>}
          </>}
        </div>
      )}

      {/* MESSAGES AREA */}
      {!adminView && <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 100, position: 'relative', zIndex: 1 }}>
        {messages.length === 0 && !streaming && (
          <div style={{ textAlign: 'center', padding: '60px 32px', color: 'rgba(255,255,255,0.12)' }}>
            <div style={{ marginBottom: 12, opacity: 0.5 }}><ABAConsciousness size={48}/></div>
            <p style={{ fontSize: 13, fontWeight: 400 }}>Starting your session...</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isAba = msg.role === 'aba';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              justifyContent: isAba ? 'flex-start' : 'flex-end',
              padding: '3px 14px',
              animation: i === messages.length - 1 ? 'msgIn 0.2s ease-out' : 'none'
            }}>
              {isAba && <ABAConsciousness size={28}/>}
              <div style={{
                maxWidth: '82%', padding: '10px 14px',
                borderRadius: isAba ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                background: isAba ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.25)',
                border: `1px solid ${isAba ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.3)'}`,
                backdropFilter: 'blur(8px)'
              }}>
                <p style={{
                  color: 'rgba(255,255,255,0.9)', fontSize: 14.5, lineHeight: 1.65,
                  whiteSpace: 'pre-wrap', margin: 0
                }}>
                  {(msg.text || '').split(/(\*\*.*?\*\*)/g).map((part, pi) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={pi} style={{ color: '#a78bfa', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                  {msg.streaming && <span style={{ display: 'inline-block', width: 2, height: 16, background: '#a78bfa', marginLeft: 2, animation: 'pulse 0.8s infinite', verticalAlign: 'text-bottom' }}/>}
                </p>
              </div>
            </div>
          );
        })}

        {streaming && messages[messages.length - 1]?.text === '' && <TypingDots/>}
        <div ref={endRef}/>
      </div>}}

      {/* INPUT BAR — iMessage style */}
      {!adminView && <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 10px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {/* Text field with inline send button */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.06)', borderRadius: 22,
            border: `1px solid ${listening ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
            padding: '2px 4px 2px 16px', minHeight: 42, transition: 'border-color 0.2s'
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={listening ? 'Listening...' : 'Message ABA...'}
              rows={1}
              disabled={streaming}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: listening ? '#a78bfa' : 'rgba(255,255,255,0.9)',
                fontSize: 15, padding: '9px 0', resize: 'none',
                lineHeight: 1.4, maxHeight: 120
              }}
            />
            {input.trim() && (
              <button onClick={handleSend} disabled={streaming} style={{
                width: 30, height: 30, borderRadius: '50%', border: 'none',
                background: '#7c3aed', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, margin: 4
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            )}
          </div>

          {/* Mic button — prominent when no text */}
          {!input.trim() && (
            <button onClick={toggleMic} disabled={streaming} style={{
              width: 42, height: 42, borderRadius: '50%', border: 'none',
              background: listening ? '#7c3aed' : 'rgba(124,58,237,0.15)',
              color: listening ? 'white' : '#a78bfa',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s',
              animation: listening ? 'micPulse 1.5s infinite' : 'none'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
                <rect x={9} y={2} width={6} height={11} rx={3}/>
                <path d="M5 11a7 7 0 0014 0"/>
                <line x1={12} y1={18} x2={12} y2={22}/>
              </svg>
            </button>
          )}
        </div>
      </div>}

      <LessonSidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        completedDays={profile?.completedDays}
        onSelect={selectLesson}
        onReset={resetProgress}
        currentLesson={currentLesson}
      />
      <DeckPanel deck={deckContent} onClose={() => setDeckContent(null)}/>
    </div>
  );
}

export default function App() { return <GMGErrorBoundary><AppInner/></GMGErrorBoundary>; }
