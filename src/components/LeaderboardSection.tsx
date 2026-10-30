import React, { useState } from 'react';
import { Search, Flame, ShieldAlert, CheckCircle2, Users, AlertCircle, Clock, Zap } from 'lucide-react';
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
    <section id="leaderboard" className="py-12 lg:py-16 bg-[#040819] border-b border-blue-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
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
              className="pl-8 pr-3 py-2 bg-[#070e28] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-60 font-mono shadow-inner"
            />
          </div>
        </div>

        {/* Qualification Cutoff Notice Banner */}
        <div className="bg-[#070f2c]/90 border border-cyan-500/30 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0 border border-cyan-500/40">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Garis Kualifikasi: Posisi 1 sampai 10 Lolos ke Bagan Mingguan</span>
                <span className="bg-cyan-400 text-slate-950 px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase">
                  TOP 10 MASUK BAGAN
                </span>
              </div>
              <div className="text-slate-400 mt-0.5">
                Klasemen direset otomatis setiap minggu pada hari Minggu pukul 23:59 WIB.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Otomatis: <strong className="text-white">{season.endDate} 23:59 WIB</strong></span>
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="bg-[#060c24] border border-blue-900/60 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-blue-900/50 bg-[#030616] text-[11px] font-mono uppercase text-slate-400">
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Tim & Kapten</th>
                  <th className="py-3.5 px-4 font-mono text-center">Total Match</th>
                  <th className="py-3.5 px-4 font-mono text-center">Menang FT</th>
                  <th className="py-3.5 px-4 font-mono text-center">
                    <span className="inline-flex items-center gap-1 justify-center" title="Kemenangan Beruntun (Win Streak)">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Current Streak</span>
                    </span>
                  </th>
                  <th className="py-3.5 px-4 font-mono text-right">Poin</th>
                  <th className="py-3.5 px-4 text-center">Status Kualifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/60 text-xs">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                      {searchQuery
                        ? `Tidak ada tim yang cocok dengan pencarian "${searchQuery}".`
                        : 'Belum ada tim peserta yang terdaftar atau klasemen kualifikasi masih kosong.'}
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player, index) => {
                    const rank = index + 1;
                    const isTop10 = rank <= 10;
                    const isCutoffLine = rank === 10;
                    const streakCount = Number(player.streak) || 0;

                    return (
                      <React.Fragment key={player.id}>
                        <tr
                          className={`transition-colors ${
                            isTop10
                              ? 'bg-blue-950/20 hover:bg-blue-900/30'
                              : 'hover:bg-slate-900/30'
                          }`}
                        >
                          {/* Rank Number (Without medals) */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-black text-xs ${
                                rank === 1
                                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30'
                                  : rank === 2
                                  ? 'bg-blue-500 text-white'
                                  : rank === 3
                                  ? 'bg-blue-700 text-white'
                                  : isTop10
                                  ? 'bg-blue-950 text-cyan-300 border border-cyan-500/30'
                                  : 'text-slate-500'
                              }`}
                            >
                              #{rank}
                            </span>
                          </td>

                          {/* Team Name & Captain info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {player.photoUrl ? (
                                <img
                                  src={player.photoUrl}
                                  alt={player.name}
                                  className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                  {player.tag?.slice(0, 2) || 'FF'}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span>{player.name}</span>
                                  {isTop10 && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                                  <span>Kapten: <strong className="text-slate-300">{player.captainName}</strong></span>
                                  <span>·</span>
                                  <span className="text-slate-500">WA: {player.phone.slice(0, 4)}••••{player.phone.slice(-3)}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Total Matches */}
                          <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                            {player.matchesPlayed}
                          </td>

                          {/* Total Wins */}
                          <td className="py-3.5 px-4 text-center font-mono text-cyan-300 font-semibold">
                            {player.wins}
                          </td>

                          {/* Current Streak Column with Competitive Highlights */}
                          <td className="py-3.5 px-4 text-center">
                            {streakCount >= 5 ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/80 text-amber-300 font-mono font-black text-[11px] rounded-full shadow-lg shadow-amber-500/20 animate-pulse">
                                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current animate-bounce shrink-0" />
                                <span>{streakCount} W-STREAK</span>
                                <span className="bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 px-1 py-0.2 rounded text-[9px] font-black uppercase tracking-wider shrink-0">
                                  ON FIRE
                                </span>
                              </span>
                            ) : streakCount >= 3 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 font-mono font-bold text-[11px] rounded-full shadow-sm">
                                <Flame className="w-3 h-3 text-cyan-400 fill-current shrink-0" />
                                <span>{streakCount} W-Streak</span>
                              </span>
                            ) : streakCount >= 1 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-950/60 border border-blue-700/40 text-blue-300 font-mono text-[10px] rounded-md">
                                <Zap className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                <span>{streakCount} Win</span>
                              </span>
                            ) : (
                              <span className="font-mono text-slate-600 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Poin Kualifikasi */}
                          <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-cyan-400">
                            {player.points} Pts
                          </td>

                          {/* Status Kualifikasi (Top 10 vs Non-Kualifikasi) */}
                          <td className="py-3.5 px-4 text-center">
                            {isTop10 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 rounded-full font-mono text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                <span>Lolos Top 10</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 text-slate-500 rounded font-mono text-[10px]">
                                Belum Lolos
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Cutoff separator line after rank 10 */}
                        {isCutoffLine && (
                          <tr className="bg-gradient-to-r from-cyan-950/80 via-blue-900/60 to-cyan-950/80 border-y-2 border-cyan-400/50">
                            <td colSpan={7} className="py-2 px-4 text-center font-mono text-[11px] font-black text-cyan-300 tracking-wider">
                              ▲ BATAS KUALIFIKASI: TOP 10 BESAR MASUK BAGAN MINGGUAN ▲
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
