import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Eye, X } from 'lucide-react';
import { esportsStore } from '../services/store';
import { BannerPoster } from '../types/esports';

interface BannerGallerySectionProps {
  onNotify: (msg: string) => void;
  onOpenAdmin?: () => void;
}

export const BannerGallerySection: React.FC<BannerGallerySectionProps> = () => {
  const banners = esportsStore.getBanners();
  const mainBanner = esportsStore.getMainBanner();

  const [selectedPreviewBanner, setSelectedPreviewBanner] = useState<BannerPoster | null>(null);

  return (
    <section id="galeri-poster" className="py-12 lg:py-16 bg-[#04081a] border-b border-blue-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>GALERI POSTER TURNAMEN MINGGUAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-display text-white tracking-tight">
              Poster & Banner Turnamen
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Poster resmi informasi kualifikasi turnamen mingguan gratis Free Fire Clash Squad dan aturan stiker DONE.
            </p>
          </div>
        </div>

        {/* Featured Main Banner Showcase */}
        <div className="bg-[#070f2c]/90 border border-blue-800/60 rounded-2xl overflow-hidden shadow-2xl mb-8 grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          <div className="lg:col-span-5 bg-black/70 p-3 sm:p-5 flex items-center justify-center">
            <div
              onClick={() => setSelectedPreviewBanner(mainBanner)}
              className="relative rounded-xl overflow-hidden border border-blue-900/60 group cursor-pointer max-h-96 w-full"
            >
              <img
                src={mainBanner.imageUrl}
                alt={mainBanner.title}
                className="w-full h-auto object-cover max-h-96 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-[#070f2c]/90 border border-cyan-400/50 text-white px-3.5 py-1.5 rounded-full text-xs font-bold font-mono transition-opacity flex items-center gap-1.5 shadow-lg">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lihat Resolusi Penuh</span>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/70 border border-cyan-400/40 rounded-full text-[11px] font-mono font-bold text-cyan-300 uppercase shadow-inner">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>POSTER UTAMA AKTIF</span>
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
        {banners.length > 1 && (
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Koleksi Seluruh Poster Turnamen ({banners.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-[#070f2a]/80 border border-blue-900/60 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg"
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
                        <span className="absolute top-2 left-2 bg-cyan-400 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[10px] font-mono shadow-sm">
                          UTAMA
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h5 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-1">
                        {banner.title}
                      </h5>
                      {banner.caption && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {banner.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between text-xs border-t border-blue-900/50 mt-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      {banner.createdAt}
                    </span>

                    <button
                      onClick={() => setSelectedPreviewBanner(banner)}
                      className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Lihat Full</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Image Preview Modal */}
        {selectedPreviewBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="relative max-w-2xl w-full bg-[#070f2a] border border-blue-700/80 rounded-2xl overflow-hidden shadow-2xl p-4 text-xs">
              <button
                onClick={() => setSelectedPreviewBanner(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="max-h-[75vh] overflow-hidden rounded-xl bg-black mb-3 flex items-center justify-center border border-blue-900/60">
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
