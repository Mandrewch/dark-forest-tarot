'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { OracleWizard } from '@/components/OracleWizard';
import { DeckFanningView } from '@/components/DeckFanningView';
import { ReadingTableau } from '@/components/ReadingTableau';
import { GrimoireView } from '@/components/GrimoireView';
import { SettingsModal } from '@/components/SettingsModal';
import { TarotSpread, DrawnCard } from '@/types/tarot';
import { TAROT_SPREADS } from '@/data/spreads';
import { Sparkles, Moon, ExternalLink } from 'lucide-react';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'oracle' | 'grimoire'>('oracle');
  const [oracleStep, setOracleStep] = useState<'wizard' | 'fanning' | 'tableau'>('wizard');

  const [activeSpread, setActiveSpread] = useState<TarotSpread>(TAROT_SPREADS[1]);
  const [querentQuestion, setQuerentQuestion] = useState<string>('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [allowReversals, setAllowReversals] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleStartRitual = (spread: TarotSpread, question: string) => {
    setActiveSpread(spread);
    setQuerentQuestion(question);
    setOracleStep('fanning');
  };

  const handleCardsSelected = (cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setOracleStep('tableau');
  };

  const handleResetReading = () => {
    setDrawnCards([]);
    setOracleStep('wizard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Occult Bar / Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col items-center justify-start pb-16">
        {currentTab === 'grimoire' ? (
          <GrimoireView />
        ) : (
          <div className="w-full flex flex-col items-center">
            {oracleStep === 'wizard' && (
              <OracleWizard
                onStartRitual={handleStartRitual}
                allowReversals={allowReversals}
                onToggleReversals={setAllowReversals}
              />
            )}

            {oracleStep === 'fanning' && (
              <DeckFanningView
                spread={activeSpread}
                allowReversals={allowReversals}
                onCardsSelected={handleCardsSelected}
                onCancel={handleResetReading}
              />
            )}

            {oracleStep === 'tableau' && (
              <ReadingTableau
                question={querentQuestion}
                spread={activeSpread}
                drawnCards={drawnCards}
                onReset={handleResetReading}
              />
            )}
          </div>
        )}
      </main>

      {/* Sanctum Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        allowReversals={allowReversals}
        onToggleReversals={setAllowReversals}
      />

      {/* Occult Footer */}
      <footer className="w-full border-t border-occult-gold/20 bg-[#0a0806]/95 py-6 px-4 text-center text-xs text-parchment-400 font-serif space-y-2">
        <div className="flex items-center justify-center gap-2 text-occult-gold/80">
          <Moon className="w-3.5 h-3.5" />
          <span>Dark Forest Tarot Sanctuary • Complete 78-Card Oracle</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11px] text-parchment-500 max-w-xl mx-auto leading-relaxed">
          Inspired by the{' '}
          <a
            href="https://darkforesttarotcards.com/en-gb/blogs/news/tarot-card-meanings-complete-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-occult-gold hover:underline inline-flex items-center gap-1"
          >
            Dark Forest Tarot Card Meanings Complete Guide
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          . Artwork based on the original 1909 Pamela Colman Smith & Arthur Edward Waite deck.
        </p>
      </footer>
    </div>
  );
}
