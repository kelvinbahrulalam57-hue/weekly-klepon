import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Flame, ShieldAlert, CheckCircle2, Users, AlertCircle, Clock, Zap,
  TrendingUp, BarChart3, ChevronDown, ChevronUp, Sparkles, Activity,
  Trophy, Swords, Award, Crown, Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { esportsStore } from '../services/store';
import { PlayerTeam } from '../types/esports';
import { PlayerDetailModal } from './PlayerDetailModal';
import { TournamentBracket } from './TournamentBracket';

const TEAM_COLORS = [
  '#22d3ee', // Cyan (Rank 1)
  '#f59e0b', // Amber (Rank 2)
  '#10b981', // Emerald (Rank 3)
  '#3b82f6', // Blue (Rank 4)
  '#f43f5e', // Rose (Rank 5)
  '#a855f7', // Purple (Rank 6)
  '#38bdf8', // Sky (Rank 7)
  '#fb923c', // Orange (Rank 8)
  '#a3e635', // Lime (Rank 9)
  '#2dd4bf', // Teal (Rank 10)
];

export const LeaderboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'bracket'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChart, setShowChart] = useState(true);
  const [chartScope, setChartScope] = useState<'top5' | 'top10'>('top5');
  const [lastUpdatePing, setLastUpdatePing] = useState(Date.now());
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: PlayerTeam; rank: number } | null>(null);
  const [, setTick] = useState(0);

  const season = esportsStore.getSeason();
  const allPlayers = esportsStore.getPlayers();

  // Subscribe to real-time updates so row reordering & points trigger instantly
  useEffect(() => {
    const unsub = esportsStore.subscribe(() => {
      setTick((t) => t + 1);
      setLastUpdatePing(Date.now());
    });
    return () => unsub();
  }, []);

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allPlayers.filter((player) => {
      if (!q) return true;
      return (
        (player.name || '').toLowerCase().includes(q) ||
        (player.captainName || '').toLowerCase().includes(q) ||
        (player.tag || '').toLowerCase().includes(q) ||
        (player.phone || '').includes(q)
      );
    });
  }, [allPlayers, searchQuery]);

  // Top 3 teams for Championship Podium
  const rank1Team = allPlayers[0] || null;
  const rank2Team = allPlayers[1] || null;
  const rank3Team = allPlayers[2] || null;

  // Maximum points in current week for calculating relative progress bar width
  const maxPoints = useMemo(() => {
    const pts = allPlayers.map((p) => Number(p.points) || 0);
    return Math.max(...pts, 1);
  }, [allPlayers]);

  // Compute dynamic points progression data for recharts
  const { chartData, trackedTeams } = useMemo(() => {
    const limit = chartScope === 'top5' ? 5 : 10;
    const topTeams = allPlayers.slice(0, limit);

    if (topTeams.length === 0) {
      return { chartData: [], trackedTeams: [] };
    }

    // Days of current tournament week
    const dayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu (Kini)'];

    // Build timeline points progression
    const data = dayLabels.map((day, dayIndex) => {
      const entry: Record<string, any> = { day };
      const progressFraction = (dayIndex + 1) / dayLabels.length;

      topTeams.forEach((team) => {
        const totalPts = Number(team.points) || 0;
        if (dayIndex === dayLabels.length - 1) {
          entry[team.name] = totalPts;
        } else if (totalPts === 0) {
          entry[team.name] = 0;
        } else {
          const simulatedPts = Math.min(
            totalPts,
            Math.max(0, Math.round(totalPts * Math.pow(progressFraction, 1.25)))
          );
          entry[team.name] = simulatedPts;
        }
      });

      return entry;
    });

    return { chartData: data, trackedTeams: topTeams };
  }, [allPlayers, chartScope]);

  return (
    <section id="leaderboard" className="py-12 lg:py-16 bg-[#040819] border-b border-blue-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Real-time Indicator & Section Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-blue-900/30">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">Free Fire Clash Squad</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Putaran Minggu Ke-{season.weekNumber || 1}</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-bold">Total Hadiah {season.totalPrizePool}</span>
          </div>

          {/* REAL-TIME BADGE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/70 border border-emerald-500/50 rounded-full text-emerald-300 text-[11px] font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-black uppercase tracking-wider">POINT REAL-TIME AKTIF</span>
            <span className="text-emerald-400/80 hidden sm:inline">· Sinkron Firestore Otomatis</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-display text-white tracking-tight leading-tight">
              KLASEMEN POIN KUALIFIKASI TOP 10
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Kumpulkan poin dari kemenangan Fast Tournament (FT). Hanya <strong>10 Tim Poin Terbesar</strong> yang berhak lolos ke bagan gugur turnamen mingguan.
              <span className="block mt-1 text-cyan-300 text-xs font-semibold">
                💡 Klik nama tim atau baris mana pun untuk membuka profil detail: statistik Win Rate (%), Total Kill, Jumlah Partisipasi Turnamen, serta arsip bukti stiker DONE admin.
              </span>
            </p>
          </div>

          {/* Switcher: Table View vs Bracket View */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#070f2c] p-1 rounded-xl border border-blue-900/60 shadow-lg shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'table'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tabel Klasemen</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bracket')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bracket'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Bagan Gugur 10 Besar</span>
            </button>
          </div>
        </div>

        {/* CHAMPIONSHIP PODIUM SHOWCASE FOR TOP 3 */}
        {allPlayers.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>PODIUM 3 BESAR SEMENTARA MINGGU INI</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Peringkat Berubah Otomatis Mengikuti Poin Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* PODIUM 2 (PERAK / SILVER) - KIRI */}
              {rank2Team ? (
                <button
                  type="button"
                  onClick={() => setSelectedPlayer({ player: rank2Team, rank: 2 })}
                  className="w-full text-left bg-gradient-to-t from-[#060c24] to-[#0a153d] border-2 border-slate-400/50 hover:border-slate-300 rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer group order-2 md:order-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-400/60 text-slate-200 rounded-lg text-xs font-mono font-black">
                      🥈 JUARA 2 SEMENTARA
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      Hadiah: {season.secondPrize}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {rank2Team.photoUrl ? (
                      <img
                        src={rank2Team.photoUrl}
                        alt={rank2Team.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-slate-300 shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-200 font-black text-sm flex items-center justify-center border border-slate-400">
                        {rank2Team.tag || 'FF'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-black text-base text-white truncate group-hover:text-cyan-300 transition-colors">
                        {rank2Team.name}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono">
                        Kapten: <strong className="text-slate-300">{rank2Team.captainName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-900/60 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Poin Kualifikasi</div>
                      <div className="text-lg font-black text-slate-200">{rank2Team.points} Pts</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Streak Menang</div>
                      <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{rank2Team.streak || 0} FT</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] font-mono text-slate-400 flex items-center justify-between group-hover:text-cyan-300">
                    <span>Lihat Bukti Stiker DONE</span>
                    <Eye className="w-3 h-3" />
                  </div>
                </button>
              ) : (
                <div className="bg-[#050a20] border border-dashed border-blue-900/60 rounded-2xl p-5 text-center text-slate-500 font-mono text-xs order-2 md:order-1">
                  Slot Juara 2 Belum Terisi
                </div>
              )}

              {/* PODIUM 1 (EMAS / GOLD) - TENGAH (LEBIH TINGGI & DOMINAN) */}
              {rank1Team ? (
                <button
                  type="button"
                  onClick={() => setSelectedPlayer({ player: rank1Team, rank: 1 })}
                  className="w-full text-left bg-gradient-to-t from-[#09153a] via-[#0b1a47] to-[#122863] border-2 border-amber-400/80 hover:border-amber-300 rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer group order-1 md:order-2 md:-mt-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-mono font-black shadow-lg shadow-amber-400/30">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                      <span>🏆 JUARA 1 SEMENTARA</span>
                    </span>
                    <span className="font-mono text-xs font-black text-amber-300">
                      Hadiah: {season.firstPrize}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-3.5">
                    {rank1Team.photoUrl ? (
                      <img
                        src={rank1Team.photoUrl}
                        alt={rank1Team.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-xl group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center border-2 border-amber-300">
                        {rank1Team.tag || 'FF'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-black text-lg text-white truncate group-hover:text-amber-300 transition-colors">
                        {rank1Team.name}
                      </h4>
                      <div className="text-xs text-amber-200/80 font-mono">
                        Kapten: <strong className="text-white">{rank1Team.captainName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-400/30 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-amber-300/80 font-bold uppercase">Poin Tertinggi</div>
                      <div className="text-2xl font-black text-amber-300">{rank1Team.points} Pts</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-amber-300/80 font-bold uppercase">Streak Menang</div>
                      <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
                        <Flame className="w-4 h-4 fill-current animate-bounce" />
                        <span>{rank1Team.streak || 0} FT</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] font-mono text-amber-300/90 flex items-center justify-between group-hover:text-white">
                    <span>Buka Rekap Match & Foto Stiker DONE Panitia</span>
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </button>
              ) : (
                <div className="bg-[#050a20] border border-dashed border-amber-500/40 rounded-2xl p-6 text-center text-slate-500 font-mono text-xs order-1 md:order-2">
                  Slot Juara 1 Belum Terisi
                </div>
              )}

              {/* PODIUM 3 (PERUNGGU / BRONZE) - KANAN */}
              {rank3Team ? (
                <button
                  type="button"
                  onClick={() => setSelectedPlayer({ player: rank3Team, rank: 3 })}
                  className="w-full text-left bg-gradient-to-t from-[#060c24] to-[#0a153d] border-2 border-amber-700/50 hover:border-amber-600 rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-700/10 cursor-pointer group order-3 md:order-3"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-700/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/80 border border-amber-700/60 text-amber-300 rounded-lg text-xs font-mono font-black">
                      🥉 JUARA 3 SEMENTARA
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      Hadiah: {season.thirdPrize}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {rank3Team.photoUrl ? (
                      <img
                        src={rank3Team.photoUrl}
                        alt={rank3Team.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-amber-600 shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-300 font-black text-sm flex items-center justify-center border border-amber-700">
                        {rank3Team.tag || 'FF'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-black text-base text-white truncate group-hover:text-cyan-300 transition-colors">
                        {rank3Team.name}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono">
                        Kapten: <strong className="text-slate-300">{rank3Team.captainName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-900/60 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Poin Kualifikasi</div>
                      <div className="text-lg font-black text-slate-200">{rank3Team.points} Pts</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Streak Menang</div>
                      <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{rank3Team.streak || 0} FT</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] font-mono text-slate-400 flex items-center justify-between group-hover:text-cyan-300">
                    <span>Lihat Bukti Stiker DONE</span>
                    <Eye className="w-3 h-3" />
                  </div>
                </button>
              ) : (
                <div className="bg-[#050a20] border border-dashed border-blue-900/60 rounded-2xl p-5 text-center text-slate-500 font-mono text-xs order-3 md:order-3">
                  Slot Juara 3 Belum Terisi
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONDITIONAL RENDER: BRACKET TAB VS TABLE TAB */}
        {activeTab === 'bracket' ? (
          <TournamentBracket
            topTeams={allPlayers.slice(0, 10)}
            onSelectTeam={(team, rank) => setSelectedPlayer({ player: team, rank })}
          />
        ) : (
          <>
            {/* Controls Row: Search Box & Toggle Chart */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <button
                type="button"
                onClick={() => setShowChart(!showChart)}
                className="px-3.5 py-2 bg-[#070e28] hover:bg-[#0b1740] border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0 self-start sm:self-auto"
                title="Tampilkan / Sembunyikan Grafik Tren Poin Recharts"
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showChart ? 'Sembunyikan Grafik Tren Poin' : 'Tampilkan Grafik Tren Poin'}</span>
                {showChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari nama squad / kapten / no WA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#070e28] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
                />
              </div>
            </div>

            {/* RECHARTS LINE CHART SECTION */}
            <AnimatePresence>
              {showChart && trackedTeams.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden mb-8"
                >
                  <div className="bg-gradient-to-b from-[#070f2c] to-[#04081c] border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-900/60">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold font-display uppercase text-white flex items-center gap-2">
                            <span>Tren Akumulasi Poin Kualifikasi</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40">
                              Live Recharts
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Visualisasi dinamis persaingan perolehan poin kemenangan FT sepanjang pekan.
                          </p>
                        </div>
                      </div>

                      {/* Scope filter: Top 5 vs Top 10 */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#030616] p-1 rounded-lg border border-blue-900/60 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setChartScope('top5')}
                          className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                            chartScope === 'top5'
                              ? 'bg-cyan-400 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Top 5 Tim
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartScope('top10')}
                          className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                            chartScope === 'top10'
                              ? 'bg-cyan-400 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Top 10 Tim
                        </button>
                      </div>
                    </div>

                    {/* Recharts Container */}
                    <div className="h-64 sm:h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                          <XAxis
                            dataKey="day"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                            axisLine={{ stroke: '#334155' }}
                          />
                          <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                            axisLine={{ stroke: '#334155' }}
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#030718',
                              borderColor: '#0284c7',
                              borderRadius: '0.75rem',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
                              color: '#f8fafc',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                            }}
                            itemStyle={{ padding: '2px 0' }}
                            formatter={(value: any, name: any) => [`${value} Poin`, `${name}`]}
                          />
                          <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              paddingBottom: '10px',
                            }}
                          />
                          {trackedTeams.map((team, idx) => (
                            <Line
                              key={team.id}
                              type="monotone"
                              dataKey={team.name}
                              name={`#${idx + 1} ${team.name}`}
                              stroke={TEAM_COLORS[idx % TEAM_COLORS.length]}
                              strokeWidth={idx === 0 ? 3.5 : 2.5}
                              dot={{
                                r: idx === 0 ? 5 : 3.5,
                                fill: TEAM_COLORS[idx % TEAM_COLORS.length],
                                stroke: '#040817',
                                strokeWidth: 2,
                              }}
                              activeDot={{
                                r: 7,
                                fill: '#ffffff',
                                stroke: TEAM_COLORS[idx % TEAM_COLORS.length],
                                strokeWidth: 3,
                              }}
                              animationDuration={1200}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Leaderboard Table Container */}
            <div className="bg-[#060c24] border border-blue-900/60 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-blue-900/50 bg-[#030616] text-[11px] font-mono uppercase text-slate-400">
                      <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                      <th className="py-3.5 px-4">Squad / Tim & Kapten</th>
                      <th className="py-3.5 px-4 font-mono text-center">Total Match</th>
                      <th className="py-3.5 px-4 font-mono text-center">Menang FT</th>
                      <th className="py-3.5 px-4 font-mono text-center">
                        <span className="inline-flex items-center gap-1 justify-center" title="Kemenangan Beruntun (Win Streak)">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>Current Streak</span>
                        </span>
                      </th>
                      <th className="py-3.5 px-4 font-mono text-right w-36 sm:w-44">Akumulasi Poin</th>
                      <th className="py-3.5 px-4 text-center">Status Tiket Bagan</th>
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
                      <AnimatePresence mode="popLayout">
                        {filteredPlayers.map((player, index) => {
                          const rank = index + 1;
                          const isTop10 = rank <= 10;
                          const isCutoffLine = rank === 10;
                          const streakCount = Number(player.streak) || 0;

                          return (
                            <React.Fragment key={player.id}>
                              <motion.tr
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 350,
                                  damping: 28,
                                  mass: 0.8,
                                }}
                                className={`transition-colors duration-200 cursor-pointer group ${
                                  isTop10
                                    ? 'bg-blue-950/20 hover:bg-blue-900/45'
                                    : 'hover:bg-slate-900/45'
                                }`}
                                onClick={() => setSelectedPlayer({ player, rank })}
                                title={`Klik untuk melihat riwayat pertandingan & total kemenangan tim ${player.name}`}
                              >
                                {/* Rank Number */}
                                <td className="py-3.5 px-4 text-center">
                                  <span
                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-black text-xs transition-transform group-hover:scale-110 ${
                                      rank === 1
                                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                                        : rank === 2
                                        ? 'bg-slate-300 text-slate-950'
                                        : rank === 3
                                        ? 'bg-amber-600 text-white'
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
                                        className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 group-hover:border-cyan-300 transition-colors"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 text-cyan-400 flex items-center justify-center font-bold text-xs group-hover:border-cyan-400 transition-colors">
                                        {player.tag?.slice(0, 2) || 'FF'}
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-bold text-white text-sm flex items-center gap-1.5 group-hover:text-cyan-300 transition-colors">
                                        <span className="group-hover:underline underline-offset-2">{player.name}</span>
                                        {isTop10 && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-1.5 sm:gap-2">
                                        <span>Kapten: <strong className="text-slate-300">{player.captainName}</strong></span>
                                        <span>·</span>
                                        <span className="text-emerald-400 font-bold">
                                          {player.matchesPlayed > 0 ? Math.round((player.wins / player.matchesPlayed) * 100) : 100}% WR
                                        </span>
                                        <span>·</span>
                                        <span className="text-rose-400 font-bold">
                                          {player.totalKills ?? Math.max(player.wins * 14, 8)} Kills
                                        </span>
                                        <span>·</span>
                                        <span className="text-cyan-400/90 group-hover:text-cyan-300 text-[10px] underline underline-offset-2">
                                          Lihat Profil & Kill ➔
                                        </span>
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

                                {/* Current Streak Column */}
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

                                {/* Poin Kualifikasi with Smooth Animated Progress Bar */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                                    <div className="flex items-baseline gap-1.5 font-mono">
                                      <span
                                        className={`font-black text-sm transition-colors ${
                                          rank === 1
                                            ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                            : rank === 2
                                            ? 'text-slate-200'
                                            : rank === 3
                                            ? 'text-amber-500'
                                            : isTop10
                                            ? 'text-cyan-400'
                                            : 'text-slate-400'
                                        }`}
                                      >
                                        {Number(player.points) || 0} Pts
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-normal">
                                        ({Math.round(((Number(player.points) || 0) / maxPoints) * 100)}%)
                                      </span>
                                    </div>

                                    {/* Animated Smooth Progress Track via Motion */}
                                    <div className="w-24 sm:w-32 bg-slate-900/90 border border-blue-950/80 rounded-full h-1.5 overflow-hidden p-[1px] shadow-inner">
                                      <motion.div
                                        key={`${player.id}-${player.points}-${lastUpdatePing}`}
                                        initial={{ width: 0 }}
                                        animate={{
                                          width: `${Math.min(100, Math.max((Number(player.points) || 0) > 0 ? 8 : 2, Math.round(((Number(player.points) || 0) / maxPoints) * 100)))}%`
                                        }}
                                        transition={{
                                          duration: 0.85,
                                          ease: [0.16, 1, 0.3, 1],
                                          delay: Math.min(index * 0.04, 0.35),
                                        }}
                                        className={`h-full rounded-full relative transition-all ${
                                          rank === 1
                                            ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                            : rank === 2
                                            ? 'bg-gradient-to-r from-slate-400 via-slate-200 to-white shadow-[0_0_8px_rgba(203,213,225,0.4)]'
                                            : rank === 3
                                            ? 'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 shadow-[0_0_8px_rgba(217,119,6,0.4)]'
                                            : isTop10
                                            ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                                            : 'bg-gradient-to-r from-slate-700 to-slate-500'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* Status Kualifikasi (Top 10 vs Non-Kualifikasi) */}
                                <td className="py-3.5 px-4 text-center">
                                  {isTop10 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 rounded-full font-mono text-[10px] font-bold">
                                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                      <span>Lolos Bagan</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 text-slate-500 rounded font-mono text-[10px]">
                                      Belum Lolos
                                    </span>
                                  )}
                                </td>
                              </motion.tr>

                              {/* Cutoff separator line after rank 10 */}
                              {isCutoffLine && (
                                <tr className="bg-gradient-to-r from-cyan-950/80 via-blue-900/60 to-cyan-950/80 border-y-2 border-cyan-400/50">
                                  <td colSpan={7} className="py-2.5 px-4 text-center font-mono text-[11px] font-black text-cyan-300 tracking-wider">
                                    ▲ BATAS KUALIFIKASI: TOP 10 BESAR RESMI MASUK BAGAN GUGUR MINGGUAN ▲
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Team Profile & Match History Sub-view Modal */}
      <PlayerDetailModal
        player={selectedPlayer?.player || null}
        rank={selectedPlayer?.rank}
        isOpen={Boolean(selectedPlayer)}
        onClose={() => setSelectedPlayer(null)}
      />
    </section>
  );
};
