import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Eye, X, Shield } from 'lucide-react';
import { esportsStore } from '../services/store';
import { BannerPoster } from '../types/esports';

interface BannerGallerySectionProps {
  onNotify: (msg: string) => void;
  onOpenAdmin?: () => void;
}

export const BannerGallerySection: React.FC<BannerGallerySectionProps> = ({ onNotify, onOpenAdmin }) => {
  const banners = esportsStore.getBanners();
  const mainBanner = esportsStore.getMainBanner();
  const isAdmin = esportsStore.isAdmin();

  const [selectedPreviewBanner, setSelectedPreviewBanner] = useState<BannerPoster | null>(null);

  return (
    <section id="galeri-poster" className="py-12 lg:py-16 bg-[#0a0f1d] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-1.5 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>GALERI RESMI & PAMFLET TURNAMEN MINGGUAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-display text-white tracking-tight">
              Poster & Banner Turnamen
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Koleksi pamflet resmi, poster aturan stiker DONE di GB, dan banner pengumuman hadiah turnamen mingguan.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded text-xs transition-all border border-emerald-500/30 cursor-pointer self-start sm:self-auto"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Kelola Banner di Dashboard Admin</span>
            </button>
          )}
        </div>

        {/* Featured Main Banner Showcase */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-8 grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          <div className="lg:col-span-5 bg-black p-3 sm:p-5 flex items-center justify-center">
            <div
              onClick={() => setSelectedPreviewBanner(mainBanner)}
              className="relative rounded-xl overflow-hidden border border-slate-800 group cursor-pointer max-h-96 w-full"
            >
              <img
                src={mainBanner.imageUrl}
                alt={mainBanner.title}
                className="w-full h-auto object-cover max-h-96 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-opacity flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lihat Resolusi Penuh</span>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-[11px] font-mono font-bold text-amber-300 uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BANNER UTAMA AKTIF</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-display uppercase text-white leading-snug">
              {mainBanner.title}
            </h3>

            {mainBanner.caption && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {mainBanner.caption}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span>Pengunggah: <strong className="text-white">{mainBanner.uploadedBy || 'Panitia'}</strong></span>
              <span>·</span>
              <span>Diperbarui: {mainBanner.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid of Other Banners */}
        <div>
          <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Koleksi Seluruh Pamflet & Poster ({banners.length})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => setSelectedPreviewBanner(banner)}
                    className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer"
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {banner.isMain && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] font-mono shadow-sm">
                        UTAMA
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h5 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-1">
                      {banner.title}
                    </h5>
                    {banner.caption && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {banner.caption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between text-xs border-t border-slate-800/80 mt-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    {banner.createdAt}
                  </span>

                  <button
                    onClick={() => setSelectedPreviewBanner(banner)}
                    className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-400" />
                    <span>Lihat Full</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Image Preview Modal */}
        {selectedPreviewBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl p-4 text-xs">
              <button
                onClick={() => setSelectedPreviewBanner(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="max-h-[75vh] overflow-hidden rounded bg-black mb-3 flex items-center justify-center">
                <img
                  src={selectedPreviewBanner.imageUrl}
                  alt={selectedPreviewBanner.title}
                  className="w-full h-auto object-contain max-h-[75vh] mx-auto"
                />
              </div>

              <div>
                <h4 className="text-base font-bold text-white uppercase font-display">
                  {selectedPreviewBanner.title}
                </h4>
                {selectedPreviewBanner.caption && (
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {selectedPreviewBanner.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
