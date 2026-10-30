import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Zap, Shield, Sparkles, Volume2, VolumeX, FastForward, CheckCircle2 } from 'lucide-react';
import { esportsStore } from '../services/store';

interface IntroSplashAnimationProps {
  onComplete: () => void;
}

export const IntroSplashAnimation: React.FC<IntroSplashAnimationProps> = ({ onComplete }) => {
  const customLogo = esportsStore.getCustomLogo();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('MEMULAI PROTOKOL ARENA...');
  const [isExiting, setIsExiting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle high-tech futuristic sci-fi sound using Web Audio API
  const playTechBeep = (freq = 880, duration = 0.08, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleFinish = () => {
    setIsExiting(true);
    playTechBeep(1200, 0.25, 'triangle');
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  useEffect(() => {
    // Play initial intro tone
    playTechBeep(520, 0.15, 'sine');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const bounded = next > 100 ? 100 : next;

        // Update tactical status
        if (bounded < 30) {
          setStatusText('CONNECTING TO FREE FIRE TOURNAMENT SERVER...');
        } else if (bounded < 65) {
          setStatusText('SYNCHRONIZING TOP 10 KLASEMEN & STIKER DONE...');
        } else if (bounded < 90) {
          setStatusText('MEMUAT ARENA FAST TOURNAMENT RESMI...');
        } else {
          setStatusText('AKSES DIBERIKAN · SELAMAT DATANG DI KLEPON FT!');
        }

        if (bounded % 25 === 0 || bounded === 100) {
          playTechBeep(700 + bounded * 4, 0.05, 'sine');
        }

        return bounded;
      });
    }, 65);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        handleFinish();
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [progress]);

  // Handle ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#020512] flex flex-col items-center justify-center p-4 select-none transition-all duration-700 overflow-hidden ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Cyber Mesh & Rays */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/25 via-cyan-950/15 to-transparent pointer-events-none" />

      {/* Floating Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Top Controls: Sound toggle & Skip Button */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-blue-900/60 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer backdrop-blur"
          title={soundEnabled ? 'Matikan Suara SFX' : 'Nyalakan Suara SFX'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          <span className="hidden sm:inline">{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
        </button>

        <button
          type="button"
          onClick={handleFinish}
          className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/10 backdrop-blur"
        >
          <span>Lewati Intro</span>
          <FastForward className="w-3.5 h-3.5" />
          <span className="text-[10px] text-cyan-400/70 hidden sm:inline">[ESC]</span>
        </button>
      </div>

      {/* Center Cinematic Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Rotating Futuristic Cyber Rings */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
          {/* Outer dashed spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-[spin_8s_linear_infinite]" />
          {/* Inner reverse spinning ring */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-blue-500/30 animate-[spin_6s_linear_infinite_reverse]" />
          {/* Glowing Hexagonal Shield Core */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.45)] border border-cyan-300/60 transform rotate-45 transition-transform hover:scale-105 overflow-hidden">
            <div className="transform -rotate-45 flex flex-col items-center justify-center text-white">
              {customLogo ? (
                <img
                  src={customLogo}
                  alt="Logo Turnamen"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shadow-lg border border-white/40"
                />
              ) : (
                <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-cyan-100" />
              )}
            </div>
            {/* Pulsing Core Light */}
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 animate-ping pointer-events-none" />
          </div>

          {/* Tactical Corner Markers */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        </div>

        {/* Brand & Title */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>OFFICIAL ESPORTS ARENA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 uppercase mt-2">
            KLEPON X ESPORTS
          </h1>
          <p className="text-xs sm:text-sm text-cyan-300/80 font-mono tracking-wider uppercase">
            Fast Tournament · Klasemen Poin Kualifikasi Top 10
          </p>
        </div>

        {/* Tactical Progress Meter */}
        <div className="w-full bg-[#050a20] border border-blue-900/80 rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider">{statusText}</span>
            </span>
            <span className="text-cyan-400 font-black text-sm tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-blue-900/80">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 rounded-full transition-all duration-150 relative shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight glimmer */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Bottom Security / System Details */}
          <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500 border-t border-blue-950 pt-2.5">
            <div className="flex items-center gap-1.5 text-cyan-400/80">
              <Shield className="w-3 h-3" />
              <span>ANTI-CHEAT STIKER DONE V3.2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>REALTIME CLOUD SYNC ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Enter Prompt when Ready */}
        {progress >= 100 && (
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Sistem Siap · Membuka Arena...</span>
          </div>
        )}
      </div>

      {/* Bottom Legal / Version Watermark */}
      <div className="absolute bottom-4 text-center text-[10px] font-mono text-slate-600">
        KLEPON X ESPORTS SC · SISTEM TURNAMEN RESMI FREE FIRE
      </div>
    </div>
  );
};
