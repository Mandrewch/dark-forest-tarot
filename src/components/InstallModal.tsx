'use client';

import React from 'react';
import Image from 'next/image';
import { X, Download, Share2, PlusSquare, Sparkles, CheckCircle2, ShieldCheck, WifiOff } from 'lucide-react';
import { usePwa } from './PwaProvider';

export const InstallModal: React.FC = () => {
  const { isModalOpen, closeInstallModal, promptInstall, isIOS, isInstalled } = usePwa();

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={closeInstallModal}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-occult-gold/60 bg-[#14100c] p-6 text-parchment-100 shadow-parchment overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.2) 0%, transparent 75%)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-occult-gold/30 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-occult-gold" />
            <h3 className="font-serif text-lg font-bold tracking-wide text-parchment-100">
              Install Sacred Oracle
            </h3>
          </div>
          <button
            onClick={closeInstallModal}
            className="p-1 rounded-full border border-occult-gold/30 text-parchment-400 hover:text-white hover:border-occult-gold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* App Medallion Preview */}
        <div className="mt-5 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-2xl border-2 border-occult-gold p-1 bg-occult-bg shadow-parchment-glow overflow-hidden group">
            <Image
              src="/icon-192.png"
              alt="Dark Forest Tarot Icon"
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-xl"
              priority
            />
          </div>

          <h4 className="mt-3 font-serif text-base font-semibold text-parchment-100">
            Dark Forest Tarot
          </h4>
          <p className="text-xs text-parchment-400 font-serif tracking-wider uppercase">
            Rider-Waite Oracle & Grimoire
          </p>
        </div>

        {/* Benefits list */}
        <div className="mt-5 space-y-2.5 p-3 rounded-xl border border-occult-gold/30 bg-black/40 text-xs text-parchment-200">
          <div className="flex items-start gap-2">
            <WifiOff className="w-4 h-4 text-occult-gold shrink-0 mt-0.5" />
            <span>Works 100% offline — consultation spreads, audio chime synthesis & grimoire.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-occult-gold shrink-0 mt-0.5" />
            <span>Private & secure — your cards and reading intentions never leave your device.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-occult-gold shrink-0 mt-0.5" />
            <span>Full-screen sanctuary experience with zero browser tab clutter.</span>
          </div>
        </div>

        {/* Action Content */}
        <div className="mt-6">
          {isInstalled ? (
            <div className="p-3 text-center rounded-xl border border-occult-gold/50 bg-occult-gold/15 text-occult-gold-light text-sm font-serif">
              ✨ Dark Forest Tarot is already installed on this device!
            </div>
          ) : isIOS ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-occult-gold/40 bg-black/60 text-xs text-parchment-200 space-y-2">
                <p className="font-serif font-semibold text-occult-gold-light">
                  How to install on iPhone & iPad:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-parchment-300">
                  <li className="flex items-center gap-1.5">
                    <span>1. Tap the</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-occult-gold/40 bg-white/10 text-white font-mono">
                      <Share2 className="w-3 h-3 text-occult-gold" /> Share
                    </span>
                    <span>button in Safari</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span>2. Scroll down and choose</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-occult-gold/40 bg-white/10 text-white font-mono">
                      <PlusSquare className="w-3 h-3 text-occult-gold" /> Add to Home Screen
                    </span>
                  </li>
                  <li>3. Tap <strong>Add</strong> in the top right corner</li>
                </ol>
              </div>
              <button
                onClick={closeInstallModal}
                className="w-full py-2.5 rounded-xl border border-occult-gold/50 bg-black/40 text-xs font-serif text-parchment-300 hover:text-white"
              >
                Understood
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={async () => {
                  const installed = await promptInstall();
                  if (installed) closeInstallModal();
                }}
                className="w-full py-3 rounded-xl border-2 border-occult-gold bg-gradient-to-r from-occult-gold/25 via-occult-gold/40 to-occult-gold/25 hover:from-occult-gold/40 hover:to-occult-gold/40 text-occult-gold-light font-serif font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-parchment transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-occult-gold" />
                <span>Install App</span>
              </button>
              <p className="text-[11px] text-center text-parchment-400">
                You can also click the install icon in your browser address bar at any time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
