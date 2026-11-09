'use client';

import React, { useEffect } from 'react';
import { TarotCard } from '@/types/tarot';
import { X, Sparkles, Compass, Moon, Sun, Shield, Eye, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

interface CardDetailModalProps {
  card: TarotCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const getVerdictBadge = () => {
    switch (card.yesNo) {
      case 'Strong Yes':
      case 'Yes':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-serif bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <CheckCircle className="w-3.5 h-3.5" />
            Verdict: {card.yesNo}
          </span>
        );
      case 'Strong No':
      case 'No':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-serif bg-rose-950/60 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5" />
            Verdict: {card.yesNo}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-serif bg-amber-950/60 text-amber-300 border border-amber-500/40">
            <HelpCircle className="w-3.5 h-3.5" />
            Verdict: {card.yesNo}
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-occult-gold/60 bg-[#16120e] p-6 sm:p-8 text-parchment-100 shadow-parchment"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-occult-gold/40 text-parchment-300 hover:text-white hover:border-occult-gold hover:bg-occult-gold/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Quick Stats */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-56 sm:w-64 aspect-[2/3.4] rounded-xl border-2 border-occult-gold/70 overflow-hidden shadow-card-elevated bg-black/60 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-2 inset-x-2 text-center bg-black/60 backdrop-blur-sm py-1 rounded border border-occult-gold/30">
                <span className="font-serif text-xs text-occult-gold uppercase tracking-widest">
                  {card.arcana} Arcana {card.romanNumeral ? `• ${card.romanNumeral}` : ''}
                </span>
              </div>
            </div>

            {/* Quick Metadata Pillbox */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="px-2.5 py-1 rounded border border-occult-gold/30 bg-black/40 text-xs font-mono uppercase text-parchment-300">
                Element: {card.element}
              </span>
              {card.astrology && (
                <span className="px-2.5 py-1 rounded border border-occult-gold/30 bg-black/40 text-xs font-serif text-parchment-300">
                  Astro: {card.astrology}
                </span>
              )}
              {card.suit && (
                <span className="px-2.5 py-1 rounded border border-occult-gold/30 bg-black/40 text-xs font-serif uppercase text-parchment-300">
                  Suit: {card.suit}
                </span>
              )}
            </div>

            <div className="mt-4">{getVerdictBadge()}</div>
            <p className="text-[11px] text-center text-parchment-400 mt-2 px-2 italic">
              {card.yesNoContext}
            </p>
          </div>

          {/* Right Column: In-Depth Dark Forest Guide */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-occult-gold text-xs tracking-widest font-serif uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dark Forest Complete Grimoire</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-parchment-50 mt-1">
                {card.name}
              </h2>
            </div>

            {/* UPRIGHT MEANING */}
            <div className="p-4 rounded-xl border border-occult-gold/30 bg-black/40 space-y-2">
              <div className="flex items-center gap-2 text-occult-gold font-serif text-sm font-semibold tracking-wide">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Upright Meaning & Virtues</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {card.uprightKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-occult-gold/10 border border-occult-gold/30 text-occult-gold-light"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-parchment-200 leading-relaxed font-body">
                {card.uprightMeaning}
              </p>
            </div>

            {/* REVERSED MEANING */}
            <div className="p-4 rounded-xl border border-red-500/30 bg-crimson-950/20 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-serif text-sm font-semibold tracking-wide">
                <Moon className="w-4 h-4 text-red-400" />
                <span>Reversed Meaning & Shadow Work</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {card.reversedKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/40 border border-red-500/30 text-red-200"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-parchment-200 leading-relaxed font-body">
                {card.reversedMeaning}
              </p>
            </div>

            {/* SYMBOLISM & ESOTERIC SECRETS */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-occult-gold">
                <Eye className="w-3.5 h-3.5" />
                <span>Occult Symbolism</span>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                {card.symbolism}
              </p>
            </div>

            {/* PRACTICAL ORACLE ADVICE */}
            <div className="p-3 rounded-lg border border-occult-border bg-black/60 flex items-start gap-3">
              <Shield className="w-5 h-5 text-occult-gold shrink-0 mt-0.5" />
              <div>
                <h5 className="font-serif text-xs font-bold text-occult-gold tracking-wide uppercase">
                  Oracle Advice
                </h5>
                <p className="text-xs text-parchment-200 mt-0.5 leading-relaxed">
                  {card.advice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
