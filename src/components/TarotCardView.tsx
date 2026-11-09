'use client';

import React, { useState } from 'react';
import { TarotCard } from '@/types/tarot';
import { Sparkles, Compass, AlertCircle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { sound } from '@/lib/sound';

interface TarotCardViewProps {
  card: TarotCard;
  isReversed?: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showDetailsButton?: boolean;
  onOpenDetails?: (card: TarotCard) => void;
  className?: string;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  isReversed = false,
  isRevealed = true,
  onReveal,
  onClick,
  size = 'md',
  interactive = true,
  showDetailsButton = false,
  onOpenDetails,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const handleFlip = () => {
    if (!isRevealed && onReveal) {
      sound.playCardFlip();
      onReveal();
    } else if (onClick) {
      onClick();
    }
  };

  const sizeClasses = {
    sm: 'w-36 h-60 text-xs',
    md: 'w-48 h-80 text-sm',
    lg: 'w-64 h-[26rem] text-base',
  };

  const getYesNoColor = (verdict: string) => {
    switch (verdict) {
      case 'Strong Yes':
      case 'Yes':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
      case 'Strong No':
      case 'No':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
      default:
        return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    }
  };

  return (
    <div
      className={`relative select-none perspective-1000 ${sizeClasses[size]} ${className}`}
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full rounded-xl transition-all duration-700 preserve-3d shadow-card-elevated cursor-pointer ${
          isRevealed ? 'rotate-y-0' : 'rotate-y-180 hover:scale-105'
        }`}
      >
        {/* FRONT OF CARD (Revealed) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 border-occult-gold/60 bg-gradient-to-b from-[#241d17] via-[#1a1512] to-[#120e0b] p-2 flex flex-col justify-between overflow-hidden ${
            isReversed ? 'rotate-180' : ''
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 75%)`,
          }}
        >
          {/* Ornate corner flourishes */}
          <div className="absolute top-1 left-1 text-[10px] text-occult-gold/50 pointer-events-none">✦</div>
          <div className="absolute top-1 right-1 text-[10px] text-occult-gold/50 pointer-events-none">✦</div>
          <div className="absolute bottom-1 left-1 text-[10px] text-occult-gold/50 pointer-events-none">✦</div>
          <div className="absolute bottom-1 right-1 text-[10px] text-occult-gold/50 pointer-events-none">✦</div>

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-occult-gold/30 pb-1 px-1">
            <span className="font-serif tracking-widest text-occult-gold text-[11px] font-bold">
              {card.romanNumeral || card.number}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border border-occult-gold/30 bg-black/40 text-parchment-300">
                {card.element}
              </span>
            </div>
          </div>

          {/* Card Center / Artwork */}
          <div className="relative flex-1 my-1.5 rounded-lg border border-occult-gold/30 bg-black/50 overflow-hidden flex items-center justify-center">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.imageUrl}
                alt={card.name}
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-top opacity-90 transition-transform duration-500 hover:scale-105"
              />
            ) : (
              /* Occult Symbol Fallback */
              <div className="p-4 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-occult-gold/50 flex items-center justify-center mb-2 bg-occult-card shadow-inner">
                  <Compass className="w-8 h-8 text-occult-gold animate-pulse-glow" />
                </div>
                <span className="font-serif text-sm text-parchment-200">{card.name}</span>
                <span className="text-[10px] text-occult-gold/70 mt-1">{card.element} • {card.astrology || 'Arcana'}</span>
              </div>
            )}

            {/* Subtle vintage parchment overlay vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Reversal indicator banner */}
            {isReversed && (
              <div className="absolute top-2 inset-x-2 py-0.5 bg-crimson-950/90 border border-red-500/50 rounded text-center shadow-lg">
                <span className="text-[9px] uppercase tracking-widest font-serif font-bold text-red-200">
                  Reversed
                </span>
              </div>
            )}
          </div>

          {/* Card Footer: Name & Keywords */}
          <div className="border-t border-occult-gold/30 pt-1 text-center">
            <h4 className="font-serif text-xs md:text-sm font-semibold tracking-wide text-parchment-100 truncate">
              {card.name}
            </h4>
            <div className="flex items-center justify-center gap-1 mt-0.5 text-[9px] text-occult-gold/80">
              <span className="truncate">
                {isReversed ? card.reversedKeywords.slice(0, 2).join(' • ') : card.uprightKeywords.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>
        </div>

        {/* BACK OF CARD (Facedown) */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 border-occult-gold/70 bg-gradient-to-b from-[#1c1712] via-[#120f0c] to-[#0a0807] p-2.5 flex flex-col items-center justify-center shadow-inner overflow-hidden rotate-y-180"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 80%)`,
          }}
        >
          {/* Ornate esoteric concentric borders */}
          <div className="w-full h-full rounded-lg border border-occult-gold/40 flex flex-col items-center justify-center p-3 relative bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:12px_12px] opacity-90">
            {/* Inner Sacred Geometry */}
            <div className="relative w-24 h-24 rounded-full border border-occult-gold/60 flex items-center justify-center">
              <div className="w-18 h-18 rounded-full border border-dashed border-occult-gold/40 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-occult-gold animate-pulse-glow" />
              </div>
              <div className="absolute -top-1.5 text-[9px] text-occult-gold font-serif">☾</div>
              <div className="absolute -bottom-1.5 text-[9px] text-occult-gold font-serif">☽</div>
              <div className="absolute -left-1.5 text-[9px] text-occult-gold font-serif">✧</div>
              <div className="absolute -right-1.5 text-[9px] text-occult-gold font-serif">✧</div>
            </div>

            <div className="mt-4 text-center">
              <span className="font-serif text-[10px] tracking-widest uppercase text-occult-gold/70 block">
                Dark Forest
              </span>
              <span className="text-[8px] font-mono tracking-widest text-parchment-400/60 block mt-0.5">
                RIDER-WAITE-SMITH
              </span>
            </div>

            {!isRevealed && (
              <div className="absolute bottom-2 text-[9px] tracking-wider uppercase text-parchment-300 font-serif animate-pulse bg-black/60 px-2 py-0.5 rounded border border-occult-gold/20">
                Click to Reveal
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional details trigger button if revealed */}
      {isRevealed && showDetailsButton && onOpenDetails && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(card);
          }}
          className="mt-2 w-full text-center text-[10px] font-serif uppercase tracking-wider py-1 px-2 rounded border border-occult-gold/40 bg-black/60 hover:bg-occult-card hover:border-occult-gold text-parchment-200 transition-colors"
        >
          View Grimoire Record
        </button>
      )}
    </div>
  );
};
