import React from 'react';
import {
  MessageCircle, Phone, Trophy, UserPlus, Gift, Radio, HelpCircle,
  Sparkles, Swords
} from 'lucide-react';
import { esportsStore } from '../services/store';

interface HeroSectionProps {
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
  onReplayIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenReportModal,
  onOpenAuthModal,
  onReplayIntro,
}) => {
  const contacts = esportsStore.getContacts();
  const season = esportsStore.getSeason();
  const currentParticipant = esportsStore.getCurrentParticipant();
  const mainBanner = esportsStore.getMainBanner();

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
