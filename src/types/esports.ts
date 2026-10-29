export type MatchGame = 'Free Fire Clash Squad';

export type ReportStatus = 'PENDING' | 'DONE' | 'REJECTED';

export interface ParticipantUser {
  id: string;
  phone: string;
  name: string;
  photoUrl: string;
  registeredAt: string;
  points: number;
  wins: number;
  matchesPlayed: number;
}

export interface PlayerTeam {
  id: string;
  name: string;
  tag: string;
  captainName: string;
  phone: string;
  points: number;
  wins: number;
  matchesPlayed: number;
  game: MatchGame;
  status: 'active' | 'warned' | 'blacklisted';
  photoUrl?: string;
  updatedAt: string;
}

export interface WinReport {
  id: string;
  participantId?: string;
  phone: string;
  teamName: string;
  captainName: string;
  storanDate: string; // Tanggal & jam setor kemenangan
  potName?: string; // Sesi Pot FT
  screenshotUrl: string; // Foto di GB saat admin mengirim stiker DONE / CEK
  status: ReportStatus;
  pointsAwarded: number;
  adminNotes?: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface BannerPoster {
  id: string;
  title: string;
  imageUrl: string;
  caption?: string;
  isMain?: boolean;
  uploadedBy?: string;
  createdAt: string;
}

export interface Season {
  id: string;
  name: string;
  weekNumber: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  totalPrizePool: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  entryFee: string;
  lastAutoReset: string;
}

export interface BlacklistEntry {
  id: string;
  teamName: string;
  captainName: string;
  phone: string;
  game: string;
  reason: string;
  penalty: string;
  evidenceSummary: string;
  date: string;
}

export interface AdminContactInfo {
  adminName: string;
  adminPhone: string;
  consultationWaUrl: string; // WhatsApp untuk konsultasi / tanya-tanya turnamen
  infoChannelName: string; // Saluran Informasi Resmi KLEPON FT
  infoChannelLink: string;
  tiktokName: string; // e.g. @kleponx.official
  tiktokUrl: string; // e.g. https://tiktok.com/@kleponx.official
  instagramName: string; // e.g. @klepon_esports
  instagramUrl: string; // e.g. https://instagram.com/klepon_esports
  whatsappGroupName?: string; // e.g. Grup Khusus Turnamen Mingguan Top 10
  whatsappGroupUrl?: string; // e.g. https://chat.whatsapp.com/...
}

export interface EvidenceGuideConfig {
  correctScreenshotUrl: string;
  correctTitle: string;
  correctDescription: string;
  wrongScreenshotUrl: string;
  wrongTitle: string;
  wrongDescription: string;
  updatedAt: string;
}
