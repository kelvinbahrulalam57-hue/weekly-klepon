import React from 'react';
import { Radio, Phone, ArrowUpRight } from 'lucide-react';
import { esportsStore } from '../services/store';

export const FloatingWhatsAppBar: React.FC = () => {
  const contacts = esportsStore.getContacts();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Saluran Info Bubble */}
      <a
        href={contacts.infoChannelLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#070f2c]/95 hover:bg-[#0a153c] text-slate-200 border border-blue-800/80 hover:border-cyan-400/60 shadow-xl px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md transition-all transform hover:-translate-y-0.5"
        title="Ikuti Saluran Informasi Resmi KLEPON FT"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span className="hidden sm:inline">Saluran Informasi KLEPON FT</span>
        <Radio className="w-4 h-4 text-cyan-400" />
      </a>

      {/* WA Konsultasi Button */}
      <a
        href={contacts.consultationWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-lg shadow-cyan-500/30 text-xs transition-all transform hover:scale-105"
        title="WhatsApp Konsultasi Turnamen Mingguan"
      >
        <Phone className="w-4 h-4 fill-current" />
        <span>Konsultasi Turnamen WA</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
