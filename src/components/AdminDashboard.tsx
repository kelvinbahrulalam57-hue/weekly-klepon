import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle, Clock, Eye, Trophy, Users, AlertTriangle,
  RotateCcw, Save, ExternalLink, Search, Ban, Lock, LogOut, Check, Phone, ArrowLeft,
  MessageCircle, Send, Image as ImageIcon, Trash2, Plus, Sparkles, Upload, Edit2,
  ShieldAlert, X, Gift, Copy, Download, FileSpreadsheet, QrCode, Share2
} from 'lucide-react';
import QRCode from 'qrcode';
import { esportsStore } from '../services/store';
import { WinReport, ReportStatus, AdminContactInfo, PlayerTeam, BannerPoster, BlacklistEntry, ParticipantUser, Season, EvidenceGuideConfig } from '../types/esports';
import { compressImage } from '../utils/imageCompressor';

interface AdminDashboardProps {
  onNotify: (msg: string) => void;
  onBackToPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNotify, onBackToPortal }) => {
  const [, setTick] = useState(0);

  // Subscribe to real-time updates so submissions appear instantly
  useEffect(() => {
    const unsub = esportsStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => unsub();
  }, []);

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'top10_broadcast' | 'participants' | 'banners' | 'evidence_guide' | 'blacklist' | 'contacts' | 'season'>('queue');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<WinReport | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [contactedTeams, setContactedTeams] = useState<Record<string, boolean>>({});

  // Banner management state
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerCaption, setBannerCaption] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerSetAsMain, setBannerSetAsMain] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [selectedBannerPreview, setSelectedBannerPreview] = useState<BannerPoster | null>(null);

  // Edit banner state
  const [editingBanner, setEditingBanner] = useState<BannerPoster | null>(null);
  const [editBannerTitle, setEditBannerTitle] = useState('');
  const [editBannerCaption, setEditBannerCaption] = useState('');
  const [editBannerImage, setEditBannerImage] = useState('');
  const [editBannerIsMain, setEditBannerIsMain] = useState(false);
  const [isEditBannerUploading, setIsEditBannerUploading] = useState(false);

  // Evidence Guide (SS GB Benar vs Salah) state
  const evidenceGuide = esportsStore.getEvidenceGuide();
  const [guideForm, setGuideForm] = useState<EvidenceGuideConfig>(evidenceGuide);
  const [isCorrectUploading, setIsCorrectUploading] = useState(false);
  const [isWrongUploading, setIsWrongUploading] = useState(false);

  // In-app Confirmation Modal state (replacing window.confirm for iframe sandbox safety)
  const [confirmModal, setConfirmModal] = useState<{
    type: 'reset_season' | 'delete_participant' | 'delete_banner' | 'delete_blacklist' | 'delete_report';
    title: string;
    message: string;
    confirmLabel?: string;
    payload?: any;
  } | null>(null);

  // Logo management state
  const [customLogoInput, setCustomLogoInput] = useState(esportsStore.getCustomLogo());
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  // Win Report Edit & Add manual state
  const [editingReport, setEditingReport] = useState<WinReport | null>(null);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    teamName: '',
    phone: '',
    captainName: '',
    potName: 'Fast Tournament Clash Squad',
    storanDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    screenshotUrl: '',
    status: 'DONE' as ReportStatus,
    adminNotes: '',
  });
  const [isReportScreenshotUploading, setIsReportScreenshotUploading] = useState(false);

  // Blacklist management state
  const [showAddBlForm, setShowAddBlForm] = useState(false);
  const [blTeamName, setBlTeamName] = useState('');
  const [blCaptainName, setBlCaptainName] = useState('');
  const [blPhone, setBlPhone] = useState('');
  const [blReason, setBlReason] = useState('');
  const [blPenalty, setBlPenalty] = useState('BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT');
  const [blEvidence, setBlEvidence] = useState('');
  const [editingBlEntry, setEditingBlEntry] = useState<BlacklistEntry | null>(null);

  // Participant editing state
  const [editingParticipant, setEditingParticipant] = useState<ParticipantUser | null>(null);
  const [participantSearch, setParticipantSearch] = useState('');

  // Share Tournament QR State (Admin Exclusive)
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const isAdmin = esportsStore.isAdmin();
  const reports = esportsStore.getWinReports();
  const players = esportsStore.getPlayers();
  const top10Players = esportsStore.getTop10Players();
  const banners = esportsStore.getBanners();
  const season = esportsStore.getSeason();
  const contacts = esportsStore.getContacts();
  const blacklist = esportsStore.getBlacklist();
  const participants = esportsStore.getParticipants();

  const [contactForm, setContactForm] = useState<AdminContactInfo>(contacts);
  const [seasonForm, setSeasonForm] = useState<Season>(season);

  // Sync forms with live store updates
  useEffect(() => {
    setContactForm(contacts);
  }, [contacts.adminPhone, contacts.tiktokUrl, contacts.instagramUrl, contacts.infoChannelLink]);

  useEffect(() => {
    setSeasonForm(season);
  }, [season.totalPrizePool, season.firstPrize, season.secondPrize, season.thirdPrize]);

  useEffect(() => {
    setGuideForm(evidenceGuide);
  }, [
    evidenceGuide.correctScreenshotUrl,
    evidenceGuide.correctTitle,
    evidenceGuide.correctDescription,
    evidenceGuide.wrongScreenshotUrl,
    evidenceGuide.wrongTitle,
    evidenceGuide.wrongDescription,
  ]);

  const totalReports = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;
  const doneCount = reports.filter((r) => r.status === 'DONE').length;
  const rejectedCount = reports.filter((r) => r.status === 'REJECTED').length;

  const filteredReports = reports.filter((rep) => {
    const matchesStatus = statusFilter === 'ALL' || rep.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (rep.teamName || '').toLowerCase().includes(q) ||
      (rep.captainName || '').toLowerCase().includes(q) ||
      (rep.phone || '').includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = esportsStore.verifyAndLoginAdmin(passwordInput.trim());
    if (success) {
      setPasswordError(false);
      setPasswordInput('');
      onNotify('Akses Panitia Diterima. Selamat datang di Dashboard Pengaturan.');
    } else {
      setPasswordError(true);
    }
  };

  const handleApproveReport = (report: WinReport) => {
    const ok = esportsStore.approveWinReport(report.id, 'Panitia KLEPON FT');
    if (ok) {
      onNotify(`Storan kemenangan untuk ${report.teamName} disetujui! +1 Poin otomatis masuk ke klasemen kualifikasi.`);
      if (selectedReport?.id === report.id) {
        setSelectedReport(null);
      }
    }
  };

  const handleRejectReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    if (!rejectReason.trim()) {
      onNotify('Alasan penolakan wajib diisi untuk edukasi tim!');
      return;
    }

    esportsStore.rejectWinReport(selectedReport.id, rejectReason.trim(), 'Panitia KLEPON FT');
    onNotify(`Storan untuk ${selectedReport.teamName} ditolak. Status berubah menjadi 'Rejected'.`);
    setSelectedReport(null);
    setShowRejectDialog(false);
    setRejectReason('');
  };

  // Win Report Edit, Delete, and Manual Add Handlers
  const handleStartEditReport = (report: WinReport) => {
    setEditingReport(report);
    setReportFormData({
      teamName: report.teamName,
      phone: report.phone,
      captainName: report.captainName || report.teamName,
      potName: report.potName || 'Fast Tournament Clash Squad',
      storanDate: report.storanDate || new Date().toISOString().slice(0, 16).replace('T', ' '),
      screenshotUrl: report.screenshotUrl,
      status: report.status,
      adminNotes: report.adminNotes || '',
    });
  };

  const handleSaveEditReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;
    if (!reportFormData.teamName.trim() || !reportFormData.phone.trim()) {
      onNotify('Nama tim dan nomor WhatsApp wajib diisi!');
      return;
    }

    esportsStore.updateWinReport(editingReport.id, {
      teamName: reportFormData.teamName.trim(),
      phone: reportFormData.phone.trim(),
      captainName: reportFormData.captainName.trim() || reportFormData.teamName.trim(),
      potName: reportFormData.potName.trim(),
      storanDate: reportFormData.storanDate,
      screenshotUrl: reportFormData.screenshotUrl || editingReport.screenshotUrl,
      status: reportFormData.status,
      adminNotes: reportFormData.adminNotes.trim(),
    });

    onNotify(`Laporan "${reportFormData.teamName}" berhasil diperbarui!`);
    setEditingReport(null);
    if (selectedReport?.id === editingReport.id) {
      setSelectedReport(null);
    }
  };

  const handleDeleteReportClick = (report: WinReport) => {
    setConfirmModal({
      type: 'delete_report',
      title: 'Hapus Laporan / Storan?',
      message: `Apakah Anda yakin ingin menghapus laporan "${report.teamName}" (${report.phone})? ${
        report.status === 'DONE'
          ? 'Perhatian: Status laporan ini adalah Sah (+1 Poin). Menghapusnya akan otomatis menarik kembali 1 poin yang telah diberikan.'
          : 'Laporan ini akan dihapus permanen dari sistem.'
      }`,
      confirmLabel: 'Ya, Hapus Laporan',
      payload: report,
    });
  };

  const handleOpenAddReportModal = () => {
    setReportFormData({
      teamName: '',
      phone: '',
      captainName: '',
      potName: 'Fast Tournament Clash Squad',
      storanDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      screenshotUrl: '',
      status: 'DONE',
      adminNotes: 'Ditambahkan manual oleh Panitia KLEPON FT',
    });
    setShowAddReportModal(true);
  };

  const handleSaveManualReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFormData.teamName.trim() || !reportFormData.phone.trim()) {
      onNotify('Nama tim dan nomor WhatsApp wajib diisi!');
      return;
    }

    esportsStore.addManualWinReport({
      teamName: reportFormData.teamName.trim(),
      phone: reportFormData.phone.trim(),
      captainName: reportFormData.captainName.trim() || reportFormData.teamName.trim(),
      potName: reportFormData.potName.trim(),
      storanDate: reportFormData.storanDate,
      screenshotUrl: reportFormData.screenshotUrl,
      status: reportFormData.status,
      adminNotes: reportFormData.adminNotes.trim(),
    });

    onNotify(`Laporan kemenangan baru untuk "${reportFormData.teamName}" berhasil ditambahkan!`);
    setShowAddReportModal(false);
  };

  const handleReportScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsReportScreenshotUploading(true);
      try {
        const compressed = await compressImage(file, 960, 960, 0.8);
        setReportFormData((prev) => ({ ...prev, screenshotUrl: compressed }));
        onNotify('Foto screenshot bukti berhasil dimuat.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsReportScreenshotUploading(false);
      }
    }
  };

  // Logo management handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLogoUploading(true);
      try {
        const compressed = await compressImage(file, 400, 400, 0.85);
        setCustomLogoInput(compressed);
        onNotify('Foto logo dari galeri berhasil dimuat. Klik "Simpan Logo Baru" untuk menerapkan.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLogoUploading(false);
      }
    }
  };

  const handleSaveCustomLogo = () => {
    esportsStore.updateCustomLogo(customLogoInput);
    onNotify('Logo pojok kiri atas berhasil diperbarui dan langsung aktif di seluruh website!');
  };

  const handleResetDefaultLogo = () => {
    setCustomLogoInput('');
    esportsStore.updateCustomLogo('');
    onNotify('Logo berhasil dikembalikan ke logo huruf "K" default.');
  };


  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsBannerUploading(true);
      try {
        const compressed = await compressImage(file, 1280, 1280, 0.8);
        setBannerImage(compressed);
        onNotify('Foto poster dari galeri berhasil dikompres dan siap disimpan.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsBannerUploading(false);
      }
    }
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImage) {
      onNotify('Judul poster dan file foto dari galeri wajib diisi!');
      return;
    }

    esportsStore.addBannerPoster({
      title: bannerTitle.trim(),
      imageUrl: bannerImage,
      caption: bannerCaption.trim(),
      isMain: bannerSetAsMain,
      uploadedBy: 'Panitia KLEPON FT',
    });

    onNotify('Poster turnamen baru berhasil diterapkan secara realtime!');
    setBannerTitle('');
    setBannerCaption('');
    setBannerImage('');
    setBannerSetAsMain(false);
  };

  // Banner edit handlers
  const handleStartEditBanner = (b: BannerPoster) => {
    setEditingBanner(b);
    setEditBannerTitle(b.title);
    setEditBannerCaption(b.caption || '');
    setEditBannerImage(b.imageUrl);
    setEditBannerIsMain(Boolean(b.isMain));
  };

  const handleEditBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsEditBannerUploading(true);
      try {
        const compressed = await compressImage(file, 1280, 1280, 0.8);
        setEditBannerImage(compressed);
        onNotify('Foto pengganti poster berhasil dikompres.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsEditBannerUploading(false);
      }
    }
  };

  const handleSaveEditBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (!editBannerTitle.trim() || !editBannerImage) {
      onNotify('Judul dan file foto poster tidak boleh kosong!');
      return;
    }

    esportsStore.updateBannerPoster(editingBanner.id, {
      title: editBannerTitle.trim(),
      caption: editBannerCaption.trim(),
      imageUrl: editBannerImage,
      isMain: editBannerIsMain,
    });

    onNotify(`Poster "${editBannerTitle.trim()}" berhasil diperbarui!`);
    setEditingBanner(null);
  };

  const handleDeleteBannerClick = (b: BannerPoster) => {
    setConfirmModal({
      type: 'delete_banner',
      title: 'Hapus Poster Turnamen?',
      message: `Apakah Anda yakin ingin menghapus poster "${b.title}"? Poster tidak akan ditampilkan lagi kepada pengunjung.`,
      confirmLabel: 'Ya, Hapus Poster',
      payload: b,
    });
  };

  const handleCopyBroadcastText = () => {
    if (top10Players.length === 0) {
      onNotify('Belum ada peserta terdaftar untuk dibroadcast.');
      return;
    }
    const lines = [
      '🏆 *PENGUMUMAN TOP 10 KUALIFIKASI TURNAMEN MINGGUAN KLEPON FT* 🏆',
      `_Total Hadiah: ${season.totalPrizePool} · 100% GRATIS_`,
      '',
      '*Daftar 10 Tim Peraih Poin Terbesar yang Lolos ke Grup Khusus:*',
      ...top10Players.map((p, i) => `${i + 1}. *${p.name}* (${p.captainName}) — *${p.points} Pts* (${p.wins} Win)`),
      '',
      '📌 *Catatan Penting:*',
      'Tim di atas wajib bersiap di grup WhatsApp khusus bagan turnamen mingguan.',
      'Ayo kumpulkan kemenangan match FT dan setor stiker DONE admin!',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    onNotify('Teks broadcast Top 10 berhasil disalin ke clipboard! Siap kirim ke grup WhatsApp.');
  };

  const handleCorrectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCorrectUploading(true);
      try {
        const compressed = await compressImage(file, 960, 960, 0.8);
        setGuideForm((prev) => ({ ...prev, correctScreenshotUrl: compressed }));
        onNotify('Foto SS GB yang Benar berhasil dimuat.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsCorrectUploading(false);
      }
    }
  };

  const handleWrongUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsWrongUploading(true);
      try {
        const compressed = await compressImage(file, 960, 960, 0.8);
        setGuideForm((prev) => ({ ...prev, wrongScreenshotUrl: compressed }));
        onNotify('Foto SS GB yang Salah berhasil dimuat.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsWrongUploading(false);
      }
    }
  };

  const handleSaveEvidenceGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideForm.correctScreenshotUrl || !guideForm.wrongScreenshotUrl) {
      onNotify('Kedua foto bukti (Benar & Salah) tidak boleh kosong!');
      return;
    }
    esportsStore.updateEvidenceGuide(guideForm);
    onNotify('Contoh bukti SS GB (Benar vs Salah) berhasil disimpan dan langsung realtime ke seluruh pengunjung!');
  };

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    esportsStore.updateContacts(contactForm);
    onNotify('Pengaturan sosial media (TikTok, IG, WA) berhasil disimpan dan langsung realtime ke seluruh pengunjung!');
  };

  const handleSaveSeason = (e: React.FormEvent) => {
    e.preventDefault();
    esportsStore.updateSeason({
      totalPrizePool: seasonForm.totalPrizePool,
      firstPrize: seasonForm.firstPrize,
      secondPrize: seasonForm.secondPrize,
      thirdPrize: seasonForm.thirdPrize,
    });
    onNotify('Pengaturan hadiah turnamen berhasil disimpan!');
  };

  const handleResetSeason = () => {
    setConfirmModal({
      type: 'reset_season',
      title: 'Reset Poin Turnamen Mingguan?',
      message: 'PERINGATAN: Seluruh poin klasemen, total kemenangan, dan match peserta akan direset kembali ke 0. DAFTAR PESERTA DAN AKUN TIM TETAP TERSIMPAN AMAN (TIDAK AKAN DIHAPUS). Apakah Anda ingin melanjutkan?',
      confirmLabel: 'Ya, Reset Poin ke 0',
    });
  };

  const handleDeleteParticipant = (part: ParticipantUser) => {
    setConfirmModal({
      type: 'delete_participant',
      title: 'Hapus Peserta dari Database?',
      message: `HAPUS PESERTA: Apakah Anda yakin ingin menghapus tim "${part.name}" (${part.phone}) dari database turnamen? Data poin dan riwayat storan kemenangan tim ini akan dihapus permanen.`,
      confirmLabel: 'Ya, Hapus Permanen',
      payload: part,
    });
  };

  const handleSaveEditParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;
    esportsStore.updateParticipant(editingParticipant.id, {
      name: editingParticipant.name,
      phone: editingParticipant.phone,
      points: Number(editingParticipant.points) || 0,
      wins: Number(editingParticipant.wins) || 0,
      matchesPlayed: Number(editingParticipant.matchesPlayed) || 0,
    });
    onNotify(`Data peserta "${editingParticipant.name}" berhasil diperbarui!`);
    setEditingParticipant(null);
  };

  const handleExportLeaderboardCSV = () => {
    const allParticipants = esportsStore.getParticipants();
    if (!allParticipants || allParticipants.length === 0) {
      onNotify('Belum ada data peserta untuk diekspor ke CSV.');
      return;
    }

    // Urutkan peringkat sesuai aturan: Poin tertinggi, Kemenangan terbanyak, Pertandingan tersedikit
    const sorted = [...allParticipants].sort((a, b) => {
      const ptsA = Number(a.points) || 0;
      const ptsB = Number(b.points) || 0;
      if (ptsB !== ptsA) return ptsB - ptsA;

      const winsA = Number(a.wins) || 0;
      const winsB = Number(b.wins) || 0;
      if (winsB !== winsA) return winsB - winsA;

      const matA = Number(a.matchesPlayed) || 0;
      const matB = Number(b.matchesPlayed) || 0;
      return matA - matB;
    });

    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10);
    const timeFormatted = now.toTimeString().slice(0, 5).replace(':', '-');

    const headers = [
      'Peringkat',
      'Nama Tim / Peserta',
      'No WhatsApp',
      'Poin Klasemen',
      'Kemenangan (Wins)',
      'Total Pertandingan (Matches)',
      'Tanggal Terdaftar'
    ];

    const escapeCsv = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = sorted.map((p, index) => {
      const rank = index + 1;
      const name = escapeCsv(p.name || 'Tim');
      // Format telepon dengan ="..." agar angka 0 di depan tidak terpotong di Excel
      const phone = p.phone ? `="${p.phone}"` : '""';
      const points = Number(p.points) || 0;
      const wins = Number(p.wins) || 0;
      const matches = Number(p.matchesPlayed) || 0;
      const registeredAt = escapeCsv(p.registeredAt || '-');

      return [rank, name, phone, points, wins, matches, registeredAt].join(',');
    });

    // Gunakan UTF-8 BOM (\uFEFF) agar Microsoft Excel & spreadsheet lain membaca format teks secara sempurna
    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Klasemen_KLEPON_FT_${dateFormatted}_${timeFormatted}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onNotify(`Berhasil mengunduh rekapan data klasemen (${sorted.length} tim) ke file CSV.`);
  };

  const getPlatformShareUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://klepon-esports.com';
  };

  const generateQrCode = async () => {
    setIsGeneratingQr(true);
    try {
      const shareUrl = getPlatformShareUrl();
      const dataUrl = await QRCode.toDataURL(shareUrl, {
        width: 360,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleOpenShareQr = () => {
    generateQrCode();
    setShowQrModal(true);
  };

  const handleCopyShareLink = () => {
    const shareUrl = getPlatformShareUrl();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      });
    }
  };

  const handleDownloadQrImage = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_KLEPON_WEEKLY_TURNAMENT.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Gambar QR Code turnamen berhasil diunduh ke galeri!');
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blTeamName.trim() || !blPhone.trim() || !blReason.trim()) {
      onNotify('Nama tim, no hp, dan alasan sanksi wajib diisi!');
      return;
    }

    esportsStore.addBlacklistEntry({
      teamName: blTeamName.trim(),
      captainName: blCaptainName.trim() || blTeamName.trim(),
      phone: blPhone.trim(),
      reason: blReason.trim(),
      penalty: blPenalty.trim(),
      evidenceSummary: blEvidence.trim() || 'Hasil investigasi chat GB membuktikan stiker palsu.',
    });

    onNotify(`Sanksi resmi untuk ${blTeamName} berhasil diterbitkan & tersinkron ke database Firestore.`);
    setBlTeamName('');
    setBlCaptainName('');
    setBlPhone('');
    setBlReason('');
    setBlEvidence('');
    setShowAddBlForm(false);
  };

  const handleSaveEditBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlEntry) return;

    esportsStore.updateBlacklistEntry(editingBlEntry.id, {
      teamName: editingBlEntry.teamName,
      captainName: editingBlEntry.captainName,
      phone: editingBlEntry.phone,
      reason: editingBlEntry.reason,
      penalty: editingBlEntry.penalty,
      evidenceSummary: editingBlEntry.evidenceSummary,
    });

    onNotify(`Data blacklist ${editingBlEntry.teamName} berhasil diperbarui.`);
    setEditingBlEntry(null);
  };

  const handleDeleteBlacklist = (entry: BlacklistEntry) => {
    setConfirmModal({
      type: 'delete_blacklist',
      title: 'Cabut Sanksi Pelanggaran?',
      message: `Apakah Anda yakin ingin mencabut sanksi dan menghapus "${entry.teamName}" dari daftar blacklist?`,
      confirmLabel: 'Ya, Cabut Sanksi',
      payload: entry,
    });
  };

  // Safe executor for in-app modal actions
  const handleConfirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'delete_participant') {
      const part = confirmModal.payload as ParticipantUser;
      esportsStore.deleteParticipant(part.id);
      onNotify(`Peserta "${part.name}" (${part.phone}) berhasil dihapus dari database.`);
    } else if (confirmModal.type === 'delete_banner') {
      const b = confirmModal.payload as BannerPoster;
      esportsStore.deleteBannerPoster(b.id);
      onNotify(`Poster "${b.title}" berhasil dihapus.`);
    } else if (confirmModal.type === 'reset_season') {
      esportsStore.manualResetSeason();
      onNotify('Klasemen turnamen mingguan berhasil direset ke 0!');
    } else if (confirmModal.type === 'delete_blacklist') {
      const entry = confirmModal.payload as BlacklistEntry;
      esportsStore.deleteBlacklistEntry(entry.id);
      onNotify(`Sanksi untuk "${entry.teamName}" berhasil dicabut.`);
    } else if (confirmModal.type === 'delete_report') {
      const rep = confirmModal.payload as WinReport;
      esportsStore.deleteWinReport(rep.id, true);
      onNotify(`Laporan storan untuk "${rep.teamName}" berhasil dihapus.`);
      if (selectedReport?.id === rep.id) {
        setSelectedReport(null);
      }
    }

    setConfirmModal(null);
  };

  // Stealth Unauthenticated Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#040817]">
        <div className="bg-[#070e28] border border-blue-900/60 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white font-mono">
              Autentikasi Diperlukan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Halaman ini memerlukan otentikasi kode sandi panitia.
            </p>
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-3 pt-2">
            <input
              type="password"
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              className="w-full bg-[#030614] border border-blue-900/60 focus:border-cyan-400 rounded-lg px-3 py-2 text-white font-mono text-center tracking-widest text-xs focus:outline-none"
            />
            {passwordError && (
              <p className="text-rose-400 text-[11px] font-mono">Kode sandi salah. Silakan coba lagi.</p>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={onBackToPortal}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredParticipants = participants.filter((p) => {
    const q = participantSearch.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(participantSearch)
    );
  });

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-6 bg-[#040817] min-h-screen text-slate-100">
      {/* Top Header Bar */}
      <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black font-display uppercase tracking-wide text-white">
                Dashboard Kontrol Panitia
              </h2>
              <span className="bg-cyan-400 text-slate-950 px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase">
                Realtime Firestore
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit peserta, poster, sosmed, verifikasi bukti stiker DONE di GB, dan reset klasemen turnamen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleOpenShareQr}
            className="px-3 py-2 bg-gradient-to-r from-blue-950 to-cyan-950 hover:from-blue-900 hover:to-cyan-900 border border-cyan-500/50 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-md group"
            title="Generate & Bagikan Kode QR Resmi Turnamen untuk Disebarkan ke Pemain"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline">QR Turnamen</span>
            <span className="sm:hidden">QR</span>
          </button>
          <button
            type="button"
            onClick={handleExportLeaderboardCSV}
            className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
            title="Ekspor Seluruh Klasemen Peserta & Poin ke File CSV (Format Excel)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={onBackToPortal}
            className="px-3.5 py-2 bg-[#0a1438] hover:bg-[#0f1f54] text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ke Tampilan Website</span>
            <span className="sm:hidden">Website</span>
          </button>
          <button
            onClick={() => {
              esportsStore.logoutAdmin();
              onBackToPortal();
              onNotify('Anda telah keluar dari mode panitia.');
            }}
            className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
            title="Keluar Sesi Panitia"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-blue-900/50 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Antrean Storan</span>
          <span className="font-mono px-1.5 py-0.2 rounded text-[10px] bg-black/40">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('top10_broadcast')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'top10_broadcast'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Broadcast WA Top 10</span>
        </button>

        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'participants'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola & Hapus Peserta ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Kelola Poster ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence_guide')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'evidence_guide'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Kelola SS GB (Benar vs Salah)</span>
        </button>

        <button
          onClick={() => setActiveTab('blacklist')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'blacklist'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Daftar Blacklist ({blacklist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'contacts'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Logo & Kontak</span>
        </button>

        <button
          onClick={() => setActiveTab('season')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'season'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#070e28] text-slate-300 hover:bg-[#0a153c] border border-blue-900/50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Hadiah & Reset Klasemen</span>
        </button>
      </div>

      {/* TAB 1: Antrean Storan */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {(['PENDING', 'DONE', 'REJECTED', 'ALL'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-cyan-400 text-slate-950 shadow'
                      : 'bg-[#070e28] text-slate-400 hover:text-white border border-blue-900/50'
                  }`}
                >
                  {st === 'PENDING' ? `Under Review (${pendingCount})` : st === 'DONE' ? `Verified (${doneCount})` : st === 'REJECTED' ? `Rejected (${rejectedCount})` : `Semua (${totalReports})`}
                </button>
              ))}

              <button
                type="button"
                onClick={handleOpenAddReportModal}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                title="Tambah Storan / Laporan Manual"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Storan Manual</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama tim / no wa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#070e28] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-blue-900/50 bg-[#030616] text-[11px] font-mono uppercase text-slate-400">
                    <th className="py-3.5 px-4">Waktu Setor</th>
                    <th className="py-3.5 px-4">Tim & No WA</th>
                    <th className="py-3.5 px-4">Sesi Match FT</th>
                    <th className="py-3.5 px-4">Bukti Stiker DONE di GB</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/60">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Tidak ada antrean storan dalam filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-blue-950/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {report.storanDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{report.teamName}</div>
                          <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-cyan-400" />
                            <span>{report.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {report.potName || 'Fast Tournament FF'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div
                            onClick={() => setSelectedReport(report)}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <img
                              src={report.screenshotUrl}
                              alt="Bukti Stiker DONE"
                              className="w-12 h-12 object-cover rounded-lg border border-blue-900 group-hover:border-cyan-400 transition-colors"
                            />
                            <div className="text-[11px] text-cyan-400 group-hover:underline flex items-center gap-1 font-mono">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspeksi</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {report.status === 'PENDING' ? (
                            <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold rounded-full animate-pulse">
                              Under Review
                            </span>
                          ) : report.status === 'DONE' ? (
                            <span className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-[10px] font-bold rounded-full">
                              Verified (+1 Pts)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono text-[10px] font-bold rounded-full">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {report.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveReport(report)}
                                  className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded text-xs flex items-center gap-1 cursor-pointer shadow-md"
                                  title="Sahkan Bukti & Tambahkan +1 Poin"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Sah</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setShowRejectDialog(true);
                                  }}
                                  className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                                  title="Tolak Storan Kemenangan"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </>
                            )}
                            {report.status === 'DONE' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowRejectDialog(true);
                                }}
                                className="px-2 py-1 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                title="Ubah status ke Ditolak (Tarik kembali +1 Poin)"
                              >
                                <X className="w-3 h-3" />
                                <span>Tolak</span>
                              </button>
                            )}
                            {report.status === 'REJECTED' && (
                              <button
                                type="button"
                                onClick={() => handleApproveReport(report)}
                                className="px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                title="Ubah status ke Sah (Berikan +1 Poin)"
                              >
                                <Check className="w-3 h-3" />
                                <span>Sahkan</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleStartEditReport(report)}
                              className="p-1.5 bg-[#070e28] hover:bg-blue-900/60 border border-blue-900 text-cyan-300 hover:text-white rounded text-xs cursor-pointer transition-colors"
                              title="Edit Data Storan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReportClick(report)}
                              className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-rose-400 hover:text-rose-200 rounded text-xs cursor-pointer transition-colors"
                              title="Hapus Storan Ini dari Antrean"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Broadcast WA Top 10 */}
      {activeTab === 'top10_broadcast' && (
        <div className="space-y-4">
          <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-900/60">
              <div>
                <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Daftar Tim Lolos Top 10 Turnamen Mingguan ({top10Players.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hubungi 10 tim peraih poin terbesar sesuai urutan daftar peserta untuk dimasukkan ke grup khusus turnamen mingguan.
                </p>
              </div>

              <button
                onClick={handleCopyBroadcastText}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks Broadcast WA</span>
              </button>
            </div>

            {top10Players.length === 0 ? (
              <div className="p-8 text-center bg-[#030616] rounded-xl border border-blue-900/40 text-slate-400 space-y-2">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-bold text-white text-sm">Tidak Ada Peserta yang Terdaftar</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Daftar broadcast Top 10 mengikuti urutan daftar peserta aktif. Jika seluruh daftar peserta dihapus, daftar broadcast otomatis kosong dan bersih.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {top10Players.map((player, idx) => {
                  const inviteUrl = esportsStore.getTop10InviteLink(player, idx + 1);
                  const isContacted = contactedTeams[player.id];

                  return (
                    <div
                      key={player.id}
                      className="p-3.5 bg-[#030616] rounded-xl border border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 font-black font-mono flex items-center justify-center text-xs">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{player.name}</div>
                          <div className="text-[11px] font-mono text-cyan-400">
                            Kapten: {player.captainName} · WA: {player.phone} · Poin: {player.points} Pts ({player.wins} Win)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setContactedTeams((prev) => ({ ...prev, [player.id]: true }))}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Chat WhatsApp Tim</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {isContacted && (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-1 rounded border border-cyan-500/30">
                            ✓ Terkirim
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: KELOLA & HAPUS PESERTA */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Daftar Peserta & Tim Terdaftar ({participants.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Admin dapat mengedit poin, jumlah kemenangan, nomor WhatsApp, serta menghapus peserta yang tidak aktif atau bermasalah.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Cari peserta / no wa..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#030616] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleExportLeaderboardCSV}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 transition-all hover:scale-102"
                  title="Unduh seluruh data klasemen peserta dan poin ke file CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-blue-900/50 bg-[#030616] text-[11px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Peserta</th>
                    <th className="py-3 px-3 font-mono">No WhatsApp</th>
                    <th className="py-3 px-3 font-mono text-center">Poin</th>
                    <th className="py-3 px-3 font-mono text-center">Menang FT</th>
                    <th className="py-3 px-3 font-mono text-center">Total Match</th>
                    <th className="py-3 px-3 text-center">Aksi Panitia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/60">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Tidak ada data peserta yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((part) => (
                      <tr key={part.id} className="hover:bg-blue-950/20 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={part.photoUrl}
                              alt={part.name}
                              className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                            />
                            <div>
                              <div className="font-bold text-white">{part.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Terdaftar: {part.registeredAt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-300 font-semibold">
                          {part.phone}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-amber-300 font-bold">
                          {part.points} Pts
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-200">
                          {part.wins}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {part.matchesPlayed}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingParticipant(part)}
                              className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-500/40 text-cyan-300 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              title="Edit Data Peserta"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteParticipant(part)}
                              className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              title="Hapus Peserta dari Database"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Edit Peserta */}
          {editingParticipant && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#070f2c] border border-blue-700 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
                  <h4 className="font-bold text-white text-sm uppercase flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-cyan-400" />
                    <span>Edit Data Peserta: {editingParticipant.name}</span>
                  </h4>
                  <button
                    onClick={() => setEditingParticipant(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditParticipant} className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Tim / Peserta</label>
                    <input
                      type="text"
                      required
                      value={editingParticipant.name}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                      className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={editingParticipant.phone}
                      onChange={(e) => setEditingParticipant({ ...editingParticipant, phone: e.target.value })}
                      className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Poin</label>
                      <input
                        type="number"
                        min="0"
                        value={editingParticipant.points}
                        onChange={(e) => setEditingParticipant({ ...editingParticipant, points: Number(e.target.value) })}
                        className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Menang FT</label>
                      <input
                        type="number"
                        min="0"
                        value={editingParticipant.wins}
                        onChange={(e) => setEditingParticipant({ ...editingParticipant, wins: Number(e.target.value) })}
                        className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Total Match</label>
                      <input
                        type="number"
                        min="0"
                        value={editingParticipant.matchesPlayed}
                        onChange={(e) => setEditingParticipant({ ...editingParticipant, matchesPlayed: Number(e.target.value) })}
                        className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingParticipant(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Kelola Poster & Banner */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-5 sm:p-6 max-w-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-900/60">
              <Upload className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold font-display uppercase text-white">
                  Unggah Poster Turnamen Baru
                </h3>
                <p className="text-slate-400 text-xs">
                  Poster akan langsung tampil di halaman utama dan popup saat player membuka website.
                </p>
              </div>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Judul Poster Turnamen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TURNAMEN MINGGUAN FREE FIRE CLASH SQUAD 30K"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full bg-[#030616] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Keterangan / Deskripsi Poster
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Total hadiah Rp 30.000. Pendaftaran 100% gratis, kumpulkan poin dari kemenangan FT!"
                  value={bannerCaption}
                  onChange={(e) => setBannerCaption(e.target.value)}
                  className="w-full bg-[#030616] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  File Foto Poster dari Galeri (HP / Laptop) *
                </label>
                <div className="border-2 border-dashed border-blue-800 rounded-xl p-4 text-center bg-[#030616]/70">
                  {isBannerUploading ? (
                    <div className="text-cyan-400 font-mono py-4">Mengompres foto poster...</div>
                  ) : bannerImage ? (
                    <div className="space-y-2">
                      <img
                        src={bannerImage}
                        alt="Preview Poster"
                        className="max-h-48 mx-auto rounded-lg object-contain border border-blue-800 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="text-rose-400 hover:underline text-[11px] cursor-pointer"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                      <label className="text-cyan-400 hover:underline cursor-pointer font-bold block text-sm">
                        <span>Pilih Foto dari Galeri</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bannerMainCheck"
                  checked={bannerSetAsMain}
                  onChange={(e) => setBannerSetAsMain(e.target.checked)}
                  className="rounded border-blue-900 text-cyan-500 focus:ring-cyan-400"
                />
                <label htmlFor="bannerMainCheck" className="text-slate-300 text-xs cursor-pointer">
                  Jadikan sebagai <strong>Poster Utama Aktif</strong> di bawah judul Weekly
                </label>
              </div>

              <button
                type="submit"
                disabled={isBannerUploading}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Poster Baru</span>
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase text-white mb-3 font-display flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Daftar Poster Turnamen Tersimpan ({banners.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#070f2a] border border-blue-900/60 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-black">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    {b.isMain && (
                      <span className="absolute top-2 left-2 bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] font-mono">
                        UTAMA
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-2">
                    <h5 className="font-bold text-white text-xs line-clamp-1">{b.title}</h5>
                    {b.caption && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">{b.caption}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-blue-950 gap-2">
                      <div className="flex items-center gap-2">
                        {!b.isMain && (
                          <button
                            onClick={() => {
                              esportsStore.setMainBanner(b.id);
                              onNotify('Poster utama berhasil diubah.');
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            Set Utama
                          </button>
                        )}
                        <button
                          onClick={() => handleStartEditBanner(b)}
                          className="px-2 py-0.5 bg-blue-950 hover:bg-blue-900 border border-blue-600/40 text-cyan-300 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Edit Poster"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteBannerClick(b)}
                        className="px-2 py-0.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-300 hover:text-rose-200 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Hapus Poster"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Edit Poster Turnamen */}
          {editingBanner && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#070f2c] border border-blue-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
                  <h4 className="font-bold text-white text-sm uppercase flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-cyan-400" />
                    <span>Edit Poster Turnamen</span>
                  </h4>
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditBanner} className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Judul Poster *
                    </label>
                    <input
                      type="text"
                      required
                      value={editBannerTitle}
                      onChange={(e) => setEditBannerTitle(e.target.value)}
                      className="w-full bg-[#030616] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Keterangan / Deskripsi Poster
                    </label>
                    <textarea
                      rows={2}
                      value={editBannerCaption}
                      onChange={(e) => setEditBannerCaption(e.target.value)}
                      className="w-full bg-[#030616] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Foto Poster Turnamen
                    </label>
                    <div className="border border-blue-800 rounded-xl p-3 bg-[#030616]/70 flex items-center gap-3">
                      <img
                        src={editBannerImage}
                        alt="Preview"
                        className="w-24 h-16 object-cover rounded-lg border border-blue-700 bg-black flex-shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <label className="text-cyan-400 hover:underline cursor-pointer font-bold text-xs inline-flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti File Foto Poster</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditBannerUpload}
                            className="hidden"
                          />
                        </label>
                        {isEditBannerUploading && (
                          <p className="text-[10px] text-cyan-300 font-mono">Mengompres foto...</p>
                        )}
                        <p className="text-[10px] text-slate-400">Pilih foto dari galeri HP atau laptop untuk mengganti.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="editBannerMainCheck"
                      checked={editBannerIsMain}
                      onChange={(e) => setEditBannerIsMain(e.target.checked)}
                      className="rounded border-blue-900 text-cyan-500 focus:ring-cyan-400"
                    />
                    <label htmlFor="editBannerMainCheck" className="text-slate-300 text-xs cursor-pointer">
                      Jadikan sebagai <strong>Poster Utama Aktif</strong> di beranda
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-900/60">
                    <button
                      type="button"
                      onClick={() => setEditingBanner(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isEditBannerUploading}
                      className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Poster</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Kelola SS GB (Benar vs Salah) */}
      {activeTab === 'evidence_guide' && (
        <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <span>Kelola Contoh Screenshot Bukti GB (Benar vs Salah)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Admin dapat mengunggah dan mengedit foto contoh bukti chat GB yang SAH/BENAR (stiker DONE asli panitia) dan contoh yang SALAH/PALSU (crop, editan, copas).
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveEvidenceGuide} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1: SS GB YANG BENAR */}
              <div className="bg-[#030616] border-2 border-emerald-500/50 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider">
                      1. Contoh SS GB yang BENAR (Sah & Valid)
                    </h4>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                    SAH +1 POIN
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Foto Screenshot Chat GB yang Benar *
                    </label>
                    <div className="border border-emerald-800/80 rounded-xl p-3 bg-black/50 flex flex-col sm:flex-row items-center gap-3">
                      <img
                        src={guideForm.correctScreenshotUrl}
                        alt="Contoh SS Benar"
                        className="w-36 h-28 object-contain rounded-lg border border-emerald-600/60 bg-black flex-shrink-0"
                      />
                      <div className="space-y-2 text-center sm:text-left">
                        <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-xs inline-flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Foto dari Galeri</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCorrectUpload}
                            className="hidden"
                          />
                        </label>
                        {isCorrectUploading && (
                          <p className="text-[10px] text-emerald-300 font-mono">Mengompres foto...</p>
                        )}
                        <p className="text-[10px] text-slate-400">
                          Foto bukti chat grup WhatsApp saat admin mengirimkan stiker DONE/CEK secara resmi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Judul Keterangan Bukti Benar
                    </label>
                    <input
                      type="text"
                      required
                      value={guideForm.correctTitle}
                      onChange={(e) => setGuideForm({ ...guideForm, correctTitle: e.target.value })}
                      className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Deskripsi Panduan Bukti Benar
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={guideForm.correctDescription}
                      onChange={(e) => setGuideForm({ ...guideForm, correctDescription: e.target.value })}
                      className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: SS GB YANG SALAH */}
              <div className="bg-[#030616] border-2 border-rose-500/50 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-rose-900/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></span>
                    <h4 className="font-bold text-rose-400 uppercase text-xs tracking-wider">
                      2. Contoh SS GB yang SALAH / PALSU (Dilarang)
                    </h4>
                  </div>
                  <span className="bg-rose-950 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/40">
                    AUTO BLACKLIST
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Foto Screenshot Chat GB yang Salah *
                    </label>
                    <div className="border border-rose-800/80 rounded-xl p-3 bg-black/50 flex flex-col sm:flex-row items-center gap-3">
                      <img
                        src={guideForm.wrongScreenshotUrl}
                        alt="Contoh SS Salah"
                        className="w-36 h-28 object-contain rounded-lg border border-rose-600/60 bg-black flex-shrink-0"
                      />
                      <div className="space-y-2 text-center sm:text-left">
                        <label className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs inline-flex items-center gap-1.5 cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Foto dari Galeri</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleWrongUpload}
                            className="hidden"
                          />
                        </label>
                        {isWrongUploading && (
                          <p className="text-[10px] text-rose-300 font-mono">Mengompres foto...</p>
                        )}
                        <p className="text-[10px] text-slate-400">
                          Foto contoh bukti palsu, jam chat dipotong, editan inspect element, atau stiker copas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Judul Keterangan Bukti Salah
                    </label>
                    <input
                      type="text"
                      required
                      value={guideForm.wrongTitle}
                      onChange={(e) => setGuideForm({ ...guideForm, wrongTitle: e.target.value })}
                      className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Deskripsi Panduan Bukti Salah
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={guideForm.wrongDescription}
                      onChange={(e) => setGuideForm({ ...guideForm, wrongDescription: e.target.value })}
                      className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#030616] rounded-xl border border-blue-900/60">
              <div className="text-slate-400 text-xs">
                💡 Perubahan foto & keterangan ini langsung tersimpan ke database Firestore dan tampil di panduan halaman utama serta popup contoh setoran pemain.
              </div>
              <button
                type="submit"
                disabled={isCorrectUploading || isWrongUploading}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Bukti SS GB</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: Blacklist */}
      {activeTab === 'blacklist' && (
        <div className="space-y-4">
          <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60 mb-4">
              <div>
                <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                  <Ban className="w-5 h-5 text-rose-400" />
                  <span>Daftar Blacklist Pelanggaran Turnamen ({blacklist.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tim dan nomor WhatsApp yang di-ban permanen karena memalsukan screenshot stiker DONE admin.
                </p>
              </div>

              <button
                onClick={() => setShowAddBlForm(!showAddBlForm)}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddBlForm ? 'Tutup Form' : 'Tambah Blacklist'}</span>
              </button>
            </div>

            {showAddBlForm && (
              <form onSubmit={handleAddBlacklist} className="p-4 bg-[#030616] rounded-xl border border-rose-500/30 space-y-3 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Tim *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: CHEATER FAKE DONE"
                      value={blTeamName}
                      onChange={(e) => setBlTeamName(e.target.value)}
                      className="w-full bg-[#070e28] border border-blue-900 rounded px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">No WhatsApp Pelaku *</label>
                    <input
                      type="text"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={blPhone}
                      onChange={(e) => setBlPhone(e.target.value)}
                      className="w-full bg-[#070e28] border border-blue-900 rounded px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Alasan Pelanggaran *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mengirim screenshot stiker DONE editan / manipulasi jam match."
                    value={blReason}
                    onChange={(e) => setBlReason(e.target.value)}
                    className="w-full bg-[#070e28] border border-blue-900 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow"
                  >
                    Terbitkan Blacklist
                  </button>
                </div>
              </form>
            )}

            {blacklist.length === 0 ? (
              <div className="p-8 text-center bg-[#030616] rounded-xl border border-blue-900/40 text-slate-400 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-white text-sm">Tidak Ada Tim di Daftar Blacklist</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Seluruh tim bertanding secara jujur tanpa catatan sanksi pemalsuan stiker DONE.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blacklist.map((entry) => (
                  <div key={entry.id} className="p-4 bg-[#030616] rounded-xl border border-rose-950/60 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-rose-400 text-sm">{entry.teamName}</span>
                        <span className="text-slate-400 font-mono text-xs ml-2">({entry.phone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBlEntry(entry)}
                          className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-500/40 text-cyan-300 rounded text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBlacklist(entry)}
                          className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs"><strong>Alasan:</strong> {entry.reason}</p>
                    <div className="text-[11px] font-mono text-rose-300">
                      Sanksi: {entry.penalty}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: Pengaturan Sosmed & Kontak */}
      {activeTab === 'contacts' && (
        <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-6 max-w-3xl shadow-xl">
          <div className="pb-4 border-b border-blue-900/60 mb-6">
            <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              <span>Pengaturan Sosial Media (TikTok, Instagram) & Saluran Informasi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ubah link dan nama akun TikTok, Instagram, serta saluran WhatsApp. Perubahan langsung tersimpan ke Firestore secara realtime.
            </p>
          </div>

          <form onSubmit={handleSaveContacts} className="space-y-5 text-xs">
            {/* PENGATURAN LOGO WEBSITE (POJOK KIRI ATAS) */}
            <div className="p-4 bg-[#030616] rounded-xl border border-cyan-500/40 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Pengaturan Logo Website (Pojok Kiri Atas)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ganti Huruf "K" dengan Foto</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Live Logo Preview */}
                <div className="md:col-span-4 bg-[#070e28] p-3 rounded-lg border border-blue-900/80 text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] font-mono text-slate-400 mb-2">Tampilan Logo Saat Ini:</div>
                  <div className="p-2 bg-[#04081c] rounded-xl border border-blue-800/80 inline-flex items-center gap-2 shadow-inner">
                    {customLogoInput ? (
                      <img
                        src={customLogoInput}
                        alt="Logo Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-cyan-400 shadow-lg shadow-cyan-500/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-slate-950 font-display text-xl border border-cyan-400/40">
                        K
                      </div>
                    )}
                    <div className="text-left">
                      <span className="text-xs font-black text-white block">KLEPON</span>
                      <span className="text-[9px] font-mono text-cyan-400">WEEKLY FREE</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2">
                    {customLogoInput ? '✓ Menggunakan Foto Custom' : 'Default: Huruf "K" Gradien'}
                  </span>
                </div>

                {/* Upload & Select from Gallery Controls */}
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Unggah Foto Logo Baru dari Galeri HP / PC:
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="px-3 py-2 bg-[#070e28] hover:bg-[#0a153c] border border-dashed border-cyan-500/50 hover:border-cyan-400 rounded-lg text-slate-300 flex items-center justify-center gap-2 text-xs transition-colors">
                          <Upload className="w-4 h-4 text-cyan-400" />
                          <span>{isLogoUploading ? 'Mengompres Foto...' : 'Pilih Foto dari Galeri...'}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={isLogoUploading}
                          className="hidden"
                        />
                      </label>
                      {customLogoInput && (
                        <button
                          type="button"
                          onClick={handleResetDefaultLogo}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                          title="Reset ke Logo Huruf K Default"
                        >
                          Reset ke K
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Select from Tournament Banners */}
                  {banners.length > 0 && (
                    <div>
                      <label className="block text-slate-400 text-[10px] font-mono uppercase mb-1">
                        Atau Pilih dari Galeri Poster Turnamen:
                      </label>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {banners.slice(0, 5).map((b) => (
                          <img
                            key={b.id}
                            src={b.imageUrl}
                            alt={b.title}
                            onClick={() => {
                              setCustomLogoInput(b.imageUrl);
                              onNotify(`Memilih poster "${b.title}" sebagai logo.`);
                            }}
                            className="w-10 h-10 rounded-md object-cover border border-blue-800 hover:border-cyan-400 cursor-pointer shrink-0 transition-all hover:scale-105"
                            title={`Gunakan poster "${b.title}" sebagai logo`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Logo URL */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Atau Masukkan URL Gambar Logo:
                    </label>
                    <input
                      type="url"
                      placeholder="https://.../logo.png"
                      value={customLogoInput}
                      onChange={(e) => setCustomLogoInput(e.target.value)}
                      className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveCustomLogo}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Terapkan Logo Sekarang</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#030616] rounded-xl border border-blue-900/60 space-y-3">
              <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                Pengaturan Akun TikTok
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Handle TikTok</label>
                  <input
                    type="text"
                    value={contactForm.tiktokName || ''}
                    onChange={(e) => setContactForm({ ...contactForm, tiktokName: e.target.value })}
                    className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link URL TikTok</label>
                  <input
                    type="url"
                    value={contactForm.tiktokUrl || ''}
                    onChange={(e) => setContactForm({ ...contactForm, tiktokUrl: e.target.value })}
                    className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#030616] rounded-xl border border-blue-900/60 space-y-3">
              <div className="font-bold text-pink-400 uppercase tracking-wider text-[11px]">
                Pengaturan Akun Instagram
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Handle Instagram</label>
                  <input
                    type="text"
                    value={contactForm.instagramName || ''}
                    onChange={(e) => setContactForm({ ...contactForm, instagramName: e.target.value })}
                    className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link URL Instagram</label>
                  <input
                    type="url"
                    value={contactForm.instagramUrl || ''}
                    onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                    className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#030616] rounded-xl border border-blue-900/60 space-y-3">
              <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                Pengaturan Saluran Informasi & WhatsApp
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link Saluran WhatsApp</label>
                  <input
                    type="url"
                    value={contactForm.infoChannelLink || ''}
                    onChange={(e) => setContactForm({ ...contactForm, infoChannelLink: e.target.value })}
                    className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Admin (Konsultasi)</label>
                  <input
                    type="text"
                    value={contactForm.adminPhone || ''}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        adminPhone: e.target.value,
                        consultationWaUrl: `https://wa.me/${e.target.value}?text=Halo%20Panitia%20KLEPON,%20saya%20ingin%20konsultasi%20seputar%20Turnamen%20Mingguan`,
                      })
                    }
                    className="w-full bg-[#070e28] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* KODE QR RESMI TURNAMEN (DISTRIBUSI PEMAIN) */}
            <div className="p-4 bg-[#030616] rounded-xl border border-cyan-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Kode QR Resmi Platform Turnamen (Khusus Admin)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Admin Exclusive
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Gunakan kode QR resmi ini untuk dibagikan ke grup WhatsApp turnamen, poster promosi, atau status media sosial agar pemain dapat langsung mengakses halaman klasemen dan setor kemenangan.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleOpenShareQr}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Buka & Unduh Kode QR</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3.5 py-2 bg-[#070e28] hover:bg-[#0a153c] border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Seluruh Pengaturan Kontak</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: Pengaturan Hadiah & Reset Klasemen Tanpa Tulisan Week */}
      {activeTab === 'season' && (
        <div className="space-y-6 max-w-2xl">
          {/* Edit Prize Pool */}
          <div className="bg-[#070f2c]/90 border border-blue-900/60 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>Edit Nominal Hadiah Turnamen Mingguan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ubah jumlah nominal hadiah Juara 1, 2, dan 3 yang ditampilkan di seluruh halaman website.
            </p>

            <form onSubmit={handleSaveSeason} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Hadiah (Prize Pool)</label>
                <input
                  type="text"
                  value={seasonForm.totalPrizePool}
                  onChange={(e) => setSeasonForm({ ...seasonForm, totalPrizePool: e.target.value })}
                  className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Juara 1</label>
                  <input
                    type="text"
                    value={seasonForm.firstPrize}
                    onChange={(e) => setSeasonForm({ ...seasonForm, firstPrize: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Juara 2</label>
                  <input
                    type="text"
                    value={seasonForm.secondPrize}
                    onChange={(e) => setSeasonForm({ ...seasonForm, secondPrize: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Juara 3</label>
                  <input
                    type="text"
                    value={seasonForm.thirdPrize}
                    onChange={(e) => setSeasonForm({ ...seasonForm, thirdPrize: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg cursor-pointer shadow"
              >
                Simpan Hadiah
              </button>
            </form>
          </div>

          {/* Reset Klasemen: Hanya Reset Point, Daftar Peserta Tetap Aman */}
          <div className="bg-[#070f2c]/90 border border-rose-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Reset Klasemen Poin Mingguan</span>
            </h3>
            
            <div className="p-3.5 bg-blue-950/50 border border-cyan-500/40 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>DAFTAR PESERTA TETAP TERSIMPAN AMAN (TIDAK AKAN DIHAPUS)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Seluruh akun tim yang terdaftar, nomor WhatsApp, nama kapten, dan profil <strong>TETAP ADA DAN TIDAK DIHAPUS</strong>.
                Sistem hanya mereset <strong>Poin Klasemen, Kemenangan, dan Total Match menjadi 0</strong> untuk memulai putaran kualifikasi mingguan baru.
              </p>
            </div>

            {/* Rekomendasi Ekspor CSV untuk Backup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs">
              <div className="space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Cadangkan / Ekspor Data Klasemen ke CSV</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Unduh rekapan poin, peringkat, kemenangan, dan kontak seluruh peserta sebelum atau sesudah reset untuk arsip panitia.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportLeaderboardCSV}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0 transition-all hover:scale-102"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File CSV</span>
              </button>
            </div>

            <button
              onClick={handleResetSeason}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Poin Klasemen ke 0 (Pertahankan Semua Peserta)</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Inspeksi Bukti Stiker DONE */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#070f2c] border border-blue-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900 mb-4">
              <div>
                <h3 className="text-base font-bold font-display uppercase text-white">
                  Inspeksi Foto Stiker DONE/CEK: {selectedReport.teamName}
                </h3>
                <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                  No WhatsApp: <span className="text-cyan-400 font-bold">{selectedReport.phone}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setShowRejectDialog(false);
                }}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="mb-4 bg-black p-2 rounded-xl border border-blue-900 text-center">
              <div className="max-h-96 overflow-hidden rounded-lg mx-auto">
                <img
                  src={selectedReport.screenshotUrl}
                  alt="Bukti Chat GB"
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
              </div>
            </div>

            {/* Action Bar for Inspeksi Report */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-blue-900 mt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStartEditReport(selectedReport);
                    setSelectedReport(null);
                  }}
                  className="px-3 py-1.5 bg-[#070e28] hover:bg-blue-900/60 border border-blue-800 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Data Storan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteReportClick(selectedReport);
                  }}
                  className="px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/70 border border-rose-900/60 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Laporan</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedReport.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectDialog(true)}
                      className="px-4 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold rounded-lg cursor-pointer"
                    >
                      Tolak Storan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveReport(selectedReport)}
                      className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg shadow-lg cursor-pointer"
                    >
                      Sahkan (+1 Poin)
                    </button>
                  </>
                )}

                {selectedReport.status === 'DONE' && (
                  <button
                    type="button"
                    onClick={() => setShowRejectDialog(true)}
                    className="px-4 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold rounded-lg cursor-pointer"
                  >
                    Ubah ke Ditolak (Tarik Poin)
                  </button>
                )}

                {selectedReport.status === 'REJECTED' && (
                  <button
                    type="button"
                    onClick={() => handleApproveReport(selectedReport)}
                    className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg cursor-pointer shadow"
                  >
                    Sahkan & Berikan +1 Poin
                  </button>
                )}
              </div>
            </div>

            {showRejectDialog && (
              <form onSubmit={handleRejectReport} className="mt-4 p-4 bg-[#030616] rounded-xl border border-rose-500/40 space-y-3">
                <label className="block text-rose-300 font-bold">Alasan Penolakan Storan:</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Jam di screenshot tidak cocok dengan log kirim stiker DONE admin di grup GB."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-[#070e28] border border-rose-500/50 rounded-lg p-2 text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectDialog(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded cursor-pointer shadow"
                  >
                    Konfirmasi Tolak
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Edit Data Storan Kemenangan */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#070f2c] border border-cyan-500/50 rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 text-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900">
              <h3 className="text-base font-bold font-display uppercase text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Edit Laporan Storan Kemenangan</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingReport(null)}
                className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded cursor-pointer hover:bg-slate-700"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSaveEditReport} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Tim *</label>
                  <input
                    type="text"
                    required
                    value={reportFormData.teamName}
                    onChange={(e) => setReportFormData({ ...reportFormData, teamName: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={reportFormData.phone}
                    onChange={(e) => setReportFormData({ ...reportFormData, phone: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Kapten</label>
                  <input
                    type="text"
                    value={reportFormData.captainName}
                    onChange={(e) => setReportFormData({ ...reportFormData, captainName: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sesi Match Pot</label>
                  <input
                    type="text"
                    value={reportFormData.potName}
                    onChange={(e) => setReportFormData({ ...reportFormData, potName: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Waktu / Tanggal Setor</label>
                  <input
                    type="text"
                    value={reportFormData.storanDate}
                    onChange={(e) => setReportFormData({ ...reportFormData, storanDate: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Verifikasi *</label>
                  <select
                    value={reportFormData.status}
                    onChange={(e) => setReportFormData({ ...reportFormData, status: e.target.value as ReportStatus })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="DONE">DONE / Sah (+1 Poin Masuk)</option>
                    <option value="REJECTED">REJECTED / Ditolak (0 Poin)</option>
                    <option value="PENDING">PENDING / Under Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Admin / Alasan Penolakan</label>
                <textarea
                  rows={2}
                  value={reportFormData.adminNotes}
                  onChange={(e) => setReportFormData({ ...reportFormData, adminNotes: e.target.value })}
                  placeholder="Catatan hasil verifikasi screenshot..."
                  className="w-full bg-[#030616] border border-blue-900 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Foto Screenshot Bukti (Opsional Ganti)</label>
                <div className="flex items-center gap-3">
                  {reportFormData.screenshotUrl && (
                    <img
                      src={reportFormData.screenshotUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-blue-900 shrink-0"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2 bg-[#030616] hover:bg-[#070e28] border border-dashed border-blue-700 rounded-lg text-slate-300 flex items-center justify-center gap-2 text-xs">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isReportScreenshotUploading ? 'Mengompres...' : 'Ganti Foto dari Galeri...'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReportScreenshotUpload}
                      disabled={isReportScreenshotUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-blue-900">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteReportClick(editingReport);
                    setEditingReport(null);
                  }}
                  className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Laporan</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReport(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-lg"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Laporan / Storan Manual */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#070f2c] border border-cyan-500/50 rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 text-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900">
              <h3 className="text-base font-bold font-display uppercase text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Tambah Laporan Storan Manual</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddReportModal(false)}
                className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded cursor-pointer hover:bg-slate-700"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSaveManualReport} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Tim *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SQUAD DRAGONS"
                    value={reportFormData.teamName}
                    onChange={(e) => setReportFormData({ ...reportFormData, teamName: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={reportFormData.phone}
                    onChange={(e) => setReportFormData({ ...reportFormData, phone: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Kapten (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Nama Kapten"
                    value={reportFormData.captainName}
                    onChange={(e) => setReportFormData({ ...reportFormData, captainName: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sesi Match Pot</label>
                  <input
                    type="text"
                    value={reportFormData.potName}
                    onChange={(e) => setReportFormData({ ...reportFormData, potName: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Waktu / Tanggal Setor</label>
                  <input
                    type="text"
                    value={reportFormData.storanDate}
                    onChange={(e) => setReportFormData({ ...reportFormData, storanDate: e.target.value })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Laporan *</label>
                  <select
                    value={reportFormData.status}
                    onChange={(e) => setReportFormData({ ...reportFormData, status: e.target.value as ReportStatus })}
                    className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="DONE">DONE / Sah Langsung (+1 Poin Ditambahkan)</option>
                    <option value="REJECTED">REJECTED / Ditolak (Catat Bukti Palsu)</option>
                    <option value="PENDING">PENDING / Under Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unggah Screenshot Bukti dari Galeri</label>
                <div className="flex items-center gap-3">
                  {reportFormData.screenshotUrl && (
                    <img
                      src={reportFormData.screenshotUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-blue-900 shrink-0"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2 bg-[#030616] hover:bg-[#070e28] border border-dashed border-cyan-500/50 rounded-lg text-slate-300 flex items-center justify-center gap-2 text-xs">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isReportScreenshotUploading ? 'Mengompres...' : 'Pilih Foto dari Galeri...'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReportScreenshotUpload}
                      disabled={isReportScreenshotUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Admin</label>
                <textarea
                  rows={2}
                  value={reportFormData.adminNotes}
                  onChange={(e) => setReportFormData({ ...reportFormData, adminNotes: e.target.value })}
                  placeholder="Catatan admin panitia..."
                  className="w-full bg-[#030616] border border-blue-900 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-blue-900">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-lg"
                >
                  Tambah Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kode QR Resmi Turnamen (Admin Exclusive) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-[#070f2c] border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-2xl p-6 text-center space-y-5 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase font-display text-white">
                    Kode QR Resmi Turnamen
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-400">
                    Khusus Panel Admin · KLEPON FT
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-lg bg-[#030616] hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors border border-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="bg-gradient-to-b from-[#030718] to-[#040b22] border-2 border-cyan-500/40 p-5 rounded-2xl shadow-xl space-y-3">
              <div className="bg-white p-3.5 rounded-xl inline-block shadow-2xl mx-auto border-4 border-cyan-400/30">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Kode QR Turnamen"
                    className="w-56 h-56 mx-auto object-contain block rounded"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-800 font-mono text-xs">
                    {isGeneratingQr ? 'Membuat QR Code...' : 'QR Code siap'}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white text-xs font-display uppercase tracking-wide">
                  Scan untuk Langsung Menuju Website Turnamen
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Arahkan kamera HP / Google Lens / WhatsApp untuk membuka portal klasemen, storan kemenangan, dan jadwal pertandingan.
                </p>
              </div>
            </div>

            {/* URL Copy Box */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-mono text-slate-400 font-semibold">
                Tautan Resmi Platform:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getPlatformShareUrl()}
                  className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 transition-transform active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-950" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons: Download QR & WhatsApp Share */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadQrImage}
                disabled={!qrDataUrl}
                className="w-full px-4 py-2.5 bg-[#0a1438] hover:bg-[#0f1f54] text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Unduh Gambar QR</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🔥 *KLEPON WEEKLY TURNAMENT FREE - FREE FIRE CLASH SQUAD*\n\n` +
                  `Ayo gabung turnamen mingguan 100% GRATIS! Kumpulkan poin kemenangan FT dan rebut total hadiah ${season.totalPrizePool}.\n\n` +
                  `📲 Scan QR atau kunjungi link berikut untuk cek klasemen & setor kemenangan:\n${getPlatformShareUrl()}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Bagikan ke WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global In-App Confirmation Modal (Safe for Sandboxed Iframe) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070f2c] border border-rose-500/70 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">{confirmModal.title}</h4>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-900/60">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-5 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-bold rounded-lg cursor-pointer shadow-lg shadow-rose-900/40 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmModal.confirmLabel || 'Ya, Lanjutkan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
