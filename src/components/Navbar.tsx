import React from 'react';
import { ShieldAlert, Trophy, Swords, Send, PhoneCall, User, LogOut, Clock, ListFilter } from 'lucide-react';
import { esportsStore } from '../services/store';

interface NavbarProps {
  currentView: 'portal' | 'admin';
  onNavigate: (view: 'portal' | 'admin') => void;
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
  onOpenHistoryModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenReportModal,
  onOpenAuthModal,
  onOpenHistoryModal,
}) => {
  const currentParticipant = esportsStore.getCurrentParticipant();
  const season = esportsStore.getSeason();
  const userReports = currentParticipant ? esportsStore.getUserWinReports(currentParticipant.phone) : [];
  const pendingCount = userReports.filter((r) => r.status === 'PENDING').length;

  return (
    <header className="sticky top-0 z-50 bg-[#04081c]/95 backdrop-blur-md border-b border-blue-900/50 px-4 lg:px-8 py-3.5 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#hero"
            onClick={(e) => {
              if (currentView === 'admin') {
                e.preventDefault();
                onNavigate('portal');
              }
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-slate-950 font-display text-lg tracking-wider shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-400/30">
              K
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-wider text-white font-display uppercase block leading-none">
                KLEPON <span className="text-cyan-400">WEEKLY TURNAMENT</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 tracking-wider">
                FREE FIRE CLASH SQUAD · {season.name}
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        {currentView === 'portal' ? (
          <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium text-slate-300">
            <a href="#galeri-poster" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-cyan-400" />
              Poster Turnamen
            </a>
            <a href="#leaderboard" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Klasemen Top 10
            </a>
            <button
              onClick={onOpenReportModal}
              className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left font-semibold text-cyan-400"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              Setor Menang FT (+1)
            </button>
            <a href="#anti-fraud" className="hover:text-rose-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Edukasi Anti-Palsu
            </a>
            <a href="#kontak" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-blue-400" />
              Saluran Info & Konsultasi
            </a>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>INTERNAL DASHBOARD · PENGATURAN KONTROL PENUH</span>
          </div>
        )}

        {/* Zone 3: Primary Action - Participant Registration / Login */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'admin' ? (
            <button
              onClick={() => onNavigate('portal')}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-lg cursor-pointer"
            >
              Kembali ke Portal
            </button>
          ) : currentParticipant ? (
            <div className="flex items-center gap-2">
              {/* Riwayat Storan Button with Under Review indicator */}
              <button
                onClick={onOpenHistoryModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#070e28] hover:bg-[#0b1740] border border-blue-800/80 hover:border-cyan-400/50 rounded-lg text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
                title="Lihat status verifikasi storan kemenangan Anda"
              >
                <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Riwayat Storan</span>
                <span className="font-mono text-cyan-400 font-bold">({userReports.length})</span>
                {pendingCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-500/50 animate-pulse">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    <span>{pendingCount} Review</span>
                  </span>
                )}
              </button>

              {/* Participant Profile Pill */}
              <div
                onClick={onOpenHistoryModal}
                className="flex items-center gap-2.5 bg-[#070e28] border border-blue-900/60 hover:border-cyan-400/50 rounded-lg p-1.5 pr-3 cursor-pointer transition-colors"
                title="Klik untuk membuka Riwayat Storan & Poin"
              >
                <img
                  src={currentParticipant.photoUrl}
                  alt={currentParticipant.name}
                  className="w-7 h-7 rounded-full object-cover border border-cyan-400/60"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentParticipant.name}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">
                    {currentParticipant.points} Pts · {currentParticipant.wins} Win
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    esportsStore.logoutParticipant();
                  }}
                  title="Keluar Akun Peserta"
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-md shadow-cyan-500/25 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 fill-current" />
              <span>Daftar / Login Peserta</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
