import {
  PlayerTeam, WinReport, Season, BlacklistEntry,
  AdminContactInfo, MatchGame, ParticipantUser, BannerPoster,
  EvidenceGuideConfig, ReportStatus
} from '../types/esports';
import { db } from './firebase';
import {
  collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc,
  serverTimestamp, getDocs, QuerySnapshot, DocumentSnapshot,
  QueryDocumentSnapshot, FirestoreError
} from 'firebase/firestore';

const STORAGE_KEY = 'klepon_weekly_turnament_state_v5';
const PARTICIPANT_KEY = 'klepon_weekly_participant_v5';
export const ADMIN_MASTER_PASSWORD = 'kleponadmin123/';

const calculateSeasonDates = (weekNum = 1) => {
  const now = new Date();
  const day = now.getDay();
  const diffToSunday = day === 0 ? 0 : 7 - day;
  const endSunday = new Date(now);
  endSunday.setDate(now.getDate() + diffToSunday);
  endSunday.setHours(23, 59, 59, 999);

  const startMonday = new Date(endSunday);
  startMonday.setDate(endSunday.getDate() - 6);
  startMonday.setHours(0, 0, 0, 0);

  return {
    startDate: startMonday.toISOString().split('T')[0],
    endDate: endSunday.toISOString().split('T')[0],
  };
};

const defaultDates = calculateSeasonDates(1);

const defaultSeason: Season = {
  id: 'season-active',
  name: 'KLEPON WEEKLY TURNAMENT FREE',
  weekNumber: 1,
  isActive: true,
  startDate: defaultDates.startDate,
  endDate: defaultDates.endDate,
  totalPrizePool: 'Rp 30.000',
  firstPrize: 'Rp 15.000',
  secondPrize: 'Rp 10.000',
  thirdPrize: 'Rp 5.000',
  entryFee: '100% GRATIS',
  lastAutoReset: new Date().toISOString(),
};

const defaultContacts: AdminContactInfo = {
  adminName: 'Admin Utama KLEPON FT (Bang Kelvin)',
  adminPhone: '6282143219876',
  consultationWaUrl: 'https://wa.me/6282143219876?text=Halo%20Panitia%20KLEPON,%20saya%20ingin%20konsultasi%20dan%20tanya-tanya%20seputar%20Turnamen%20Mingguan%20Gratis%20Free%20Fire%20Clash%20Squad',
  infoChannelName: 'Saluran Informasi Resmi KLEPON FT',
  infoChannelLink: 'https://whatsapp.com/channel/KleponWeeklyTurnamentOfficial',
  tiktokName: '@kleponx.official',
  tiktokUrl: 'https://tiktok.com/@kleponx.official',
  instagramName: '@klepon_esports',
  instagramUrl: 'https://instagram.com/klepon_esports',
  whatsappGroupName: 'Grup Khusus Turnamen Mingguan Top 10',
  whatsappGroupUrl: 'https://chat.whatsapp.com/GrupKhususBagan10Besar',
  logoUrl: '',
};

const officialMainPosterUrl = '/src/assets/images/klepon_hero_esports_1793070950068.jpg';
const sampleDoneStickerUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
const sampleAvatar = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80';

export const defaultEvidenceGuide: EvidenceGuideConfig = {
  correctScreenshotUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  correctTitle: 'Stiker DONE Resmi Admin di Jam yang Cocok (Sah & Valid)',
  correctDescription: 'Screenshot penuh chat grup WhatsApp GB yang memuat pengiriman stiker DONE / CEK dari admin resmi di jam yang cocok, tanpa sensor/crop dan tanpa editan.',
  wrongScreenshotUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  wrongTitle: 'Stiker Copas / Editan / Jam Dipotong (Palsu - Auto Blacklist)',
  wrongDescription: 'Screenshot chat palsu, stiker copas dari turnamen lain, jam dipotong, inspect element WA Web, atau screenshot lobi FF. Langsung dibanned permanen!',
  updatedAt: new Date().toISOString(),
};

const defaultBanners: BannerPoster[] = [
  {
    id: 'banner-klepon-main',
    title: 'KLEPON WEEKLY TURNAMENT FREE',
    imageUrl: officialMainPosterUrl,
    caption: 'Turnamen Gratis Free Fire Clash Squad Mingguan. Ambil Top 10 Poin Terbesar masuk babak gugur perebutan Total Hadiah Rp 30.000!',
    isMain: true,
    uploadedBy: 'Panitia KLEPON FT',
    createdAt: new Date().toISOString().split('T')[0],
  },
];

const defaultParticipants: ParticipantUser[] = [
  {
    id: 'part-01',
    phone: '081234567801',
    name: 'KLEPON ELITE CS',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-21',
    points: 12,
    wins: 12,
    matchesPlayed: 14,
  },
  {
    id: 'part-02',
    phone: '081234567802',
    name: 'GARUDA CYBER',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-22',
    points: 10,
    wins: 10,
    matchesPlayed: 12,
  },
  {
    id: 'part-03',
    phone: '081234567803',
    name: 'VANGUARD 4v4',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-23',
    points: 9,
    wins: 9,
    matchesPlayed: 11,
  },
  {
    id: 'part-04',
    phone: '081234567804',
    name: 'ROYAL DRAGONS',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-23',
    points: 7,
    wins: 7,
    matchesPlayed: 9,
  },
  {
    id: 'part-05',
    phone: '081234567805',
    name: 'BLACK PANTHER',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-24',
    points: 6,
    wins: 6,
    matchesPlayed: 8,
  },
  {
    id: 'part-06',
    phone: '081234567806',
    name: 'TITAN REBORN',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-24',
    points: 5,
    wins: 5,
    matchesPlayed: 7,
  },
  {
    id: 'part-07',
    phone: '081234567807',
    name: 'AURA NUSANTARA',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-25',
    points: 4,
    wins: 4,
    matchesPlayed: 6,
  },
  {
    id: 'part-08',
    phone: '081234567808',
    name: 'NIGHTMARE SQUAD',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-25',
    points: 4,
    wins: 4,
    matchesPlayed: 5,
  },
  {
    id: 'part-09',
    phone: '081234567809',
    name: 'GALAXY ESPORTS',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-26',
    points: 3,
    wins: 3,
    matchesPlayed: 5,
  },
  {
    id: 'part-10',
    phone: '081234567810',
    name: 'CYBER VIP CS',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-26',
    points: 2,
    wins: 2,
    matchesPlayed: 4,
  },
  {
    id: 'part-11',
    phone: '081234567811',
    name: 'SHADOW CLAN',
    photoUrl: sampleAvatar,
    registeredAt: '2026-10-26',
    points: 1,
    wins: 1,
    matchesPlayed: 3,
  },
];

const defaultPlayers: PlayerTeam[] = defaultParticipants.map((p, idx) => ({
  id: p.id,
  name: p.name,
  tag: p.name.slice(0, 3).toUpperCase(),
  captainName: `Kapten ${p.name.split(' ')[0]}`,
  phone: p.phone,
  points: p.points,
  wins: p.wins,
  matchesPlayed: p.matchesPlayed,
  game: 'Free Fire Clash Squad' as MatchGame,
  status: 'active',
  photoUrl: p.photoUrl,
  updatedAt: new Date(Date.now() - 3600000 * (idx + 1)).toISOString(),
}));

const defaultWinReports: WinReport[] = [
  {
    id: 'rep-storan-101',
    phone: '081234567801',
    teamName: 'KLEPON ELITE CS',
    captainName: 'Kapten KLEPON',
    storanDate: '2026-10-26 21:15',
    potName: 'Pot A Fast Tournament',
    screenshotUrl: sampleDoneStickerUrl,
    status: 'PENDING',
    pointsAwarded: 0,
    adminNotes: 'Menunggu pengecekan foto stiker DONE/CEK admin di grup GB FT.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'rep-storan-102',
    phone: '081234567802',
    teamName: 'GARUDA CYBER',
    captainName: 'Kapten GARUDA',
    storanDate: '2026-10-26 19:40',
    potName: 'Pot B Fast Tournament',
    screenshotUrl: sampleDoneStickerUrl,
    status: 'PENDING',
    pointsAwarded: 0,
    adminNotes: 'Menunggu verifikasi stiker CEK admin.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'rep-storan-099',
    phone: '081234567803',
    teamName: 'VANGUARD 4v4',
    captainName: 'Kapten VANGUARD',
    storanDate: '2026-10-26 16:30',
    potName: 'Pot Siang FT',
    screenshotUrl: sampleDoneStickerUrl,
    status: 'DONE',
    pointsAwarded: 1,
    adminNotes: 'SAH & VALID: Foto stiker DONE admin di chat grup terkonfirmasi. +1 Poin masuk ke kualifikasi Top 10!',
    submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    verifiedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    verifiedBy: 'Panitia KLEPON',
  },
];

const defaultBlacklist: BlacklistEntry[] = [
  {
    id: 'bl-1',
    teamName: 'CHEATER FAKE DONE',
    captainName: 'Doni Copas',
    phone: '085799988771',
    game: 'Free Fire Clash Squad',
    reason: 'Memalsukan screenshot chat stiker DONE dari turnamen lain / editan WhatsApp Web.',
    penalty: 'BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT',
    evidenceSummary: 'Pemeriksaan riwayat chat membuktikan admin tidak pernah mengirim stiker DONE pada jam tersebut.',
    date: '2026-10-24',
  },
];

interface AppState {
  season: Season;
  participants: ParticipantUser[];
  currentParticipant: ParticipantUser | null;
  players: PlayerTeam[];
  winReports: WinReport[];
  banners: BannerPoster[];
  blacklist: BlacklistEntry[];
  contacts: AdminContactInfo;
  evidenceGuide: EvidenceGuideConfig;
  isAdminLoggedIn: boolean;
  isFirestoreSyncing: boolean;
}

class FirestoreEsportsStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.initFirestoreRealtimeListeners();
    this.checkAutoReset();
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          season: { ...defaultSeason, ...(parsed.season || {}) },
          contacts: { ...defaultContacts, ...(parsed.contacts || {}) },
          banners: Array.isArray(parsed.banners) && parsed.banners.length > 0 ? parsed.banners : defaultBanners,
          players: Array.isArray(parsed.players) ? parsed.players : defaultPlayers,
          participants: Array.isArray(parsed.participants) ? parsed.participants : defaultParticipants,
          winReports: Array.isArray(parsed.winReports) ? parsed.winReports : defaultWinReports,
          blacklist: Array.isArray(parsed.blacklist) ? parsed.blacklist : defaultBlacklist,
          evidenceGuide: parsed.evidenceGuide ? { ...defaultEvidenceGuide, ...parsed.evidenceGuide } : defaultEvidenceGuide,
          currentParticipant: this.loadParticipant(),
          isAdminLoggedIn: false,
          isFirestoreSyncing: true,
        };
      }
    } catch {
      // Fallback
    }

    return {
      season: defaultSeason,
      participants: defaultParticipants,
      currentParticipant: this.loadParticipant(),
      players: defaultPlayers,
      winReports: defaultWinReports,
      banners: defaultBanners,
      blacklist: defaultBlacklist,
      contacts: defaultContacts,
      evidenceGuide: defaultEvidenceGuide,
      isAdminLoggedIn: false,
      isFirestoreSyncing: true,
    };
  }

  private loadParticipant(): ParticipantUser | null {
    try {
      const p = localStorage.getItem(PARTICIPANT_KEY);
      return p ? JSON.parse(p) : null;
    } catch {
      return null;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      if (this.state.currentParticipant) {
        localStorage.setItem(PARTICIPANT_KEY, JSON.stringify(this.state.currentParticipant));
      } else {
        localStorage.removeItem(PARTICIPANT_KEY);
      }
    } catch {
      // Ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Realtime Firestore onSnapshot listeners
  private initFirestoreRealtimeListeners() {
    try {
      // 1. Listen to Players (Leaderboard)
      onSnapshot(collection(db, 'players'), (snapshot: QuerySnapshot) => {
        if (!snapshot.empty) {
          const remotePlayers: PlayerTeam[] = [];
          snapshot.forEach((d: QueryDocumentSnapshot) => remotePlayers.push(d.data() as PlayerTeam));
          const pMap = new Map<string, PlayerTeam>();
          this.state.players.forEach((p) => pMap.set(p.id, p));
          remotePlayers.forEach((p) => pMap.set(p.id, p));
          this.state.players = Array.from(pMap.values());
          this.saveState();
        } else {
          // Seed initial players to Firestore if empty
          defaultPlayers.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'players', p.id), p);
            } catch {
              // ignore
            }
          });
        }
      }, (err: FirestoreError) => {
        console.warn('Firestore players realtime fallback:', err.message);
      });

      // 2. Listen to WinReports (Real-time sync to Admin Dashboard)
      onSnapshot(collection(db, 'winReports'), (snapshot: QuerySnapshot) => {
        if (!snapshot.empty) {
          const remoteReports: WinReport[] = [];
          snapshot.forEach((d: QueryDocumentSnapshot) => remoteReports.push(d.data() as WinReport));
          const rMap = new Map<string, WinReport>();
          this.state.winReports.forEach((r) => rMap.set(r.id, r));
          remoteReports.forEach((r) => rMap.set(r.id, r));
          this.state.winReports = Array.from(rMap.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          this.saveState();
        } else {
          defaultWinReports.forEach(async (r) => {
            try {
              await setDoc(doc(db, 'winReports', r.id), r);
            } catch {
              // ignore
            }
          });
        }
      }, (err: FirestoreError) => {
        console.warn('Firestore winReports realtime fallback:', err.message);
      });

      // 3. Listen to Banners from Gallery
      onSnapshot(collection(db, 'banners'), (snapshot: QuerySnapshot) => {
        if (!snapshot.empty) {
          const remoteBanners: BannerPoster[] = [];
          snapshot.forEach((d: QueryDocumentSnapshot) => remoteBanners.push(d.data() as BannerPoster));
          const bMap = new Map<string, BannerPoster>();
          this.state.banners.forEach((b) => bMap.set(b.id, b));
          remoteBanners.forEach((b) => bMap.set(b.id, b));
          this.state.banners = Array.from(bMap.values());
          this.saveState();
        } else {
          defaultBanners.forEach(async (b) => {
            try {
              await setDoc(doc(db, 'banners', b.id), b);
            } catch {
              // ignore
            }
          });
        }
      }, (err: FirestoreError) => {
        console.warn('Firestore banners realtime fallback:', err.message);
      });

      // 4. Listen to Season
      onSnapshot(doc(db, 'season', 'active'), (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          this.state.season = snapshot.data() as Season;
          this.saveState();
        } else {
          setDoc(doc(db, 'season', 'active'), defaultSeason).catch(() => {});
        }
      }, (err: FirestoreError) => {
        console.warn('Firestore season realtime fallback:', err.message);
      });

      // 5. Listen to Blacklist
      onSnapshot(collection(db, 'blacklist'), (snapshot: QuerySnapshot) => {
        const remoteBl: BlacklistEntry[] = [];
        snapshot.forEach((d: QueryDocumentSnapshot) => remoteBl.push(d.data() as BlacklistEntry));
        this.state.blacklist = remoteBl;
        this.saveState();
      }, (err: FirestoreError) => {
        console.warn('Firestore blacklist realtime fallback:', err.message);
      });

      // 6. Listen to Contacts (TikTok, IG, WhatsApp live sync)
      onSnapshot(doc(db, 'contacts', 'active'), (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          this.state.contacts = { ...defaultContacts, ...(snapshot.data() as AdminContactInfo) };
          this.saveState();
        } else {
          setDoc(doc(db, 'contacts', 'active'), defaultContacts).catch(() => {});
        }
      }, (err: FirestoreError) => {
        console.warn('Firestore contacts realtime fallback:', err.message);
      });

      // 7. Listen to Participants (Realtime Sync & Deletion)
      onSnapshot(collection(db, 'participants'), (snapshot: QuerySnapshot) => {
        const remoteParticipants: ParticipantUser[] = [];
        snapshot.forEach((d: QueryDocumentSnapshot) => remoteParticipants.push(d.data() as ParticipantUser));
        this.state.participants = remoteParticipants;
        this.saveState();
      }, (err: FirestoreError) => {
        console.warn('Firestore participants realtime fallback:', err.message);
      });

      // 8. Listen to Evidence Guide Config (SS GB Benar vs Salah)
      onSnapshot(doc(db, 'config', 'evidenceGuide'), (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          this.state.evidenceGuide = { ...defaultEvidenceGuide, ...(snapshot.data() as EvidenceGuideConfig) };
          this.saveState();
        } else {
          setDoc(doc(db, 'config', 'evidenceGuide'), defaultEvidenceGuide).catch(() => {});
        }
      }, (err: FirestoreError) => {
        console.warn('Firestore evidenceGuide realtime fallback:', err.message);
      });
    } catch (e) {
      console.warn('Firestore init error, running local reactive bridge:', e);
    }
  }

  // Automatic reset logic if period ends
  public checkAutoReset(): boolean {
    const now = new Date();
    const end = new Date(this.state.season.endDate + 'T23:59:59');

    if (now.getTime() > end.getTime()) {
      // 1. Reset points on all participants (DO NOT DELETE PARTICIPANTS!)
      this.state.participants = this.state.participants.map((p) => ({
        ...p,
        points: 0,
        wins: 0,
        matchesPlayed: 0,
        streak: 0,
      }));

      // 2. Also reset current active participant points if logged in
      if (this.state.currentParticipant) {
        this.state.currentParticipant = {
          ...this.state.currentParticipant,
          points: 0,
          wins: 0,
          matchesPlayed: 0,
          streak: 0,
        };
      }

      // 3. Reset players
      this.state.players = this.state.players.map((p) => ({
        ...p,
        points: 0,
        wins: 0,
        matchesPlayed: 0,
        streak: 0,
        updatedAt: new Date().toISOString(),
      }));

      const nextWeek = (this.state.season.weekNumber || 1) + 1;
      const newDates = calculateSeasonDates(nextWeek);
      this.state.season.weekNumber = nextWeek;
      this.state.season.name = 'KLEPON WEEKLY TURNAMENT FREE';
      this.state.season.startDate = newDates.startDate;
      this.state.season.endDate = newDates.endDate;
      this.state.season.lastAutoReset = new Date().toISOString();

      // Sync to Firestore: update season, participants, and players
      try {
        setDoc(doc(db, 'season', 'active'), this.state.season).catch(() => {});
        this.state.participants.forEach((p) => {
          setDoc(doc(db, 'participants', p.id), p, { merge: true }).catch(() => {});
        });
        this.state.players.forEach((p) => {
          setDoc(doc(db, 'players', p.id), p, { merge: true }).catch(() => {});
        });
      } catch {
        // ignore
      }

      this.saveState();
      return true;
    }
    return false;
  }

  // Calculate current consecutive win streak for a team
  public calculateTeamStreak(phone: string, teamName?: string, currentWins: number = 0, explicitStreak?: number): number {
    if (explicitStreak !== undefined && explicitStreak >= 0) {
      return explicitStreak;
    }

    const cleanPhone = (phone || '').trim().toLowerCase();
    const cleanName = (teamName || '').trim().toLowerCase();

    const reports = (this.state.winReports || []).filter((r) => {
      const matchPhone = cleanPhone && (r.phone || '').trim().toLowerCase() === cleanPhone;
      const matchName = cleanName && (r.teamName || '').trim().toLowerCase() === cleanName;
      return matchPhone || matchName;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    if (reports.length > 0) {
      let streak = 0;
      for (const rep of reports) {
        if (rep.status === 'DONE') {
          streak += 1;
        } else if (rep.status === 'REJECTED') {
          break;
        }
      }
      return streak;
    }

    return currentWins > 0 ? Math.min(currentWins, 5) : 0;
  }

  // Getters
  public getSeason(): Season {
    return { ...defaultSeason, ...(this.state.season || {}) };
  }

  public getParticipants(): ParticipantUser[] {
    return Array.isArray(this.state.participants) ? this.state.participants : [];
  }

  public getCurrentParticipant(): ParticipantUser | null {
    return this.state.currentParticipant || null;
  }

  public getPlayers(): PlayerTeam[] {
    // Strictly synchronized with registered participants
    const participants = this.getParticipants();
    if (!participants || participants.length === 0) {
      return [];
    }

    return participants.map((p) => {
      const wins = Number(p.wins) || 0;
      const streak = this.calculateTeamStreak(p.phone, p.name, wins, p.streak);
      return {
        id: p.id,
        name: p.name || 'Tim Tanpa Nama',
        tag: (p.name.trim().slice(0, 3) || 'FT').toUpperCase(),
        captainName: p.name || 'Kapten',
        phone: p.phone || '',
        points: Number(p.points) || 0,
        wins: wins,
        matchesPlayed: Number(p.matchesPlayed) || 0,
        streak: streak,
        game: 'Free Fire Clash Squad' as const,
        status: 'active' as const,
        photoUrl: p.photoUrl,
        updatedAt: p.registeredAt || new Date().toISOString(),
      };
    }).sort((a, b) => b.points - a.points || b.wins - a.wins);
  }

  public getTop10Players(): PlayerTeam[] {
    return this.getPlayers().slice(0, 10);
  }

  public getWinReports(): WinReport[] {
    const rawList = Array.isArray(this.state.winReports) ? this.state.winReports : [];
    return [...rawList].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  public getUserWinReports(phone?: string): WinReport[] {
    const targetPhone = (phone || this.state.currentParticipant?.phone || '').trim().toLowerCase();
    const cleanName = (this.state.currentParticipant?.name || '').trim().toLowerCase();
    const partId = this.state.currentParticipant?.id;

    if (!targetPhone && !cleanName && !partId) return [];

    return this.getWinReports().filter((r) => {
      const matchPhone = targetPhone && r.phone && r.phone.trim().toLowerCase() === targetPhone;
      const matchName = cleanName && r.teamName && r.teamName.trim().toLowerCase() === cleanName;
      const matchId = partId && r.participantId && r.participantId === partId;
      return matchPhone || matchName || matchId;
    });
  }

  public getBanners(): BannerPoster[] {
    const rawList = Array.isArray(this.state.banners) && this.state.banners.length > 0 ? this.state.banners : defaultBanners;
    return [...rawList].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
  }

  public getMainBanner(): BannerPoster {
    const banners = this.getBanners();
    const main = banners.find((b) => b.isMain);
    return main || banners[0] || defaultBanners[0];
  }

  public getBlacklist(): BlacklistEntry[] {
    return Array.isArray(this.state.blacklist) ? this.state.blacklist : [];
  }

  public getEvidenceGuide(): EvidenceGuideConfig {
    return this.state.evidenceGuide || defaultEvidenceGuide;
  }

  public updateEvidenceGuide(data: Partial<EvidenceGuideConfig>): void {
    this.state.evidenceGuide = {
      ...this.getEvidenceGuide(),
      ...data,
      updatedAt: new Date().toISOString(),
    };
    try {
      setDoc(doc(db, 'config', 'evidenceGuide'), this.state.evidenceGuide, { merge: true }).catch((err) => {
        console.warn('Evidence guide update error:', err);
      });
    } catch {
      // ignore
    }
    this.saveState();
  }

  public getContacts(): AdminContactInfo {
    return { ...defaultContacts, ...(this.state.contacts || {}) };
  }

  public getCustomLogo(): string {
    return this.getContacts().logoUrl || '';
  }

  public updateCustomLogo(logoUrl: string): void {
    const trimmed = (logoUrl || '').trim();
    this.state.contacts = {
      ...this.getContacts(),
      logoUrl: trimmed,
    };
    try {
      setDoc(doc(db, 'contacts', 'active'), this.state.contacts, { merge: true }).catch((err) => {
        console.warn('Update custom logo doc error:', err);
      });
      setDoc(doc(db, 'config', 'branding'), { logoUrl: trimmed, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch {
      // ignore
    }
    this.saveState();
  }

  public isAdmin(): boolean {
    return this.state.isAdminLoggedIn;
  }

  // Add banner / poster from gallery
  public addBannerPoster(data: {
    title: string;
    imageUrl: string;
    caption?: string;
    isMain?: boolean;
    uploadedBy?: string;
  }): BannerPoster {
    const newBanner: BannerPoster = {
      id: `banner-${Date.now()}`,
      title: data.title.trim(),
      imageUrl: data.imageUrl,
      caption: data.caption,
      isMain: Boolean(data.isMain),
      uploadedBy: data.uploadedBy || 'Peserta Komunitas',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    if (newBanner.isMain) {
      this.state.banners = this.state.banners.map((b) => ({ ...b, isMain: false }));
    }

    this.state.banners.unshift(newBanner);

    // Save to Firestore
    try {
      setDoc(doc(db, 'banners', newBanner.id), newBanner);
    } catch {
      // ignore
    }

    this.saveState();
    return newBanner;
  }

  public setMainBanner(bannerId: string): void {
    this.state.banners = this.state.banners.map((b) => ({
      ...b,
      isMain: b.id === bannerId,
    }));

    this.state.banners.forEach((b) => {
      setDoc(doc(db, 'banners', b.id), b).catch(() => {});
    });

    this.saveState();
  }

  public updateBannerPoster(
    bannerId: string,
    data: {
      title?: string;
      imageUrl?: string;
      caption?: string;
      isMain?: boolean;
    }
  ): BannerPoster | null {
    const idx = this.state.banners.findIndex((b) => b.id === bannerId);
    if (idx === -1) return null;

    if (data.isMain) {
      this.state.banners = this.state.banners.map((b) => ({ ...b, isMain: false }));
    }

    const current = this.state.banners[idx];
    const updated: BannerPoster = {
      ...current,
      title: data.title !== undefined ? data.title.trim() : current.title,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : current.imageUrl,
      caption: data.caption !== undefined ? data.caption : current.caption,
      isMain: data.isMain !== undefined ? data.isMain : current.isMain,
    };

    this.state.banners[idx] = updated;

    try {
      setDoc(doc(db, 'banners', bannerId), updated, { merge: true }).catch((err) => {
        console.warn('Banner update doc error:', err);
      });
    } catch {
      // ignore
    }

    this.saveState();
    return updated;
  }

  public deleteBannerPoster(bannerId: string): void {
    this.state.banners = this.state.banners.filter((b) => b.id !== bannerId);
    if (!this.state.banners.some((b) => b.isMain) && this.state.banners.length > 0) {
      this.state.banners[0].isMain = true;
    }
    deleteDoc(doc(db, 'banners', bannerId)).catch((err) => console.warn('Banner delete error:', err));
    this.saveState();
  }

  public findParticipantByPhone(phone: string): ParticipantUser | null {
    const clean = phone.trim().toLowerCase();
    if (!clean) return null;
    return this.state.participants.find((p) => p.phone.toLowerCase() === clean) || null;
  }

  public findParticipantByName(name: string): ParticipantUser | null {
    const clean = name.trim().toLowerCase();
    if (!clean) return null;
    return this.state.participants.find((p) => p.name.toLowerCase() === clean) || null;
  }

  public setCurrentParticipant(participant: ParticipantUser): void {
    this.state.currentParticipant = participant;
    this.saveState();
  }

  public verifyAndLoginAdmin(password: string): boolean {
    if (password === ADMIN_MASTER_PASSWORD) {
      this.state.isAdminLoggedIn = true;
      this.saveState();
      return true;
    }
    return false;
  }

  public logoutAdmin(): void {
    this.state.isAdminLoggedIn = false;
    this.saveState();
  }

  public authParticipant(data: { phone: string; name: string; photoUrl: string }): ParticipantUser {
    const cleanPhone = data.phone.trim();
    const cleanName = data.name.trim();

    let participant = this.state.participants.find(
      (p) => p.phone === cleanPhone || p.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (participant) {
      participant.name = cleanName;
      if (data.photoUrl) participant.photoUrl = data.photoUrl;
    } else {
      participant = {
        id: `part-${Date.now()}`,
        phone: cleanPhone,
        name: cleanName,
        photoUrl: data.photoUrl || sampleAvatar,
        registeredAt: new Date().toISOString().split('T')[0],
        points: 0,
        wins: 0,
        matchesPlayed: 0,
      };
      this.state.participants.push(participant);
    }

    let player = this.state.players.find(
      (pl) => pl.phone === cleanPhone || pl.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (!player) {
      player = {
        id: participant.id,
        name: cleanName,
        tag: cleanName.slice(0, 3).toUpperCase(),
        captainName: cleanName,
        phone: cleanPhone,
        points: participant.points,
        wins: participant.wins,
        matchesPlayed: participant.matchesPlayed,
        game: 'Free Fire Clash Squad',
        status: 'active',
        photoUrl: participant.photoUrl,
        updatedAt: new Date().toISOString(),
      };
      this.state.players.push(player);
    }

    // Sync to Firestore
    try {
      setDoc(doc(db, 'participants', participant.id), participant);
      setDoc(doc(db, 'players', player.id), player);
    } catch {
      // ignore
    }

    this.state.currentParticipant = participant;
    this.saveState();
    return participant;
  }

  public logoutParticipant(): void {
    this.state.currentParticipant = null;
    this.saveState();
  }

  public submitStoranMenang(data: {
    storanDate: string;
    potName?: string;
    screenshotUrl: string;
  }): { success: boolean; message: string; report?: WinReport } {
    if (!this.state.currentParticipant) {
      return {
        success: false,
        message: 'Wajib login atau daftar peserta terlebih dahulu sebelum menyetor kemenangan!',
      };
    }

    const participant = this.state.currentParticipant;

    let player = this.state.players.find(
      (p) => p.phone === participant.phone || p.name.toLowerCase() === participant.name.toLowerCase()
    );

    if (player) {
      player.matchesPlayed += 1;
    }

    const newReport: WinReport = {
      id: `rep-${Date.now()}`,
      participantId: participant.id,
      phone: participant.phone,
      teamName: participant.name,
      captainName: participant.name,
      storanDate: data.storanDate,
      potName: data.potName || 'Fast Tournament Clash Squad',
      screenshotUrl: data.screenshotUrl,
      status: 'PENDING',
      pointsAwarded: 0,
      adminNotes: `Storan tgl ${data.storanDate}. Menunggu verifikasi foto stiker DONE/CEK panitia di GB.`,
      submittedAt: new Date().toISOString(),
    };

    this.state.winReports.unshift(newReport);

    // Save to Firestore in real-time
    setDoc(doc(db, 'winReports', newReport.id), newReport)
      .then(() => {
        console.log('✅ Realtime: Storan kemenangan berhasil masuk ke Firestore:', newReport.id);
      })
      .catch((err) => {
        console.error('❌ Gagal sinkron storan kemenangan ke Firestore:', err);
      });

    if (player) {
      setDoc(doc(db, 'players', player.id), player).catch((err) => {
        console.error('❌ Gagal update player ke Firestore:', err);
      });
    }

    this.saveState();
    return {
      success: true,
      message: 'Storan kemenangan berhasil dikirim! Menunggu admin verifikasi foto stiker DONE.',
      report: newReport,
    };
  }

  public approveWinReport(reportId: string, adminName: string): boolean {
    const report = this.state.winReports.find((r) => r.id === reportId);
    if (!report) return false;

    if (report.status !== 'DONE') {
      report.status = 'DONE';
      report.pointsAwarded = 1;
      report.verifiedAt = new Date().toISOString();
      report.verifiedBy = adminName;
      report.adminNotes = 'VERIFIKASI SAH: Foto stiker DONE/CEK admin di grup GB terkonfirmasi. +1 Poin otomatis masuk ke klasemen kualifikasi!';

      const team = this.state.players.find(
        (p) => p.phone === report.phone || p.name.toLowerCase() === report.teamName.toLowerCase()
      );
      if (team) {
        team.points += 1;
        team.wins += 1;
        team.updatedAt = new Date().toISOString();
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }

      const part = this.state.participants.find((p) => p.phone === report.phone);
      if (part) {
        part.points += 1;
        part.wins += 1;
        setDoc(doc(db, 'participants', part.id), part).catch(() => {});
      }

      setDoc(doc(db, 'winReports', report.id), report).catch(() => {});
    }

    this.saveState();
    return true;
  }

  public rejectWinReport(reportId: string, reason: string, adminName: string): boolean {
    const report = this.state.winReports.find((r) => r.id === reportId);
    if (!report) return false;

    if (report.status === 'DONE') {
      const team = this.state.players.find(
        (p) => p.phone === report.phone || p.name.toLowerCase() === report.teamName.toLowerCase()
      );
      if (team && team.points > 0) {
        team.points -= 1;
        team.wins = Math.max(0, team.wins - 1);
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }
    }

    report.status = 'REJECTED';
    report.pointsAwarded = 0;
    report.verifiedAt = new Date().toISOString();
    report.verifiedBy = adminName;
    report.adminNotes = `DITOLAK: ${reason}`;

    setDoc(doc(db, 'winReports', report.id), report).catch(() => {});
    this.saveState();
    return true;
  }

  public deleteWinReport(reportId: string, revertPoints = true): boolean {
    const report = this.state.winReports.find((r) => r.id === reportId);
    if (!report) return false;

    // If report was DONE (verified) and we are reverting points, deduct from team & participant
    if (revertPoints && report.status === 'DONE') {
      const team = this.state.players.find(
        (p) => p.phone === report.phone || p.name.toLowerCase() === report.teamName.toLowerCase()
      );
      if (team && team.points > 0) {
        team.points = Math.max(0, team.points - (report.pointsAwarded || 1));
        team.wins = Math.max(0, team.wins - 1);
        team.updatedAt = new Date().toISOString();
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }

      const part = this.state.participants.find((p) => p.phone === report.phone);
      if (part && part.points > 0) {
        part.points = Math.max(0, part.points - (report.pointsAwarded || 1));
        part.wins = Math.max(0, part.wins - 1);
        setDoc(doc(db, 'participants', part.id), part).catch(() => {});
      }
    }

    // Remove from in-memory array
    this.state.winReports = this.state.winReports.filter((r) => r.id !== reportId);

    // Delete from Firestore
    try {
      deleteDoc(doc(db, 'winReports', reportId)).catch((err) => {
        console.warn('Delete winReport error:', err);
      });
    } catch {
      // ignore
    }

    this.saveState();
    return true;
  }

  public updateWinReport(reportId: string, updates: Partial<WinReport>): boolean {
    const idx = this.state.winReports.findIndex((r) => r.id === reportId);
    if (idx === -1) return false;

    const current = this.state.winReports[idx];
    const prevStatus = current.status;
    const nextStatus = updates.status || prevStatus;

    // Handle point adjustments if status toggled
    if (prevStatus !== 'DONE' && nextStatus === 'DONE') {
      // Add points
      const targetPhone = updates.phone || current.phone;
      const targetName = updates.teamName || current.teamName;
      const team = this.state.players.find(
        (p) => p.phone === targetPhone || p.name.toLowerCase() === targetName.toLowerCase()
      );
      if (team) {
        team.points += 1;
        team.wins += 1;
        team.updatedAt = new Date().toISOString();
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }
      const part = this.state.participants.find((p) => p.phone === targetPhone);
      if (part) {
        part.points += 1;
        part.wins += 1;
        setDoc(doc(db, 'participants', part.id), part).catch(() => {});
      }
      updates.pointsAwarded = 1;
      updates.verifiedAt = new Date().toISOString();
    } else if (prevStatus === 'DONE' && nextStatus !== 'DONE') {
      // Remove points
      const team = this.state.players.find(
        (p) => p.phone === current.phone || p.name.toLowerCase() === current.teamName.toLowerCase()
      );
      if (team && team.points > 0) {
        team.points = Math.max(0, team.points - 1);
        team.wins = Math.max(0, team.wins - 1);
        team.updatedAt = new Date().toISOString();
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }
      const part = this.state.participants.find((p) => p.phone === current.phone);
      if (part && part.points > 0) {
        part.points = Math.max(0, part.points - 1);
        part.wins = Math.max(0, part.wins - 1);
        setDoc(doc(db, 'participants', part.id), part).catch(() => {});
      }
      updates.pointsAwarded = 0;
      updates.verifiedAt = new Date().toISOString();
    }

    const updated: WinReport = {
      ...current,
      ...updates,
    };

    this.state.winReports[idx] = updated;

    try {
      setDoc(doc(db, 'winReports', reportId), updated, { merge: true }).catch((err) => {
        console.warn('Update winReport error:', err);
      });
    } catch {
      // ignore
    }

    this.saveState();
    return true;
  }

  public addManualWinReport(data: {
    phone: string;
    teamName: string;
    captainName?: string;
    potName?: string;
    storanDate?: string;
    screenshotUrl?: string;
    status: ReportStatus;
    adminNotes?: string;
  }): WinReport {
    const isDone = data.status === 'DONE';
    const pointsAwarded = isDone ? 1 : 0;
    const nowIso = new Date().toISOString();

    const newReport: WinReport = {
      id: `rep-manual-${Date.now()}`,
      phone: data.phone.trim(),
      teamName: data.teamName.trim(),
      captainName: data.captainName?.trim() || data.teamName.trim(),
      storanDate: data.storanDate || nowIso.slice(0, 16).replace('T', ' '),
      potName: data.potName?.trim() || 'Fast Tournament FF',
      screenshotUrl: data.screenshotUrl || sampleDoneStickerUrl,
      status: data.status,
      pointsAwarded,
      adminNotes: data.adminNotes?.trim() || (isDone ? 'Ditambahkan manual oleh Panitia KLEPON FT (Status: Sah)' : 'Dicatat sebagai laporan Ditolak / Melanggar oleh Admin'),
      submittedAt: nowIso,
      verifiedAt: nowIso,
      verifiedBy: 'Panitia KLEPON FT',
    };

    this.state.winReports.unshift(newReport);

    if (isDone) {
      const team = this.state.players.find(
        (p) => p.phone === newReport.phone || p.name.toLowerCase() === newReport.teamName.toLowerCase()
      );
      if (team) {
        team.points += 1;
        team.wins += 1;
        team.updatedAt = nowIso;
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }
      const part = this.state.participants.find((p) => p.phone === newReport.phone);
      if (part) {
        part.points += 1;
        part.wins += 1;
        setDoc(doc(db, 'participants', part.id), part).catch(() => {});
      }
    }

    try {
      setDoc(doc(db, 'winReports', newReport.id), newReport).catch((err) => {
        console.warn('Save manual winReport error:', err);
      });
    } catch {
      // ignore
    }

    this.saveState();
    return newReport;
  }

  public blacklistTeam(teamName: string, phone: string, reason: string, penalty: string, evidenceSummary: string): void {
    this.addBlacklistEntry({
      teamName,
      captainName: teamName,
      phone,
      reason,
      penalty,
      evidenceSummary,
    });
  }

  public addBlacklistEntry(data: {
    teamName: string;
    captainName?: string;
    phone: string;
    reason: string;
    penalty?: string;
    evidenceSummary?: string;
  }): BlacklistEntry {
    const newEntry: BlacklistEntry = {
      id: `bl-${Date.now()}`,
      teamName: data.teamName.trim(),
      captainName: data.captainName?.trim() || data.teamName.trim(),
      phone: data.phone.trim(),
      game: 'Free Fire Clash Squad',
      reason: data.reason.trim(),
      penalty: data.penalty?.trim() || 'BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT',
      evidenceSummary: data.evidenceSummary?.trim() || 'Terbukti memalsukan bukti stiker DONE / melanggar integritas turnamen.',
      date: new Date().toISOString().split('T')[0],
    };

    this.state.blacklist.unshift(newEntry);

    const team = this.state.players.find(
      (p) => p.name.toLowerCase() === newEntry.teamName.toLowerCase() || p.phone === newEntry.phone
    );
    if (team) {
      team.status = 'blacklisted';
      setDoc(doc(db, 'players', team.id), team).catch(() => {});
    }

    setDoc(doc(db, 'blacklist', newEntry.id), newEntry).catch((err) => {
      console.warn('Blacklist save error:', err);
    });
    this.saveState();
    return newEntry;
  }

  public updateBlacklistEntry(id: string, data: Partial<BlacklistEntry>): void {
    const idx = this.state.blacklist.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.state.blacklist[idx] = {
        ...this.state.blacklist[idx],
        ...data,
      };
      setDoc(doc(db, 'blacklist', id), this.state.blacklist[idx]).catch((err) => {
        console.warn('Blacklist update error:', err);
      });
      this.saveState();
    }
  }

  public deleteBlacklistEntry(id: string): void {
    const entry = this.state.blacklist.find((b) => b.id === id);
    this.state.blacklist = this.state.blacklist.filter((b) => b.id !== id);
    if (entry) {
      const team = this.state.players.find(
        (p) => p.name.toLowerCase() === entry.teamName.toLowerCase() || p.phone === entry.phone
      );
      if (team) {
        team.status = 'active';
        setDoc(doc(db, 'players', team.id), team).catch(() => {});
      }
    }
    deleteDoc(doc(db, 'blacklist', id)).catch((err) => console.warn('Blacklist delete error:', err));
    this.saveState();
  }

  public manualResetSeason(): void {
    // 1. Reset points on all participants (DO NOT DELETE PARTICIPANTS! Participants remain registered)
    this.state.participants = this.state.participants.map((p) => ({
      ...p,
      points: 0,
      wins: 0,
      matchesPlayed: 0,
      streak: 0,
    }));

    // 2. Also reset current logged in participant points without logging out
    if (this.state.currentParticipant) {
      this.state.currentParticipant = {
        ...this.state.currentParticipant,
        points: 0,
        wins: 0,
        matchesPlayed: 0,
        streak: 0,
      };
    }

    // 3. Reset players
    this.state.players = this.state.players.map((p) => ({
      ...p,
      points: 0,
      wins: 0,
      matchesPlayed: 0,
      streak: 0,
      updatedAt: new Date().toISOString(),
    }));

    const nextWeek = (this.state.season.weekNumber || 1) + 1;
    const newDates = calculateSeasonDates(nextWeek);
    this.state.season.weekNumber = nextWeek;
    this.state.season.name = 'KLEPON WEEKLY TURNAMENT FREE';
    this.state.season.startDate = newDates.startDate;
    this.state.season.endDate = newDates.endDate;
    this.state.season.lastAutoReset = new Date().toISOString();

    // Persist to Firestore: update season, participants, and players
    try {
      setDoc(doc(db, 'season', 'active'), this.state.season).catch(() => {});
      this.state.participants.forEach((p) => {
        setDoc(doc(db, 'participants', p.id), p, { merge: true }).catch(() => {});
      });
      this.state.players.forEach((p) => {
        setDoc(doc(db, 'players', p.id), p, { merge: true }).catch(() => {});
      });
    } catch {
      // ignore
    }

    this.saveState();
  }

  public deleteParticipant(id: string): void {
    const part = this.state.participants.find((p) => p.id === id);
    const phone = part?.phone;
    const name = part?.name;

    this.state.participants = this.state.participants.filter((p) => p.id !== id);

    // Also remove from players list by id, phone, or name
    const matchedPlayers = this.state.players.filter(
      (pl) => pl.id === id || (phone && pl.phone === phone) || (name && pl.name.toLowerCase() === name.toLowerCase())
    );
    this.state.players = this.state.players.filter(
      (pl) => pl.id !== id && (!phone || pl.phone !== phone) && (!name || pl.name.toLowerCase() !== name.toLowerCase())
    );

    matchedPlayers.forEach((pl) => {
      deleteDoc(doc(db, 'players', pl.id)).catch(() => {});
    });

    // Also remove their win reports if any
    if (phone || name) {
      const reportsToDelete = this.state.winReports.filter(
        (r) => (phone ? r.phone === phone : false) || (name ? r.teamName.toLowerCase() === name.toLowerCase() : false)
      );
      this.state.winReports = this.state.winReports.filter(
        (r) => (phone ? r.phone !== phone : true) && (name ? r.teamName.toLowerCase() !== name.toLowerCase() : true)
      );
      reportsToDelete.forEach((r) => {
        deleteDoc(doc(db, 'winReports', r.id)).catch(() => {});
      });
    }

    if (this.state.currentParticipant?.id === id || (phone && this.state.currentParticipant?.phone === phone)) {
      this.state.currentParticipant = null;
    }

    deleteDoc(doc(db, 'participants', id)).catch(() => {});
    deleteDoc(doc(db, 'players', id)).catch(() => {});

    this.saveState();
  }

  public updateParticipant(
    id: string,
    data: { name?: string; phone?: string; points?: number; wins?: number; matchesPlayed?: number; photoUrl?: string }
  ): void {
    const pIdx = this.state.participants.findIndex((p) => p.id === id);
    let oldPhone = '';
    let oldName = '';
    if (pIdx !== -1) {
      oldPhone = this.state.participants[pIdx].phone;
      oldName = this.state.participants[pIdx].name;
      this.state.participants[pIdx] = {
        ...this.state.participants[pIdx],
        ...data,
      };
      setDoc(doc(db, 'participants', id), this.state.participants[pIdx], { merge: true }).catch(() => {});
    }

    // Match player by ID, oldPhone, newPhone, or name
    const plIdx = this.state.players.findIndex(
      (p) =>
        p.id === id ||
        (oldPhone && p.phone === oldPhone) ||
        (data.phone && p.phone === data.phone) ||
        (oldName && p.name.toLowerCase() === oldName.toLowerCase())
    );

    if (plIdx !== -1) {
      this.state.players[plIdx] = {
        ...this.state.players[plIdx],
        name: data.name ?? this.state.players[plIdx].name,
        captainName: data.name ?? this.state.players[plIdx].captainName,
        phone: data.phone ?? this.state.players[plIdx].phone,
        points: data.points !== undefined ? data.points : this.state.players[plIdx].points,
        wins: data.wins !== undefined ? data.wins : this.state.players[plIdx].wins,
        matchesPlayed: data.matchesPlayed !== undefined ? data.matchesPlayed : this.state.players[plIdx].matchesPlayed,
        photoUrl: data.photoUrl ?? this.state.players[plIdx].photoUrl,
        updatedAt: new Date().toISOString(),
      };
      setDoc(doc(db, 'players', this.state.players[plIdx].id), this.state.players[plIdx], { merge: true }).catch(() => {});
    } else if (pIdx !== -1) {
      const p = this.state.participants[pIdx];
      const newPlayer: PlayerTeam = {
        id: p.id,
        name: p.name,
        tag: (p.name.trim().slice(0, 3) || 'FT').toUpperCase(),
        captainName: p.name,
        phone: p.phone,
        points: p.points || 0,
        wins: p.wins || 0,
        matchesPlayed: p.matchesPlayed || 0,
        game: 'Free Fire Clash Squad',
        status: 'active',
        photoUrl: p.photoUrl,
        updatedAt: new Date().toISOString(),
      };
      this.state.players.push(newPlayer);
      setDoc(doc(db, 'players', newPlayer.id), newPlayer, { merge: true }).catch(() => {});
    }

    // Update current participant if active
    if (this.state.currentParticipant?.id === id || (oldPhone && this.state.currentParticipant?.phone === oldPhone)) {
      this.state.currentParticipant = {
        ...this.state.currentParticipant,
        ...data,
      };
    }

    // Update related win reports if name or phone changed
    if ((data.phone && oldPhone && data.phone !== oldPhone) || (data.name && oldName && data.name !== oldName)) {
      this.state.winReports = this.state.winReports.map((r) => {
        if ((oldPhone && r.phone === oldPhone) || (oldName && r.teamName.toLowerCase() === oldName.toLowerCase())) {
          const updatedRep = {
            ...r,
            phone: data.phone || r.phone,
            teamName: data.name || r.teamName,
          };
          setDoc(doc(db, 'winReports', r.id), updatedRep, { merge: true }).catch(() => {});
          return updatedRep;
        }
        return r;
      });
    }

    this.saveState();
  }

  public updateSeason(data: Partial<Season>): void {
    this.state.season = {
      ...this.state.season,
      ...data,
      name: 'KLEPON WEEKLY TURNAMENT FREE',
    };
    setDoc(doc(db, 'season', 'active'), this.state.season).catch(() => {});
    this.saveState();
  }

  public updateContacts(newContacts: Partial<AdminContactInfo>): void {
    this.state.contacts = {
      ...this.state.contacts,
      ...newContacts,
    };
    try {
      setDoc(doc(db, 'contacts', 'active'), this.state.contacts);
    } catch (err) {
      console.warn('Contacts Firestore save error:', err);
    }
    this.saveState();
  }

  public getTop10InviteLink(player: PlayerTeam, rank: number): string {
    const cleanPhone = player.phone.startsWith('0') ? '62' + player.phone.slice(1) : player.phone;
    const msg = `Halo Tim *${player.name}* (Kapten: ${player.captainName})! 🔥\n\nSelamat! Anda berada di *Peringkat #${rank}* dengan total *${player.points} Poin* dan resmi LOLOS ke *Bagan 10 Besar Turnamen Mingguan Gratis KLEPON WEEKLY TURNAMENT FREE*!\n\nSilakan bergabung ke Grup Khusus Turnamen Mingguan untuk jadwal tanding sistem bagan gugur perebutan Total Hadiah Rp 30.000:\n🔗 https://chat.whatsapp.com/GrupKhususBagan10Besar\n\n_Mohon konfirmasi kesiapan squad Anda kepada panitia. Terima kasih!_`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }
}

export const esportsStore = new FirestoreEsportsStore();
