'use client';

import React, { useState } from 'react';
import { TarotCard, TarotSpread, DrawnCard } from '@/types/tarot';
import { TAROT_CARDS } from '@/data/cards';
import { Sparkles, Shuffle, Wand2, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface DeckFanningViewProps {
  spread: TarotSpread;
  allowReversals: boolean;
  onCardsSelected: (drawnCards: DrawnCard[]) => void;
  onCancel: () => void;
}

export const DeckFanningView: React.FC<DeckFanningViewProps> = ({
  spread,
  allowReversals,
  onCardsSelected,
  onCancel,
}) => {
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>(() => [...TAROT_CARDS]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const neededCount = spread.cardCount;
  const remainingCount = neededCount - selectedIndices.length;

  // Shuffle ritual using Fisher-Yates
  const handleShuffle = () => {
    setIsShuffling(true);
    sound.playShuffle();

    setTimeout(() => {
      const deck = [...TAROT_CARDS];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      setShuffledDeck(deck);
      setSelectedIndices([]);
      setIsShuffling(false);
    }, 900);
  };

  const handlePickCard = (index: number) => {
    if (selectedIndices.includes(index) || selectedIndices.length >= neededCount) return;

    sound.playCardDeal();
    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    // If completed
    if (newSelected.length === neededCount) {
      finalizeSelection(newSelected);
    }
  };

  const handleAutoDeal = () => {
    sound.playShuffle();
    const picked: number[] = [...selectedIndices];
    while (picked.length < neededCount) {
      const randIdx = Math.floor(Math.random() * shuffledDeck.length);
      if (!picked.includes(randIdx)) {
        picked.push(randIdx);
      }
    }
    setSelectedIndices(picked);
    finalizeSelection(picked);
  };

  const finalizeSelection = (indices: number[]) => {
    setTimeout(() => {
      const drawnCards: DrawnCard[] = indices.map((deckIdx, slotIdx) => {
        const card = shuffledDeck[deckIdx];
        const isReversed = allowReversals ? Math.random() < 0.35 : false;
        const position = spread.positions[slotIdx] || {
          id: `slot-${slotIdx + 1}`,
          name: `Position ${slotIdx + 1}`,
          description: `Card ${slotIdx + 1}`,
        };

        return {
          card,
          isReversed,
          positionId: position.id,
          positionName: position.name,
          positionDescription: position.description,
          drawnAt: Date.now(),
          revealed: false,
        };
      });

      onCardsSelected(drawnCards);
    }, 400);
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4">
      {/* Header instructions */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-serif uppercase tracking-widest text-occult-gold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Ritual of Selection
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-50">
          Draw For: {spread.name}
        </h2>
        <p className="text-xs sm:text-sm text-parchment-300 font-body">
          {remainingCount > 0 ? (
            <>
              Center your focus on your question. Select{' '}
              <strong className="text-occult-gold-light">{remainingCount}</strong> more card
              {remainingCount > 1 ? 's' : ''} for:{' '}
              <span className="italic text-occult-gold">
                &quot;{spread.positions[selectedIndices.length]?.name}&quot;
              </span>
            </>
          ) : (
            'All cards selected. Channeling your spread...'
          )}
        </p>
      </div>

      {/* Control Buttons: Shuffle & Auto-Deal */}
      <div className="flex items-center gap-3 my-6">
        <button
          onClick={handleShuffle}
          disabled={isShuffling}
          className="px-4 py-2 rounded-xl border border-occult-gold/50 bg-black/60 hover:bg-occult-card hover:border-occult-gold text-parchment-100 text-xs sm:text-sm font-serif flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Shuffle className={`w-4 h-4 text-occult-gold ${isShuffling ? 'animate-spin' : ''}`} />
          <span>{isShuffling ? 'Shuffling Sacred Deck...' : 'Reshuffle Deck'}</span>
        </button>

        <button
          onClick={handleAutoDeal}
          disabled={isShuffling || selectedIndices.length >= neededCount}
          className="px-4 py-2 rounded-xl border border-occult-gold/50 bg-occult-gold/15 hover:bg-occult-gold/25 hover:border-occult-gold text-occult-gold-light text-xs sm:text-sm font-serif flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4 text-occult-gold" />
          <span>Auto-Deal Cards</span>
        </button>
      </div>

      {/* Visual Spread Slot Placeholders */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {spread.positions.map((pos, idx) => {
          const isFilled = selectedIndices.length > idx;
          const isCurrentTarget = selectedIndices.length === idx;

          return (
            <div
              key={pos.id}
              className={`w-28 sm:w-32 h-36 sm:h-40 rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                isFilled
                  ? 'border-occult-gold bg-occult-gold/15 shadow-parchment-glow'
                  : isCurrentTarget
                  ? 'border-occult-gold/80 bg-black/50 border-dashed animate-pulse'
                  : 'border-occult-border/50 bg-black/30'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-occult-gold/70">
                Slot {idx + 1}
              </span>
              <span className="font-serif text-xs font-semibold text-parchment-100 mt-1 line-clamp-2">
                {pos.name}
              </span>
              <div className="mt-2 text-[10px] text-parchment-400">
                {isFilled ? '✓ Chosen' : isCurrentTarget ? '• Select Card' : 'Waiting'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Fanned Deck Carousel / Deck Ribbon */}
      <div className="w-full max-w-5xl overflow-x-auto py-6 px-2 scrollbar-thin">
        <div className="flex items-center justify-start sm:justify-center min-w-max gap-[-16px] px-8">
          {shuffledDeck.slice(0, 36).map((_, index) => {
            const isSelected = selectedIndices.includes(index);
            const rotation = (index - 18) * 1.2;

            return (
              <div
                key={index}
                onClick={() => !isSelected && handlePickCard(index)}
                style={{
                  transform: isSelected
                    ? 'translateY(-24px) scale(1.08)'
                    : `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 0.8}px)`,
                  marginLeft: index > 0 ? '-28px' : '0',
                }}
                className={`w-20 sm:w-24 h-32 sm:h-36 rounded-lg border border-occult-gold/60 bg-gradient-to-b from-[#1a1410] to-[#0d0a08] shadow-card-elevated cursor-pointer transition-all duration-300 hover:translate-y-[-20px] hover:z-30 hover:border-occult-gold flex flex-col items-center justify-center p-1.5 relative ${
                  isSelected ? 'opacity-40 pointer-events-none ring-2 ring-occult-gold' : ''
                }`}
              >
                <div className="w-full h-full rounded border border-occult-gold/30 flex items-center justify-center bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:8px_8px]">
                  <span className="text-occult-gold text-xs font-serif">✦</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-parchment-500 mt-2 font-serif italic text-center">
        Tip: Scroll horizontally or click any facedown card from the consecrated fan to draw.
      </p>
    </div>
  );
};
