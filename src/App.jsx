// GMG UNIVERSITY v5.0.0 ECHO
// Lane-Pierce Fellowship Training Platform
// REAL ABA Integration via AIR (ABA Intelligence Router)
// 
// Backend: https://abacia-services.onrender.com
// Auth: Firebase (gmg-university project)
// Brain: Supabase (ABAbase)
// Voice: ElevenLabs
//
// We Are All ABA.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

// ============================================================================
// FIREBASE CONFIG
// ============================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDCq39PympTHCU7gFlIOm6xJYbtS7Amm9g",
  authDomain: "gmg-university.firebaseapp.com",
  projectId: "gmg-university",
  storageBucket: "gmg-university.firebasestorage.app",
  messagingSenderId: "85247972370",
  appId: "1:85247972370:web:18e62a01313037292d74cb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ============================================================================
// ABA BACKEND ENDPOINTS
// ============================================================================

const ABA_ENDPOINTS = {
  air: 'https://abacia-services.onrender.com/api/air/process',
  status: 'https://abacia-services.onrender.com/api/air/status',
  elevenlabs: 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL'
};

const SUPABASE = {
  url: 'https://htlxjkbrstpwwtzsbyvb.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzI4MjEsImV4cCI6MjA4NjEwODgyMX0.MOgNYkezWpgxTO3ZHd0omZ0WLJOOR-tL7hONXWG9eBw',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bHhqa2Jyc3Rwd3d0enNieXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUzMjgyMSwiZXhwIjoyMDg2MTA4ODIxfQ.G55zXnfanoUxRAoaYz-tD9FDJ53xHH-pRgDrKss_Iqo'
};

const ELEVENLABS_KEY = 'sk_e0b48157805968dbb370f299b60e22001189bd85c3864040';

// ============================================================================
// ABA CONSCIOUSNESS - REAL ORGANIC ENERGY BLOB
// Brandon: "LIKE ENERGY INSIDE OF ENERGY! LIFE MOVING ABSTRACT"
// Brandon: "NO SPHERE NO CIRCLE NO DOTS!!!!!!!!"
// ============================================================================

const STATE_PALETTES = {
  idle: {
    colors: [[139, 92, 246], [167, 139, 250], [236, 72, 153], [99, 102, 241]],
    glow: [139, 92, 246]
  },
  thinking: {
    colors: [[245, 158, 11], [251, 191, 36], [239, 68, 68], [253, 224, 71]],
    glow: [245, 158, 11]
  },
  speaking: {
    colors: [[34, 197, 94], [16, 185, 129], [132, 204, 22], [45, 212, 191]],
    glow: [34, 197, 94]
  },
  listening: {
    colors: [[6, 182, 212], [59, 130, 246], [139, 92, 246], [147, 197, 253]],
    glow: [6, 182, 212]
  }
};

class NoiseGenerator {
  constructor() {
    this.perm = Array.from({ length: 512 }, () => Math.floor(Math.random() * 256));
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

const ABAConsciousness = ({ size = 200, state = 'idle' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const noiseRef = useRef(new NoiseGenerator());
  const stateRef = useRef(state);

  useEffect(() => { stateRef.current = state; }, [state]);

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
      ctx.clearRect(0, 0, size, size);

      // Draw multiple blob layers
      for (let layer = 0; layer < 4; layer++) {
        const color = palette.colors[layer];
        const layerOffset = layer * 0.7;
        const baseRadius = size * (0.28 - layer * 0.03);
        ctx.beginPath();
        const points = 120;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const n1 = noise.noise2D(Math.cos(angle) * 2 + time + layerOffset, Math.sin(angle) * 2 + time * 0.7);
          const n2 = noise.noise2D(Math.cos(angle) * 4 + time * 1.3 + layerOffset, Math.sin(angle) * 4 + time * 0.9) * 0.5;
          const n3 = noise.noise2D(Math.cos(angle) * 8 + time * 0.5 + layerOffset, Math.sin(angle) * 8 + time * 1.1) * 0.25;
          const noiseVal = (n1 + n2 + n3) * 0.4;
          const radius = baseRadius + noiseVal * size * 0.15;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        const gradient = ctx.createRadialGradient(
          center + Math.sin(time * 2 + layer) * 10,
          center + Math.cos(time * 1.5 + layer) * 10,
          0, center, center, baseRadius * 1.5
        );
        const alpha = 0.7 - layer * 0.12;
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
        if (layer === 0) {
          ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
          ctx.shadowBlur = 30;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Inner energy wisps
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
          const n = noise.noise2D(Math.cos(angle) * 3 + wispTime + w, Math.sin(angle) * 3 + wispTime * 0.8);
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
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
};

// ============================================================================
// CURRICULUM DATA
// ============================================================================

const CURRICULUM = {
  v1: {
    title: 'Fundraising Foundations',
    days: 30,
    description: 'Master the fundamentals of nonprofit fundraising',
    lessons: [
      { day: 1, title: 'The Four Sources of Money', type: 'lesson', focus: 'individuals-50-foundations-25-earned-15-corps-10' },
      { day: 2, title: 'Why People Actually Give', type: 'lesson', focus: 'donor-psychology-motivations' },
      { day: 3, title: 'The Donor Lifecycle', type: 'lesson', focus: 'identification-cultivation-solicitation-stewardship' },
      { day: 4, title: 'The Donor Pyramid', type: 'lesson', focus: 'annual-major-planned-giving-tiers' },
      { day: 5, title: 'Quiz: Days 1-4', type: 'quiz' },
      { day: 6, title: 'Annual Giving Programs', type: 'lesson', focus: 'recurring-gifts-appeals-campaigns' },
      { day: 7, title: 'Foundation Grants Reality', type: 'lesson', focus: 'success-rates-fit-requirements' },
      { day: 8, title: 'Corporate Partnerships', type: 'lesson', focus: 'sponsorship-cause-marketing-matching' },
      { day: 9, title: 'Earned Revenue Strategies', type: 'lesson', focus: 'fee-for-service-merchandise-events' },
      { day: 10, title: 'Quiz: Days 6-9', type: 'quiz' },
      { day: 11, title: 'Board Fundraising Responsibility', type: 'lesson', focus: 'give-get-governance' },
      { day: 12, title: 'Grant Research Deep Dive', type: 'lesson', focus: 'prospect-identification-databases' },
      { day: 13, title: 'Donor Retention Strategies', type: 'lesson', focus: '45-percent-average-improvement-tactics' },
      { day: 14, title: 'Fundraising Systems and Tools', type: 'lesson', focus: 'crm-tracking-automation' },
      { day: 15, title: 'Quiz: Days 11-14', type: 'quiz' },
      { day: 16, title: 'Grant Writing Basics', type: 'lesson', focus: 'structure-narrative-budget' },
      { day: 17, title: 'Major Donor Identification', type: 'lesson', focus: 'capacity-affinity-propensity-linkage' },
      { day: 18, title: 'Planned Giving Introduction', type: 'lesson', focus: 'bequests-trusts-annuities' },
      { day: 19, title: 'Corporate Sponsorship Models', type: 'lesson', focus: 'tiered-packages-benefits' },
      { day: 20, title: 'Quiz: Days 16-19', type: 'quiz' },
      { day: 21, title: 'Digital Fundraising Tactics', type: 'lesson', focus: 'email-social-crowdfunding' },
      { day: 22, title: 'Storytelling for Impact', type: 'lesson', focus: 'protagonist-challenge-transformation' },
      { day: 23, title: 'Capital Campaigns Overview', type: 'lesson', focus: 'quiet-phase-50-percent' },
      { day: 24, title: 'Monthly Giving Programs', type: 'lesson', focus: 'sustainer-retention-upgrade' },
      { day: 25, title: 'Quiz: Days 21-24', type: 'quiz' },
      { day: 26, title: 'Board Development', type: 'lesson', focus: 'recruitment-training-engagement' },
      { day: 27, title: 'Prospect Research Methods', type: 'lesson', focus: 'wealth-screening-indicators' },
      { day: 28, title: 'Fundraising Metrics That Matter', type: 'lesson', focus: 'cost-per-dollar-20-cents' },
      { day: 29, title: 'Strategic Planning for Development', type: 'lesson', focus: 'goals-timeline-accountability' },
      { day: 30, title: 'Volume 1 Capstone', type: 'capstone', focus: 'full-consulting-simulation' }
    ]
  },
  v2: {
    title: 'The GMG Way',
    days: 30,
    description: 'Learn the Global Majority Group methodology',
    lessons: [
      { day: 1, title: 'What Makes GMG Different', type: 'lesson', focus: 'both-sides-of-table' },
      { day: 2, title: 'Both Sides of the Table', type: 'lesson', focus: 'grantmaker-grantseeker-perspective' },
      { day: 3, title: "Brandon's Writing Standards", type: 'lesson', focus: '16-rules-no-ai-slop' },
      { day: 4, title: '360° Landscape Assessment', type: 'lesson', focus: 'comprehensive-org-analysis' },
      { day: 5, title: 'Quiz: Days 1-4', type: 'quiz' },
      { day: 6, title: 'Data Science Development Plans', type: 'lesson' },
      { day: 7, title: 'Prospect Precision System', type: 'lesson' },
      { day: 8, title: 'Grant Catalyst Methodology', type: 'lesson' },
      { day: 9, title: 'Implementation Engine', type: 'lesson' },
      { day: 10, title: 'Quiz: Days 6-9', type: 'quiz' }
    ]
  },
  v3: {
    title: 'CPP Consultant Model',
    days: 15,
    description: 'Consultant Pipeline Program + LAYERED Assessment',
    lessons: [
      { day: 1, title: 'CPP Introduction', type: 'assessment', focus: 'consultant-pipeline-program' },
      { day: 2, title: 'Code Switching Scenario', type: 'assessment' },
      { day: 3, title: 'Professional Development', type: 'assessment' },
      { day: 4, title: 'Brotherhood Scenario', type: 'assessment' },
      { day: 5, title: 'LAYERED Assessment Part 1', type: 'assessment' }
    ]
  }
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function GMGUniversity() {
  // State
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [selectedVolume, setSelectedVolume] = useState('v1');
  const [selectedDay, setSelectedDay] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [abaState, setAbaState] = useState('idle');
  const [lessonProgress, setLessonProgress] = useState(0);
  const [voiceMode, setVoiceMode] = useState(false);
  const [airStatus, setAirStatus] = useState(null);
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // ============================================================================
  // AUTH
  // ============================================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check AIR status on mount
    fetch(ABA_ENDPOINTS.status)
      .then(r => r.json())
      .then(setAirStatus)
      .catch(console.error);
  }, []);

  const loadUserProfile = async (firebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
      } else {
        const newProfile = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Fellow',
          photoURL: firebaseUser.photoURL,
          completedDays: [],
          currentVolume: 'v1',
          currentDay: 1,
          xp: 0,
          streak: 0,
          iep: { strengths: [], gaps: [], notes: [] },
          createdAt: serverTimestamp()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Profile error:', error);
    }
  };

  const handleSignIn = () => signInWithPopup(auth, googleProvider).catch(console.error);
  const handleSignOut = () => signOut(auth).then(() => setView('home')).catch(console.error);

  // ============================================================================
  // ABA VIA AIR (REAL BACKEND)
  // ============================================================================

  const sendToABA = async (userMessage, isStart = false) => {
    setIsTyping(true);
    setAbaState('thinking');
    
    const lesson = CURRICULUM[selectedVolume]?.lessons.find(l => l.day === selectedDay);
    
    const systemContext = `You are ABA, the AI professor for GMG University's Lane-Pierce Fellowship program.

CURRENT LESSON:
- Volume: ${CURRICULUM[selectedVolume]?.title}
- Day ${selectedDay}: ${lesson?.title}
- Focus: ${lesson?.focus || 'General'}
- Type: ${lesson?.type}

STUDENT: ${userProfile?.name || 'Fellow'}
EMAIL: ${userProfile?.email}
XP: ${userProfile?.xp || 0} | Completed: ${userProfile?.completedDays?.length || 0} lessons

${isStart ? 'START the lesson: Greet them by name, brief personal check-in, preview what they will learn, then begin teaching conversationally. Ask questions to verify understanding.' : 'Continue the lesson conversationally. Ask checkpoint questions. Be warm and professional, never robotic.'}

PERSONALITY: Butler + Genius. Warm, professional, complete sentences. Personal context before business. Never say "I'd be happy to help."

We Are All ABA.`;

    try {
      // Use AIR endpoint for real ABA processing
      const response = await fetch(ABA_ENDPOINTS.air, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          user_id: userProfile?.email || 'guest',
          channel: 'gmg_university',
          source: `gmgu_${selectedVolume}_day${selectedDay}`,
          context: {
            lesson: lesson?.title,
            volume: selectedVolume,
            day: selectedDay,
            studentName: userProfile?.name,
            systemPrompt: systemContext
          }
        })
      });

      const data = await response.json();
      const abaResponse = data.response || data.message || "Give me a moment to gather my thoughts...";
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: abaResponse }
      ]);

      setAbaState('speaking');
      setLessonProgress(prev => Math.min(prev + 12, 100));

      // Voice mode
      if (voiceMode) {
        speakWithElevenLabs(abaResponse);
      }

      // Log to ABAbase
      logToSupabase(userMessage, abaResponse, lesson);

      setTimeout(() => setAbaState('idle'), 2000);

    } catch (error) {
      console.error('AIR Error:', error);
      
      // Fallback to direct Claude if AIR fails
      try {
        const fallbackResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            system: systemContext,
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ]
          })
        });
        
        const fallbackData = await fallbackResponse.json();
        const fallbackText = fallbackData.content?.[0]?.text || "Let me reconnect...";
        
        setMessages(prev => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: fallbackText }
        ]);
        setLessonProgress(prev => Math.min(prev + 12, 100));
      } catch (fallbackError) {
        setMessages(prev => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: "I'm having a brief connection issue. Let's try again in a moment." }
        ]);
      }
      setAbaState('idle');
    } finally {
      setIsTyping(false);
    }
  };

  // ============================================================================
  // ELEVENLABS VOICE
  // ============================================================================

  const speakWithElevenLabs = async (text) => {
    try {
      setAbaState('speaking');
      const response = await fetch(ABA_ENDPOINTS.elevenlabs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_KEY
        },
        body: JSON.stringify({
          text: text.substring(0, 1000),
          model_id: 'eleven_turbo_v2_5',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  // ============================================================================
  // SUPABASE LOGGING
  // ============================================================================

  const logToSupabase = async (userMsg, abaMsg, lesson) => {
    try {
      await fetch(`${SUPABASE.url}/rest/v1/aba_memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE.serviceKey,
          'Authorization': `Bearer ${SUPABASE.serviceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          source: `gmgu.${selectedVolume}.day${selectedDay}.${userProfile?.email?.split('@')[0] || 'guest'}`,
          memory_type: 'lesson_interaction',
          content: JSON.stringify({
            student: userProfile?.email,
            lesson: lesson?.title,
            exchange: { user: userMsg.substring(0, 500), aba: abaMsg.substring(0, 500) },
            timestamp: new Date().toISOString()
          }),
          importance: 5,
          tags: ['gmg-university', selectedVolume, `day-${selectedDay}`]
        })
      });
    } catch (error) {
      console.error('Supabase log error:', error);
    }
  };

  // ============================================================================
  // LESSON HANDLERS
  // ============================================================================

  const startLesson = (volume, day) => {
    setSelectedVolume(volume);
    setSelectedDay(day);
    setMessages([]);
    setLessonProgress(0);
    setView('lesson');
    setTimeout(() => sendToABA("I'm ready for today's lesson.", true), 500);
  };

  const completeLesson = async () => {
    if (!user || !userProfile) return;
    const key = `${selectedVolume}-d${selectedDay}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        completedDays: arrayUnion(key),
        xp: (userProfile.xp || 0) + 100,
        lastActiveDate: serverTimestamp()
      });
      setUserProfile(prev => ({
        ...prev,
        completedDays: [...(prev.completedDays || []), key],
        xp: (prev.xp || 0) + 100
      }));
      setView('learn');
    } catch (error) {
      console.error('Complete error:', error);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setAbaState('listening');
    sendToABA(inputValue);
    setInputValue('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================================================
  // RENDER: LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <ABAConsciousness size={120} state="thinking" />
          <p className="text-amber-400 font-medium mt-4">Loading GMG University...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: LOGIN
  // ============================================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mb-6">
              <ABAConsciousness size={100} state="idle" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">GMG University</h1>
            <p className="text-slate-400 text-lg">Lane-Pierce Fellowship Program</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">
                {airStatus ? `${airStatus.agents} agents online` : 'Connecting to ABA...'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-6">
            <div className="space-y-5">
              {[
                { icon: '📚', title: '75 Days of Training', desc: '3 volumes of nonprofit fundraising mastery' },
                { icon: '🤖', title: 'ABA-Powered Learning', desc: 'Live AI conversations via 79 agents' },
                { icon: '🎯', title: 'Personalized IEP', desc: 'Individual Education Plan built for you' },
                { icon: '🔊', title: 'Voice Mode', desc: 'ABA can speak lessons out loud' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-3 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-slate-500 text-sm mt-8">We Are All ABA.</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: LESSON VIEW
  // ============================================================================

  if (view === 'lesson' && selectedDay) {
    const lesson = CURRICULUM[selectedVolume]?.lessons.find(l => l.day === selectedDay);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setView('learn')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <span>←</span> <span className="text-sm">Back</span>
            </button>
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2">
                <ABAConsciousness size={28} state={abaState} />
                <span className="text-amber-400 text-sm font-medium">Day {selectedDay}</span>
              </div>
              <p className="text-white text-sm truncate max-w-[200px]">{lesson?.title}</p>
            </div>
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                voiceMode ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {voiceMode ? '🔊' : '🔇'}
            </button>
          </div>
          <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
              style={{ width: `${lessonProgress}%` }}
            />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900'
                  : 'bg-slate-800/80 backdrop-blur border border-slate-700/50 text-white'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <ABAConsciousness size={20} state={abaState} />
                    <span className="text-amber-400 text-xs font-medium">ABA</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <ABAConsciousness size={20} state="thinking" />
                  <span className="text-amber-400 text-xs font-medium">ABA is thinking...</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-700 disabled:to-slate-700 text-slate-900 disabled:text-slate-500 font-medium px-6 py-3 rounded-xl transition-all"
            >
              Send
            </button>
          </div>
          
          {lessonProgress >= 70 && (
            <button
              onClick={completeLesson}
              className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-green-500/20"
            >
              ✓ Complete Lesson (+100 XP)
            </button>
          )}
        </div>

        <audio ref={audioRef} />
      </div>
    );
  }

  // ============================================================================
  // RENDER: LEARN VIEW
  // ============================================================================

  if (view === 'learn') {
    const volume = CURRICULUM[selectedVolume];
    const completedDays = userProfile?.completedDays || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setView('home')} className="text-slate-400 hover:text-white transition-colors">← Home</button>
            <h1 className="text-white font-semibold">Learn</h1>
            <div className="w-12" />
          </div>
          <div className="flex gap-2">
            {Object.entries(CURRICULUM).map(([key, vol]) => (
              <button
                key={key}
                onClick={() => setSelectedVolume(key)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedVolume === key
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-5 mb-4">
            <h2 className="text-xl font-bold text-white mb-1">{volume.title}</h2>
            <p className="text-slate-400 text-sm mb-2">{volume.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{volume.days} Days</span>
              <span>•</span>
              <span>{volume.lessons.filter(l => l.type === 'lesson').length} Lessons</span>
              <span>•</span>
              <span>{volume.lessons.filter(l => l.type === 'quiz').length} Quizzes</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {volume.lessons.map((lesson) => {
              const isCompleted = completedDays.includes(`${selectedVolume}-d${lesson.day}`);
              const isQuiz = lesson.type === 'quiz';
              const isCapstone = lesson.type === 'capstone';
              const isAssessment = lesson.type === 'assessment';
              
              return (
                <button
                  key={lesson.day}
                  onClick={() => startLesson(selectedVolume, lesson.day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                    isCompleted ? 'bg-green-500/20 border border-green-500/40 text-green-400' :
                    isQuiz ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30' :
                    isCapstone ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30' :
                    isAssessment ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30' :
                    'bg-slate-800/50 border border-slate-700/50 text-white hover:bg-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <span className="text-lg font-bold">{lesson.day}</span>
                  <span className="text-xs opacity-70">
                    {isCompleted ? '✓' : isQuiz ? '📝' : isCapstone ? '🎓' : isAssessment ? '🔍' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: HOME VIEW
  // ============================================================================

  const completedCount = userProfile?.completedDays?.length || 0;
  const totalLessons = Object.values(CURRICULUM).reduce((sum, v) => sum + v.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'U')}&background=f59e0b&color=0f172a`}
              alt="Profile"
              className="w-11 h-11 rounded-xl border-2 border-amber-500/50"
            />
            <div>
              <p className="text-white font-medium">{userProfile?.name || 'Fellow'}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-400">{userProfile?.xp || 0} XP</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{userProfile?.streak || 0} day streak</span>
              </div>
            </div>
          </div>
          <button onClick={handleSignOut} className="text-slate-500 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* ABA Status Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
          <ABAConsciousness size={60} state="idle" />
          <div className="flex-1">
            <h2 className="text-white font-semibold mb-1">ABA is ready to teach</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">{airStatus?.agents || 79} agents online</span>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Your Progress</h2>
            <span className="text-amber-400 font-bold text-lg">{Math.round((completedCount / totalLessons) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${(completedCount / totalLessons) * 100}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm">{completedCount} of {totalLessons} lessons completed</p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setView('learn')}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-500/25 text-lg"
        >
          Continue Learning →
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: completedCount, label: 'Completed', color: 'text-white' },
            { value: userProfile?.streak || 0, label: 'Streak', color: 'text-amber-400' },
            { value: userProfile?.xp || 0, label: 'XP', color: 'text-green-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Volume Cards */}
        <div className="space-y-3">
          <h3 className="text-slate-400 text-sm font-medium">CURRICULUM</h3>
          {Object.entries(CURRICULUM).map(([key, volume]) => {
            const volCompleted = (userProfile?.completedDays || []).filter(d => d.startsWith(key)).length;
            const volTotal = volume.lessons.length;
            
            return (
              <button
                key={key}
                onClick={() => { setSelectedVolume(key); setView('learn'); }}
                className="w-full bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 rounded-xl p-4 text-left transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{volume.title}</h4>
                    <p className="text-slate-500 text-xs">{volume.description}</p>
                  </div>
                  <span className="text-amber-400 text-sm font-medium">{volCompleted}/{volTotal}</span>
                </div>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all" style={{ width: `${(volCompleted / volTotal) * 100}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-6 py-4">
        <p className="text-center text-slate-500 text-sm">We Are All ABA.</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
