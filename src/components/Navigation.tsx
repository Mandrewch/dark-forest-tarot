'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Wand2, Volume2, VolumeX, Settings, ExternalLink } from 'lucide-react';
import { sound } from '@/lib/sound';

interface NavigationProps {
  currentTab: 'oracle' | 'grimoire';
  onSelectTab: (tab: 'oracle' | 'grimoire') => void;
  onOpenSettings: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playChime();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-occult-gold/30 bg-[#0e0b08]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo & Title */}
      <div
        onClick={() => onSelectTab('oracle')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl border border-occult-gold/60 bg-occult-card flex items-center justify-center shadow-parchment group-hover:border-occult-gold transition-colors">
          <Sparkles className="w-5 h-5 text-occult-gold group-hover:rotate-45 transition-transform" />
        </div>
        <div>
          <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-parchment-100 flex items-center gap-1.5">
            Dark Forest Tarot
          </span>
          <span className="text-[10px] font-mono tracking-widest text-occult-gold/80 block uppercase">
            Rider-Waite Oracle
          </span>
        </div>
      </div>

      {/* Center Tabs: Oracle vs Grimoire */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-occult-gold/30 bg-black/50">
        <button
          onClick={() => {
            sound.playCardDeal();
            onSelectTab('oracle');
          }}
          className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            currentTab === 'oracle'
              ? 'border border-occult-gold/60 bg-occult-gold/25 text-occult-gold-light shadow-sm'
              : 'text-parchment-400 hover:text-parchment-100'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Oracle</span>
        </button>

        <button
          onClick={() => {
            sound.playCardDeal();
            onSelectTab('grimoire');
          }}
          className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            currentTab === 'grimoire'
              ? 'border border-occult-gold/60 bg-occult-gold/25 text-occult-gold-light shadow-sm'
              : 'text-parchment-400 hover:text-parchment-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Grimoire</span>
        </button>
      </div>

      {/* Right Controls: Audio, Settings, External Source Guide */}
      <div className="flex items-center gap-2">
        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-lg border border-occult-gold/30 text-parchment-400 hover:text-occult-gold hover:border-occult-gold bg-black/40 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-parchment-500" /> : <Volume2 className="w-4 h-4 text-occult-gold" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="Sanctum Settings"
          className="p-2 rounded-lg border border-occult-gold/30 text-parchment-400 hover:text-occult-gold hover:border-occult-gold bg-black/40 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* External Link to Dark Forest Tarot Guide */}
        <a
          href="https://darkforesttarotcards.com/en-gb/blogs/news/tarot-card-meanings-complete-guide"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Official Dark Forest Tarot Guide"
          className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-occult-gold/30 text-[11px] font-serif text-occult-gold hover:bg-occult-gold/15 transition-colors"
        >
          <span>Guide</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
};
