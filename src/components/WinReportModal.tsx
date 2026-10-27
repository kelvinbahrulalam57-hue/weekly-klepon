import React, { useState, useEffect } from 'react';
import {
  X, Upload, ShieldAlert, Image as ImageIcon, Send, Clock,
  UserCheck, AlertTriangle, Lock, CheckCircle2, XCircle, ListFilter, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { esportsStore } from '../services/store';
import { compressImage } from '../utils/imageCompressor';

interface WinReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onOpenAuth: () => void;
}

export const WinReportModal: React.FC<WinReportModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  onOpenAuth,
}) => {
  const currentParticipant = esportsStore.getCurrentParticipant();
  const nowFormatted = new Date().toISOString().slice(0, 16).replace('T', ' ');

  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [storanDate, setStoranDate] = useState(nowFormatted);
  const [potName, setPotName] = useState('Pot Fast Tournament Free Fire');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStoranDate(new Date().toISOString().slice(0, 16).replace('T', ' '));
      setFormError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const userReports = currentParticipant
    ? esportsStore.getUserWinReports(currentParticipant.phone)
    : [];

  const triggerCelebrationConfetti = () => {
    // 1. Center explosion
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#06b6d4', '#e11d48'],
      zIndex: 99999,
    });

    // 2. Left cannon volley
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#38bdf8', '#ffffff'],
        zIndex: 99999,
      });
    }, 150);

    // 3. Right cannon volley
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#38bdf8', '#ffffff'],
        zIndex: 99999,
      });
    }, 300);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      setFormError(null);
      try {
        const compressed = await compressImage(file, 960, 960, 0.75);
        setScreenshotUrl(compressed);
      } catch (err) {
        console.error('Image compression error:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const useSampleDoneSticker = () => {
    setScreenshotUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    setPotName('Pot A Fast Tournament (Stiker DONE Admin)');
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentParticipant) {
      setFormError('Wajib login atau mendaftar peserta terlebih dahulu sebelum menyetor kemenangan!');
      onOpenAuth();
      return;
    }

    if (!screenshotUrl) {
      setFormError('Harap unggah foto/screenshot di GB saat admin mengirimkan stiker DONE atau CEK!');
      return;
    }

    if (!agreementChecked) {
      setFormError('Harap centang konfirmasi keaslian bukti stiker DONE admin terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = esportsStore.submitStoranMenang({
        storanDate,
        potName,
        screenshotUrl,
      });

      setIsSubmitting(false);

      if (res.success) {
        // Trigger celebratory confetti effect
        triggerCelebrationConfetti();
        setJustSubmitted(true);

        onNotify(
          `Storan kemenangan untuk ${currentParticipant.name} berhasil dikirim! Status saat ini: 'Under Review' (Sedang Ditinjau Panitia).`
        );
        // Switch to history tab immediately so player sees their 'Under Review' badge
        setActiveTab('history');
        setScreenshotUrl('');
        setAgreementChecked(false);
      } else {
        setFormError(res.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-xs flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between z-10">
          <div>
            <div className="text-emerald-400 font-mono text-[11px] font-bold uppercase mb-0.5">
              SETORAN POIN KUALIFIKASI TOP 10
            </div>
            <h3 className="text-base font-bold font-display uppercase text-white">
              Setor Kemenangan FT & Status Review
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bukti foto stiker DONE/CEK di chat grup GB resmi untuk klaim +1 Poin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Condition Check: MUST BE LOGGED IN */}
        {!currentParticipant ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Wajib Daftar / Login Peserta Dulu
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Anda harus login atau mendaftar peserta terlebih dahulu agar <strong>Nomor WhatsApp</strong> dan nama tim Anda tercatat otomatis di sistem untuk kualifikasi 10 besar turnamen mingguan.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all text-sm cursor-pointer"
              >
                Daftar / Login Peserta Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Nav Tabs: Submit vs History */}
            <div className="px-5 pt-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/60">
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'submit'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>+ Setor Kemenangan Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Riwayat Storan ({userReports.length})</span>
                {userReports.some((r) => r.status === 'PENDING') && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* TAB 1: FORM SUBMIT */}
            {activeTab === 'submit' && (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {formError && (
                  <div className="bg-rose-950/80 border border-rose-500/60 rounded-lg p-3 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold mb-0.5">Periksa Form Storan:</strong>
                      <span>{formError}</span>
                    </div>
                  </div>
                )}

                {/* Active User Card */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentParticipant.photoUrl}
                      alt={currentParticipant.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500/60"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{currentParticipant.name}</div>
                      <div className="text-[11px] font-mono text-emerald-400">
                        No WhatsApp: {currentParticipant.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">Poin Saat Ini</span>
                    <span className="text-sm font-bold text-amber-300">{currentParticipant.points} Pts</span>
                  </div>
                </div>

                {/* Strict Notice: NOT A PROFILE PHOTO */}
                <div className="bg-amber-950/50 border border-amber-500/50 rounded-lg p-3 text-amber-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>PERINGATAN: BUKAN FOTO PROFIL ATAU FOTO SQUAD!</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-300">
                    Foto yang Anda kirimkan <strong>WAJIB</strong> berupa screenshot obrolan di grup WhatsApp (GB) saat <strong>Admin / Panitia Klepon</strong> mengirimkan stiker resmi <strong>"DONE"</strong> atau <strong>"CEK"</strong> sebagai tanda sah kemenangan match FT Anda.
                  </p>
                  <div className="text-[10px] text-rose-300 font-medium">
                    ❌ Dilarang mengirim foto selfie, foto profil, screenshot lobi FF, atau foto editan. Storan palsu langsung diblacklist permanen!
                  </div>
                </div>

                {/* Tanggal & Jam Storan Kemenangan */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tanggal & Jam Storan Kemenangan *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={storanDate}
                    onChange={(e) => setStoranDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                  />
                  <span className="text-[10px] text-slate-500">Waktu saat Anda mengajukan klaim kemenangan FT</span>
                </div>

                {/* Sesi Pot FT */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sesi Pot / Match Fast Tournament
                  </label>
                  <input
                    type="text"
                    value={potName}
                    onChange={(e) => setPotName(e.target.value)}
                    placeholder="Contoh: Pot A FT Malam, Pot 1 Siang"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                {/* Foto di GB saat admin mengirim stiker DONE / CEK */}
                <div>
                  <label className="block text-slate-200 font-bold mb-1 flex items-center justify-between">
                    <span>Upload Foto Chat GB (Stiker DONE / CEK Admin) *</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-normal">Format: Bukti Chat GB</span>
                  </label>

                  <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-lg p-3.5 text-center transition-colors bg-slate-950/60">
                    {isCompressing ? (
                      <div className="py-6 space-y-2 text-emerald-400 font-mono text-xs animate-pulse">
                        <Upload className="w-6 h-6 mx-auto animate-bounce" />
                        <p>Mengompres dan memproses foto bukti menang...</p>
                      </div>
                    ) : screenshotUrl ? (
                      <div className="space-y-2">
                        <div className="max-h-52 overflow-hidden rounded border border-emerald-500/50 mx-auto max-w-sm bg-black">
                          <img
                            src={screenshotUrl}
                            alt="Bukti Stiker DONE di GB"
                            className="w-full h-auto object-contain max-h-52"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Foto Bukti Chat GB Terpilih</span>
                          </span>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => setScreenshotUrl('')}
                            className="px-2.5 py-1 bg-slate-800 text-rose-400 hover:bg-slate-700 rounded text-[11px] cursor-pointer"
                          >
                            Ganti Foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-7 h-7 text-emerald-400 mx-auto" />
                        <div className="text-slate-300 text-xs">
                          <label className="text-emerald-400 hover:underline cursor-pointer font-bold block text-sm mb-1">
                            <span>Pilih Screenshot Chat GB dari Galeri HP</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-[10px] text-slate-400">
                            Pastikan stiker <strong>DONE</strong> atau <strong>CEK</strong> dari panitia terlihat jelas di screenshot.
                          </p>
                        </div>
                        <div className="pt-2 flex items-center justify-center gap-2 border-t border-slate-800/80">
                          <span className="text-slate-500 text-[10px]">Contoh Bukti:</span>
                          <button
                            type="button"
                            onClick={useSampleDoneSticker}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="w-3 h-3 text-emerald-400" />
                            <span>Pakai Contoh Stiker DONE Panitia</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkbox Konfirmasi */}
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreement-gb"
                    required
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="agreement-gb" className="text-slate-300 leading-snug cursor-pointer text-[11px]">
                    Saya menyatakan screenshot chat di GB saat admin kirim stiker DONE/CEK ini adalah sah.
                    Jika palsu, nomor WhatsApp saya siap di-blacklist permanen dari seluruh event KLEPON FT.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 text-xs"
                  >
                    {isSubmitting ? (
                      <span>Mengirim Storan...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Setoran Kemenangan (+1 Poin)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: USER'S SUBMISSION HISTORY WITH 'UNDER REVIEW' BADGE */}
            {activeTab === 'history' && (
              <div className="p-5 space-y-4">
                {justSubmitted && (
                  <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900 border border-emerald-400/60 rounded-xl p-3.5 text-xs shadow-xl flex items-start gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                      <Sparkles className="w-4 h-4 fill-current animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Kemenangan Berhasil Disetor!</span>
                        <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono text-[10px] font-black uppercase">
                          Under Review
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        Bukti foto stiker DONE/CEK Anda telah tersinkronisasi realtime ke dashboard panitia. Poin (+1 Pts) akan otomatis bertambah saat status diverifikasi menjadi <strong>Verified</strong>!
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">
                    Status storan tim <strong className="text-white">{currentParticipant.name}</strong>:
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('submit')}
                    className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>+ Setor Lagi</span>
                  </button>
                </div>

                {userReports.length === 0 ? (
                  <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                    <div className="text-slate-300 font-bold">Belum Ada Storan Kemenangan</div>
                    <p className="text-slate-500 text-[11px]">
                      Segera setorkan screenshot chat GB saat admin mengirimkan stiker DONE untuk mulai mengumpulkan poin kualifikasi Top 10!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {userReports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          report.status === 'PENDING'
                            ? 'bg-amber-950/20 border-amber-500/50 shadow-sm shadow-amber-500/10'
                            : report.status === 'DONE'
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-rose-950/20 border-rose-500/40'
                        }`}
                      >
                        {/* Header: Sesi + VISUAL 'UNDER REVIEW' BADGE */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 mb-2.5">
                          <div>
                            <div className="font-bold text-white text-xs">{report.potName}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Waktu: {report.storanDate}
                            </div>
                          </div>

                          {/* Visual Status Badges */}
                          <div>
                            {report.status === 'PENDING' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>Under Review (Sedang Ditinjau)</span>
                              </span>
                            )}

                            {report.status === 'DONE' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Verified (+1 Poin Sah)</span>
                              </span>
                            )}

                            {report.status === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-sm">
                                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span>Ditolak Panitia</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="flex items-center gap-3">
                          <img
                            src={report.screenshotUrl}
                            alt="Bukti Chat GB"
                            onClick={() => setSelectedPreviewImage(report.screenshotUrl)}
                            className="w-16 h-14 rounded object-cover border border-slate-700 shrink-0 bg-black cursor-pointer hover:border-emerald-400 transition-colors"
                            title="Klik untuk perbesar"
                          />
                          <div className="text-[11px] text-slate-300 space-y-1">
                            {report.status === 'PENDING' && (
                              <p className="text-amber-300/90 leading-tight">
                                Storan sedang diperiksa panitia di log chat GB. Poin akan bertambah otomatis begitu status berubah menjadi <strong>Verified</strong>.
                              </p>
                            )}
                            {report.status === 'DONE' && (
                              <p className="text-emerald-300/90 leading-tight font-medium">
                                ✓ {report.adminNotes || 'Stiker DONE terverifikasi. +1 Poin berhasil masuk kualifikasi!'}
                              </p>
                            )}
                            {report.status === 'REJECTED' && (
                              <p className="text-rose-300/90 leading-tight">
                                ✗ {report.adminNotes || 'Storan ditolak karena bukti tidak sesuai.'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Fullscreen Preview */}
        {selectedPreviewImage && (
          <div
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPreviewImage(null)}
          >
            <div className="relative max-w-lg bg-slate-950 border border-slate-700 rounded-lg p-2 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-2 px-2 text-xs text-slate-300 font-mono">
                <span>Bukti Chat Stiker DONE di GB</span>
                <button
                  onClick={() => setSelectedPreviewImage(null)}
                  className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 hover:text-white"
                >
                  Tutup
                </button>
              </div>
              <img
                src={selectedPreviewImage}
                alt="Full Preview Bukti"
                className="max-h-[75vh] w-auto mx-auto object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
