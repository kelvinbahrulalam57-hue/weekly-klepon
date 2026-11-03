import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Phone, Trophy, UserPlus, Gift, Radio, HelpCircle,
  Sparkles, Swords, Timer, Clock, Flame, AlertCircle, ChevronRight, ShieldCheck
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
    const parsed = new Date(`${endDateStr}T23:59:59`);
    if (!isNaN(parsed.getTime()) && parsed.getTime() > Date.now()) {
      targetTime = parsed;
    } else {
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
    setTimeLeft(calculateTimeRemaining(season.endDate));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(season.endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [season.endDate]);

  const scrollToLeaderboard = () => {
    const el = document.getElementById('leaderboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:py-16 border-b border-blue-900/40 bg-[#040817]">
      {/* Background Arena Image with Scrim & Cyber Blue Stadium Glow */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/klepon_hero_esports_1793070950068.jpg"
          alt="KLEPON WEEKLY TURNAMENT FREE Arena"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-[#040817]/95 to-[#040817]/80" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: HERO HEADLINE, FORMAT EXPLAINER, PRIZES, & CTAS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tournament Sub-header Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-black uppercase tracking-wider rounded-md">
                FREE FIRE CLASH SQUAD
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400 font-bold">100% Gratis</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Sistem Bagan 10 Besar</span>
              {onReplayIntro && (
                <>
                  <span className="text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={onReplayIntro}
                    className="text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer text-xs underline decoration-cyan-500/40 underline-offset-4"
                    title="Tonton Ulang Animasi Masuk Arena Turnamen"
                  >
                    Putar Ulang Animasi
                  </button>
                </>
              )}
            </div>

            {/* Main Esports Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display leading-[1.1] [text-wrap:balance]">
                KLEPON WEEKLY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                  TURNAMENT FREE
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Turnamen mingguan resmi komunitas <strong>Free Fire Clash Squad</strong> tanpa biaya pendaftaran (100% Gratis).
                Kumpulkan poin kemenangan Fast Tournament (FT), setor screenshot saat admin mengirim <strong>stiker DONE / CEK</strong> di grup GB.
                Setiap akhir pekan, <strong>10 Tim Poin Terbesar</strong> akan dimasukkan panitia ke <strong>Grup Khusus Bagan Gugur</strong> memperebutkan Total Hadiah Rp 30.000!
              </p>
            </div>

            {/* Prize Breakdown Banner */}
            <div className="bg-[#070f2a]/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>TOTAL HADIAH BAGAN MINGGUAN: {season.totalPrizePool} (100% GRATIS)</span>
                </div>
                <span className="text-slate-400 hidden sm:inline">Reset Klasemen: Setiap Minggu 23:59 WIB</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="bg-[#030617]/90 border border-amber-500/50 p-3 rounded-xl shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-full blur-md pointer-events-none" />
                  <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">JUARA 1 🏆</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">
                    {season.firstPrize}
                  </div>
                </div>
                <div className="bg-[#030617]/90 border border-slate-400/40 p-3 rounded-xl shadow-inner relative overflow-hidden group">
                  <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">JUARA 2 🥈</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">
                    {season.secondPrize}
                  </div>
                </div>
                <div className="bg-[#030617]/90 border border-amber-700/50 p-3 rounded-xl shadow-inner relative overflow-hidden group">
                  <div className="text-[11px] font-mono text-amber-500 font-bold uppercase tracking-wider">JUARA 3 🥉</div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-white mt-1">
                    {season.thirdPrize}
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary CTA: Setor Menang */}
              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-lg shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wide"
              >
                <Trophy className="w-4 h-4 fill-current" />
                <span>Setor Menang FT (Stiker DONE di GB)</span>
              </button>

              {/* CTA: Lihat Bagan 10 Besar */}
              <button
                type="button"
                onClick={scrollToLeaderboard}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-cyan-300 hover:text-white bg-[#070e28] hover:bg-[#0b1740] border border-cyan-500/40 hover:border-cyan-300 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Swords className="w-4 h-4 text-cyan-400" />
                <span>Lihat Bagan & Klasemen</span>
              </button>

              {/* CTA: Daftar / Login Peserta */}
              {!currentParticipant && (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-[#070e28]/80 hover:bg-[#0b1740] border border-blue-800/80 hover:border-cyan-400/60 rounded-xl transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>Daftar / Login Squad</span>
                </button>
              )}

              {/* CTA: Saluran Informasi KLEPON FT */}
              <a
                href={contacts.infoChannelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-blue-950/40 hover:bg-blue-900/40 border border-blue-900/60 rounded-xl transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Saluran WhatsApp</span>
              </a>

              {/* CTA: Konsultasi Panitia */}
              <a
                href={contacts.consultationWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-slate-400 hover:text-white bg-[#070e28]/60 border border-blue-900/40 rounded-xl transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Konsultasi Panitia</span>
              </a>
            </div>

            {/* 4 Tactical Specs Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-blue-900/40">
              <div className="bg-[#070e28]/70 border border-blue-900/60 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Sistem Turnamen</div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">Bagan 10 Besar</div>
              </div>
              <div className="bg-[#070e28]/70 border border-blue-900/60 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Jadwal Tanding</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-400 font-mono mt-0.5">Seminggu Sekali</div>
              </div>
              <div className="bg-[#070e28]/70 border border-blue-900/60 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Bukti Storan Sah</div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono mt-0.5">Stiker DONE di GB</div>
              </div>
              <div className="bg-[#070e28]/70 border border-blue-900/60 p-3 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Reset Klasemen</div>
                <div className="text-xs sm:text-sm font-bold text-slate-200 font-mono mt-0.5">Tiap Minggu 23:59</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CHAMPIONSHIP POSTER SHOWCASE & TACTICAL STADIUM COUNTDOWN */}
          <div className="lg:col-span-5 space-y-5">
            {/* OFFICIAL TOURNAMENT POSTER CARD */}
            <div className="rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-[#070f2c]/95 shadow-2xl backdrop-blur-md relative group">
              <div className="relative bg-black/80 p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={mainBanner.imageUrl}
                  alt={mainBanner.title}
                  className="w-full h-auto object-cover max-h-80 sm:max-h-96 rounded-xl border border-blue-900/80 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute top-5 left-5 bg-[#030617]/90 border border-cyan-400/60 px-3 py-1 rounded-md text-[10px] font-mono font-bold text-cyan-300 shadow-lg">
                  POSTER RESMI TURNAMEN
                </div>
              </div>

              {/* Poster Card Details */}
              <div className="p-4 sm:p-5 space-y-2 border-t border-blue-900/60">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold">{season.name}</span>
                  <span className="text-amber-400 font-bold">TOTAL HADIAH: {season.totalPrizePool}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black font-display uppercase text-white leading-snug">
                  {mainBanner.title}
                </h3>
                {mainBanner.caption && (
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {mainBanner.caption}
                  </p>
                )}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold">✓ 100% Gratis</span>
                  <span>·</span>
                  <span>Ambil Top 10 Poin Terbesar</span>
                  <span>·</span>
                  <span>Storan Stiker DONE di GB</span>
                </div>
              </div>
            </div>

            {/* STADIUM TACTICAL LED COUNTDOWN CLOCK */}
            <div className="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-r from-[#071333] via-[#050b24] to-[#0a183d] p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3.5">
                {/* Header with live indicator */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-sm">
                      <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black font-display uppercase tracking-wide text-white">
                        Hitung Mundur Batas Kualifikasi
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Penentuan Top 10 · Minggu ({timeLeft.targetDateLabel}), 23:59:59 WIB
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-300 font-bold">
                    Minggu Ke-{season.weekNumber || 1}
                  </div>
                </div>

                {/* Countdown Digits Grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {/* HARI */}
                  <div className="bg-[#030617]/95 border border-cyan-500/30 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Hari
                    </div>
                  </div>

                  {/* JAM */}
                  <div className="bg-[#030617]/95 border border-cyan-500/30 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Jam
                    </div>
                  </div>

                  {/* MENIT */}
                  <div className="bg-[#030617]/95 border border-cyan-500/30 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Menit
                    </div>
                  </div>

                  {/* DETIK */}
                  <div className="bg-[#030617]/95 border border-cyan-500/30 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest mt-0.5">
                      Detik
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  {timeLeft.isExpired ? (
                    <div className="flex items-center gap-1.5 text-rose-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Kualifikasi minggu ini selesai. Sedang difinalisasi!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Setor stiker DONE admin sebelum waktu habis!</span>
                    </div>
                  )}
                  <span className="text-cyan-400 font-bold px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-500/40">
                    10 Slot Bagan
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
