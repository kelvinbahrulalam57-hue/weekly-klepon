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
      <div className="bg-[#070f2c] border border-blue-800/80 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-xs">
        {/* Header */}
        <div className="sticky top-0 bg-[#050b20]/95 backdrop-blur-sm border-b border-blue-900/60 p-4 sm:p-5 flex items-center justify-between z-10">
          <div>
            <div className="text-cyan-400 font-mono text-[11px] font-bold uppercase mb-0.5 flex items-center gap-1.5">
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
            className="w-7 h-7 rounded-lg bg-blue-950 hover:bg-blue-900 text-slate-300 flex items-center justify-center cursor-pointer border border-blue-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Logged In State */}
        {!currentParticipant ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-cyan-400 mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Anda Belum Login / Terdaftar
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Silakan login atau daftarkan nomor WhatsApp dan nama squad Anda terlebih dahulu untuk melihat riwayat klaim poin kemenangan FT Anda.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Daftar / Login Sekarang
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-5">
            {/* Participant Summary Bar */}
            <div className="bg-[#030616] border border-blue-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentParticipant.photoUrl}
                  alt={currentParticipant.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400/60 shadow-md"
                />
                <div>
                  <div className="font-bold text-sm text-white">{currentParticipant.name}</div>
                  <div className="text-xs font-mono text-cyan-400">
                    No WhatsApp: {currentParticipant.phone}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Terdaftar sejak {currentParticipant.registeredAt}
                  </div>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2">
                  <div className="text-amber-400 font-bold text-sm">{pendingCount}</div>
                  <div className="text-[10px] text-slate-400">Under Review</div>
                </div>
                <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-2">
                  <div className="text-cyan-300 font-bold text-sm">{verifiedCount}</div>
                  <div className="text-[10px] text-slate-400">Verified (+1)</div>
                </div>
                <div className="bg-[#070e28] border border-blue-900 rounded-lg p-2">
                  <div className="text-amber-300 font-bold text-sm">{currentParticipant.points}</div>
                  <div className="text-[10px] text-slate-400">Total Poin</div>
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Daftar Storan Kemenangan ({userReports.length})</span>
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 text-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>+ Setor Menang FT Baru</span>
                </button>
              </div>

              {userReports.length === 0 ? (
                <div className="p-8 text-center bg-[#030616] border border-dashed border-blue-900 rounded-xl space-y-3">
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
                    className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow"
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
                          ? 'bg-cyan-950/20 border-cyan-500/40'
                          : 'bg-rose-950/20 border-rose-500/40'
                      }`}
                    >
                      {/* Card Header with prominent Visual Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-blue-900/60 mb-3">
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{report.potName || 'Fast Tournament Clash Squad'}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            Waktu Storan: <span className="text-slate-200">{report.storanDate}</span>
                          </div>
                        </div>

                        {/* Visual Status Badges */}
                        <div className="flex items-center gap-2">
                          {report.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/60 rounded-full font-mono text-xs font-bold shadow-sm shadow-amber-500/20 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>UNDER REVIEW</span>
                            </span>
                          )}

                          {report.status === 'DONE' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 rounded-full font-mono text-xs font-bold shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                              <span>VERIFIED (+1 POIN)</span>
                            </span>
                          )}

                          {report.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/60 rounded-full font-mono text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>REJECTED</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                        {/* Thumbnail of Done Sticker */}
                        <div className="sm:col-span-4 bg-black rounded-lg p-1.5 border border-blue-900 flex flex-col items-center">
                          <img
                            src={report.screenshotUrl}
                            alt="Screenshot Chat GB"
                            className="w-full h-28 object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(report.screenshotUrl)}
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedImage(report.screenshotUrl)}
                            className="mt-1 text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Buka Gambar Penuh</span>
                          </button>
                        </div>

                        {/* Audit Details */}
                        <div className="sm:col-span-8 space-y-2 text-xs">
                          {report.status === 'PENDING' && (
                            <div className="p-2.5 bg-amber-950/30 rounded border border-amber-500/30 text-amber-200">
                              <div className="font-semibold flex items-center gap-1.5 text-[11px] mb-0.5">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>Sedang Menunggu Verifikasi Panitia</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                Foto screenshot chat stiker DONE di GB Anda sedang diverifikasi silang dengan log chat admin. Poin +1 akan otomatis bertambah ke klasemen begitu panitia menyetujui.
                              </p>
                            </div>
                          )}

                          {report.status === 'DONE' && (
                            <div className="p-2.5 bg-cyan-950/30 rounded border border-cyan-500/30 text-cyan-200">
                              <div className="font-semibold flex items-center gap-1.5 text-[11px] mb-0.5 text-cyan-300">
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                <span>Terverifikasi Sah oleh Panitia (+1 Poin)</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {report.adminNotes || 'Foto stiker DONE di chat GB terkonfirmasi valid. Poin kualifikasi telah ditambahkan ke klasemen!'}
                              </p>
                              {report.verifiedAt && (
                                <div className="text-[10px] font-mono text-cyan-400 mt-1">
                                  Diverifikasi: {report.verifiedAt.slice(0, 16).replace('T', ' ')}
                                </div>
                              )}
                            </div>
                          )}

                          {report.status === 'REJECTED' && (
                            <div className="p-2.5 bg-rose-950/40 rounded border border-rose-500/40 text-rose-200">
                              <div className="font-semibold flex items-center gap-1.5 text-[11px] mb-0.5 text-rose-300">
                                <ShieldAlert className="w-3 h-3 text-rose-400" />
                                <span>Storan Tidak Disetujui</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {report.adminNotes || 'Bukti chat tidak cocok atau stiker DONE tidak terverifikasi di jam tersebut.'}
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

        {/* Modal Fullscreen Preview Gambar Stiker */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="relative max-w-2xl w-full bg-[#070f2c] border border-blue-700 rounded-2xl overflow-hidden shadow-2xl p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="max-h-[80vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Bukti Stiker DONE Chat GB"
                  className="w-full h-auto object-contain max-h-[80vh] mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
