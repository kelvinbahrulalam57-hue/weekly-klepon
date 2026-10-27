import React from 'react';
import { Phone, Radio, Lock } from 'lucide-react';
import { esportsStore } from '../services/store';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const contacts = esportsStore.getContacts();

  return (
    <footer className="bg-[#05080e] border-t border-slate-800 text-slate-400 py-10 px-4 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-wider text-white font-display uppercase">
              KLEPON <span className="text-emerald-400">WEEKLY TURNAMENT FREE</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-amber-400 font-bold">BAGAN 10 BESAR MINGGUAN</span>
          </div>
          <p className="text-slate-500 max-w-md text-center md:text-left">
            Platform turnamen mingguan 100% gratis khusus Free Fire Clash Squad. Sistem kualifikasi poin dari stiker DONE di GB, seleksi Top 10 ke bagan gugur, dan perebutan total hadiah Rp 30.000 setiap minggu.
          </p>
        </div>

        {/* Socials & Official Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href={contacts.infoChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Saluran Informasi KLEPON FT</span>
          </a>
          <a
            href={contacts.consultationWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>WA Konsultasi Turnamen</span>
          </a>
          <a
            href={contacts.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            IG: <strong className="text-slate-200">{contacts.instagramName || '@klepon_esports'}</strong>
          </a>
          <a
            href={contacts.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            TikTok: <strong className="text-slate-200">{contacts.tiktokName || '@kleponx.official'}</strong>
          </a>
        </div>

        {/* Copyright & Discreet Hidden Panitia Access */}
        <div className="flex flex-col items-center md:items-end gap-1.5 text-slate-600 font-mono text-[11px]">
          <div>© 2026 KLEPON WEEKLY TURNAMENT FREE. ALL RIGHTS RESERVED.</div>
          <button
            onClick={onOpenAdmin}
            className="text-slate-700 hover:text-slate-500 flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
            title="Akses Panitia"
          >
            <Lock className="w-3 h-3 text-slate-700 hover:text-slate-400" />
            <span>Akses Panitia</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
