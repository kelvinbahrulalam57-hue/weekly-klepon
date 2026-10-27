import React from 'react';
import { Radio, Phone, HelpCircle, Calendar, Users, ArrowUpRight, CheckCircle2, Trophy } from 'lucide-react';
import { esportsStore } from '../services/store';

export const CommunityInfoSection: React.FC = () => {
  const contacts = esportsStore.getContacts();
  const season = esportsStore.getSeason();

  return (
    <section id="kontak" className="py-12 lg:py-16 bg-[#080c14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Official Info Channel & Consultation */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/20 rounded text-xs font-mono text-emerald-400 mb-3">
              <Radio className="w-3.5 h-3.5" />
              <span>SALURAN INFORMASI RESMI & KONSULTASI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display uppercase text-white tracking-tight mb-3">
              Saluran Informasi KLEPON FT & WhatsApp Konsultasi
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Seluruh pengumuman pertandingan, update slot FT harian, dan pembagian bagan turnamen mingguan disiarkan secara resmi melalui <strong>Saluran Informasi WhatsApp</strong>.
              WhatsApp panitia kami khusus melayani konsultasi dan tanya-jawab seputar turnamen mingguan gratis ini.
            </p>

            <div className="space-y-4">
              {/* Saluran Info WA */}
              <a
                href={contacts.infoChannelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 rounded-xl transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Saluran Resmi WhatsApp</div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {contacts.infoChannelName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded border border-emerald-500/30">
                  <span>Ikuti Saluran</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* WA Konsultasi */}
              <a
                href={contacts.consultationWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">WhatsApp Khusus Tanya-Tanya & Konsultasi</div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-mono">
                      +{contacts.adminPhone} ({contacts.adminName})
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded border border-amber-500/30">
                  <span>Chat Konsultasi</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Social Media Links: TikTok & Instagram (Configured via Admin Dashboard) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* TikTok Card */}
                <a
                  href={contacts.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      TT
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">TikTok Resmi</div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors font-mono">
                        {contacts.tiktokName || '@kleponx.official'}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>

                {/* Instagram Card */}
                <a
                  href={contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-pink-500/50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold text-xs">
                      IG
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Instagram Resmi</div>
                      <div className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors font-mono">
                        {contacts.instagramName || '@klepon_esports'}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Schedule & Group Explanation */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-7">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-2">
              <Calendar className="w-4 h-4" />
              <span>JADWAL TURNAMEN: SEMINGGU SEKALI</span>
            </div>
            <h3 className="text-lg font-bold font-display uppercase text-white mb-2">
              Bagaimana Cara Mengikuti Turnamen Mingguan?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Tidak ada pendaftaran slot manual harian via WA. Sistem kompetisi dirancang adil dan kompetitif berbasis akumulasi poin:
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">1. Daftar / Login Peserta</strong>
                  <span>Cukup masukkan Nomor WhatsApp, Nama Tim, dan Foto profil untuk identitas squad Anda.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">2. Kumpulkan Poin dari Fast Tournament</strong>
                  <span>Setiap kali menang FT di room yang dipantau panitia, screenshot chat saat admin kirim stiker <strong>DONE / CEK</strong> di GB lalu setorkan di website.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">3. Masuk 10 Besar di Akhir Minggu</strong>
                  <span>Tepat setiap Minggu malam, 10 tim dengan poin tertinggi otomatis diambil panitia.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">4. Dimasukkan ke Grup Khusus Turnamen Mingguan</strong>
                  <span>Admin langsung menghubungi nomor WhatsApp Anda untuk diundang ke grup khusus turnamen mingguan dan bertanding di sistem bagan gugur memperebutkan Rp 30.000!</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Prize: <strong className="text-amber-400">Rp 30.000</strong></span>
              <span>Reset Otomatis: <strong className="text-emerald-400">Tiap Minggu 23:59 WIB</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
