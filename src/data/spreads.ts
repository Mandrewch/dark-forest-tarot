import { TarotSpread } from '@/types/tarot';

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: 'single',
    name: 'Daily Oracle / Single Card',
    subtitle: 'Daily guidance, meditation focus, or quick insight',
    description: 'A focused single-card draw designed to illuminate the dominant energetic current of your day or provide instant perspective on an immediate concern.',
    cardCount: 1,
    positions: [
      {
        id: 'focus',
        name: 'The Central Light',
        description: 'The core energy, lesson, or guiding truth speaking to you right now.',
      },
    ],
  },
  {
    id: 'past-present-future',
    name: 'Past • Present • Future',
    subtitle: 'The classical temporal continuum of your query',
    description: 'An ancient tripartite spread revealing how past roots blossom into current circumstances and direct the emergent horizon.',
    cardCount: 3,
    positions: [
      {
        id: 'past',
        name: 'The Foundation (Past)',
        description: 'Past experiences, ancestral forces, or decisions that shaped your current path.',
      },
      {
        id: 'present',
        name: 'The Crucible (Present)',
        description: 'The energetic reality, challenges, and forces currently surrounding you.',
      },
      {
        id: 'future',
        name: 'The Horizon (Future)',
        description: 'The likely trajectory and emergent outcome if current momentum is maintained.',
      },
    ],
  },
  {
    id: 'mind-body-spirit',
    name: 'Mind • Body • Spirit',
    subtitle: 'Holistic triune alignment & energetic health',
    description: 'A deeply reflective diagnostic spread that checks in with your mental focus, physical vitality, and deeper spiritual calling.',
    cardCount: 3,
    positions: [
      {
        id: 'mind',
        name: 'The Mind (Air / Mental)',
        description: 'Your thoughts, beliefs, intellectual clarity, or mental preoccupations.',
      },
      {
        id: 'body',
        name: 'The Body (Earth / Physical)',
        description: 'Physical health, tangible environment, routines, and material manifestations.',
      },
      {
        id: 'spirit',
        name: 'The Spirit (Fire / Divine)',
        description: 'Your soul’s deeper purpose, intuition, passion, and spiritual guidance.',
      },
    ],
  },
  {
    id: 'yes-no',
    name: 'Yes / No Oracle',
    subtitle: 'Decisive clarity with contextual wisdom',
    description: 'Using the Dark Forest explicit Yes/No card matrix, this 3-card spread provides a clear verdict supported by underlying causes and forward advice.',
    cardCount: 3,
    positions: [
      {
        id: 'verdict',
        name: 'The Verdict',
        description: 'The primary answering force: Yes, No, or nuanced conditional truth.',
      },
      {
        id: 'cause',
        name: 'The Underlying Cause',
        description: 'The hidden influence, motivation, or karmic root behind this answer.',
      },
      {
        id: 'counsel',
        name: 'The Oracle’s Counsel',
        description: 'How to proceed, protect your energy, or seize the prevailing current.',
      },
    ],
  },
];
