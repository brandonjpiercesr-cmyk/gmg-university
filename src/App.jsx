// GMG UNIVERSITY v9.0 — iMessage Chat Style
// ⬡B:gmg_university.ui_redesign:BUILD:chat_style_v9:20260403⬡
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
// ⬡B:GMGU.standalone:FEAT:voice_conversation_orb:20260409⬡
import { useConversation } from '@elevenlabs/react';
// Firestore removed — progress lives in Supabase brain via backend API

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
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size
      }}
    />
  );
};


// ⬡B:audra.gmg_university.ui:CODE:markdown_renderer:20260407⬡
function renderMd(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  const flushList = () => { if (listItems.length > 0) { elements.push(React.createElement('ul', { key: 'ul-' + elements.length, style: { margin: '6px 0', paddingLeft: 18 } }, listItems)); listItems = []; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { flushList(); elements.push(React.createElement('div', { key: 'br-' + i, style: { height: 8 } })); continue; }
    if (trimmed.startsWith('### ')) { flushList(); elements.push(React.createElement('p', { key: 'h3-' + i, style: { color: '#a78bfa', fontSize: 13, fontWeight: 600, margin: '8px 0 4px' } }, inlineMd(trimmed.slice(4)))); continue; }
    if (trimmed.startsWith('## ')) { flushList(); elements.push(React.createElement('p', { key: 'h2-' + i, style: { color: '#a78bfa', fontSize: 14, fontWeight: 600, margin: '10px 0 4px' } }, inlineMd(trimmed.slice(3)))); continue; }
    if (trimmed.startsWith('# ')) { flushList(); elements.push(React.createElement('p', { key: 'h1-' + i, style: { color: 'white', fontSize: 15, fontWeight: 700, margin: '10px 0 4px' } }, inlineMd(trimmed.slice(2)))); continue; }
    if (trimmed.match(/^[-*]\s/)) { listItems.push(React.createElement('li', { key: 'li-' + i, style: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, marginBottom: 2 } }, inlineMd(trimmed.slice(2)))); continue; }
    if (trimmed.match(/^\d+\.\s/)) { listItems.push(React.createElement('li', { key: 'li-' + i, style: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, marginBottom: 2 } }, inlineMd(trimmed.replace(/^\d+\.\s/, '')))); continue; }
    flushList();
    elements.push(React.createElement('p', { key: 'p-' + i, style: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, margin: '2px 0' } }, inlineMd(trimmed)));
  }
  flushList();
  return elements;
}
function inlineMd(text) {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    let firstMatch = null;
    let firstIdx = remaining.length;
    if (boldMatch && boldMatch.index < firstIdx) { firstMatch = 'bold'; firstIdx = boldMatch.index; }
    if (codeMatch && codeMatch.index < firstIdx) { firstMatch = 'code'; firstIdx = codeMatch.index; }
    if (!firstMatch) { parts.push(remaining); break; }
    if (firstIdx > 0) parts.push(remaining.slice(0, firstIdx));
    if (firstMatch === 'bold') {
      parts.push(React.createElement('strong', { key: 'b' + key++, style: { color: 'white', fontWeight: 600 } }, boldMatch[1]));
      remaining = remaining.slice(firstIdx + boldMatch[0].length);
    } else {
      parts.push(React.createElement('code', { key: 'c' + key++, style: { background: 'rgba(124,58,237,0.15)', padding: '1px 5px', borderRadius: 4, fontSize: 12, color: '#a78bfa' } }, codeMatch[1]));
      remaining = remaining.slice(firstIdx + codeMatch[0].length);
    }
  }
  return parts;
}

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

/* AbaBlob removed — using real ABAConsciousness component */
// VOL_META removed — curriculum loaded from backend





/* ━━━ ANIMATIONS ━━━ */
const STYLES = `
@keyframes kenBurns{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.12) translate(-2%,-1%)}100%{transform:scale(1) translate(0,0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)}50%{box-shadow:0 0 0 12px rgba(124,58,237,0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes mb{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

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
// ⬡B:audra.gmg_university.restructure:FIX:block_aware_sidebar:20260407⬡
function LessonSidebar({ show, onClose, completedDays, onSelectBlock, onReset, currentLesson, curriculum, cohortType }) {
  if (!show) return null;
  const completed = completedDays || [];
  const blocks = curriculum?.blocks || [];
  const totalAll = blocks.reduce((s, b) => s + (b.days || []).length, 0);
  const totalDone = completed.length;
  const isFounder = cohortType === 'FOUNDER' || cohortType === 'INTERVIEW_MODE';
  
  // ⬡B:GMGU.dev:FEAT:lesson_locking:20260409⬡
  // Find what the next unlocked lesson is — students can only go up to this
  let nextUnlocked = null;
  for (const block of blocks) {
    for (let i = 0; i < (block.days || []).length; i++) {
      const key = 'b' + block.block + '-d' + (i + 1);
      if (!completed.includes(key)) { nextUnlocked = key; break; }
    }
    if (nextUnlocked) break;
  }
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
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 2, width: totalAll > 0 ? `${(totalDone / totalAll) * 100}%` : '0%', transition: 'width 0.4s' }}/>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, whiteSpace: 'nowrap' }}>{totalDone}/{totalAll}</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {blocks.map(block => (
            <div key={block.block}>
              <div style={{ padding: '12px 16px 6px', color: (completedDays || []).filter(k => k.startsWith('b' + block.block + '-')).length >= (block.days || []).length && (block.days || []).length > 1 ? '#10b981' : block.block === 0 ? '#fbbf24' : '#a78bfa', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {block.block === 0 ? 'Block 0' : 'Block ' + block.block}{block.track && block.track !== 'UNASSIGNED' ? ' · ' + block.track.replace(/_/g, ' ') : ''} — {block.name}
              </div>
              {(block.days || []).map((title, i) => {
                const dayNum = i + 1;
                const key = 'b' + block.block + '-d' + dayNum;
                const done = completed.includes(key);
                const isCurrent = currentLesson?.block === block.block && currentLesson?.day === dayNum;
                // ⬡B:GMGU.dev:FEAT:lesson_locking:20260409⬡
                const isNextUp = key === nextUnlocked;
                const isLocked = !isFounder && !done && !isNextUp;
                return (
                  <button key={key} onClick={() => { if (!isLocked) { onSelectBlock(block.block, dayNum, title, block.name); onClose(); } }} style={{
                    width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    background: isCurrent ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', textAlign: 'left',
                    borderLeft: isCurrent ? '3px solid #7c3aed' : '3px solid transparent',
                    opacity: isLocked ? 0.35 : 1
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600, flexShrink: 0,
                      background: done ? 'rgba(16,185,129,0.2)' : isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                      color: done ? '#10b981' : isLocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)',
                      border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)')
                    }}>{done ? '✓' : isLocked ? '🔒' : dayNum}</span>
                    <span style={{ color: done ? 'rgba(255,255,255,0.5)' : isLocked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.3 }}>{title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { if (window.confirm('Reset ALL progress? This cannot be undone.')) onReset(); }} style={{
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

/* ⬡B:GMGU.standalone:FEAT:voice_conversation_orb:20260409⬡ */
/* ElevenLabs push-to-talk voice orb for GMG-U voice conversation mode */
function VoiceConversationOrb({ userId, onSwitchToChat, currentLesson, cohortType }) {
  const [orbState, setOrbState] = useState('idle');
  const [statusText, setStatusText] = useState('Tap to start voice conversation');
  const [transcript, setTranscript] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [liveCaption, setLiveCaption] = useState(''); // ⬡B:GMGU.dev:FEAT:live_captions:20260409⬡
  const [lastUserSaid, setLastUserSaid] = useState('');
  const thinkTimerRef = useRef(null);
  const currentMsgRef = useRef('');
  const captionRef = useRef(null);

  const conversation = useConversation({
    onConnect: () => { setOrbState('listening'); setStatusText('Listening... share your answer'); setLiveCaption(''); },
    onDisconnect: () => { setOrbState('idle'); setStatusText('Conversation ended'); setLiveCaption(''); },
    onError: (msg) => { setOrbState('error'); setErrorMsg(String(msg)); setStatusText('Error. Tap to retry.'); },
    onMessage: ({ message, source }) => {
      if (source === 'user') {
        if (currentMsgRef.current) { setTranscript(p => [...p, { from: 'aba', text: currentMsgRef.current }]); currentMsgRef.current = ''; }
        setLastUserSaid(message);
        setTranscript(p => [...p, { from: 'user', text: message }]);
        setLiveCaption('');
        setOrbState('thinking'); setStatusText('ABA is thinking...');
      }
      if (source === 'ai') { 
        currentMsgRef.current += message;
        setLiveCaption(currentMsgRef.current); // Live caption updates as ABA speaks
      }
    },
    onModeChange: ({ mode }) => {
      clearTimeout(thinkTimerRef.current);
      if (mode === 'speaking') { setOrbState('speaking'); setStatusText('ABA is speaking...'); }
      else {
        if (currentMsgRef.current) { setTranscript(p => [...p, { from: 'aba', text: currentMsgRef.current }]); currentMsgRef.current = ''; setLiveCaption(''); }
        thinkTimerRef.current = setTimeout(() => { setOrbState('listening'); setStatusText('Your turn — share your thoughts'); }, 200);
      }
    }
  });

  const handleTap = useCallback(async () => {
    if (orbState === 'error') { setOrbState('idle'); setStatusText('Tap to start voice conversation'); setErrorMsg(''); return; }
    if (conversation.status === 'connected') { await conversation.endSession(); return; }
    try {
      setOrbState('connecting'); setStatusText('Requesting microphone...');
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatusText('Connecting to ABA...');
      try {
        // ⬡B:GMGU.vara:FIX:direct_app_context:20260409⬡
        // Pass GMG-U context DIRECTLY in the preload call, not through AIR (timing issue).
        // The preload endpoint injects this into the cached system prompt immediately.
        const recentChat = (window.__gmgu_messages || []).slice(-6).map(m => 
          (m.role === 'aba' ? 'ABA: ' : 'User: ') + (m.text || '').substring(0, 300)
        ).join('\n');
        
        const convId = 'gmgu_voice_' + Date.now();
        await fetch('https://abacia-services.onrender.com/vara/preload', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            conversation_id: convId,
            appContext: {
              mode: 'gmg-university',
              instructions: 'You are ABA conducting a GMG University lesson. ' +
                (cohortType === 'FOUNDER' || cohortType === 'INTERVIEW_MODE' 
                  ? 'This user is a FOUNDER in INTERVIEW_MODE. You are NOT teaching them, you are INTERVIEWING them. Their answers become the curriculum that other students learn from.'
                  : 'This user is a STUDENT. Teach them the lesson content, ask comprehension questions, and assess their understanding.') +
                (currentLesson 
                  ? ' You are on Block ' + currentLesson.block + ', Day ' + currentLesson.day + ': ' + currentLesson.title + '.'
                  : ' Start with the next lesson in the curriculum.') +
                ' Ask real-world questions. Push for depth, specifics, and stories from their actual experience. When they give an answer, summarize it back and ask a follow-up. The lesson is complete when you have captured at least 2 substantive answers with follow-ups. Keep responses to 2-3 sentences to stay conversational. Do NOT use tools like save_memory or search_brain during the voice call unless the user explicitly asks you to search or save something — tool calls cause delays that make you go silent. Just have the conversation naturally, the content gets saved automatically after the call ends.',
              recentChat: (recentChat || 'No prior chat.').substring(0, 600)
            }
          })
        });
      } catch (pe) { console.log('[VOICE] Preload failed (non-fatal):', pe.message); }
      // ⬡B:GMGU.layered:FIX:voice_first_message_override:20260411⬡
      const isAssessment = currentLesson?.block === 0;
      const voiceFirstMsg = currentLesson
        ? (isAssessment 
            ? `Hey Boss. Picking up your LAYERED assessment, Day ${currentLesson.day}: ${currentLesson.title}. Let me ask you something.`
            : `Hey Boss. Jumping into Block ${currentLesson.block}, Day ${currentLesson.day}: ${currentLesson.title}. Let's get into it.`)
        : 'Hey Boss, this is ABA. What do you need?';
      await conversation.startSession({ 
        agentId: 'agent_0601khe2q0gben08ws34bzf7a0sa',
        overrides: { agent: { prompt: { prompt: '' }, firstMessage: voiceFirstMsg } }
      });
    } catch (err) {
      setOrbState('error'); setErrorMsg(err.message || 'Failed to connect');
      setStatusText(err.name === 'NotAllowedError' ? 'Microphone access denied.' : 'Connection failed. Tap to retry.');
    }
  }, [conversation, orbState, userId]);

  const colors = { idle: '139,92,246', connecting: '245,158,11', listening: '139,92,246', thinking: '245,158,11', speaking: '16,185,129', error: '239,68,68' };
  const c = colors[orbState] || colors.idle;
  const isActive = orbState !== 'idle' && orbState !== 'error';
  const labels = { idle: 'TAP TO TALK', connecting: 'CONNECTING', listening: 'LISTENING', thinking: 'THINKING', speaking: 'SPEAKING', error: 'ERROR' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '30px 14px', minHeight: 280 }}>
      {/* ⬡B:GMGU.layered:UI:aba_logo_orb:20260411⬡ */}
      {/* Pulsing rings */}
      {isActive && <>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: `1px solid rgba(${c},.12)`, animation: 'pulse 2s ease-out infinite', opacity: .5, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: `1px solid rgba(${c},.08)`, animation: 'pulse 2s ease-out .5s infinite', opacity: .3, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: `1px solid rgba(${c},.05)`, animation: 'pulse 2s ease-out 1s infinite', opacity: .2, pointerEvents: 'none' }} />
      </>}

      {/* Main orb — ABA logo inside pulsating colored circle */}
      <button onClick={handleTap} style={{
        width: 150, height: 150, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: `radial-gradient(circle at 30% 30%, rgba(${c},.5), rgba(${c},.2))`,
        boxShadow: `0 0 ${isActive ? 80 : 30}px rgba(${c},.4), inset 0 0 40px rgba(255,255,255,.08)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        color: 'white', position: 'relative', zIndex: 2,
        animation: orbState === 'listening' ? 'breathe 1s ease-in-out infinite' : orbState === 'speaking' ? 'breathe 1.5s ease-in-out infinite' : 'breathe 3s ease-in-out infinite',
        transition: 'all .3s'
      }}>
        <div style={{ animation: (orbState === 'thinking' || orbState === 'connecting') ? 'spin 1s linear infinite' : 'none' }}>
          <img src="https://i.imgur.com/0be7HCF.png" alt="ABA" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', filter: `drop-shadow(0 0 8px rgba(${c},.6))` }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: .9 }}>{labels[orbState]}</span>
      </button>

      {/* Status text + live indicator */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <p style={{ color: `rgba(${c},.7)`, fontSize: 12, textAlign: 'center', margin: 0, fontWeight: 500 }}>{statusText}</p>
        {orbState === 'listening' && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: `rgba(${c},.9)`, animation: 'mb 1s ease infinite' }} />
          <span style={{ color: `rgba(${c},.8)`, fontSize: 10, fontWeight: 600 }}>LIVE</span>
        </div>}
        {conversation.status === 'connected' && <button onClick={() => conversation.endSession()} style={{ marginTop: 6, padding: '6px 18px', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.06)', color: 'rgba(239,68,68,.7)', cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>End Voice</button>}
        {errorMsg && <p style={{ color: 'rgba(239,68,68,.6)', fontSize: 10, textAlign: 'center', margin: 0 }}>{errorMsg}</p>}
      </div>

      {/* ⬡B:GMGU.dev:FEAT:live_captions:20260409⬡ Live captions — like subtitles */}
      {(liveCaption || lastUserSaid) && orbState !== 'idle' && (
        <div ref={captionRef} style={{
          width: '100%', maxHeight: 180, overflowY: 'auto',
          background: 'rgba(0,0,0,.4)', borderRadius: 12, padding: '10px 14px',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.06)'
        }}>
          {lastUserSaid && orbState !== 'listening' && (
            <p style={{ color: 'rgba(139,92,246,.6)', fontSize: 11, margin: '0 0 6px', fontStyle: 'italic' }}>
              You: {lastUserSaid.length > 120 ? lastUserSaid.substring(lastUserSaid.length - 120) : lastUserSaid}
            </p>
          )}
          {liveCaption && (
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              {liveCaption.length > 500 ? '...' + liveCaption.substring(liveCaption.length - 500) : liveCaption}
            </p>
          )}
        </div>
      )}

      {/* Voice transcript */}
      {transcript.length > 0 && (
        <div style={{ width: '100%', maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {transcript.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: t.from === 'aba' ? 'flex-start' : 'flex-end' }}>
              <div style={{ maxWidth: '85%', padding: '8px 12px', borderRadius: t.from === 'aba' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                background: t.from === 'aba' ? 'rgba(139,92,246,.12)' : 'rgba(255,255,255,.08)',
                color: 'rgba(255,255,255,.8)', fontSize: 12, lineHeight: 1.4 }}>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Switch to chat + end conversation */}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={() => onSwitchToChat(transcript)} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)',
          background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 11
        }}>Switch to Chat</button>
        {conversation?.status === 'connected' && (
          <button onClick={async () => { await conversation.endSession(); onSwitchToChat(transcript); }} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)',
            background: 'rgba(239,68,68,.08)', color: 'rgba(239,68,68,.7)', cursor: 'pointer', fontSize: 11
          }}>End Voice</button>
        )}
      </div>
    </div>
  );
}

/* ━━━ MAIN APP ━━━ */
function AppInner() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(() => {
    // ⬡B:GMGU.dev:FIX:stale_localStorage:20260409⬡
    // Don't load stale messages — let auto-init determine the correct lesson
    // Old behavior loaded cached messages which could show Day 1 even when Day 1 is complete
    return [];
  });
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [initDone, setInitDone] = useState(false);
  const [deckContent, setDeckContent] = useState(null);
  const [lessonDone, setLessonDone] = useState(null); // {title, block, day, next}
  const [curriculum, setCurriculum] = useState(null);
  const [interactionMode, setInteractionMode] = useState(null); // null = show selector, 'chat' = iMessage, 'voice' = ElevenLabs orb
  const [adminView, setAdminView] = useState(false);
  const [adminStudents, setAdminStudents] = useState([]);
  const [adminInterviews, setAdminInterviews] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [testMode, setTestMode] = useState({ cohort: 'INTEREST_MEMBER', track: 'PROGRAMS', block: 0, day: 1 });
  const [cohortBriefing, setCohortBriefing] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [layeredProfiles, setLayeredProfiles] = useState([]); // ⬡B:GMGU.layered:FEAT:admin_profiles:20260410⬡
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', name: '', cohort: 'INTEREST_MEMBER', track: 'UNASSIGNED', group: 'UNASSIGNED' });

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
      // Load graduation assessments from brain
      try {
        const aRes = await fetch('https://htlxjkbrstpwwtzsbyvb.supabase.co/rest/v1/aba_memory?source=ilike.gmg.university.assessment.%25.block0&select=source,content,created_at&order=created_at.desc&limit=20', { headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzI4MjEsImV4cCI6MjA4NjEwODgyMX0.MOgNYkezWpgxTO3ZHd0omZ0WLJOOR-tL7hONXWG9eBw' } });
        if (aRes.ok) setAssessments(await aRes.json());
      } catch (e) { console.error('[GMG-U] Assessments:', e.message); }
      // ⬡B:GMGU.layered:FEAT:admin_profiles:20260410⬡ Load LAYERED profiles
      try {
        const lpRes = await fetch('https://htlxjkbrstpwwtzsbyvb.supabase.co/rest/v1/aba_memory?memory_type=eq.layered_profile&select=source,content,created_at&order=created_at.desc&limit=20', { headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzI4MjEsImV4cCI6MjA4NjEwODgyMX0.MOgNYkezWpgxTO3ZHd0omZ0WLJOOR-tL7hONXWG9eBw' } });
        if (lpRes.ok) setLayeredProfiles(await lpRes.json());
      } catch (e) { console.error('[GMG-U] LAYERED profiles:', e.message); }
      // Also load day-level scores for all users
      try {
        const lsRes = await fetch('https://htlxjkbrstpwwtzsbyvb.supabase.co/rest/v1/aba_memory?memory_type=eq.layered_assessment&select=source,content,created_at&order=created_at.desc&limit=50', { headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzI4MjEsImV4cCI6MjA4NjEwODgyMX0.MOgNYkezWpgxTO3ZHd0omZ0WLJOOR-tL7hONXWG9eBw' } });
        if (lsRes.ok) {
          const scores = await lsRes.json();
          // Group scores by person for display
          if (scores.length > 0) console.log('[GMG-U] Loaded ' + scores.length + ' LAYERED day scores');
        }
      } catch (e) { console.error('[GMG-U] LAYERED scores:', e.message); }
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
      if (r.ok) { setShowAddForm(false); setAddForm({ email: '', name: '', cohort: 'INTEREST_MEMBER', track: 'UNASSIGNED', group: 'UNASSIGNED' }); loadAdmin(); }
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

  // ⬡B:audra.gmg_university.restructure:CODE:test_mode:20260407⬡
  async function simulateDay() {
    setAdminView(false);
    setMessages([]);
    const c = testMode.cohort;
    const t = testMode.track;
    const b = testMode.block;
    const d = testMode.day;
    // Load the title for this day from the curriculum endpoint
    let title = 'Day ' + d;
    try {
      const cr = await fetch(PROGRESS_API.replace('/progress', '/curriculum') + '?cohort_type=' + encodeURIComponent(c) + '&track=' + encodeURIComponent(t));
      if (cr.ok) {
        const data = await cr.json();
        const block = (data.blocks || []).find(bl => bl.block === b);
        if (block && block.days && block.days[d - 1]) title = block.days[d - 1];
      }
    } catch (e) { console.error('[GMG-U] Test mode curriculum:', e.message); }
    setCurrentLesson({ block: b, day: d, title, blockName: 'Block ' + b });
    let msg = 'TEST MODE SIMULATION. I am simulating a ' + c + ' student';
    if (c === 'FOUNDING_LINE') msg += ' on the ' + t + ' track';
    msg += '. Block ' + b + ' Day ' + d + ': "' + title + '". Proceed with my lesson.';
    if (c === 'INTERVIEW_MODE') msg += ' Interview me on this topic — share your research perspective first, then ask for my take.';
    streamFromAIR(msg, true);
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

  // ━━━ PERSIST MESSAGES ━━━
  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem('gmgu-messages', JSON.stringify(messages.slice(-50))); } catch {}
      window.__gmgu_messages = messages; // ⬡B:GMGU:voice_context_sync⬡ Expose to voice orb
    }
  }, [messages]);

  // ━━━ AUTO-SCROLL ━━━
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streaming]);

  // ━━━ LOAD CURRICULUM FROM BACKEND ━━━
  useEffect(() => {
    if (!profile) return;
    (async () => {
      try {
        const cohort = profile.cohort_type || 'FOUNDING_LINE';
        const track = profile.gmg_track || 'UNASSIGNED';
        const r = await fetch(PROGRESS_API.replace('/progress', '/curriculum') + '?cohort_type=' + encodeURIComponent(cohort) + '&track=' + encodeURIComponent(track));
        if (r.ok) setCurriculum(await r.json());
      } catch (e) { console.error('[GMG-U] Curriculum load:', e.message); }
    })();
  }, [profile]);

  // ━━━ AUTO-INIT: ABA greets on login ━━━
  // ⬡B:GMGU.layered:FIX:backend_pairing_init:20260410⬡
  // Calls /api/gmg-university/next-lessons which handles T7+ enforced pairing on the backend.
  // No local calculation — one source of truth for all 3 frontends.
  useEffect(() => {
    if (user && profile && curriculum && !initDone && !streaming) {
      setInitDone(true);
      const name = profile.name?.split(' ')[0] || 'there';
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      const email = profile.email || user?.email || '';
      
      (async () => {
        try {
          const nlRes = await fetch(PROGRESS_API.replace('/progress', '/next-lessons') + '?email=' + encodeURIComponent(email));
          if (!nlRes.ok) throw new Error('next-lessons failed');
          const nl = await nlRes.json();
          
          if (nl.mode === 'paired' && nl.nextLessons.length > 1) {
            // T7+ dual-track: show both options
            const lessons = nl.nextLessons;
            const b0 = lessons.find(l => l.block === 0);
            const b1 = lessons.find(l => l.block === 1);
            if (b0 && b1) {
              setMessages([{ role: 'aba', text: `Good ${greeting}, ${name}. You have two tracks for Day ${nl.currentPair}.\n\n**🧬 LAYERED Assessment** — Day ${b0.day}: ${b0.title}\n\n**📚 Nonprofit Foundations** — Day ${b1.day}: ${b1.title}\n\nBoth must be completed before Day ${nl.currentPair + 1} unlocks. Which one do you want to start with?`, time: Date.now() }]);
              window.__gmgu_dual_track = { block0: { block: 0, day: b0.day, title: b0.title }, block1: { block: 1, day: b1.day, title: b1.title } };
              return;
            }
          }
          
          if (nl.mode === 'paired' && nl.nextLessons.length === 1) {
            // T7+ but only one half of the pair remains
            const lesson = nl.nextLessons[0];
            const isAssessment = lesson.block === 0;
            const otherTrack = lesson.block === 0 ? 'Nonprofit Foundations' : 'LAYERED Assessment';
            setMessages([{ role: 'aba', text: `Good ${greeting}, ${name}. You already finished your ${otherTrack} for Day ${nl.currentPair}. Now let's do the other half.\n\n**${isAssessment ? '🧬 LAYERED Assessment' : '📚 Nonprofit Foundations'}** — Day ${lesson.day}: ${lesson.title}`, time: Date.now() }]);
            setCurrentLesson({ block: lesson.block, day: lesson.day, title: lesson.title });
            // Don't auto-stream — show voice/chat mode selector first
            return;
          }
          
          if (nl.mode === 'single' && nl.nextLessons.length > 0) {
            // PB or sequential
            const lesson = nl.nextLessons[0];
            const isAssessment = lesson.type === 'assessment';
            let msg = `Good ${greeting}, this is ${name}. I just opened GMG University.`;
            msg += ' My next ' + (isAssessment ? 'assessment' : 'lesson') + ' is Block ' + lesson.block + ' Day ' + lesson.day + ': "' + lesson.title + '". Proceed with my ' + (isAssessment ? 'assessment' : 'lesson') + '.';
            setCurrentLesson({ block: lesson.block, day: lesson.day, title: lesson.title });
            streamFromAIR(msg, true);
            return;
          }
          
          // mode === 'complete'
          let msg = `Good ${greeting}, this is ${name}. I just opened GMG University. I have completed all ${curriculum?.totalDays || '?'} days.`;
          streamFromAIR(msg, true);
        } catch (e) {
          console.error('[GMG-U] Next lessons:', e.message);
          // Fallback: just start Block 0 Day 1
          const next = getNextLesson(profile.completedDays || []);
          let msg = `Good ${greeting}, this is ${name}. I just opened GMG University.`;
          if (next) { msg += ' My next lesson is Block ' + next.block + ' Day ' + next.day + '. Proceed.'; setCurrentLesson(next); }
          streamFromAIR(msg, true);
        }
      })();
    }
  }, [user, profile, curriculum, initDone]);

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
    if (!curriculum?.blocks) return null;
    for (const block of curriculum.blocks) {
      for (let i = 0; i < (block.days || []).length; i++) {
        const key = 'b' + block.block + '-d' + (i + 1);
        if (!completed.includes(key)) return { block: block.block, day: i + 1, title: block.days[i], blockName: block.name };
      }
    }
    return null;
  }

  // ━━━ TTS WITH QUEUE ━━━
  // ⬡B:GMGU.dev:FIX:tts_long_text_and_recovery:20260409⬡
  async function speakText(text) {
    if (!voiceOn || !text?.trim()) return;
    // Split long text into sentence-sized chunks for TTS
    // ElevenLabs handles up to ~500 chars well, longer texts may fail
    const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
    for (const sentence of sentences) {
      const chunk = sentence.trim();
      if (!chunk || chunk.length < 3) continue;
      try {
        const r = await fetch(TTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunk.substring(0, 500) })
        });
        if (r.ok) {
          const url = URL.createObjectURL(await r.blob());
          audioQueue.current.push(url);
          playNext();
        } else {
          console.warn('[TTS] Failed for chunk, skipping:', r.status);
        }
      } catch (e) { console.error('[TTS]', e.message); }
    }
  }

  function playNext() {
    if (isPlaying.current || audioQueue.current.length === 0) return;
    isPlaying.current = true;
    const url = audioQueue.current.shift();
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.onended = () => { isPlaying.current = false; URL.revokeObjectURL(url); playNext(); };
      audioRef.current.onerror = () => { isPlaying.current = false; URL.revokeObjectURL(url); console.warn('[TTS] Audio playback error, skipping to next'); playNext(); };
      audioRef.current.play().catch(() => { isPlaying.current = false; URL.revokeObjectURL(url); playNext(); });
    } else {
      isPlaying.current = false;
      playNext();
    }
  }

  // ━━━ STREAM FROM AIR ━━━
  async function streamFromAIR(userMsg, isAutoInit = false) {
    if (streaming) return;
    setStreaming(true);
    if (!isAutoInit) setMessages(prev => [...prev, { role: 'user', text: userMsg, time: Date.now() }]);
    setMessages(prev => [...prev, { role: 'aba', text: '', streaming: true, time: Date.now() }]);

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
              // ⬡B:GMGU.standalone:FIX:faster_tts_streaming:20260409⬡
              // Speak earlier: first chunk fires on comma/period after 40+ chars
              // Subsequent chunks fire on sentence boundaries (.!?)
              const shouldSpeak = sentenceBuf.length > 40 && (
                sentenceBuf.match(/[.!?]\s*$/) || 
                (sentenceBuf.length > 80 && sentenceBuf.match(/[,;:]\s*$/))
              );
              if (shouldSpeak) { speakText(sentenceBuf.trim()); sentenceBuf = ''; }
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
    const doneInfo = currentLesson ? { title: currentLesson.title, block: currentLesson.block, day: currentLesson.day } : null;
    if (!currentLesson || !user?.email) return;
    const key = 'b' + currentLesson.block + '-d' + currentLesson.day;
    if (profile?.completedDays?.includes(key)) return;
    try {
      const r = await fetch(PROGRESS_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, completedKey: key })
      });
      if (r.ok) {
        const updated = await r.json();
        setProfile(p => ({ ...p, ...updated }));
        const nextL = getNextLesson(updated.completedDays || []); setCurrentLesson(nextL); if (doneInfo) setLessonDone({ ...doneInfo, next: nextL, total: (updated.completedDays||[]).length, of: curriculum?.totalDays || 75 });
      }
    } catch (e) { console.error('[GMG-U] Complete error:', e.message); }
  }

  // ⬡B:GMGU.standalone:FIX:selectBlockLesson_missing:20260408⬡
  // selectBlockLesson — replaces old selectLesson with block-aware version
  const selectBlockLesson = (blockNum, dayNum, title, blockName) => {
    setCurrentLesson({ block: blockNum, day: dayNum, title, blockName });
    setMessages([]);
    setInitDone(false);
    setTimeout(() => {
      const firstName = (user?.name || user?.email || 'there').split(' ')[0];
      streamFromAIR(firstName + ' here. I want to do Block ' + blockNum + ' Day ' + dayNum + ': "' + title + '". Proceed with my lesson.', true);
    }, 100);
  };

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <CinematicBG/>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
        <ABAConsciousness size={80}/>
        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 700, marginTop: 20, marginBottom: 4, letterSpacing: -0.5 }}>GMG University</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8 }}>Global Majority Group</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, maxWidth: 320, margin: '0 auto 28px', lineHeight: 1.5 }}>AI-powered nonprofit education. Personalized curriculum. Real-world skills from real practitioners.</p>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} style={{
          padding: '14px 36px', borderRadius: 14,
          background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)',
          color: '#a78bfa', fontSize: 15, cursor: 'pointer', fontWeight: 600,
          backdropFilter: 'blur(12px)'
        }}>Sign in with Google</button>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, marginTop: 20 }}>Powered by ABA</p>
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
                    <option value="INTEREST_MEMBER">Interest Member</option><option value="NEW_COHORT">New Cohort (Legacy)</option><option value="FOUNDING_LINE">Founding Line</option><option value="INTERVIEW_MODE">Interview Mode</option>
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
                {/* ⬡B:GMGU.dev:FEAT:admin_completion_toggle:20260409⬡ */}
                <button onClick={async () => {
                  const dayKey = prompt('Mark day complete (e.g., b1-d1) or remove (e.g., -b1-d1):');
                  if (!dayKey) return;
                  const isRemove = dayKey.startsWith('-');
                  const key = isRemove ? dayKey.slice(1) : dayKey;
                  let days = [...(s.completedDays || [])];
                  if (isRemove) { days = days.filter(d => d !== key); }
                  else if (!days.includes(key)) { days.push(key); }
                  try {
                    await fetch(Q + '/api/gmg-university/progress', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: s.email, completedDays: days, cohort_type: s.cohort_type, gmg_track: s.gmg_track })
                    });
                    loadAdmin();
                  } catch (e) { console.error('[ADMIN]', e.message); }
                }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(139,92,246,0.2)', background: 'transparent', color: '#a78bfa', fontSize: 10, cursor: 'pointer' }}>±Day</button>
              </div>
            </div>
          ))}
          {/* GRADUATION ALERTS — students who completed Block 0 */}
          {assessments.length > 0 && <>
            <p style={{ color: 'rgba(16,185,129,0.8)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Graduation Alerts ({assessments.length})</p>
            {assessments.map((a, i) => {
              const hamId = (a.source || '').split('.')[3] || '?';
              return (
                <div key={i} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>{hamId} — Block 0 Complete</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{(a.created_at || '').substring(0, 10)}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{(typeof a.content === 'string' ? a.content : JSON.stringify(a.content)).substring(0, 300)}{(typeof a.content === 'string' ? a.content : '').length > 300 ? '...' : ''}</p>
                </div>
              );
            })}
          </>}

          {/* ⬡B:GMGU.layered:FEAT:admin_layered_profiles:20260410⬡ */}
          {layeredProfiles.length > 0 && <>
            <p style={{ color: 'rgba(251,191,36,0.8)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>LAYERED Profiles ({layeredProfiles.length})</p>
            {layeredProfiles.map((lp, i) => {
              const email = (lp.source || '').replace('gmg.university.layered.profile.', '');
              let profile = lp.content;
              try { if (typeof profile === 'string') profile = JSON.parse(profile); } catch { profile = {}; }
              const layers = profile.layers || {};
              const archetype = profile.configuration_archetype || profile.archetype || 'Unknown';
              const coreBalance = profile.core_balance || {};
              const resilience = profile.resilience_tier || '?';
              const trackRec = profile.track_recommendation || 'Undecided';
              return (
                <div key={i} style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>{email}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{(lp.created_at || '').substring(0, 10)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>{archetype}</span>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>Resilience: {resilience}</span>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>Track: {trackRec}</span>
                  </div>
                  {/* Layer scores bar chart */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
                    {['Autonomy','Alignment','Strategic','Execution','Relational','Analytical','Creative'].map(layer => {
                      const score = layers[layer.toLowerCase()] || layers[layer] || 0;
                      return (
                        <div key={layer} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 65, fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>{layer}</span>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: score >= 7 ? '#10b981' : score >= 4 ? '#fbbf24' : '#ef4444', borderRadius: 3, width: (score * 10) + '%', transition: 'width 0.3s' }}/>
                          </div>
                          <span style={{ width: 16, fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{score}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* CORE balance */}
                  {Object.keys(coreBalance).length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {Object.entries(coreBalance).map(([k, v]) => (
                        <span key={k} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, background: v >= 7 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', color: v >= 7 ? '#10b981' : 'rgba(255,255,255,0.4)' }}>{k}: {v}</span>
                      ))}
                    </div>
                  )}
                  {profile.narrative && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.5, margin: 0 }}>{String(profile.narrative).substring(0, 250)}{String(profile.narrative).length > 250 ? '...' : ''}</p>}
                </div>
              );
            })}
          </>}

          {/* COHORT BRIEFING — recent student activity */}
          {adminStudents.length > 0 && <>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Cohort Progress</p>
            {adminStudents.filter(s => s.cohort_type !== 'INTERVIEW_MODE').map(s => {
              const completed = s.completedDays || [];
              const block0Done = completed.filter(k => k.startsWith('b0-')).length;
              const block1Done = completed.filter(k => k.startsWith('b1-')).length;
              const isInterest = s.cohort_type === 'INTEREST_MEMBER';
              const totalBlocks = isInterest ? 6 : 5;
              return (
                <div key={s.ham_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 6 }}>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 500, flex: 1, minWidth: 0 }}>{s.name}</span>
                  {isInterest && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, background: block0Done >= 7 ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.1)', color: block0Done >= 7 ? '#10b981' : '#fbbf24' }}>B0: {block0Done}/7</span>}
                  <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, background: block1Done >= 15 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: block1Done >= 15 ? '#10b981' : 'rgba(255,255,255,0.4)' }}>B1: {block1Done}/15</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{completed.length} total</span>
                </div>
              );
            })}
          </>}

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
          {/* TEST MODE — founders simulate any student experience */}
          <div style={{ marginTop: 20, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 12, padding: 14 }}>
            <p style={{ color: '#fbbf24', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Test Mode</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 10, lineHeight: 1.4 }}>Simulate any student experience. Pick a cohort type, track, block, and day — then experience exactly what they would see.</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <select value={testMode.cohort} onChange={e => { const c = e.target.value; setTestMode(t => ({ ...t, cohort: c, block: c === 'INTEREST_MEMBER' ? 0 : 1 })); }} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                <option value="INTEREST_MEMBER">Interest Member</option>
                <option value="FOUNDING_LINE">Founding Line</option>
                <option value="INTERVIEW_MODE">Founder Interview</option>
              </select>
              {testMode.cohort === 'FOUNDING_LINE' && <select value={testMode.track} onChange={e => setTestMode(t => ({ ...t, track: e.target.value }))} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                <option value="CDO_VP_HEAD_FUNDRAISING">BJ — CDO/VP</option>
                <option value="DEVELOPMENT_MANAGER">CJ — Dev Manager</option>
                <option value="PROGRAMS">Vante — Programs</option>
                <option value="OPERATIONS">Dwayne — Ops</option>
              </select>}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <select value={testMode.block} onChange={e => setTestMode(t => ({ ...t, block: parseInt(e.target.value), day: 1 }))} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12 }}>
                {testMode.cohort === 'INTEREST_MEMBER' && <option value={0}>Block 0 — Brotherhood</option>}
                <option value={1}>Block 1 — Foundations</option>
                <option value={2}>Block 2 — Track Specific</option>
                <option value={3}>Block 3 — Deeper</option>
                <option value={4}>Block 4 — CPP/Resume</option>
                <option value={5}>Block 5 — Capstone</option>
              </select>
              <input type="number" min={1} max={15} value={testMode.day} onChange={e => setTestMode(t => ({ ...t, day: parseInt(e.target.value) || 1 }))} style={{ width: 60, padding: 8, borderRadius: 8, border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(15,15,20,0.9)', color: 'white', fontSize: 12, textAlign: 'center' }}/>
            </div>
            <button onClick={simulateDay} style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none', background: 'rgba(251,191,36,0.2)', color: '#fbbf24', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Simulate Day {testMode.day} of Block {testMode.block}</button>
          </div>
          </>}
        </div>
      )}

      {/* MESSAGES AREA */}
      {!adminView && <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 100, position: 'relative', zIndex: 1 }}>
        {messages.length === 0 && !streaming && (
          <div style={{ textAlign: 'center', padding: '48px 28px', color: 'rgba(255,255,255,0.15)' }}>
            <div style={{ marginBottom: 14, opacity: 0.6 }}><ABAConsciousness size={56}/></div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Starting your session...</p>
            {curriculum && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
              {curriculum.blocks?.length || 0} blocks · {curriculum.totalDays || 0} days · {(profile?.completedDays || []).length} completed
            </p>}
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
                <div style={{ margin: 0 }}>
                  {msg.role === 'aba' && !msg.streaming ? renderMd((msg.text || '').replace(/\[LESSON_STARTED\]/g,'').replace(/\[LESSON_COMPLETE\]/g,'').trim()) : <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14.5, lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>}
                  {msg.streaming && <span style={{ display: 'inline-block', width: 2, height: 16, background: '#a78bfa', marginLeft: 2, animation: 'pulse 0.8s infinite', verticalAlign: 'text-bottom' }}/>}
                  {msg.time && !msg.streaming && <p style={{ color: 'rgba(255,255,255,0.08)', fontSize: 9, marginTop: 4, textAlign: msg.role === 'aba' ? 'left' : 'right' }}>{new Date(msg.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>}
                  {/* ⬡B:GMGU.standalone:FEAT:read_aloud_and_voice_switch:20260409⬡ */}
                  {isAba && !msg.streaming && interactionMode === 'chat' && i === messages.length - 1 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.06)' }}>
                      <button onClick={() => speakText((msg.text || '').replace(/\[.*?\]/g,'').replace(/\*\*/g,'').trim())} style={{
                        padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(139,92,246,.2)',
                        background: 'rgba(139,92,246,.08)', color: 'rgba(139,92,246,.7)', cursor: 'pointer',
                        fontSize: 10, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
                        Read Aloud
                      </button>
                      <button onClick={() => setInteractionMode('voice')} style={{
                        padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(6,182,212,.2)',
                        background: 'rgba(6,182,212,.08)', color: 'rgba(6,182,212,.7)', cursor: 'pointer',
                        fontSize: 10, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}><rect x={9} y={2} width={6} height={11} rx={3}/><path d="M5 11a7 7 0 0014 0"/><line x1={12} y1={18} x2={12} y2={22}/></svg>
                        Switch to Voice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {streaming && messages[messages.length - 1]?.text === '' && <TypingDots/>}
        <div ref={endRef}/>

        {/* ⬡B:GMGU.layered:FEAT:dual_track_selector:20260410⬡ */}
        {/* Dual-track picker for founding line — LAYERED + Block 1 */}
        {!currentLesson && !streaming && messages.length > 0 && window.__gmgu_dual_track && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '12px 14px' }}>
            <button onClick={() => {
              const t = window.__gmgu_dual_track.block0;
              setCurrentLesson(t);
              window.__gmgu_dual_track = null;
              const name = profile?.name?.split(' ')[0] || 'there';
              streamFromAIR(name + ' here. I want to do Block 0 Day ' + t.day + ': "' + t.title + '". This is a LAYERED assessment day. Proceed with my assessment.', true);
            }} style={{
              flex: 1, maxWidth: 220, padding: '14px 16px', borderRadius: 14,
              border: '1px solid rgba(251,191,36,.3)', background: 'rgba(251,191,36,.08)',
              color: '#fbbf24', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6
            }}>
              <span style={{ fontSize: 20 }}>🧬</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>LAYERED Assessment</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Day {window.__gmgu_dual_track.block0.day}: {window.__gmgu_dual_track.block0.title}</span>
            </button>
            <button onClick={() => {
              const t = window.__gmgu_dual_track.block1;
              setCurrentLesson(t);
              window.__gmgu_dual_track = null;
              const name = profile?.name?.split(' ')[0] || 'there';
              streamFromAIR(name + ' here. I want to do Block 1 Day ' + t.day + ': "' + t.title + '". Proceed with my lesson.', true);
            }} style={{
              flex: 1, maxWidth: 220, padding: '14px 16px', borderRadius: 14,
              border: '1px solid rgba(139,92,246,.3)', background: 'rgba(139,92,246,.08)',
              color: '#a78bfa', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6
            }}>
              <span style={{ fontSize: 20 }}>📚</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Nonprofit Foundations</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Day {window.__gmgu_dual_track.block1.day}: {window.__gmgu_dual_track.block1.title}</span>
            </button>
          </div>
        )}

        {/* ⬡B:GMGU.standalone:FEAT:voice_chat_mode_selector:20260409⬡ */}
        {/* Mode selector — shown after ABA's first message finishes streaming */}
        {!interactionMode && currentLesson && messages.length > 0 && !streaming && messages[messages.length-1]?.role === 'aba' && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '20px 14px 10px' }}>
            <button onClick={() => setInteractionMode('voice')} style={{
              flex: 1, maxWidth: 200, padding: '14px 16px', borderRadius: 14,
              border: '1px solid rgba(139,92,246,.3)', background: 'rgba(139,92,246,.12)',
              color: '#a78bfa', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, transition: 'all .2s'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}><rect x={9} y={2} width={6} height={11} rx={3}/><path d="M5 11a7 7 0 0014 0"/><line x1={12} y1={18} x2={12} y2={22}/></svg>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Continue with Voice</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Like a phone call</span>
            </button>
            <button onClick={() => setInteractionMode('chat')} style={{
              flex: 1, maxWidth: 200, padding: '14px 16px', borderRadius: 14,
              border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)',
              color: 'rgba(255,255,255,.7)', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, transition: 'all .2s'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Continue Chatting</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Type your answers</span>
            </button>
          </div>
        )}

        {/* Voice conversation mode — ElevenLabs push-to-talk orb */}
        {interactionMode === 'voice' && (
          <VoiceConversationOrb userId={user?.email} currentLesson={currentLesson} cohortType={profile?.cohort_type} onSwitchToChat={(voiceTranscript) => {
            // ⬡B:GMGU.dev:FEAT:voice_to_chat_sync:20260409⬡
            if (voiceTranscript && voiceTranscript.length > 0) {
              const voiceMsgs = voiceTranscript.map(t => ({
                role: t.from === 'aba' ? 'aba' : 'user',
                text: t.text,
                time: Date.now(),
                source: 'voice'
              }));
              setMessages(prev => [...prev, 
                { role: 'aba', text: '(Voice conversation captured)', time: Date.now(), source: 'system' },
                ...voiceMsgs
              ]);
              
              // ⬡B:GMGU.dev:FIX:voice_lesson_completion:20260409⬡
              // If the voice conversation had 4+ exchanges (2+ from user, 2+ from ABA),
              // mark the current lesson as complete. This covers the gap where VARA
              // can't emit [LESSON_COMPLETE] through the ElevenLabs pipeline.
              const userTurns = voiceTranscript.filter(t => t.from === 'user').length;
              const abaTurns = voiceTranscript.filter(t => t.from === 'aba').length;
              if (userTurns >= 2 && abaTurns >= 2 && currentLesson) {
                const key = 'b' + currentLesson.block + '-d' + currentLesson.day;
                if (!(profile?.completedDays || []).includes(key)) {
                  fetch(Q + '/api/gmg-university/progress', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: profile?.email, completedKey: key })
                  }).then(r => r.json()).then(updated => {
                    setProfile(p => ({ ...p, ...updated }));
                    setLessonDone({ title: currentLesson.title, block: currentLesson.block, day: currentLesson.day });
                  }).catch(e => console.error('[GMG-U] Voice completion save:', e.message));
                }
              }
            }
            setInteractionMode('chat');
          }} />
        )}
      </div>}

      {/* INPUT BAR — only show in chat mode or before mode selected */}
      {!adminView && interactionMode !== 'voice' && <div style={{
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
        onSelectBlock={selectBlockLesson} curriculum={curriculum}
        onReset={resetProgress}
        currentLesson={currentLesson}
        cohortType={profile?.cohort_type}
      />
      {/* Lesson Complete Card */}
      {lessonDone && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s ease-out' }} onClick={() => setLessonDone(null)}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(24px)', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)', padding: '32px 28px', textAlign: 'center', maxWidth: 340, width: '90%', animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h3 style={{ color: 'white', fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Lesson Complete</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 16px' }}>Block {lessonDone.block} · Day {lessonDone.day}</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: '0 0 16px' }}>{lessonDone.title}</p>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 3, width: (lessonDone.total / Math.max(lessonDone.of, 1) * 100) + '%', transition: 'width 0.5s' }}/>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 20 }}>{lessonDone.total} of {lessonDone.of} lessons completed</p>
          {lessonDone.next ? <button onClick={() => { selectBlockLesson(lessonDone.next.block, lessonDone.next.day, lessonDone.next.title, lessonDone.next.blockName); setLessonDone(null); }} style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'rgba(124,58,237,0.25)', color: '#a78bfa', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Next: {lessonDone.next.title}</button>
          : <p style={{ color: '#10b981', fontSize: 14, fontWeight: 600 }}>All lessons complete!</p>}
        </div>
      </div>}
      <DeckPanel deck={deckContent} onClose={() => setDeckContent(null)}/>
    </div>
  );
}

export default function App() { return <GMGErrorBoundary><AppInner/></GMGErrorBoundary>; }
