'use client';

import React, { useState } from 'react';
import { TarotSpread, SpreadType } from '@/types/tarot';
import { TAROT_SPREADS } from '@/data/spreads';
import { Sparkles, Compass, HelpCircle, Flame, Sun, Wand2, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface OracleWizardProps {
  onStartRitual: (spread: TarotSpread, question: string) => void;
  allowReversals: boolean;
  onToggleReversals: (val: boolean) => void;
}

const SAMPLE_INTENTIONS = [
  'What energy should I embrace today?',
  'What is the true nature of the challenge I face?',
  'Will my current venture yield abundant fruit?',
  'How can I bring balance to mind, body, and spirit?',
  'What hidden truth am I not seeing clearly?',
];

export const OracleWizard: React.FC<OracleWizardProps> = ({
  onStartRitual,
  allowReversals,
  onToggleReversals,
}) => {
  const [selectedSpreadId, setSelectedSpreadId] = useState<SpreadType>('past-present-future');
  const [question, setQuestion] = useState('');

  const currentSpread =
    TAROT_SPREADS.find((s) => s.id === selectedSpreadId) || TAROT_SPREADS[0];

  const handleSelectSpread = (id: SpreadType) => {
    sound.playCardDeal();
    setSelectedSpreadId(id);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playShuffle();
    onStartRitual(currentSpread, question);
  };

  const spreadIcons: Record<SpreadType, React.ReactNode> = {
    single: <Sun className="w-5 h-5 text-amber-400" />,
    'past-present-future': <Compass className="w-5 h-5 text-occult-gold" />,
    'mind-body-spirit': <Sparkles className="w-5 h-5 text-emerald-400" />,
    'yes-no': <HelpCircle className="w-5 h-5 text-cyan-400" />,
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-occult-gold/40 bg-black/60 text-occult-gold text-xs font-serif tracking-widest uppercase">
          <Wand2 className="w-3.5 h-3.5" />
          <span>The Ancient Sanctum</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide text-parchment-50">
          Consult the Oracle
        </h1>
        <p className="text-xs sm:text-sm text-parchment-300 font-body leading-relaxed">
          Frame your intention, choose your sacred spread, and prepare to draw from the 78-card consecrated Rider-Waite deck.
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-8">
        {/* Step 1: Select Spread */}
        <div className="space-y-4">
          <label className="block font-serif text-sm uppercase tracking-wider text-occult-gold font-bold">
            1. Select Your Reading Spread
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TAROT_SPREADS.map((sp) => {
              const isSelected = sp.id === selectedSpreadId;

              return (
                <div
                  key={sp.id}
                  onClick={() => handleSelectSpread(sp.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-occult-gold bg-occult-card shadow-parchment scale-[1.02]'
                      : 'border-occult-border/70 bg-[#14100d]/70 hover:border-occult-gold/50 hover:bg-[#1a1511]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl border border-occult-gold/40 bg-black/50">
                        {spreadIcons[sp.id]}
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-parchment-100">
                          {sp.name}
                        </h3>
                        <span className="text-[11px] font-mono text-occult-gold/80 block">
                          {sp.cardCount} {sp.cardCount === 1 ? 'Card' : 'Cards'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-parchment-400 font-body mt-3 leading-relaxed">
                    {sp.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-occult-gold/20 flex flex-wrap gap-1.5">
                    {sp.positions.map((pos) => (
                      <span
                        key={pos.id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-occult-gold/20 text-parchment-300"
                      >
                        {pos.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Formulate Question / Intention */}
        <div className="space-y-3">
          <label className="block font-serif text-sm uppercase tracking-wider text-occult-gold font-bold">
            2. State Your Intention or Query
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What guidance do the cards have for my next chapter? (or leave blank for general guidance)"
              className="w-full px-4 py-3 rounded-xl border-2 border-occult-gold/40 bg-black/70 text-parchment-100 placeholder:text-parchment-600 text-sm font-serif focus:outline-none focus:border-occult-gold focus:ring-1 focus:ring-occult-gold shadow-inner"
            />
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-serif text-occult-gold/70 mr-1">
              Suggested Intentions:
            </span>
            {SAMPLE_INTENTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestion(s)}
                className="text-[10px] font-serif px-2.5 py-1 rounded-full border border-occult-border bg-black/40 hover:border-occult-gold hover:text-occult-gold-light text-parchment-400 transition-colors"
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Reversal Toggle Checkbox */}
        <div className="p-4 rounded-xl border border-occult-gold/30 bg-black/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-serif text-xs font-semibold text-parchment-100">
              Allow Inverted & Reversed Cards
            </span>
            <p className="text-[11px] text-parchment-400">
              When enabled, drawn cards carry a realistic ~35% chance of appearing reversed with shadow guidance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleReversals(!allowReversals)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-serif tracking-wider transition-colors ${
              allowReversals
                ? 'border-occult-gold bg-occult-gold/20 text-occult-gold-light'
                : 'border-occult-border bg-black/60 text-parchment-500'
            }`}
          >
            {allowReversals ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Begin Ritual Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-occult-gold bg-gradient-to-r from-occult-gold/30 via-occult-gold/20 to-occult-gold/30 hover:bg-occult-gold/40 text-occult-gold-light font-serif text-base font-bold tracking-widest uppercase flex items-center justify-center gap-3 mx-auto transition-all shadow-parchment group"
          >
            <Sparkles className="w-5 h-5 text-occult-gold group-hover:rotate-12 transition-transform" />
            <span>Begin Sacred Shuffle & Draw</span>
            <ArrowRight className="w-5 h-5 text-occult-gold group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
