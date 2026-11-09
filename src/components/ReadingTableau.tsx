'use client';

import React, { useState, useEffect } from 'react';
import { DrawnCard, TarotSpread, TarotCard } from '@/types/tarot';
import { TarotCardView } from './TarotCardView';
import { CardDetailModal } from './CardDetailModal';
import { SynthesisResult } from '@/lib/readingSynthesis';
import { sound } from '@/lib/sound';
import {
  Sparkles,
  Eye,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Bot,
  Scroll,
  HelpCircle,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface ReadingTableauProps {
  question: string;
  spread: TarotSpread;
  drawnCards: DrawnCard[];
  onReset: () => void;
}

export const ReadingTableau: React.FC<ReadingTableauProps> = ({
  question,
  spread,
  drawnCards: initialDrawnCards,
  onReset,
}) => {
  const [cards, setCards] = useState<DrawnCard[]>(initialDrawnCards);
  const [selectedInspectCard, setSelectedInspectCard] = useState<TarotCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [readingResult, setReadingResult] = useState<SynthesisResult | null>(null);
  const [readingSource, setReadingSource] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const allRevealed = cards.every((c) => c.revealed);

  // Play deal sound on initial mount
  useEffect(() => {
    sound.playCardDeal();
  }, []);

  const handleRevealCard = (index: number) => {
    sound.playCardFlip();
    const updated = [...cards];
    updated[index].revealed = true;
    setCards(updated);

    // If this completed revealing all cards, play resonant chime
    if (updated.every((c) => c.revealed)) {
      setTimeout(() => sound.playChime(), 400);
    }
  };

  const handleRevealAll = () => {
    sound.playCardFlip();
    const updated = cards.map((c) => ({ ...c, revealed: true }));
    setCards(updated);
    setTimeout(() => sound.playChime(), 500);
  };

  const handleInspectCard = (card: TarotCard) => {
    setSelectedInspectCard(card);
    setIsModalOpen(true);
  };

  const handleSynthesizeReading = async () => {
    setIsLoadingAi(true);
    sound.playCardDeal();

    try {
      let customApiKey: string | undefined = undefined;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tarot_gemini_api_key');
        if (stored) customApiKey = stored;
      }

      const res = await fetch('/api/tarot-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          spread,
          drawnCards: cards,
          customApiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setReadingResult(data.result);
        setReadingSource(data.source || 'Oracle Engine');
        sound.playChime();
      }
    } catch (err) {
      console.error('Error synthesizing reading:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleCopyMarkdown = () => {
    const lines = [
      `# Tarot Reading: ${spread.name}`,
      `**Inquiry / Intention:** ${question || 'General Guidance'}`,
      `**Date:** ${new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}`,
      '',
      '## Cards Drawn:',
      ...cards.map(
        (c) =>
          `- **${c.positionName}**: ${c.card.name} (${c.isReversed ? 'Reversed' : 'Upright'}) — *${(c.isReversed ? c.card.reversedKeywords : c.card.uprightKeywords).join(', ')}*`
      ),
      '',
    ];

    if (readingResult) {
      lines.push('## Oracle Interpretation:');
      lines.push(readingResult.overview);
      lines.push('');
      lines.push('### Card Breakdown:');
      readingResult.cardAnalyses.forEach((ca) => {
        lines.push(`- **${ca.positionName} - ${ca.cardName}**: ${ca.interpretation}`);
      });
      lines.push('');
      lines.push('### Synthesis:');
      lines.push(readingResult.synthesis);
      if (readingResult.verdictSummary) {
        lines.push('');
        lines.push(`### Verdict: ${readingResult.verdictSummary}`);
      }
      lines.push('');
      lines.push(`### Sacred Counsel:\n${readingResult.counsel}`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header: Querent Question Banner */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-occult-gold/40 bg-black/60 text-occult-gold text-xs font-serif tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Reading • {spread.name}</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-parchment-50 max-w-3xl mx-auto tracking-wide">
          &ldquo;{question || 'What guidance does the oracle have for my path?'}&rdquo;
        </h1>

        <p className="text-xs text-parchment-400 mt-2 font-serif italic">
          {allRevealed
            ? 'All cards revealed. Inspect their individual secrets or synthesize the reading below.'
            : 'Click each card to reveal its mysteries or click "Reveal All".'}
        </p>

        {/* Quick reveal all button if any card still hidden */}
        {!allRevealed && (
          <div className="mt-4">
            <button
              onClick={handleRevealAll}
              className="px-5 py-2 rounded-xl border border-occult-gold bg-occult-gold/20 hover:bg-occult-gold/30 text-occult-gold-light text-xs font-serif tracking-widest uppercase transition-all shadow-parchment"
            >
              Reveal All Cards
            </button>
          </div>
        )}
      </div>

      {/* Cards Spread Display Grid */}
      <div className="flex flex-wrap justify-center items-start gap-6 sm:gap-8 my-8">
        {cards.map((drawn, idx) => (
          <div key={drawn.positionId} className="flex flex-col items-center max-w-[200px]">
            {/* Position Header */}
            <div className="text-center mb-2 h-14 flex flex-col justify-end">
              <span className="text-[10px] font-mono uppercase tracking-wider text-occult-gold/80 block">
                {drawn.positionName}
              </span>
              <span className="text-[11px] text-parchment-300 font-serif line-clamp-2 px-1">
                {drawn.positionDescription}
              </span>
            </div>

            {/* Interactive Card */}
            <TarotCardView
              card={drawn.card}
              isReversed={drawn.isReversed}
              isRevealed={drawn.revealed}
              onReveal={() => handleRevealCard(idx)}
              showDetailsButton={drawn.revealed}
              onOpenDetails={handleInspectCard}
              size="md"
            />
          </div>
        ))}
      </div>

      {/* Individual Card Meaning Cards (Below Tableau) */}
      {allRevealed && (
        <div className="mt-12 space-y-6">
          <div className="border-t border-occult-gold/30 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-occult-gold" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-parchment-100">
                The Arcana Revealed
              </h3>
            </div>

            {/* Actions: Synthesize with AI */}
            {!readingResult && (
              <button
                onClick={handleSynthesizeReading}
                disabled={isLoadingAi}
                className="px-5 py-2.5 rounded-xl border-2 border-occult-gold bg-gradient-to-r from-occult-gold/30 via-occult-gold/20 to-occult-gold/30 hover:bg-occult-gold/40 text-occult-gold-light font-serif text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 transition-all shadow-parchment disabled:opacity-50"
              >
                <Bot className={`w-4 h-4 ${isLoadingAi ? 'animate-spin' : ''}`} />
                <span>{isLoadingAi ? 'Consulting the Oracle...' : 'Synthesize Reading with AI'}</span>
              </button>
            )}
          </div>

          {/* If Yes/No Spread: Dedicated Verdict Showcase */}
          {spread.id === 'yes-no' && (
            <div className="p-5 rounded-2xl border-2 border-occult-gold/60 bg-black/60 shadow-parchment flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs uppercase font-serif tracking-widest text-occult-gold">
                  Direct Oracle Verdict
                </span>
                <h4 className="font-serif text-2xl font-bold text-parchment-50">
                  {cards[0]?.card.yesNo}
                </h4>
                <p className="text-xs text-parchment-300 font-body max-w-xl">
                  {cards[0]?.card.yesNoContext}
                </p>
              </div>
              <div className="shrink-0 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-occult-gold/30 pt-3 sm:pt-0 sm:pl-6">
                <span className="text-[11px] font-mono text-parchment-400 block">
                  Anchor Card:
                </span>
                <span className="font-serif text-sm text-occult-gold font-semibold">
                  {cards[0]?.card.name} ({cards[0]?.isReversed ? 'Reversed' : 'Upright'})
                </span>
              </div>
            </div>
          )}

          {/* Synthesized AI Reading Presentation */}
          {readingResult && (
            <div
              className="p-6 sm:p-8 rounded-2xl border-2 border-occult-gold/70 bg-[#16120e] shadow-parchment space-y-6"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 70%)`,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-occult-gold/30 gap-2">
                <div>
                  <span className="text-xs font-serif uppercase tracking-widest text-occult-gold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Synthesized Oracle Transmission
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-parchment-50 mt-1">
                    The Celestial Reading
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-occult-gold/30 bg-black/40 text-parchment-400">
                    {readingSource}
                  </span>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-parchment-200 leading-relaxed font-body italic border-l-2 border-occult-gold pl-4 py-1">
                  {readingResult.overview}
                </p>
              </div>

              {/* Card Analyses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readingResult.cardAnalyses.map((ca, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-occult-gold/30 bg-black/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-occult-gold">
                        {ca.positionName}
                      </span>
                      <span className="text-xs font-serif font-bold text-parchment-100">
                        {ca.cardName}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-parchment-300 leading-relaxed font-body">
                      {ca.interpretation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Synthesis */}
              <div className="space-y-2 pt-2">
                <h5 className="font-serif text-sm uppercase tracking-wider text-occult-gold font-bold">
                  The Holistic Tapestry
                </h5>
                <p className="text-xs sm:text-sm text-parchment-200 leading-relaxed font-body whitespace-pre-line">
                  {readingResult.synthesis}
                </p>
              </div>

              {/* Sacred Counsel */}
              <div className="p-4 rounded-xl border border-occult-gold/40 bg-occult-gold/10 flex items-start gap-3">
                <Compass className="w-5 h-5 text-occult-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h6 className="font-serif text-xs uppercase tracking-wider font-bold text-occult-gold">
                    Sacred Oracle Counsel
                  </h6>
                  <p className="text-xs sm:text-sm text-parchment-100 leading-relaxed font-body">
                    {readingResult.counsel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer: Copy, Print, New Reading */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-occult-gold/30 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyMarkdown}
                className="px-4 py-2 rounded-xl border border-occult-gold/40 bg-black/60 hover:bg-occult-card hover:border-occult-gold text-parchment-200 text-xs font-serif flex items-center gap-2 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-occult-gold" />
                    <span>Copy Reading (Markdown)</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl border border-occult-gold/40 bg-black/60 hover:bg-occult-card hover:border-occult-gold text-parchment-200 text-xs font-serif flex items-center gap-2 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-occult-gold" />
                <span>Print / Save Parchment</span>
              </button>
            </div>

            <button
              onClick={onReset}
              className="px-5 py-2 rounded-xl border border-occult-gold bg-occult-gold/20 hover:bg-occult-gold/30 text-occult-gold-light text-xs font-serif tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-occult-gold" />
              <span>Begin New Oracle Ritual</span>
            </button>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedInspectCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
