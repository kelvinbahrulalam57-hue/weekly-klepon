import React, { useState } from 'react';
import { X, Clock, CheckCircle2, XCircle, ExternalLink, Send, ShieldAlert, Image as ImageIcon, Trophy, User } from 'lucide-react';
import { esportsStore } from '../services/store';
import { WinReport } from '../types/esports';

interface UserSubmissionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
}

export const UserSubmissionHistoryModal: React.FC<UserSubmissionHistoryModalProps> = ({
  isOpen,
  onClose,
  onOpenReportModal,
  onOpenAuthModal,
}) => {
  const currentParticipant = esportsStore.getCurrentParticipant();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const userReports = currentParticipant
    ? esportsStore.getUserWinReports(currentParticipant.phone)
    : [];

  const pendingCount = userReports.filter((r) => r.status === 'PENDING').length;
  const verifiedCount = userReports.filter((r) => r.status === 'DONE').length;
  const rejectedCount = userReports.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-xs">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between z-10">
          <div>
            <div className="text-emerald-400 font-mono text-[11px] font-bold uppercase mb-0.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>STATUS KUALIFIKASI POIN SQUAD</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-display uppercase text-white">
              Riwayat Storan Kemenangan FT
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pantau status verifikasi foto stiker DONE/CEK dari panitia (Under Review ➔ Verified).
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Logged In State */}
        {!currentParticipant ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Silakan Daftar atau Login Terlebih Dahulu
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Masuk dengan Nomor WhatsApp dan nama tim Anda untuk melihat riwayat storan dan status verifikasi poin kualifikasi.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer"
            >
              Daftar / Login Peserta
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-5">
            {/* Participant Summary Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentParticipant.photoUrl}
                  alt={currentParticipant.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/60 shadow-md"
                />
                <div>
                  <div className="font-bold text-sm text-white">{currentParticipant.name}</div>
                  <div className="text-xs font-mono text-emerald-400">
                    No WhatsApp: {currentParticipant.phone}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Terdaftar sejak {currentParticipant.registeredAt}
                  </div>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="bg-amber-950/40 border border-amber-500/30 rounded p-2">
                  <div className="text-amber-400 font-bold text-sm">{pendingCount}</div>
                  <div className="text-[10px] text-slate-400">Under Review</div>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded p-2">
                  <div className="text-emerald-400 font-bold text-sm">{verifiedCount}</div>
                  <div className="text-[10px] text-slate-400">Verified (+1)</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded p-2">
                  <div className="text-amber-300 font-bold text-sm">{currentParticipant.points}</div>
                  <div className="text-[10px] text-slate-400">Total Poin</div>
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daftar Storan Kemenangan ({userReports.length})</span>
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 text-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>+ Setor Menang FT Baru</span>
                </button>
              </div>

              {userReports.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/50 border border-dashed border-slate-800 rounded-xl space-y-3">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="text-slate-300 font-bold text-sm">
                    Belum Ada Riwayat Storan Kemenangan
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Setelah Anda menang Fast Tournament dan admin mengirimkan stiker <strong>DONE</strong> atau <strong>CEK</strong> di grup GB, segera screenshot dan setorkan di sini untuk klaim +1 Poin kualifikasi.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReportModal();
                    }}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded text-xs cursor-pointer"
                  >
                    Setor Kemenangan Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 rounded-xl border transition-all ${
                        report.status === 'PENDING'
                          ? 'bg-amber-950/20 border-amber-500/40 shadow-md shadow-amber-500/5'
                          : report.status === 'DONE'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-rose-950/20 border-rose-500/40'
                      }`}
                    >
                      {/* Card Header with prominent Visual Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80 mb-3">
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{report.potName || 'Fast Tournament Clash Squad'}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            Waktu Storan: <span className="text-slate-200">{report.storanDate}</span>
                          </div>
                        </div>

                        {/* VISUAL 'UNDER REVIEW' / 'VERIFIED' / 'REJECTED' BADGE */}
                        <div>
                          {report.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Under Review (Sedang Ditinjau)</span>
                            </span>
                          )}

                          {report.status === 'DONE' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Verified (+1 Poin Sah)</span>
                            </span>
                          )}

                          {report.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-sm">
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Ditolak Panitia</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body: Screenshot thumbnail + Details */}
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        {/* Thumbnail */}
                        <div
                          onClick={() => setSelectedImage(report.screenshotUrl)}
                          className="relative w-28 h-24 sm:w-32 sm:h-24 bg-black rounded-lg overflow-hidden border border-slate-700 cursor-pointer shrink-0 group hover:border-emerald-400 transition-colors"
                          title="Klik untuk memperbesar bukti chat GB"
                        >
                          <img
                            src={report.screenshotUrl}
                            alt="Bukti Chat GB"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                            Perbesar
                          </div>
                        </div>

                        {/* Audit Details */}
                        <div className="flex-1 space-y-1.5 text-xs">
                          {report.status === 'PENDING' && (
                            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded text-amber-200">
                              <div className="font-bold flex items-center gap-1 mb-0.5">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Menunggu Pengecekan Admin</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                Storan Anda sedang dalam antrean verifikasi panitia. Admin akan mencocokkan tangkapan layar dengan stiker DONE yang dikirim di chat grup GB. Poin otomatis bertambah (+1 PTS) setelah disetujui.
                              </p>
                            </div>
                          )}

                          {report.status === 'DONE' && (
                            <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded text-emerald-200">
                              <div className="font-bold flex items-center gap-1 mb-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Terverifikasi Sah (+1 Poin)</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {report.adminNotes || 'Foto stiker DONE di GB terkonfirmasi asli. Poin berhasil ditambahkan ke akumulasi kualifikasi 10 besar!'}
                              </p>
                              {report.verifiedAt && (
                                <div className="text-[10px] font-mono text-emerald-400 mt-1">
                                  Diverifikasi: {new Date(report.verifiedAt).toLocaleString('id-ID')} oleh {report.verifiedBy || 'Admin Panitia'}
                                </div>
                              )}
                            </div>
                          )}

                          {report.status === 'REJECTED' && (
                            <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded text-rose-200">
                              <div className="font-bold flex items-center gap-1 mb-0.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                <span>Storan Tidak Sah / Ditolak</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {report.adminNotes || 'Foto stiker DONE tidak valid atau jam pengiriman tidak cocok dengan log riwayat admin di grup GB.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Fullscreen Preview Bukti */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-2xl max-h-[90vh] bg-slate-950 border border-slate-700 rounded-lg p-2 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-2 px-2 text-xs text-slate-300 font-mono">
                <span>Bukti Chat Stiker DONE di GB</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 hover:text-white"
                >
                  Tutup
                </button>
              </div>
              <img
                src={selectedImage}
                alt="Full Preview Bukti"
                className="max-h-[80vh] w-auto mx-auto object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
