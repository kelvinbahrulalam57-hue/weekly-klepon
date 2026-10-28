import React, { useState } from 'react';
import { Phone, Radio } from 'lucide-react';
import { esportsStore } from '../services/store';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const contacts = esportsStore.getContacts();
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    const next = clickCount + 1;
    if (next >= 5) {
      setClickCount(0);
      onOpenAdmin();
    } else {
      setClickCount(next);
      // Reset counter after 3 seconds of inactivity
      setTimeout(() => setClickCount(0), 3000);
    }
  };

  return (
    <footer className="bg-[#030615] border-t border-blue-900/40 text-slate-400 py-10 px-4 lg:px-8 text-xs relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-wider text-white font-display uppercase">
              KLEPON <span className="text-cyan-400">WEEKLY TURNAMENT FREE</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-amber-400 font-bold">BAGAN 10 BESAR MINGGUAN</span>
          </div>
          <p className="text-slate-400 max-w-md text-center md:text-left leading-relaxed">
            Platform turnamen mingguan 100% gratis khusus Free Fire Clash Squad. Sistem kualifikasi poin dari stiker DONE di GB, seleksi Top 10 ke bagan gugur, dan perebutan total hadiah Rp 30.000 setiap minggu.
          </p>
        </div>

        {/* Socials & Official Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href={contacts.infoChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
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

        {/* Copyright & Stealth Hidden Admin Access */}
        <div className="flex flex-col items-center md:items-end gap-1 text-slate-500 font-mono text-[11px]">
          <div
            onClick={handleSecretClick}
            className="cursor-default select-none transition-colors hover:text-slate-400"
            title="KLEPON WEEKLY TURNAMENT FREE"
          >
            © 2026 KLEPON WEEKLY TURNAMENT FREE. ALL RIGHTS RESERVED.
          </div>
          <div className="text-[10px] text-slate-600">
            Free Fire Clash Squad Esports Platform
          </div>
        </div>
      </div>
    </footer>
  );
};
