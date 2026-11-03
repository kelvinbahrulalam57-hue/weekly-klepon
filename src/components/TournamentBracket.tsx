import React, { useState } from 'react';
import { Trophy, Swords, Flame, ChevronRight, Eye, Sparkles, ExternalLink, Crown } from 'lucide-react';
import { PlayerTeam } from '../types/esports';
import { esportsStore } from '../services/store';

interface TournamentBracketProps {
  topTeams: PlayerTeam[];
  onSelectTeam: (team: PlayerTeam, rank: number) => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  topTeams,
  onSelectTeam,
}) => {
  const [showOriginalPoster, setShowOriginalPoster] = useState(false);
  const contacts = esportsStore.getContacts();
  const season = esportsStore.getSeason();

  // Advancing winners state for interactive match progression
  const [advancingWinners, setAdvancingWinners] = useState<Record<string, string>>({
    pemenang1: '',
    pemenang2: '',
    pemenang3: '',
    pemenang4: '',
    pemenang5: '',
    pemenangA: '',
    pemenangB: '',
    juara1: '',
    juara2: '',
    juara3: '',
  });

  // Map 10 qualified teams by rank seed (1 to 10)
  const getTeam = (index: number): PlayerTeam | null => {
    return topTeams[index - 1] || null;
  };

  const team1 = getTeam(1);
  const team2 = getTeam(2);
  const team3 = getTeam(3);
  const team4 = getTeam(4);
  const team5 = getTeam(5);
  const team6 = getTeam(6);
  const team7 = getTeam(7);
  const team8 = getTeam(8);
  const team9 = getTeam(9);
  const team10 = getTeam(10);

  const handleSelectWinner = (key: string, teamName: string) => {
    setAdvancingWinners((prev) => ({
      ...prev,
      [key]: prev[key] === teamName ? '' : teamName,
    }));
  };

  const renderTeamSlot = (
    num: number,
    team: PlayerTeam | null,
    pemenangKey: string
  ) => {
    const isAdvancing = team && advancingWinners[pemenangKey] === team.name;

    return (
      <div
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-full border-2 transition-all cursor-pointer group ${
          isAdvancing
            ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
            : 'bg-[#080d1e] border-amber-400/90 hover:border-amber-300 hover:bg-[#0c1638]'
        }`}
        onClick={() => {
          if (team) {
            onSelectTeam(team, num);
          }
        }}
        title={team ? `Klik untuk profil ${team.name} (${team.points} Pts). Klik ganda/toggle untuk majukan ke babak berikutnya.` : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 pr-1">
          {/* Circular Golden Badge with bold black number */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
            {num}
          </div>

          {/* Team Name */}
          <div className="min-w-0">
            <div className="font-black text-xs uppercase tracking-wide text-white group-hover:text-amber-300 transition-colors truncate">
              {team ? team.name : `TIM ${num}`}
            </div>
            {team && (
              <div className="text-[10px] text-amber-300/80 font-mono truncate">
                {team.captainName}
              </div>
            )}
          </div>
        </div>

        {/* Real-time points & advance button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {team && (
            <span className="font-mono font-black text-xs text-amber-400">
              {team.points} Pts
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (team) handleSelectWinner(pemenangKey, team.name);
            }}
            className={`w-4 h-4 rounded text-[9px] font-mono font-black flex items-center justify-center transition-all ${
              isAdvancing
                ? 'bg-amber-400 text-slate-950'
                : 'bg-blue-950/80 text-amber-300/70 hover:text-amber-300 border border-amber-500/30'
            }`}
            title="Pilih tim ini sebagai pemenang match"
          >
            ✓
          </button>
        </div>
      </div>
    );
  };

  const renderAdvancingSlot = (label: string, pemenangKey: string, nextKey?: string) => {
    const winnerName = advancingWinners[pemenangKey];
    const isSelected = nextKey && advancingWinners[nextKey] === winnerName && winnerName;

    return (
      <div
        className={`w-full flex items-center justify-between px-3 py-2 rounded-full border-2 transition-all cursor-pointer ${
          winnerName
            ? 'bg-gradient-to-r from-amber-950/80 to-[#0e1d44] border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
            : 'bg-[#080d1e] border-amber-400/80 hover:border-amber-300 text-white'
        }`}
        onClick={() => {
          if (winnerName && nextKey) {
            handleSelectWinner(nextKey, winnerName);
          }
        }}
        title={winnerName ? `Pemenang: ${winnerName}. Klik untuk memajukan ke babak berikutnya.` : label}
      >
        <span className="font-black text-xs uppercase tracking-wide truncate">
          {winnerName || label}
        </span>
        {winnerName && nextKey && (
          <span className="text-[9px] font-mono text-amber-400 ml-1 shrink-0 font-bold">
            ➔ Lanjut
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Toggle original poster image & live description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d22] border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-amber-400 uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>SKEMA RESMI BABAK IN-PLAY 10 BESAR · BY ADMIN KLEPON</span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-display uppercase text-white">
            Bagan Fase Gugur Free Fire Clash Squad (Sesuai Desain Poster Resmi)
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl font-normal leading-relaxed">
            Struktur 4 babak: <strong>Babak 1 (10 Tim)</strong> ➔ <strong>Perempat Final (8 Tim)</strong> ➔ <strong>Semifinal (4 Tim)</strong> ➔ <strong>Final (2 Tim) & Perebutan Juara 3</strong>. Tim teratas otomatis terisi dari klasemen poin <em>real-time</em>!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowOriginalPoster(!showOriginalPoster)}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20 shrink-0 uppercase tracking-wide"
        >
          <Eye className="w-4 h-4" />
          <span>{showOriginalPoster ? 'Tutup Poster Asli' : 'Lihat Gambar Poster Asli'}</span>
        </button>
      </div>

      {/* Pop-up / Expandable Original Poster Modal */}
      {showOriginalPoster && (
        <div className="bg-black/90 border-2 border-amber-400 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-3 animate-fade-in relative">
          <div className="flex items-center justify-between border-b border-amber-500/40 pb-2">
            <span className="font-mono font-bold text-amber-400 text-xs uppercase flex items-center gap-1.5">
              <span>🖼️ POSTER ASLI WEEKLY TOURNAMENT BY ADMIN KLEPON</span>
            </span>
            <button
              onClick={() => setShowOriginalPoster(false)}
              className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>
          <div className="flex justify-center bg-black/80 rounded-xl p-2 overflow-hidden">
            <img
              src="/public/assets/aistudio/IMG-20261030-WA0060_3d2a02b2.jpg"
              alt="Poster Asli Bagan Babak In-Play Weekly Tournament"
              className="max-h-[80vh] w-auto object-contain rounded-lg border border-amber-500/40 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* RECREATED AUTHENTIC BLACK & GOLD POSTER STAGE */}
      <div className="bg-[#02040a] border-4 border-amber-400/90 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.15)] relative overflow-hidden">
        
        {/* Yellow geometric tribal corners inspired by the poster */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400 to-transparent opacity-30 [clip-path:polygon(0_0,100%_0,0_100%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400 to-transparent opacity-30 [clip-path:polygon(100%_0,100%_100%,0_0)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400 to-transparent opacity-30 [clip-path:polygon(0_100%,100%_100%,0_0)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-400 to-transparent opacity-30 [clip-path:polygon(100%_100%,0_100%,100%_0)] pointer-events-none" />

        {/* POSTER TITLE HEADER */}
        <div className="text-center relative z-10 mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* Left Crown */}
            <span className="text-amber-400 text-3xl sm:text-5xl font-black drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              👑
            </span>

            {/* Brush Titles */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                WEEKLY <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.7)]">TOURNAMENT</span>
              </h1>
              
              {/* Yellow brush banner with black text */}
              <div className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-black px-6 py-1 rounded-sm transform -rotate-1 shadow-lg">
                <span className="font-black font-display text-sm sm:text-lg uppercase tracking-wider">
                  BY ADMIN KLEPON
                </span>
              </div>
            </div>

            {/* Right Crown */}
            <span className="text-amber-400 text-3xl sm:text-5xl font-black drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              👑
            </span>
          </div>
        </div>

        {/* 4 STAGES GRID WITH YELLOW BRUSH BANNERS */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[950px] space-y-6">
            
            {/* STAGE HEADER BANNERS (YELLOW BRUSH LABELS) */}
            <div className="grid grid-cols-4 gap-6 text-center font-black uppercase text-slate-950 font-display">
              {/* Stage 1 */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 py-1.5 px-3 rounded-sm shadow-md transform -skew-x-6 border-b-2 border-amber-600">
                <div className="text-xs sm:text-sm tracking-wide">BABAK 1 (10 TIM)</div>
              </div>

              {/* Stage 2 */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 py-1.5 px-3 rounded-sm shadow-md transform -skew-x-6 border-b-2 border-amber-600">
                <div className="text-xs sm:text-sm tracking-wide">PEREMPAT FINAL (8 TIM)</div>
              </div>

              {/* Stage 3 */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 py-1.5 px-3 rounded-sm shadow-md transform -skew-x-6 border-b-2 border-amber-600">
                <div className="text-xs sm:text-sm tracking-wide">SEMIFINAL (4 TIM)</div>
              </div>

              {/* Stage 4 */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 py-1.5 px-3 rounded-sm shadow-md transform -skew-x-6 border-b-2 border-amber-600">
                <div className="text-xs sm:text-sm tracking-wide">FINAL (2 TIM)</div>
              </div>
            </div>

            {/* BRACKET MATCH TREE */}
            <div className="grid grid-cols-4 gap-6 items-stretch relative pt-2">
              
              {/* COLUMN 1: BABAK 1 (10 TIM) */}
              <div className="flex flex-col justify-between gap-4 py-2">
                {/* Match 1: Tim 1 vs Tim 2 */}
                <div className="space-y-1.5 relative">
                  {renderTeamSlot(1, team1, 'pemenang1')}
                  {renderTeamSlot(2, team2, 'pemenang1')}
                  {/* Bracket fork arm */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-10 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>

                {/* Match 2: Tim 3 vs Tim 4 */}
                <div className="space-y-1.5 relative">
                  {renderTeamSlot(3, team3, 'pemenang2')}
                  {renderTeamSlot(4, team4, 'pemenang2')}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-10 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>

                {/* Match 3: Tim 5 vs Tim 6 */}
                <div className="space-y-1.5 relative">
                  {renderTeamSlot(5, team5, 'pemenang3')}
                  {renderTeamSlot(6, team6, 'pemenang3')}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-10 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>

                {/* Match 4: Tim 7 vs Tim 8 */}
                <div className="space-y-1.5 relative">
                  {renderTeamSlot(7, team7, 'pemenang4')}
                  {renderTeamSlot(8, team8, 'pemenang4')}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-10 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>

                {/* Match 5: Tim 9 vs Tim 10 */}
                <div className="space-y-1.5 relative">
                  {renderTeamSlot(9, team9, 'pemenang5')}
                  {renderTeamSlot(10, team10, 'pemenang5')}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-10 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>
              </div>

              {/* COLUMN 2: PEREMPAT FINAL (8 TIM) */}
              <div className="flex flex-col justify-between gap-6 py-5">
                {/* Pemenang 1 & 2 Fork */}
                <div className="space-y-6 relative">
                  <div className="space-y-2">
                    {renderAdvancingSlot('PEMENANG 1', 'pemenang1', 'pemenangA')}
                    {renderAdvancingSlot('PEMENANG 2', 'pemenang2', 'pemenangA')}
                  </div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-16 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>

                {/* Pemenang 3 & 4 Fork */}
                <div className="space-y-6 relative">
                  <div className="space-y-2">
                    {renderAdvancingSlot('PEMENANG 3', 'pemenang3', 'pemenangB')}
                    {renderAdvancingSlot('PEMENANG 4', 'pemenang4', 'pemenangB')}
                  </div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-16 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>

                {/* Pemenang 5 (Slot 5) */}
                <div className="pt-2">
                  {renderAdvancingSlot('PEMENANG 5', 'pemenang5')}
                </div>
              </div>

              {/* COLUMN 3: SEMIFINAL (4 TIM) */}
              <div className="flex flex-col justify-around gap-12 py-10 relative">
                <div className="space-y-16 relative">
                  <div className="space-y-10">
                    {renderAdvancingSlot('PEMENANG A', 'pemenangA', 'juara1')}
                    {renderAdvancingSlot('PEMENANG B', 'pemenangB', 'juara1')}
                  </div>
                  {/* Bracket arm connecting Semifinal A + B to Final */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-24 border-r-2 border-y-2 border-amber-400 pointer-events-none" />
                </div>
              </div>

              {/* COLUMN 4: FINAL (2 TIM) & PEREBUTAN JUARA 3 */}
              <div className="flex flex-col justify-between gap-6 py-2">
                
                {/* FINAL SECTION: JUARA 1 & JUARA 2 */}
                <div className="space-y-4">
                  
                  {/* JUARA 1 (GRAND PODIUM WITH GOLD CROWN & WREATH) */}
                  <div className="text-center relative pt-4">
                    {/* Crown on top */}
                    <div className="text-amber-400 text-3xl sm:text-4xl animate-bounce drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]">
                      👑
                    </div>

                    {/* Laurel Wreath Badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="text-amber-400 text-2xl font-bold select-none">🌿</span>
                      
                      <div className="bg-[#030612] border-3 border-amber-400 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        <span className="font-black font-display text-lg sm:text-xl text-amber-300 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                          {advancingWinners.juara1 || 'JUARA 1'}
                        </span>
                      </div>

                      <span className="text-amber-400 text-2xl font-bold select-none transform scale-x-[-1]">🌿</span>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-amber-300 mt-1">
                      Hadiah: {season.firstPrize} (100% Tunai)
                    </div>
                  </div>

                  {/* JUARA 2 (SILVER BADGE WITH SILVER CROWN) */}
                  <div className="text-center pt-2">
                    <div className="text-slate-300 text-xl drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]">
                      👑
                    </div>
                    <div className="inline-block bg-gradient-to-r from-slate-300 via-white to-slate-300 text-slate-950 font-black font-display text-sm sm:text-base px-6 py-1.5 rounded-sm transform skew-x-[-12deg] shadow-lg border border-slate-400 mt-0.5">
                      <span className="transform skew-x-[12deg] block tracking-wider">
                        {advancingWinners.juara2 || 'JUARA 2'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-slate-300 mt-1">
                      Hadiah: {season.secondPrize}
                    </div>
                  </div>
                </div>

                {/* PEREBUTAN JUARA 3 BOX (INSPIRED BY THE POSTER) */}
                <div className="border-2 border-amber-400/90 bg-[#040816] rounded-2xl p-3 space-y-2 shadow-xl relative">
                  
                  {/* Yellow brush header for Juara 3 */}
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black font-display text-[10px] sm:text-xs py-0.5 px-3 rounded-sm text-center uppercase tracking-wider -mt-5 mx-auto w-max shadow-md border border-amber-500">
                    PEREBUTAN JUARA 3
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1.5 flex-1 pr-2">
                        <div className="bg-[#080d1e] border border-amber-500/70 text-slate-200 px-2 py-1 rounded-full text-[10px] font-mono font-bold text-center">
                          TIM KALAH A
                        </div>
                        <div className="bg-[#080d1e] border border-amber-500/70 text-slate-200 px-2 py-1 rounded-full text-[10px] font-mono font-bold text-center">
                          TIM KALAH B
                        </div>
                      </div>

                      {/* Juara 3 Laurel & Bronze Badge */}
                      <div className="text-center pl-2 border-l border-amber-500/40 shrink-0">
                        <div className="text-amber-600 text-lg">👑</div>
                        <div className="bg-[#030612] border-2 border-amber-600 px-3 py-1 rounded-full text-[11px] font-black font-display text-amber-500 uppercase">
                          {advancingWinners.juara3 || 'JUARA 3'}
                        </div>
                        <div className="text-[9px] font-mono text-amber-400 mt-0.5">
                          {season.thirdPrize}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM POSTER FOOTER BANNER */}
        <div className="mt-8 text-center">
          <a
            href={contacts.tiktokUrl || 'https://tiktok.com/@kleponx.official'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#050814] hover:bg-[#0a1128] border-2 border-amber-400 rounded-full text-white font-black font-display text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:scale-102 cursor-pointer group"
          >
            {/* TikTok Icon */}
            <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-xs border border-white/20">
              🎵
            </span>
            <span className="text-amber-300 group-hover:text-amber-200 transition-colors">
              FINAL DI CHASTER DI TIKTOK KLEPON | GB FT DI BIO
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>

      </div>
    </div>
  );
};
