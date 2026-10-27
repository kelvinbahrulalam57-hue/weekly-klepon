import React from 'react';
import { MessageCircle, Phone, Trophy, UserPlus, Gift, Radio, HelpCircle } from 'lucide-react';
import { esportsStore } from '../services/store';

interface HeroSectionProps {
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenReportModal,
  onOpenAuthModal,
}) => {
  const contacts = esportsStore.getContacts();
  const season = esportsStore.getSeason();
  const currentParticipant = esportsStore.getCurrentParticipant();

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:py-18 border-b border-slate-800/80">
      {/* Background Arena Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/klepon_hero_esports_1793070950068.jpg"
          alt="KLEPON WEEKLY TURNAMENT FREE Arena"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/90 to-[#080c14]/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          {/* Free Entry & Weekly Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/70 border border-amber-500/40 rounded text-xs font-mono text-amber-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold">TURNAMEN MINGGUAN SISTEM BAGAN 10 BESAR</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-bold">100% GRATIS</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display leading-tight mb-4 [text-wrap:balance]">
            KLEPON WEEKLY <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              TURNAMENT FREE
            </span>
          </h1>

          {/* BANNER DI POSISIKAN LANGSUNG DI BAWAH TULISAN WEEKLY */}
          <div className="mb-6 rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-900/90 shadow-2xl backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 items-center">
              <div className="sm:col-span-5 bg-black p-2 sm:p-3 flex items-center justify-center relative overflow-hidden">
                <img
                  src={esportsStore.getMainBanner().imageUrl}
                  alt={esportsStore.getMainBanner().title}
                  className="w-full h-auto object-cover max-h-56 sm:max-h-64 rounded-xl border border-slate-800 shadow-lg"
                />
                <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded shadow uppercase">
                  POSTER RESMI AKTIF
                </span>
              </div>
              <div className="sm:col-span-7 p-4 sm:p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 font-bold">
                  <span>{season.name}</span>
                  <span>·</span>
                  <span className="text-amber-400">TOTAL HADIAH: {season.totalPrizePool}</span>
                </div>
                <h3 className="text-base sm:text-xl font-black font-display uppercase text-white leading-snug">
                  {esportsStore.getMainBanner().title}
                </h3>
                {esportsStore.getMainBanner().caption && (
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {esportsStore.getMainBanner().caption}
                  </p>
                )}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">✓ 100% Gratis</span>
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
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 sm:p-5 mb-8 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>TOTAL HADIAH BAGAN MINGGUAN: {season.totalPrizePool} (100% GRATIS)</span>
              </div>
              <span className="text-slate-400 hidden sm:inline">Reset Klasemen: Setiap Minggu 23:59 WIB</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-slate-950/70 border border-amber-500/30 p-2.5 sm:p-3 rounded-lg">
                <div className="text-[11px] font-mono text-amber-400 font-bold">JUARA 1 🏆</div>
                <div className="text-lg sm:text-2xl font-black font-mono text-white mt-0.5">
                  {season.firstPrize}
                </div>
              </div>
              <div className="bg-slate-950/70 border border-slate-700/60 p-2.5 sm:p-3 rounded-lg">
                <div className="text-[11px] font-mono text-slate-300 font-bold">JUARA 2 🥈</div>
                <div className="text-lg sm:text-2xl font-black font-mono text-white mt-0.5">
                  {season.secondPrize}
                </div>
              </div>
              <div className="bg-slate-950/70 border border-amber-700/40 p-2.5 sm:p-3 rounded-lg">
                <div className="text-[11px] font-mono text-amber-600 font-bold">JUARA 3 🥉</div>
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
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>Setor Menang FT (Foto Stiker DONE di GB)</span>
            </button>

            {/* CTA 2: Daftar / Login Peserta */}
            {!currentParticipant && (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 rounded transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Daftar / Login Peserta</span>
              </button>
            )}

            {/* CTA 3: Saluran Informasi KLEPON FT */}
            <a
              href={contacts.infoChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Saluran Informasi KLEPON FT</span>
            </a>

            {/* CTA 4: Konsultasi & Tanya-Tanya WA */}
            <a
              href={contacts.consultationWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 rounded transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Konsultasi Turnamen via WhatsApp</span>
            </a>
          </div>

          {/* 4 Pillars Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded">
              <div className="text-[11px] text-slate-400 mb-0.5">Sistem Turnamen</div>
              <div className="text-sm font-bold text-white font-mono">Bagan 10 Besar</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded">
              <div className="text-[11px] text-slate-400 mb-0.5">Jadwal Tanding</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">Seminggu Sekali</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded">
              <div className="text-[11px] text-slate-400 mb-0.5">Bukti Storan Sah</div>
              <div className="text-sm font-bold text-amber-300 font-mono">Stiker DONE di GB</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded">
              <div className="text-[11px] text-slate-400 mb-0.5">Reset Klasemen</div>
              <div className="text-sm font-bold text-slate-200 font-mono">Otomatis Tiap Minggu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
