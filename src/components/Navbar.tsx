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
    <header className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
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
            <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-slate-950 font-display text-lg tracking-wider shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-wider text-white font-display uppercase block leading-none">
                KLEPON WEEKLY TURNAMENT FREE
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider">
                FREE FIRE CLASH SQUAD · {season.name}
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        {currentView === 'portal' ? (
          <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium text-slate-300">
            <a href="#galeri-poster" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-emerald-400" />
              Poster & Pamflet
            </a>
            <a href="#leaderboard" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Klasemen Top 10
            </a>
            <button
              onClick={onOpenReportModal}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left font-semibold text-emerald-300"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              Setor Menang FT (+1)
            </button>
            <a href="#anti-fraud" className="hover:text-rose-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Edukasi Anti-Palsu
            </a>
            <a href="#kontak" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Saluran Info & Konsultasi
            </a>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PANEL ADMIN · VERIFIKASI STIKER DONE & BAGAN 10 BESAR</span>
          </div>
        )}

        {/* Zone 3: Primary Action - Participant Registration / Login */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'admin' ? (
            <button
              onClick={() => onNavigate('portal')}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-all whitespace-nowrap shrink-0 shadow-lg cursor-pointer"
            >
              Kembali ke Portal Pemain
            </button>
          ) : currentParticipant ? (
            <div className="flex items-center gap-2">
              {/* Riwayat Storan Button with Under Review indicator */}
              <button
                onClick={onOpenHistoryModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-lg text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
                title="Lihat status verifikasi storan kemenangan Anda"
              >
                <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Riwayat Storan</span>
                <span className="font-mono text-emerald-400 font-bold">({userReports.length})</span>
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
                className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-lg p-1.5 pr-3 cursor-pointer transition-colors"
                title="Klik untuk membuka Riwayat Storan & Poin"
              >
                <img
                  src={currentParticipant.photoUrl}
                  alt={currentParticipant.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentParticipant.name}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
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
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-md shadow-emerald-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
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
