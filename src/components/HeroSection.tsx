import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Phone, Trophy, UserPlus, Gift, Radio, HelpCircle,
  Sparkles, Swords, Timer, Clock, Flame, AlertCircle
} from 'lucide-react';
import { esportsStore } from '../services/store';

interface HeroSectionProps {
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
  onReplayIntro?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  targetDateLabel: string;
}

const calculateTimeRemaining = (endDateStr?: string): TimeLeft => {
  let targetTime: Date;

  if (endDateStr) {
    // Standard ISO/date string YYYY-MM-DD
    const parsed = new Date(`${endDateStr}T23:59:59`);
    if (!isNaN(parsed.getTime()) && parsed.getTime() > Date.now()) {
      targetTime = parsed;
    } else {
      // If already passed or invalid, find upcoming Sunday 23:59:59
      const now = new Date();
      const day = now.getDay();
      const diffToSunday = day === 0 ? 0 : 7 - day;
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + diffToSunday);
      nextSunday.setHours(23, 59, 59, 999);
      targetTime = nextSunday;
    }
  } else {
    const now = new Date();
    const day = now.getDay();
    const diffToSunday = day === 0 ? 0 : 7 - day;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + diffToSunday);
    nextSunday.setHours(23, 59, 59, 999);
    targetTime = nextSunday;
  }

  const diffMs = targetTime.getTime() - Date.now();
  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      targetDateLabel: targetTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }),
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    targetDateLabel: targetTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }),
  };
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenReportModal,
  onOpenAuthModal,
  onReplayIntro,
}) => {
  const contacts = esportsStore.getContacts();
  const season = esportsStore.getSeason();
  const currentParticipant = esportsStore.getCurrentParticipant();
  const mainBanner = esportsStore.getMainBanner();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeRemaining(season.endDate));

  useEffect(() => {
    // Initial calculate
    setTimeLeft(calculateTimeRemaining(season.endDate));

    // Update every 1 second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(season.endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [season.endDate]);

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:py-18 border-b border-blue-900/40 bg-[#040817]">
      {/* Background Arena Image with Scrim and Cyber Blue Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/klepon_hero_esports_1793070950068.jpg"
          alt="KLEPON WEEKLY TURNAMENT FREE Arena"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-[#040817]/95 to-[#040817]/85" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 animate-fade-in-up">
        <div className="max-w-3xl">
          {/* Free Entry & Weekly Badge & Replay Intro */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-950/80 border border-cyan-500/40 rounded-full text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold tracking-wide">TURNAMEN MINGGUAN SISTEM BAGAN 10 BESAR</span>
              <span className="text-blue-500">·</span>
              <span className="text-amber-400 font-bold">100% GRATIS</span>
            </div>

            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-full text-xs font-mono transition-all cursor-pointer shadow-sm group"
                title="Tonton Ulang Animasi Masuk Arena Turnamen"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Putar Ulang Animasi Masuk</span>
              </button>
            )}
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display leading-tight mb-4 [text-wrap:balance]">
            KLEPON WEEKLY <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 drop-shadow-sm">
              TURNAMENT FREE
            </span>
          </h1>

          {/* BANNER DI POSISIKAN LANGSUNG DI BAWAH TULISAN WEEKLY */}
          <div className="mb-6 rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#070f2c]/90 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 items-center">
              <div className="sm:col-span-5 bg-black/60 p-2 sm:p-3 flex items-center justify-center relative overflow-hidden">
                <img
                  src={mainBanner.imageUrl}
                  alt={mainBanner.title}
                  className="w-full h-auto object-cover max-h-56 sm:max-h-64 rounded-xl border border-blue-900/60 shadow-lg"
                />
                <span className="absolute top-4 left-4 bg-cyan-400 text-slate-950 text-[10px] font-mono font-black px-2.5 py-0.5 rounded shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>POSTER AKTIF</span>
                </span>
              </div>
              <div className="sm:col-span-7 p-4 sm:p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 font-bold">
                  <span>{season.name}</span>
                  <span>·</span>
                  <span className="text-amber-400">TOTAL HADIAH: {season.totalPrizePool}</span>
                </div>
                <h3 className="text-base sm:text-xl font-black font-display uppercase text-white leading-snug">
                  {mainBanner.title}
                </h3>
                {mainBanner.caption && (
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {mainBanner.caption}
                  </p>
                )}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold">✓ 100% Gratis</span>
                  <span>·</span>
                  <span>Ambil Top 10 Poin Terbesar</span>
                  <span>·</span>
                  <span>Storan Stiker DONE di GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* HITUNG MUNDUR BATAS PENDAFTARAN & KUALIFIKASI MINGGUAN */}
          <div className="mb-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-[#071333] via-[#050b24] to-[#0a183d] p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Background cyber accent glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3.5">
              {/* Header with live indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-sm">
                    <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black font-display uppercase tracking-wide text-white flex items-center gap-2">
                      <span>Batas Akhir Pendaftaran & Kualifikasi</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                        LIVE COUNTDOWN
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Penentuan Top 10 Poin Terbesar · Ditutup Minggu ({timeLeft.targetDateLabel}), 23:59:59 WIB
                    </p>
                  </div>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/80 text-[11px] font-mono text-cyan-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Minggu Ke-{season.weekNumber || 1}</span>
                </div>
              </div>

              {/* Countdown Digits Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3.5 text-center">
                {/* HARI */}
                <div className="bg-[#030617]/90 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-2.5 sm:p-3 shadow-inner transition-colors">
                  <div className="text-2xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Hari
                  </div>
                </div>

                {/* JAM */}
                <div className="bg-[#030617]/90 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-2.5 sm:p-3 shadow-inner transition-colors">
                  <div className="text-2xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Jam
                  </div>
                </div>

                {/* MENIT */}
                <div className="bg-[#030617]/90 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-2.5 sm:p-3 shadow-inner transition-colors">
                  <div className="text-2xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Menit
                  </div>
                </div>

                {/* DETIK */}
                <div className="bg-[#030617]/90 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-2.5 sm:p-3 shadow-inner transition-colors">
                  <div className="text-2xl sm:text-4xl font-black font-mono text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-300/80 uppercase tracking-widest mt-0.5">
                    Detik
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                {timeLeft.isExpired ? (
                  <div className="flex items-center gap-1.5 text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Kualifikasi minggu ini telah selesai. Klasemen sedang difinalisasi untuk bagan gugur 10 besar!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Kumpulkan poin kemenangan FT & setor stiker DONE admin sebelum waktu berakhir!</span>
                  </div>
                )}
                <span className="text-cyan-400 font-bold hidden sm:inline">10 Tiket Tersedia</span>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-2xl font-normal">
            Turnamen gratis mingguan khusus <strong>Free Fire Clash Squad</strong>.
            Kumpulkan poin dari kemenangan Fast Tournament (FT), setor bukti screenshot chat saat admin mengirim <strong>stiker DONE / CEK</strong> di GB.
            Di akhir minggu, <strong>10 Tim Poin Terbesar</strong> akan dimasukkan panitia ke <strong>Grup Khusus Turnamen Mingguan</strong> untuk bertanding di bagan gugur memperebutkan Total Hadiah Rp 30.000!
          </p>

          {/* Prize Breakdown Banner */}
          <div className="bg-[#070f2a]/90 border border-cyan-500/30 rounded-xl p-4 sm:p-5 mb-8 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>TOTAL HADIAH BAGAN MINGGUAN: {season.totalPrizePool} (100% GRATIS)</span>
              </div>
              <span className="text-slate-400 hidden sm:inline">Reset Klasemen: Setiap Minggu 23:59 WIB</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-[#030617]/90 border border-amber-500/40 p-2.5 sm:p-3 rounded-lg shadow-inner">
                <div className="text-[11px] font-mono text-amber-400 font-bold">JUARA 1 🏆</div>
                <div className="text-lg sm:text-2xl font-black font-mono text-white mt-0.5">
                  {season.firstPrize}
                </div>
              </div>
              <div className="bg-[#030617]/90 border border-blue-500/30 p-2.5 sm:p-3 rounded-lg shadow-inner">
                <div className="text-[11px] font-mono text-slate-300 font-bold">JUARA 2 🥈</div>
                <div className="text-lg sm:text-2xl font-black font-mono text-white mt-0.5">
                  {season.secondPrize}
                </div>
              </div>
              <div className="bg-[#030617]/90 border border-amber-700/40 p-2.5 sm:p-3 rounded-lg shadow-inner">
                <div className="text-[11px] font-mono text-amber-500 font-bold">JUARA 3 🥉</div>
                <div className="text-lg sm:text-2xl font-black font-mono text-white mt-0.5">
                  {season.thirdPrize}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            {/* Primary CTA: Setor Menang */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>Setor Menang FT (Foto Stiker DONE di GB)</span>
            </button>

            {/* CTA 2: Daftar / Login Peserta */}
            {!currentParticipant && (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#070e28] hover:bg-[#0b1740] border border-blue-800/80 hover:border-cyan-400/60 rounded-lg transition-all cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Daftar / Login Peserta</span>
              </button>
            )}

            {/* CTA 3: Saluran Informasi KLEPON FT */}
            <a
              href={contacts.infoChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-cyan-300 hover:text-white bg-blue-950/40 hover:bg-blue-900/40 border border-cyan-500/30 rounded-lg transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Saluran Informasi KLEPON FT</span>
            </a>

            {/* CTA 4: Konsultasi & Tanya-Tanya WA */}
            <a
              href={contacts.consultationWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-[#070e28]/70 border border-blue-900/60 rounded-lg transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Konsultasi Turnamen via WhatsApp</span>
            </a>
          </div>

          {/* 4 Pillars Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-900/40">
            <div className="bg-[#070e28]/60 border border-blue-900/60 p-3 rounded-lg">
              <div className="text-[11px] text-slate-400 mb-0.5">Sistem Turnamen</div>
              <div className="text-sm font-bold text-white font-mono">Bagan 10 Besar</div>
            </div>
            <div className="bg-[#070e28]/60 border border-blue-900/60 p-3 rounded-lg">
              <div className="text-[11px] text-slate-400 mb-0.5">Jadwal Tanding</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">Seminggu Sekali</div>
            </div>
            <div className="bg-[#070e28]/60 border border-blue-900/60 p-3 rounded-lg">
              <div className="text-[11px] text-slate-400 mb-0.5">Bukti Storan Sah</div>
              <div className="text-sm font-bold text-amber-300 font-mono">Stiker DONE di GB</div>
            </div>
            <div className="bg-[#070e28]/60 border border-blue-900/60 p-3 rounded-lg">
              <div className="text-[11px] text-slate-400 mb-0.5">Reset Klasemen</div>
              <div className="text-sm font-bold text-slate-200 font-mono">Otomatis Tiap Minggu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
