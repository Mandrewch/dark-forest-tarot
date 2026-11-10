'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Volume2, VolumeX, Sparkles, Shield, RotateCcw, Check, Download, Smartphone } from 'lucide-react';
import { sound } from '@/lib/sound';
import { usePwa } from './PwaProvider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowReversals: boolean;
  onToggleReversals: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  allowReversals,
  onToggleReversals,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { openInstallModal, isInstalled } = usePwa();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('tarot_gemini_api_key') || '';
      setApiKey(storedKey);
      setIsMuted(sound.getMuted());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      if (apiKey.trim()) {
        localStorage.setItem('tarot_gemini_api_key', apiKey.trim());
      } else {
        localStorage.removeItem('tarot_gemini_api_key');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playChime();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-occult-gold/60 bg-[#16120e] p-6 text-parchment-100 shadow-parchment"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-occult-gold/30 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-occult-gold" />
            <h3 className="font-serif text-lg font-bold tracking-wide text-parchment-100">
              Sanctum Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full border border-occult-gold/30 text-parchment-400 hover:text-white hover:border-occult-gold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-occult-gold/30 bg-black/40">
            <div className="flex items-center gap-3">
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-parchment-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-occult-gold" />
              )}
              <div>
                <h5 className="font-serif text-sm font-semibold text-parchment-100">
                  Ritual Audio & Chimes
                </h5>
                <p className="text-[11px] text-parchment-400">
                  Card shuffles, flips, and resonant singing bowl
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-lg border text-xs font-serif tracking-wider transition-colors ${
                isMuted
                  ? 'border-occult-border bg-black/60 text-parchment-400'
                  : 'border-occult-gold bg-occult-gold/20 text-occult-gold-light'
              }`}
            >
              {isMuted ? 'Muted' : 'Active'}
            </button>
          </div>

          {/* Reversals Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-occult-gold/30 bg-black/40">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-occult-gold" />
              <div>
                <h5 className="font-serif text-sm font-semibold text-parchment-100">
                  Reversed Cards
                </h5>
                <p className="text-[11px] text-parchment-400">
                  Include shadow aspects and inverted card meanings
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggleReversals(!allowReversals)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-serif tracking-wider transition-colors ${
                allowReversals
                  ? 'border-occult-gold bg-occult-gold/20 text-occult-gold-light'
                  : 'border-occult-border bg-black/60 text-parchment-400'
              }`}
            >
              {allowReversals ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* App Installation */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-occult-gold/30 bg-black/40">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-occult-gold" />
              <div>
                <h5 className="font-serif text-sm font-semibold text-parchment-100">
                  Device Application
                </h5>
                <p className="text-[11px] text-parchment-400">
                  {isInstalled
                    ? 'Running as standalone installed app'
                    : 'Install to desktop or home screen for offline ritual access'}
                </p>
              </div>
            </div>
            {isInstalled ? (
              <span className="px-2.5 py-1 rounded-lg border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-xs font-serif">
                Installed
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  openInstallModal();
                }}
                className="px-3 py-1.5 rounded-lg border border-occult-gold bg-occult-gold/20 hover:bg-occult-gold/30 text-occult-gold-light text-xs font-serif flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-occult-gold" />
                <span>Install</span>
              </button>
            )}
          </div>

          {/* Gemini API Key */}
          <div className="p-3 rounded-xl border border-occult-gold/30 bg-black/40 space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-occult-gold" />
              <h5 className="font-serif text-sm font-semibold text-parchment-100">
                Custom Gemini API Key (Optional)
              </h5>
            </div>
            <p className="text-[11px] text-parchment-400 leading-relaxed">
              If left blank, the app will use the server’s configured environment variable or seamlessly provide the built-in Dark Forest oracle synthesis engine.
            </p>
            <div className="flex gap-2 pt-1">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-occult-gold/40 bg-black/70 text-xs font-mono text-parchment-100 placeholder:text-parchment-600 focus:outline-none focus:border-occult-gold"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3 py-1.5 rounded-lg border border-occult-gold bg-occult-gold/20 hover:bg-occult-gold/30 text-occult-gold-light text-xs font-serif flex items-center gap-1 transition-colors"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
