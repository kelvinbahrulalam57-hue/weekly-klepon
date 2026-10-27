import React, { useState, useEffect } from 'react';
import { X, Trophy, Gift, ArrowRight, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { esportsStore } from '../services/store';

interface MainPosterModalProps {
  onOpenAuth: () => void;
  onOpenReportModal: () => void;
}

export const MainPosterModal: React.FC<MainPosterModalProps> = ({ onOpenAuth, onOpenReportModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const mainBanner = esportsStore.getMainBanner();
  const season = esportsStore.getSeason();
  const currentParticipant = esportsStore.getCurrentParticipant();

  useEffect(() => {
    // Show banner modal when player enters website (after slight delay for smooth intro)
    const dismissedSession = sessionStorage.getItem('klepon_banner_dismissed');
    if (!dismissedSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false);
    if (dontShowAgain) {
      sessionStorage.setItem('klepon_banner_dismissed', 'true');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-xs">
        {/* Close Button */}
        <button
          onClick={() => handleClose(false)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
          title="Tutup Banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Poster Image Container */}
        <div className="relative bg-black flex items-center justify-center max-h-[55vh] sm:max-h-[60vh] overflow-hidden">
          <img
            src={mainBanner.imageUrl}
            alt={mainBanner.title}
            className="w-full h-auto object-contain max-h-[55vh] sm:max-h-[60vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
          
          {/* Badge over poster */}
          <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>POSTER RESMI TURNAMEN MINGGUAN</span>
          </div>
        </div>

        {/* Content details under poster */}
        <div className="p-4 sm:p-5 pt-3 space-y-3 bg-slate-900">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
              <span>{season.name}</span>
              <span>·</span>
              <span className="text-amber-400">TOTAL HADIAH: {season.totalPrizePool}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black font-display uppercase text-white mt-0.5 leading-snug">
              {mainBanner.title}
            </h3>
            {mainBanner.caption && (
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {mainBanner.caption}
              </p>
            )}
          </div>

          {/* Quick Prize Preview Pill */}
          <div className="grid grid-cols-3 gap-2 text-center py-2 px-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] text-amber-400 font-mono block">JUARA 1</span>
              <span className="font-bold text-white font-mono text-xs sm:text-sm">{season.firstPrize}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-300 font-mono block">JUARA 2</span>
              <span className="font-bold text-white font-mono text-xs sm:text-sm">{season.secondPrize}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-600 font-mono block">JUARA 3</span>
              <span className="font-bold text-white font-mono text-xs sm:text-sm">{season.thirdPrize}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
            {!currentParticipant ? (
              <button
                onClick={() => {
                  handleClose(true);
                  onOpenAuth();
                }}
                className="w-full sm:flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs"
              >
                <span>Daftar Peserta Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleClose(true);
                  onOpenReportModal();
                }}
                className="w-full sm:flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs"
              >
                <Trophy className="w-3.5 h-3.5 fill-current" />
                <span>Setor Kemenangan (+1 Poin)</span>
              </button>
            )}

            <button
              onClick={() => handleClose(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold text-xs cursor-pointer"
            >
              Masuk ke Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
