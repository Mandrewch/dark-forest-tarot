export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles';
export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit' | string;
export type YesNoVerdict = 'Strong Yes' | 'Yes' | 'Maybe' | 'No' | 'Strong No';

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  romanNumeral?: string;
  arcana: ArcanaType;
  suit?: SuitType;
  element: ElementType;
  astrology?: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  yesNo: YesNoVerdict;
  yesNoContext: string;
  symbolism: string;
  advice: string;
  imageUrl: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionId: string;
  positionName: string;
  positionDescription: string;
  drawnAt: number;
  revealed: boolean;
}

export type SpreadType = 'single' | 'past-present-future' | 'mind-body-spirit' | 'yes-no';

export interface SpreadPosition {
  id: string;
  name: string;
  description: string;
}

export interface TarotSpread {
  id: SpreadType;
  name: string;
  subtitle: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}
