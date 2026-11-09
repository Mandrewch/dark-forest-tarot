import { TarotCard, ArcanaType, SuitType, YesNoVerdict } from '@/types/tarot';
import { MAJOR_ARCANA } from './majorArcana';
import { WANDS } from './minorArcana/wands';
import { CUPS } from './minorArcana/cups';
import { SWORDS } from './minorArcana/swords';
import { PENTACLES } from './minorArcana/pentacles';

export { MAJOR_ARCANA } from './majorArcana';
export { WANDS } from './minorArcana/wands';
export { CUPS } from './minorArcana/cups';
export { SWORDS } from './minorArcana/swords';
export { PENTACLES } from './minorArcana/pentacles';

export const MINOR_ARCANA: TarotCard[] = [
  ...WANDS,
  ...CUPS,
  ...SWORDS,
  ...PENTACLES,
];

export const TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA,
];

export function getCardById(id: string): TarotCard | undefined {
  return TAROT_CARDS.find((card) => card.id === id);
}

export interface FilterOptions {
  arcana?: ArcanaType | 'all';
  suit?: SuitType | 'all';
  yesNo?: YesNoVerdict | 'all';
  searchQuery?: string;
}

export function filterCards(options: FilterOptions): TarotCard[] {
  const { arcana, suit, yesNo, searchQuery } = options;

  return TAROT_CARDS.filter((card) => {
    if (arcana && arcana !== 'all' && card.arcana !== arcana) {
      return false;
    }

    if (suit && suit !== 'all' && card.suit !== suit) {
      return false;
    }

    if (yesNo && yesNo !== 'all') {
      if (yesNo === 'Yes' && !(card.yesNo === 'Yes' || card.yesNo === 'Strong Yes')) {
        return false;
      }
      if (yesNo === 'No' && !(card.yesNo === 'No' || card.yesNo === 'Strong No')) {
        return false;
      }
      if (yesNo === 'Maybe' && card.yesNo !== 'Maybe') {
        return false;
      }
      if (yesNo === 'Strong Yes' && card.yesNo !== 'Strong Yes') {
        return false;
      }
      if (yesNo === 'Strong No' && card.yesNo !== 'Strong No') {
        return false;
      }
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = card.name.toLowerCase().includes(q);
      const matchKeywords =
        card.uprightKeywords.some((k) => k.toLowerCase().includes(q)) ||
        card.reversedKeywords.some((k) => k.toLowerCase().includes(q));
      const matchMeaning =
        card.uprightMeaning.toLowerCase().includes(q) ||
        card.reversedMeaning.toLowerCase().includes(q);
      const matchAstrology = card.astrology?.toLowerCase().includes(q);

      if (!matchName && !matchKeywords && !matchMeaning && !matchAstrology) {
        return false;
      }
    }

    return true;
  });
}
