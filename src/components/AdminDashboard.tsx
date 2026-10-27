import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle, Clock, Eye, Trophy, Users, AlertTriangle,
  RotateCcw, Save, ExternalLink, Search, Ban, Lock, LogOut, Check, Phone, ArrowLeft,
  MessageCircle, Send, Image as ImageIcon, Trash2, Plus, Sparkles, Upload, Edit2,
  ShieldAlert, X
} from 'lucide-react';
import { esportsStore } from '../services/store';
import { WinReport, ReportStatus, AdminContactInfo, PlayerTeam, BannerPoster, BlacklistEntry } from '../types/esports';
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
  const [activeTab, setActiveTab] = useState<'queue' | 'top10_broadcast' | 'teams' | 'banners' | 'blacklist' | 'contacts' | 'season'>('queue');
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

  // Blacklist management state
  const [showAddBlForm, setShowAddBlForm] = useState(false);
  const [blTeamName, setBlTeamName] = useState('');
  const [blCaptainName, setBlCaptainName] = useState('');
  const [blPhone, setBlPhone] = useState('');
  const [blReason, setBlReason] = useState('');
  const [blPenalty, setBlPenalty] = useState('BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT');
  const [blEvidence, setBlEvidence] = useState('');
  const [editingBlEntry, setEditingBlEntry] = useState<BlacklistEntry | null>(null);

  const isAdmin = esportsStore.isAdmin();
  const reports = esportsStore.getWinReports();
  const players = esportsStore.getPlayers();
  const top10Players = esportsStore.getTop10Players();
  const banners = esportsStore.getBanners();
  const season = esportsStore.getSeason();
  const contacts = esportsStore.getContacts();
  const blacklist = esportsStore.getBlacklist();

  const [contactForm, setContactForm] = useState<AdminContactInfo>(contacts);

  // Sync contactForm with live store updates
  useEffect(() => {
    setContactForm(contacts);
  }, [contacts.adminPhone, contacts.tiktokUrl, contacts.instagramUrl, contacts.infoChannelLink]);

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
      onNotify('Login Admin Panitia Berhasil!');
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    esportsStore.logoutAdmin();
    onNotify('Admin berhasil keluar.');
    onBackToPortal();
  };

  const handleApprove = (report: WinReport) => {
    esportsStore.approveWinReport(report.id, 'Panitia KLEPON FT');
    onNotify(`Storan ${report.teamName} DI-APPROVE! +1 Poin otomatis masuk ke klasemen kualifikasi.`);
    setSelectedReport(null);
  };

  const handleRejectConfirm = () => {
    if (!selectedReport) return;
    const reason = rejectReason.trim() || 'Foto stiker DONE tidak valid / tidak ditemukan pada riwayat chat GB admin.';
    esportsStore.rejectWinReport(selectedReport.id, reason, 'Panitia KLEPON FT');
    onNotify(`Storan ${selectedReport.teamName} DITOLAK. Alasan: ${reason}`);
    setShowRejectDialog(false);
    setSelectedReport(null);
    setRejectReason('');
  };

  const handleBlacklistFromReport = (report: WinReport) => {
    const reason = prompt('Masukkan alasan blacklist tim ini:', 'Memalsukan screenshot stiker DONE/CEK admin di grup GB');
    if (reason) {
      esportsStore.blacklistTeam(
        report.teamName,
        report.phone,
        reason,
        'BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT',
        `Bukti foto stiker palsu diajukan tgl ${report.storanDate}`
      );
      esportsStore.rejectWinReport(report.id, `BLACKLISTED: ${reason}`, 'Panitia KLEPON FT');
      onNotify(`Tim ${report.teamName} (${report.phone}) resmi dimasukkan ke Wall of Shame Blacklist!`);
      setSelectedReport(null);
    }
  };

  const handleChatTop10 = (player: PlayerTeam, rank: number) => {
    const url = esportsStore.getTop10InviteLink(player, rank);
    window.open(url, '_blank');
    setContactedTeams((prev) => ({ ...prev, [player.id]: true }));
    onNotify(`Membuka WhatsApp untuk mengundang ${player.name} (Rank #${rank}) ke Grup Khusus Turnamen Mingguan.`);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsBannerUploading(true);
      try {
        const compressed = await compressImage(file, 1000, 1000, 0.75);
        setBannerImage(compressed);
      } catch (err) {
        console.error('Banner upload error:', err);
      } finally {
        setIsBannerUploading(false);
      }
    }
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImage) {
      alert('Harap masukkan judul poster dan pilih foto pamflet dari galeri!');
      return;
    }

    esportsStore.addBannerPoster({
      title: bannerTitle.trim(),
      imageUrl: bannerImage,
      caption: bannerCaption.trim(),
      isMain: bannerSetAsMain,
      uploadedBy: 'Admin Panitia',
    });

    onNotify(`Poster "${bannerTitle}" berhasil diunggah & tersinkronisasi realtime!`);
    setBannerTitle('');
    setBannerCaption('');
    setBannerImage('');
    setBannerSetAsMain(false);
  };

  const handleDeleteBanner = (banner: BannerPoster) => {
    if (confirm(`Yakin ingin menghapus poster "${banner.title}"?`)) {
      esportsStore.deleteBannerPoster(banner.id);
      onNotify(`Poster "${banner.title}" berhasil dihapus.`);
    }
  };

  const handleSetMainBanner = (banner: BannerPoster) => {
    esportsStore.setMainBanner(banner.id);
    onNotify(`Poster "${banner.title}" sekarang aktif sebagai banner utama website.`);
  };

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    esportsStore.updateContacts(contactForm);
    onNotify('Pengaturan sosial media (TikTok, Instagram) & WhatsApp berhasil diperbarui dan tersinkron realtime!');
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blTeamName.trim() || !blPhone.trim() || !blReason.trim()) {
      alert('Harap isi Nama Tim, Nomor WhatsApp, dan Alasan Blacklist!');
      return;
    }
    esportsStore.addBlacklistEntry({
      teamName: blTeamName.trim(),
      captainName: blCaptainName.trim() || blTeamName.trim(),
      phone: blPhone.trim(),
      reason: blReason.trim(),
      penalty: blPenalty.trim() || 'BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT',
      evidenceSummary: blEvidence.trim() || 'Terbukti melanggar integritas turnamen (bukti palsu).',
    });
    onNotify(`Tim ${blTeamName} berhasil ditambahkan ke daftar Blacklist & tersinkron Firestore!`);
    setBlTeamName('');
    setBlCaptainName('');
    setBlPhone('');
    setBlReason('');
    setBlPenalty('BAN PERMANEN SELURUH EVENT & KICK DARI SALURAN FT');
    setBlEvidence('');
    setShowAddBlForm(false);
  };

  const handleDeleteBlacklist = (entry: BlacklistEntry) => {
    if (confirm(`Hapus tim "${entry.teamName}" (${entry.phone}) dari daftar Blacklist? Tim ini akan dapat berpartisipasi kembali.`)) {
      esportsStore.deleteBlacklistEntry(entry.id);
      onNotify(`Tim "${entry.teamName}" berhasil dihapus dari Blacklist.`);
    }
  };

  const handleSaveEditBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlEntry) return;
    esportsStore.updateBlacklistEntry(editingBlEntry.id, {
      teamName: editingBlEntry.teamName.trim(),
      captainName: editingBlEntry.captainName.trim(),
      phone: editingBlEntry.phone.trim(),
      reason: editingBlEntry.reason.trim(),
      penalty: editingBlEntry.penalty.trim(),
      evidenceSummary: editingBlEntry.evidenceSummary.trim(),
    });
    onNotify(`Data blacklist "${editingBlEntry.teamName}" berhasil diperbarui!`);
    setEditingBlEntry(null);
  };

  const handleResetSeason = () => {
    if (confirm(`Yakin ingin mereset klasemen untuk ${season.name}? Season Week ${season.weekNumber + 1} akan dibuat otomatis dan poin direset ke 0.`)) {
      esportsStore.manualResetSeason();
      onNotify('Klasemen berhasil direset! Season baru telah aktif.');
    }
  };

  // If not logged in as Admin, show secret password-only prompt (No keyboard shortcut shown)
  if (!isAdmin) {
    return (
      <div className="py-20 px-4 bg-[#080c14] min-h-[75vh] flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-8 shadow-2xl relative text-xs">
          <button
            onClick={onBackToPortal}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Peserta</span>
          </button>

          <div className="w-12 h-12 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold font-display uppercase text-white text-center mb-1">
            Panel Panitia Tersembunyi
          </h2>
          <p className="text-[11px] text-slate-400 text-center mb-6">
            KLEPON WEEKLY TURNAMENT FREE
          </p>

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password Admin</label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Masukkan password admin"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className={`w-full bg-slate-950 border ${
                  passwordError ? 'border-rose-500' : 'border-slate-800'
                } rounded px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm`}
              />
              {passwordError && (
                <p className="text-rose-400 text-[10px] mt-1 font-mono">
                  Password salah! Silakan coba lagi.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              Buka Dashboard Panitia
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080c14] py-8 lg:py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Admin Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PANEL ADMIN · KLEPON WEEKLY TURNAMENT FREE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display uppercase text-white tracking-tight">
              Dashboard Verifikasi Stiker DONE & Top 10
            </h1>
            <div className="text-xs text-slate-400 mt-0.5">
              Season: <span className="text-white font-mono font-bold">{season.name}</span> · Reset Otomatis: <span className="text-emerald-400 font-mono">{season.endDate} (23:59 WIB)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Lihat Portal Pemain
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-500/40 rounded text-xs text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Total Storan</span>
              <Shield className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
              {totalReports}
            </div>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded">
            <div className="text-xs text-amber-400 flex items-center justify-between">
              <span>Perlu Cek (PENDING)</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-amber-400 mt-1">
              {pendingCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">FOTO STIKER DONE</div>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded">
            <div className="text-xs text-emerald-400 flex items-center justify-between">
              <span>Disetujui (+1 Poin)</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-emerald-400 mt-1">
              {doneCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">POIN MASUK</div>
          </div>

          <div className="bg-slate-900 border border-rose-500/30 p-3.5 rounded">
            <div className="text-xs text-rose-400 flex items-center justify-between">
              <span>Ditolak / Palsu</span>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-rose-400 mt-1">
              {rejectedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">BUKTI INVALID</div>
          </div>

          <div className="bg-slate-900 border border-teal-500/30 p-3.5 rounded">
            <div className="text-xs text-teal-400 flex items-center justify-between">
              <span>Lolos Top 10</span>
              <Trophy className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-teal-400 mt-1">
              {top10Players.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">MASUK BAGAN 30K</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'queue' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Antrean Storan Stiker DONE ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('top10_broadcast')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'top10_broadcast' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Broadcast WA Top 10 Bagan</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teams' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Seluruh Peserta ({players.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blacklist')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'blacklist' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Blacklist ({blacklist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'banners' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Kelola Banner & Poster ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contacts' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Kontak Saluran & Konsultasi</span>
          </button>

          <button
            onClick={() => setActiveTab('season')}
            className={`px-4 py-2 text-xs font-bold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'season' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Klasemen Otomatis / Manual</span>
          </button>
        </div>

        {/* TAB 1: Antrean Verifikasi Storan */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded">
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                    statusFilter === 'PENDING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PENDING ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter('DONE')}
                  className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                    statusFilter === 'DONE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DONE ({doneCount})
                </button>
                <button
                  onClick={() => setStatusFilter('REJECTED')}
                  className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                    statusFilter === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  REJECTED ({rejectedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SEMUA ({totalReports})
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari Tim / No WhatsApp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-52 font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-xs font-mono uppercase text-slate-400">
                      <th className="py-3 px-4">Nama Tim & No WhatsApp</th>
                      <th className="py-3 px-4">Sesi Match / Pot FT</th>
                      <th className="py-3 px-4">Tgl & Jam Storan</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Foto Stiker DONE di GB</th>
                      <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Tidak ada data storan dalam status ini.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{report.teamName}</div>
                            <a
                              href={`https://wa.me/${report.phone.startsWith('0') ? '62' + report.phone.slice(1) : report.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 hover:underline"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{report.phone}</span>
                            </a>
                          </td>

                          <td className="py-3 px-4 text-slate-300">
                            {report.potName || 'Fast Tournament CS'}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-300">
                            <div>{report.storanDate}</div>
                            <div className="text-[10px] text-slate-500">
                              Submit: {new Date(report.submittedAt).toLocaleTimeString('id-ID')}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {report.status === 'PENDING' && (
                              <span className="inline-block px-2.5 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold rounded text-[10px]">
                                PENDING
                              </span>
                            )}
                            {report.status === 'DONE' && (
                              <span className="inline-block px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold rounded text-[10px]">
                                DONE (+1 POIN)
                              </span>
                            )}
                            {report.status === 'REJECTED' && (
                              <span className="inline-block px-2.5 py-1 bg-rose-500/10 border border-rose-500/40 text-rose-400 font-bold rounded text-[10px]">
                                REJECTED
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-teal-400" />
                              <span>Lihat Chat GB</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            {report.status === 'PENDING' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(report)}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[11px] transition-colors cursor-pointer"
                                  title="Approve & Tambahkan +1 Poin Otomatis"
                                >
                                  Approve (+1)
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setShowRejectDialog(true);
                                  }}
                                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-[11px] transition-colors cursor-pointer"
                                  title="Tolak Bukti"
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedReport(report)}
                                className="text-slate-400 hover:text-white text-[11px] underline cursor-pointer"
                              >
                                Detail Audit
                              </button>
                            )}
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

        {/* TAB 2: Broadcast WA Top 10 Lolos Bagan Mingguan */}
        {activeTab === 'top10_broadcast' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold uppercase font-display text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>Daftar 10 Tim Teratas yang Lolos ke Turnamen Mingguan</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Klik tombol <strong>Chat WA & Kirim Link Grup Khusus</strong> untuk mengundang kapten tim ke grup khusus turnamen mingguan sistem bagan gugur.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase bg-slate-950">
                    <th className="py-2.5 px-3">Peringkat</th>
                    <th className="py-2.5 px-3">Nama Tim</th>
                    <th className="py-2.5 px-3">Nomor WhatsApp Terdaftar</th>
                    <th className="py-2.5 px-3 text-center">Poin Kualifikasi</th>
                    <th className="py-2.5 px-3 text-center">Status Hubungi</th>
                    <th className="py-2.5 px-3 text-right">Aksi WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {top10Players.map((player, idx) => {
                    const rank = idx + 1;
                    const isContacted = contactedTeams[player.id];

                    return (
                      <tr key={player.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                          #{rank}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {player.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-200">
                          {player.phone}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-300">
                          {player.points} PTS ({player.wins} Win)
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isContacted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                              <Check className="w-3 h-3" />
                              Sudah Dikontak
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-mono">
                              Belum Dikontak
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleChatTop10(player, rank)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                          >
                            <Send className="w-3 h-3" />
                            <span>Chat WA & Masukkan Grup Khusus</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Seluruh Peserta */}
        {activeTab === 'teams' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
              Seluruh Peserta Terdaftar ({players.length} Tim)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Daftar seluruh tim dan akumulasi poin dari storan stiker DONE yang lolos inspeksi panitia.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase bg-slate-950">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Nama Tim</th>
                    <th className="py-2.5 px-3">No WhatsApp</th>
                    <th className="py-2.5 px-3 text-center">Match FT</th>
                    <th className="py-2.5 px-3 text-center">Total Win</th>
                    <th className="py-2.5 px-3 text-right">Poin FT</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {players.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">#{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{p.phone}</td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums">{p.matchesPlayed}</td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-emerald-400 font-bold">{p.wins}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-400 font-bold text-sm">{p.points} PTS</td>
                      <td className="py-2.5 px-3 text-center">
                        {idx < 10 ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            LOLOS TOP 10
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Di Bawah Garis
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Blacklist (Kelola & Setting Lengkap) */}
        {activeTab === 'blacklist' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold font-display uppercase text-white flex items-center gap-2">
                    <Ban className="w-5 h-5 text-rose-400" />
                    <span>Database & Pengaturan Blacklist ({blacklist.length} Tim)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kelola daftar tim dan nomor WhatsApp yang terkena sanksi banned karena memalsukan bukti stiker DONE/CEK. Tersinkron realtime ke database Firestore.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBlForm(!showAddBlForm)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center gap-2 text-xs cursor-pointer shadow-lg shadow-rose-600/20 self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddBlForm ? 'Tutup Form Tambah' : '+ Tambah Blacklist Baru'}</span>
                </button>
              </div>

              {/* Form Tambah Blacklist Manual */}
              {showAddBlForm && (
                <form onSubmit={handleAddBlacklist} className="mt-5 p-4 bg-slate-950 border border-rose-500/30 rounded-xl space-y-4 text-xs">
                  <div className="font-bold text-rose-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Form Input Tim / Nomor ke Blacklist</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nama Tim *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: CHEATER VORTEX 4v4"
                        value={blTeamName}
                        onChange={(e) => setBlTeamName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nama Kapten / IGN</label>
                      <input
                        type="text"
                        placeholder="Contoh: Kapten Doni"
                        value={blCaptainName}
                        onChange={(e) => setBlCaptainName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 085799988771"
                        value={blPhone}
                        onChange={(e) => setBlPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Alasan Pelanggaran *</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        'Memalsukan screenshot stiker DONE/CEK admin di grup GB',
                        'Mengedit jam chat via WhatsApp Web / Inspect Element',
                        'Memotong (crop) jam dan nama grup agar bukti palsu tersamar',
                        'Menggunakan bukti stiker turnamen lain / event lama',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBlReason(preset)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded cursor-pointer border border-slate-700"
                        >
                          + {preset.slice(0, 35)}...
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan alasan lengkap..."
                      value={blReason}
                      onChange={(e) => setBlReason(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sanksi Resmi</label>
                      <input
                        type="text"
                        value={blPenalty}
                        onChange={(e) => setBlPenalty(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Ringkasan Bukti / Forensik</label>
                      <input
                        type="text"
                        placeholder="Contoh: Log chat membuktikan admin tidak pernah kirim stiker di jam tersebut"
                        value={blEvidence}
                        onChange={(e) => setBlEvidence(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBlForm(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center gap-1.5 shadow-md shadow-rose-600/30 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Simpan & Terapkan Blacklist</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Blacklist Items Table / Cards */}
              <div className="mt-5 space-y-3">
                {blacklist.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-lg border border-slate-800 text-slate-400">
                    Belum ada tim yang diblacklist.
                  </div>
                ) : (
                  blacklist.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-slate-950 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs space-y-2 transition-all shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-rose-400 font-display uppercase">
                              {entry.teamName}
                            </span>
                            <span className="text-[10px] bg-rose-950 border border-rose-500/40 text-rose-300 font-bold px-2 py-0.5 rounded">
                              BLACKLISTED
                            </span>
                          </div>
                          <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                            Kapten: <strong className="text-slate-200">{entry.captainName || entry.teamName}</strong> · WhatsApp: <strong className="text-emerald-400">{entry.phone}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingBlEntry(entry)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded flex items-center gap-1 cursor-pointer"
                            title="Edit Data Blacklist"
                          >
                            <Edit2 className="w-3 h-3 text-amber-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlacklist(entry)}
                            className="px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold rounded flex items-center gap-1 cursor-pointer"
                            title="Cabut Sanksi & Hapus dari Blacklist"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-slate-300">
                        <strong className="text-white">Alasan:</strong> {entry.reason}
                      </div>

                      {entry.evidenceSummary && (
                        <div className="text-slate-400 font-mono text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/80">
                          <strong className="text-slate-300">Hasil Forensik:</strong> {entry.evidenceSummary}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] pt-1 text-slate-400 font-mono">
                        <div>
                          <strong className="text-rose-400">Sanksi:</strong> {entry.penalty}
                        </div>
                        <div>Ditetapkan: {entry.date}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Edit Blacklist Entry */}
            {editingBlEntry && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="font-bold text-white text-sm uppercase flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-amber-400" />
                      <span>Edit Data Blacklist: {editingBlEntry.teamName}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingBlEntry(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditBlacklist} className="space-y-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nama Tim</label>
                      <input
                        type="text"
                        required
                        value={editingBlEntry.teamName}
                        onChange={(e) => setEditingBlEntry({ ...editingBlEntry, teamName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nama Kapten</label>
                        <input
                          type="text"
                          value={editingBlEntry.captainName}
                          onChange={(e) => setEditingBlEntry({ ...editingBlEntry, captainName: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">No WhatsApp</label>
                        <input
                          type="text"
                          required
                          value={editingBlEntry.phone}
                          onChange={(e) => setEditingBlEntry({ ...editingBlEntry, phone: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Alasan Blacklist</label>
                      <input
                        type="text"
                        required
                        value={editingBlEntry.reason}
                        onChange={(e) => setEditingBlEntry({ ...editingBlEntry, reason: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sanksi Resmi</label>
                      <input
                        type="text"
                        required
                        value={editingBlEntry.penalty}
                        onChange={(e) => setEditingBlEntry({ ...editingBlEntry, penalty: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-rose-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Ringkasan Forensik Bukti</label>
                      <textarea
                        rows={2}
                        value={editingBlEntry.evidenceSummary}
                        onChange={(e) => setEditingBlEntry({ ...editingBlEntry, evidenceSummary: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingBlEntry(null)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Pengaturan Sosial Media & Saluran Informasi */}
        {activeTab === 'contacts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-3xl shadow-xl">
            <div className="pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-bold uppercase font-display text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Pengaturan Sosial Media (TikTok, Instagram) & Saluran Informasi</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Atur nama akun TikTok, Instagram beserta tautan resminya, serta link Saluran Informasi WhatsApp dan kontak panitia. Perubahan langsung tersinkron secara realtime ke database Firestore dan tampil di seluruh bagian website.
              </p>
            </div>

            <form onSubmit={handleSaveContacts} className="space-y-6 text-xs">
              {/* SECTION 1: TIKTOK */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Pengaturan Akun TikTok Panitia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nama / Handle Akun TikTok *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: @kleponx.official"
                      value={contactForm.tiktokName || ''}
                      onChange={(e) => setContactForm({ ...contactForm, tiktokName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Link / URL Tautan Profil TikTok *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="Contoh: https://tiktok.com/@kleponx.official"
                      value={contactForm.tiktokUrl || ''}
                      onChange={(e) => setContactForm({ ...contactForm, tiktokUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: INSTAGRAM */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  <span>Pengaturan Akun Instagram Panitia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nama / Handle Akun Instagram *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: @klepon_esports"
                      value={contactForm.instagramName || ''}
                      onChange={(e) => setContactForm({ ...contactForm, instagramName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Link / URL Tautan Profil Instagram *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="Contoh: https://instagram.com/klepon_esports"
                      value={contactForm.instagramUrl || ''}
                      onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: SALURAN INFORMASI & WHATSAPP */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Saluran Informasi Resmi WhatsApp & Kontak Panitia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Saluran Informasi Resmi</label>
                    <input
                      type="text"
                      value={contactForm.infoChannelName}
                      onChange={(e) => setContactForm({ ...contactForm, infoChannelName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tautan Saluran Resmi WhatsApp (whatsapp.com/channel/...)</label>
                    <input
                      type="text"
                      value={contactForm.infoChannelLink}
                      onChange={(e) => setContactForm({ ...contactForm, infoChannelLink: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Admin Panitia</label>
                    <input
                      type="text"
                      value={contactForm.adminName}
                      onChange={(e) => setContactForm({ ...contactForm, adminName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Admin (Konsultasi / Tanya Jawab)</label>
                    <input
                      type="text"
                      value={contactForm.adminPhone}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          adminPhone: e.target.value,
                          consultationWaUrl: `https://wa.me/${e.target.value}?text=Halo%20Panitia%20KLEPON,%20saya%20ingin%20konsultasi%20dan%20tanya-tanya%20seputar%20Turnamen%20Mingguan%20Gratis%20Free%20Fire%20Clash%20Squad`,
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Grup WhatsApp Khusus Top 10 (Mingguan)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Grup Khusus Turnamen Mingguan Top 10"
                      value={contactForm.whatsappGroupName || ''}
                      onChange={(e) => setContactForm({ ...contactForm, whatsappGroupName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Link Grup WhatsApp Khusus Top 10</label>
                    <input
                      type="text"
                      placeholder="https://chat.whatsapp.com/..."
                      value={contactForm.whatsappGroupUrl || ''}
                      onChange={(e) => setContactForm({ ...contactForm, whatsappGroupUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Seluruh Pengaturan Sosial Media & Kontak</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: Kelola Banner & Poster Turnamen (Khusus Admin) */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Upload New Banner Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 max-w-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <Upload className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold font-display uppercase text-white">
                    Unggah & Edit Poster Turnamen (Khusus Admin)
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Poster yang Anda unggah akan muncul di halaman utama (tepat di bawah tulisan Weekly) dan pop-up saat player masuk.
                  </p>
                </div>
              </div>

              <form onSubmit={handleBannerSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Judul Poster / Pamflet Turnamen *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PAMFLET FREE FIRE CLASH SQUAD HADIAH 30K MINGGUAN"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Keterangan / Deskripsi Poster
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Total hadiah Rp 30.000 (Juara 1: 15k, Juara 2: 10k, Juara 3: 5k). Pendaftaran gratis, kumpulkan poin dari kemenangan FT di GB!"
                    value={bannerCaption}
                    onChange={(e) => setBannerCaption(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Pilih File Foto Poster dari Galeri Perangkat *
                  </label>
                  <div className="border border-dashed border-slate-700 rounded-lg p-4 text-center bg-slate-950/60">
                    {isBannerUploading ? (
                      <div className="py-4 text-emerald-400 font-mono text-xs animate-pulse">
                        Mengompres & memproses gambar poster...
                      </div>
                    ) : bannerImage ? (
                      <div className="space-y-2">
                        <img
                          src={bannerImage}
                          alt="Preview Banner"
                          className="max-h-48 mx-auto rounded object-contain border border-slate-700 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setBannerImage('')}
                          className="text-rose-400 hover:underline text-[11px] cursor-pointer"
                        >
                          Ganti Foto Poster
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                        <label className="text-emerald-400 hover:underline cursor-pointer font-bold block text-sm">
                          <span>Pilih Foto dari Galeri (HP / Laptop)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-slate-500">
                          Format JPG atau PNG. Otomatis dikompres agar sinkron realtime ke seluruh pengunjung.
                        </p>
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
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="bannerMainCheck" className="text-slate-300 text-xs cursor-pointer">
                    Jadikan sebagai <strong>Banner Utama Aktif</strong> (tampil di bawah judul Weekly & pop-up masuk website)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isBannerUploading}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Terapkan Poster Baru</span>
                </button>
              </form>
            </div>

            {/* Existing Banners List */}
            <div>
              <h4 className="text-sm font-bold uppercase text-white mb-3 font-display flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Daftar Poster Turnamen Tersimpan ({banners.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className={`bg-slate-900 border rounded-xl overflow-hidden flex flex-col justify-between ${
                      b.isMain ? 'border-amber-500/60 shadow-lg shadow-amber-500/10' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-[16/9] bg-black overflow-hidden group">
                        <img
                          src={b.imageUrl}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {b.isMain && (
                          <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] font-mono shadow">
                            BANNER UTAMA AKTIF
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-1">
                        <h5 className="font-bold text-white text-xs leading-snug line-clamp-1">
                          {b.title}
                        </h5>
                        {b.caption && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {b.caption}
                          </p>
                        )}
                        <div className="text-[10px] font-mono text-slate-500 pt-1">
                          Diupload: {b.createdAt} oleh {b.uploadedBy}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      {!b.isMain ? (
                        <button
                          type="button"
                          onClick={() => handleSetMainBanner(b)}
                          className="text-amber-400 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Jadikan Utama</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Aktif Sekarang</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(b)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        title="Hapus Poster Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Reset Season */}
        {activeTab === 'season' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-xl">
            <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
              Sistem Reset Klasemen Mingguan Otomatis
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Season aktif: <strong className="text-emerald-400 font-mono">{season.name}</strong>.
              <br />
              Klasemen otomatis ter-reset saat melewati batas minggu: <strong className="text-white font-mono">{season.endDate} 23:59 WIB</strong>.
              Panitia juga dapat melakukan reset manual di bawah ini jika pertandingan bagan final telah selesai.
            </p>

            <button
              onClick={handleResetSeason}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Klasemen & Buka Season Baru (Week {season.weekNumber + 1})</span>
            </button>
          </div>
        )}

        {/* Modal Inspeksi Bukti Stiker DONE Resolusi Penuh */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-bold font-display uppercase text-white flex items-center gap-2">
                    <span>Inspeksi Foto Stiker DONE/CEK: {selectedReport.teamName}</span>
                  </h3>
                  <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                    No WhatsApp: <span className="text-emerald-400 font-bold">{selectedReport.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setShowRejectDialog(false);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {/* Screenshot View */}
              <div className="mb-4 bg-slate-950 p-2 rounded border border-slate-800 text-center">
                <div className="text-[11px] font-mono text-slate-500 mb-2 flex items-center justify-between px-2">
                  <span>BUKTI CHAT DI GB (STIKER DONE / CEK ADMIN)</span>
                  <a
                    href={selectedReport.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Buka Resolusi Penuh</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="max-h-96 overflow-hidden rounded border border-slate-800 mx-auto bg-black">
                  <img
                    src={selectedReport.screenshotUrl}
                    alt="Bukti Chat GB"
                    className="w-full h-auto object-contain max-h-96 mx-auto"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 font-mono text-[11px]">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500">NO WHATSAPP</div>
                  <div className="text-emerald-400 font-bold">{selectedReport.phone}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500">TGL STORAN MENANG</div>
                  <div className="text-white font-bold">{selectedReport.storanDate}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500">STATUS</div>
                  <div className="text-amber-400 font-bold">{selectedReport.status}</div>
                </div>
              </div>

              {selectedReport.adminNotes && (
                <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-4 text-slate-300">
                  <div className="font-semibold text-slate-400 mb-1">Catatan Audit:</div>
                  <div className="font-mono text-[11px]">{selectedReport.adminNotes}</div>
                </div>
              )}

              {/* Reject Reason Dialog */}
              {showRejectDialog && (
                <div className="bg-rose-950/40 border border-rose-500/50 p-4 rounded mb-4 space-y-2">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Alasan Penolakan Bukti Stiker:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: Admin tidak pernah mengirim stiker DONE pada jam tersebut / bukti editan"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-slate-950 border border-rose-500/50 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowRejectDialog(false)}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleRejectConfirm}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer"
                    >
                      Konfirmasi Tolak
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleBlacklistFromReport(selectedReport)}
                  className="px-3 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  <span>Blacklist Tim Ini (Bukti Palsu)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold rounded cursor-pointer"
                  >
                    Tolak Storan
                  </button>
                  <button
                    onClick={() => handleApprove(selectedReport)}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve (+1 Poin Otomatis)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
