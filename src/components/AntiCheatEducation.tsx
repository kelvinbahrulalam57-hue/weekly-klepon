import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, Ban, MessageSquare } from 'lucide-react';
import { esportsStore } from '../services/store';

export const AntiCheatEducation: React.FC = () => {
  const [simulatorMode, setSimulatorMode] = useState<'real' | 'fake'>('fake');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1);
  const blacklist = esportsStore.getBlacklist();

  const fakeInspectionPoints = [
    {
      id: 1,
      title: 'Stiker DONE / CEK Hasil Copas Turnamen Lain',
      desc: 'Pelaku mengambil screenshot chat admin yang mengirimkan stiker DONE dari turnamen luar atau event lama, padahal admin tidak pernah mengirim stiker di jam tersebut.',
      verdict: 'TIDAK LOLOS: Panitia mencocokkan langsung dengan log chat asli admin di grup GB!',
    },
    {
      id: 2,
      title: 'Editan Inspect Element WhatsApp Web',
      desc: 'Screenshot diedit menggunakan inspect element atau aplikasi pembuat chat palsu untuk memalsukan nama pengirim stiker DONE.',
      verdict: 'TIDAK LOLOS: Artefak kompresi font dan bubble chat WhatsApp editan langsung terdeteksi!',
    },
    {
      id: 3,
      title: 'Jam Pengiriman Stiker Dipotong (Crop)',
      desc: 'Screenshot sengaja dipotong agar jam chat admin tidak terlihat, guna menyembunyikan waktu tanding palsu.',
      verdict: 'TIDAK LOLOS: Wajib screenshot layar penuh chat GB yang memuat waktu kirim stiker secara utuh!',
    },
    {
      id: 4,
      title: 'Nomor WhatsApp Storan Berbeda',
      desc: 'Storan diajukan oleh nomor WhatsApp yang tidak terdaftar saat kualifikasi.',
      verdict: 'TIDAK LOLOS: Nomor WA harus sesuai dengan akun peserta terdaftar.',
    },
  ];

  return (
    <section id="anti-fraud" className="py-12 lg:py-16 bg-[#080c14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Urgent Warning Header Banner */}
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border border-rose-500/40 rounded-xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-rose-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                  <span>ATURAN INTEGRITAS BUKTI STIKER DONE DI GB</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300">ZERO TOLERANCE FRAUD</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-display uppercase text-white tracking-tight leading-tight">
                  Jangan Berani-beraninya Nipu di Sini dengan Bukti Palsu!
                </h2>
                <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  Turnamen ini dibuat <strong>100% GRATIS</strong> dengan total hadiah mingguan <strong>Rp 30.000</strong>.
                  Satu-satunya bukti kemenangan yang sah adalah <strong>foto screenshot di GB saat admin resmi mengirim stiker DONE atau CEK</strong>.
                  Admin selalu mencocokkan riwayat chat asli di grup.
                  Pelaku pemalsuan screenshot stiker akan <strong>langsung di-blacklist permanen</strong> dan nomornya diumumkan di Wall of Shame!
                </p>
              </div>
            </div>

            <div className="shrink-0 bg-slate-950/80 border border-rose-500/30 px-5 py-3 rounded text-center">
              <div className="text-xs font-mono text-rose-400">Sanksi Pemalsuan Bukti</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">BAN PERMANEN</div>
              <div className="text-[11px] text-slate-400 mt-0.5">+ Kick Saluran & Daftar Hitam</div>
            </div>
          </div>
        </div>

        {/* Interactive Comparison Simulator */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                BUKTI CHAT GB VERIFICATION GUIDE
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display uppercase text-white">
                Simulator Deteksi Bukti Stiker DONE: Sah vs Palsu
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cara panitia memeriksa keabsahan bukti chat GB saat admin mengirimkan stiker DONE/CEK.
              </p>
            </div>

            {/* Toggle Mode Asli / Palsu */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded self-start sm:self-auto">
              <button
                onClick={() => {
                  setSimulatorMode('fake');
                  setActiveHotspot(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  simulatorMode === 'fake'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Contoh Bukti Palsu (Terdeteksi)</span>
              </button>
              <button
                onClick={() => {
                  setSimulatorMode('real');
                  setActiveHotspot(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  simulatorMode === 'real'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Contoh Bukti Sah (Stiker Asli)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Chat Screen Mockup */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-3 relative overflow-hidden shadow-xl">
              <div className="bg-[#0b141a] rounded p-4 relative min-h-[340px] flex flex-col justify-between border border-slate-800 font-sans">
                {/* Simulated WhatsApp Group Header */}
                <div className="flex items-center justify-between text-xs px-3 py-2 bg-[#1f2c34] rounded text-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-[10px]">
                      K
                    </div>
                    <div>
                      <span className="font-bold block text-white text-[11px]">GRUP GB FT KLEPON [SEASON 1]</span>
                      <span className="text-[10px] text-slate-400 font-mono">152 Peserta</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    {simulatorMode === 'fake' ? 'JAM CHAT EDITAN' : 'RESMI TERVERIFIKASI'}
                  </div>
                </div>

                {/* Simulated Chat Messages */}
                <div className="space-y-3 my-2 text-xs">
                  {/* Player Message */}
                  <div className="bg-[#005c4b] text-white p-2.5 rounded-lg max-w-xs ml-auto shadow">
                    <span className="text-[10px] text-emerald-200 block font-bold mb-0.5">KPX_VORTEX (Player)</span>
                    <span>Pot Malam selesai min, izin lapor menang Booyah CS</span>
                    <span className="text-[9px] text-emerald-300 block text-right mt-1 font-mono">20:44 WIB ✓✓</span>
                  </div>

                  {/* Admin Reply with Sticker DONE / CEK */}
                  <div className={`p-3 rounded-lg max-w-xs shadow ${
                    simulatorMode === 'fake'
                      ? 'bg-rose-950/60 border border-rose-500/50 text-white'
                      : 'bg-[#1f2c34] text-white'
                  }`}>
                    <span className="text-[10px] text-amber-400 block font-bold mb-1">
                      👑 Admin Utama KLEPON FT
                    </span>
                    <div className="bg-slate-900 border border-slate-700 p-2.5 rounded text-center my-1">
                      <div className="text-xl font-black font-display text-emerald-400 tracking-wider">
                        ✓ STIKER DONE
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        [CEK VALID - POIN +1]
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 block text-right mt-1 font-mono">
                      {simulatorMode === 'fake' ? '20:45 WIB [Jam Desinkron]' : '20:45 WIB'}
                    </span>
                  </div>
                </div>

                {/* Bottom Verification Note */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Bukti Storan: Foto Chat GB Stiker DONE</span>
                  <span className="font-mono text-emerald-400">STATUS: MATCH TERVALIDASI</span>
                </div>

                {simulatorMode === 'fake' && (
                  <div className="absolute inset-0 bg-rose-950/25 pointer-events-none border-2 border-rose-500/60 rounded flex items-center justify-center">
                    <div className="bg-rose-950/90 border border-rose-500 text-rose-300 text-xs px-3 py-1 font-mono font-bold tracking-wider rounded uppercase shadow-xl transform rotate-6">
                      ⚠️ BUKTI STIKER PALSU TERDETEKSI
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Explanatory Points on the Side */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                {simulatorMode === 'fake' ? 'Ciri-Ciri Pemalsuan Stiker DONE' : 'Standar Screenshot Stiker DONE yang Sah'}
              </div>

              {simulatorMode === 'fake' ? (
                fakeInspectionPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => setActiveHotspot(point.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer ${
                      activeHotspot === point.id
                        ? 'bg-rose-950/40 border-rose-500 text-slate-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-white mb-1">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-[10px] font-mono">
                        {point.id}
                      </span>
                      <span>{point.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">{point.desc}</p>
                    <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{point.verdict}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 text-xs text-slate-300 space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">1. Stiker Asli Dikirim Admin</strong>
                      <span>Terlihat jelas nama akun admin resmi yang mengirim stiker DONE atau CEK.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">2. Jam Chat Sesuai Waktu Match</strong>
                      <span>Jam pengiriman stiker di chat grup cocok dengan log match turnamen.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">3. Layar Penuh Tanpa Crop</strong>
                      <span>Screenshot memperlihatkan nama grup FT dan waktu chat secara utuh.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wall of Shame / Blacklist Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ban className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold font-display uppercase text-white">
              Wall of Shame — Daftar Blacklist Penipu Bukti
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Daftar nomor telepon dan tim yang terkena sanksi banned permanen karena mencoba memalsukan screenshot chat stiker DONE admin.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-xs font-mono uppercase text-slate-400">
                    <th className="py-3 px-4">Nama Tim & Kapten</th>
                    <th className="py-3 px-4 font-mono">No WhatsApp</th>
                    <th className="py-3 px-4">Alasan Pelanggaran</th>
                    <th className="py-3 px-4">Bukti Forensik</th>
                    <th className="py-3 px-4 text-center">Sanksi Resmi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {blacklist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-rose-400">{entry.teamName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">Kapten: {entry.captainName}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{entry.phone}</td>
                      <td className="py-3 px-4 text-slate-300">{entry.reason}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] max-w-xs">{entry.evidenceSummary}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-rose-950/80 border border-rose-500/40 text-rose-400 font-bold rounded text-[10px]">
                          {entry.penalty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
