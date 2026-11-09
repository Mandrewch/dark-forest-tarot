'use client';

import React, { useState, useMemo } from 'react';
import { TarotCard, ArcanaType, SuitType, YesNoVerdict } from '@/types/tarot';
import { TAROT_CARDS, filterCards } from '@/data/cards';
import { TarotCardView } from './TarotCardView';
import { CardDetailModal } from './CardDetailModal';
import { Search, Filter, BookOpen, Sparkles, X } from 'lucide-react';
import { sound } from '@/lib/sound';

export const GrimoireView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArcana, setSelectedArcana] = useState<ArcanaType | 'all'>('all');
  const [selectedSuit, setSelectedSuit] = useState<SuitType | 'all'>('all');
  const [selectedYesNo, setSelectedYesNo] = useState<YesNoVerdict | 'all'>('all');

  const [inspectCard, setInspectCard] = useState<TarotCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCards = useMemo(() => {
    return filterCards({
      searchQuery,
      arcana: selectedArcana,
      suit: selectedSuit,
      yesNo: selectedYesNo,
    });
  }, [searchQuery, selectedArcana, selectedSuit, selectedYesNo]);

  const handleCardClick = (card: TarotCard) => {
    sound.playCardFlip();
    setInspectCard(card);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArcana('all');
    setSelectedSuit('all');
    setSelectedYesNo('all');
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedArcana !== 'all' ||
    selectedSuit !== 'all' ||
    selectedYesNo !== 'all';

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-occult-gold/40 bg-black/60 text-occult-gold text-xs font-serif tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Dark Forest Tarot Encyclopedia</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-parchment-50">
          The Sacred Grimoire
        </h1>
        <p className="text-xs sm:text-sm text-parchment-300 font-body leading-relaxed">
          Explore the esoteric symbology, upright & reversed wisdom, and astrological correspondences of all 78 Rider-Waite-Smith cards.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl border border-occult-gold/40 bg-[#16120e]/80 backdrop-blur-md shadow-parchment mb-8 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-occult-gold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards by name, keyword (e.g. abundance, conflict), or astrology..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-occult-gold/40 bg-black/60 text-parchment-100 placeholder:text-parchment-600 text-xs sm:text-sm font-serif focus:outline-none focus:border-occult-gold focus:ring-1 focus:ring-occult-gold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-parchment-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Arcana Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-mono text-occult-gold uppercase tracking-wider mr-1">
              Arcana:
            </span>
            {(['all', 'major', 'minor'] as const).map((arc) => (
              <button
                key={arc}
                onClick={() => setSelectedArcana(arc)}
                className={`px-3 py-1 rounded-lg border text-xs font-serif uppercase tracking-wider transition-colors ${
                  selectedArcana === arc
                    ? 'border-occult-gold bg-occult-gold/25 text-occult-gold-light'
                    : 'border-occult-border/60 bg-black/40 text-parchment-400 hover:text-parchment-200'
                }`}
              >
                {arc === 'all' ? 'All (78)' : arc === 'major' ? 'Major (22)' : 'Minor (56)'}
              </button>
            ))}
          </div>

          {/* Suit Selector */}
          {selectedArcana !== 'major' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-mono text-occult-gold uppercase tracking-wider mr-1">
                Suit:
              </span>
              {(['all', 'wands', 'cups', 'swords', 'pentacles'] as const).map((suit) => (
                <button
                  key={suit}
                  onClick={() => setSelectedSuit(suit)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-serif uppercase tracking-wider transition-colors ${
                    selectedSuit === suit
                      ? 'border-occult-gold bg-occult-gold/25 text-occult-gold-light'
                      : 'border-occult-border/60 bg-black/40 text-parchment-400 hover:text-parchment-200'
                  }`}
                >
                  {suit}
                </button>
              ))}
            </div>
          )}

          {/* Yes/No Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-occult-gold uppercase tracking-wider mr-1">
              Yes/No:
            </span>
            {(['all', 'Yes', 'No', 'Maybe'] as const).map((yn) => (
              <button
                key={yn}
                onClick={() => setSelectedYesNo(yn as YesNoVerdict | 'all')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-serif uppercase tracking-wider transition-colors ${
                  selectedYesNo === yn
                    ? 'border-occult-gold bg-occult-gold/25 text-occult-gold-light'
                    : 'border-occult-border/60 bg-black/40 text-parchment-400 hover:text-parchment-200'
                }`}
              >
                {yn}
              </button>
            ))}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-serif text-occult-gold hover:underline flex items-center gap-1 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-xs font-mono text-parchment-400 uppercase tracking-wider">
          Displaying {filteredCards.length} of {TAROT_CARDS.length} Cards
        </span>
        <span className="text-xs font-serif italic text-occult-gold/80">
          Click any card to read its full Dark Forest guide entry
        </span>
      </div>

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="flex justify-center">
              <TarotCardView
                card={card}
                isRevealed={true}
                onClick={() => handleCardClick(card)}
                size="sm"
                className="hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-occult-gold/30 bg-black/40 p-8 space-y-3">
          <Sparkles className="w-8 h-8 text-occult-gold mx-auto opacity-70" />
          <h3 className="font-serif text-lg font-bold text-parchment-100">
            No Arcana Matches Your Search
          </h3>
          <p className="text-xs text-parchment-400 max-w-sm mx-auto">
            Try adjusting your search keywords or clearing active filters to reveal the deck.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 rounded-xl border border-occult-gold bg-occult-gold/20 text-occult-gold-light text-xs font-serif"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Inspect Card Modal */}
      <CardDetailModal
        card={inspectCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
