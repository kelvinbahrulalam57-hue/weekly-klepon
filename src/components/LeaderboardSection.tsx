import React, { useState } from 'react';
import { Search, Flame, ShieldAlert, CheckCircle2, Users, AlertCircle, Clock } from 'lucide-react';
import { esportsStore } from '../services/store';

export const LeaderboardSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const season = esportsStore.getSeason();
  const allPlayers = esportsStore.getPlayers();

  const filteredPlayers = allPlayers.filter((player) => {
    const q = searchQuery.toLowerCase();
    return (
      (player.name || '').toLowerCase().includes(q) ||
      (player.captainName || '').toLowerCase().includes(q) ||
      (player.tag || '').toLowerCase().includes(q) ||
      (player.phone || '').includes(searchQuery)
    );
  });

  return (
    <section id="leaderboard" className="py-12 lg:py-16 bg-[#080c14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>KLASEMEN KUALIFIKASI MINGGUAN · {season.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-white tracking-tight">
              Klasemen Poin Kualifikasi Top 10
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Dari seluruh peserta yang bermain FT, hanya <strong>10 Tim Poin Terbesar</strong> yang diambil untuk masuk ke bagan turnamen mingguan.
              Nomor WhatsApp peserta Top 10 akan langsung dihubungi panitia untuk dimasukkan ke grup khusus turnamen mingguan.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari tim / no hp / kapten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 font-mono"
            />
          </div>
        </div>

        {/* Qualification Cutoff Notice Banner */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Garis Kualifikasi: Posisi 1 sampai 10 Lolos ke Bagan Mingguan</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  TOP 10 MASUK BAGAN
                </span>
              </div>
              <div className="text-slate-400 mt-0.5">
                Klasemen direset otomatis setiap minggu pada hari Minggu pukul 23:59 WIB.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded border border-slate-800 shrink-0">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Otomatis: {season.endDate} (23:59 WIB)</span>
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="bg-slate-900/40 border border-slate-800 rounded overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-mono uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Nama Tim & Tag CS</th>
                  <th className="py-3 px-4">Kapten & No WhatsApp</th>
                  <th className="py-3 px-4 text-center">Match FT</th>
                  <th className="py-3 px-4 text-center">Total Win</th>
                  <th className="py-3 px-4 text-right">Total Poin FT</th>
                  <th className="py-3 px-4 text-center">Status Kualifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      Belum ada data tim yang cocok. Daftar peserta dan setor kemenangan Anda!
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player, index) => {
                    const rank = index + 1;
                    const isTop10 = rank <= 10;

                    const displayPhone = player.phone
                      ? player.phone.slice(0, 4) + '****' + player.phone.slice(-3)
                      : '-';

                    return (
                      <tr
                        key={player.id}
                        className={`hover:bg-slate-800/30 transition-colors ${
                          isTop10 ? 'bg-emerald-950/5' : ''
                        }`}
                      >
                        {/* Rank (Pure tabular number, no medals!) */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded tabular-nums ${
                              isTop10
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'text-slate-500'
                            }`}
                          >
                            #{rank}
                          </span>
                        </td>

                        {/* Team Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {player.photoUrl ? (
                              <img
                                src={player.photoUrl}
                                alt={player.name}
                                className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-emerald-400 shrink-0">
                                {player.tag}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{player.name}</span>
                                {isTop10 && (
                                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                Mode: Free Fire Clash Squad
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Captain & Phone */}
                        <td className="py-3 px-4">
                          <div className="text-slate-200 text-xs font-medium">{player.captainName}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">
                            WA: {displayPhone}
                          </div>
                        </td>

                        {/* Matches */}
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-300 text-xs">
                          {player.matchesPlayed}
                        </td>

                        {/* Wins */}
                        <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-emerald-400">
                          {player.wins}
                        </td>

                        {/* Total Points */}
                        <td className="py-3 px-4 text-right">
                          <div className="font-mono tabular-nums text-base font-black text-emerald-400">
                            {player.points} PTS
                          </div>
                        </td>

                        {/* Status (Top 10 vs Below Cutoff) */}
                        <td className="py-3 px-4 text-center">
                          {player.status === 'blacklisted' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              BANNED
                            </span>
                          ) : isTop10 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              LOLOS TOP 10
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Di Bawah Garis
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              Status Kualifikasi: <strong className="text-emerald-400">10 Besar Teratas</strong> masuk ke Bagan Sistem Gugur Mingguan (Perebutan Rp 30.000).
            </div>
            <div className="font-mono text-slate-300">
              Nomor WhatsApp pemegang Top 10 akan di-chat panitia untuk dimasukkan ke Grup Khusus Turnamen.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
