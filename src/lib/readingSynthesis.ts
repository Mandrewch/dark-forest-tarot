import { DrawnCard, TarotSpread } from '@/types/tarot';

export interface SynthesisResult {
  overview: string;
  cardAnalyses: {
    positionName: string;
    cardName: string;
    isReversed: boolean;
    interpretation: string;
  }[];
  synthesis: string;
  verdictSummary?: string;
  counsel: string;
}

export function generateDeterministicSynthesis(
  question: string,
  spread: TarotSpread,
  drawnCards: DrawnCard[]
): SynthesisResult {
  const cleanQ = question.trim() ? question.trim() : 'General Spiritual Direction & Guidance';

  // Count elemental correspondences
  const elements: Record<string, number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
  let majorCount = 0;
  let reversedCount = 0;

  drawnCards.forEach((dc) => {
    if (dc.card.arcana === 'major') majorCount++;
    if (dc.isReversed) reversedCount++;
    if (elements[dc.card.element] !== undefined) {
      elements[dc.card.element]++;
    }
  });

  const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];

  // Overview paragraph
  const overview = `Reflecting upon your inquiry, "${cleanQ}", the oracle reveals a tapestry shaped prominently by the element of ${dominantElement}. ${
    majorCount >= 2
      ? 'With multiple Major Arcana present, powerful karmic tides and pivotal spiritual milestones are currently unfolding in your life.'
      : 'The presence of the Minor Arcana indicates that practical everyday choices, mindset adjustments, and tangible actions will determine your outcome.'
  } ${
    reversedCount > 0
      ? `${reversedCount} card${reversedCount > 1 ? 's appear' : ' appears'} in reverse, highlighting internal resistance, shadow patterns, or areas where energy must be liberated.`
      : 'All energies flow upright and direct, signaling unblocked momentum and clear pathways ahead.'
  }`;

  // Card-by-card analyses
  const cardAnalyses = drawnCards.map((dc) => {
    const orientation = dc.isReversed ? 'Reversed' : 'Upright';
    const meaning = dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning;
    const keywords = dc.isReversed ? dc.card.reversedKeywords : dc.card.uprightKeywords;

    const interpretation = `In the position of **${dc.positionName}**, **${dc.card.name}** emerges ${orientation}. Keywords: *${keywords.slice(0, 3).join(', ')}*. ${meaning} In context of your situation, this position highlights how ${
      dc.isReversed
        ? `the inverted nature of ${dc.card.name} calls for deep internal work, dissolving fear, and confronting what lies beneath the surface.`
        : `the direct power of ${dc.card.name} urges you to align with its constructive virtues and step into active ownership of this current.`
    }`;

    return {
      positionName: dc.positionName,
      cardName: `${dc.card.name} (${orientation})`,
      isReversed: dc.isReversed,
      interpretation,
    };
  });

  // Spread-specific synthesis
  let synthesis = '';
  let verdictSummary: string | undefined = undefined;

  if (spread.id === 'single') {
    const single = drawnCards[0];
    synthesis = `As your focal anchor, ${single.card.name} (${single.isReversed ? 'Reversed' : 'Upright'}) advises you to bring mindful awareness to ${
      single.isReversed ? single.card.reversedKeywords[0] : single.card.uprightKeywords[0]
    }. Let this card serve as your compass through today's decisions.`;
  } else if (spread.id === 'past-present-future') {
    const [past, present, future] = drawnCards;
    synthesis = `The temporal thread weaves from the foundations of ${past?.card.name} (${past?.isReversed ? 'Reversed' : 'Upright'}) into the crucible of ${present?.card.name} (${present?.isReversed ? 'Reversed' : 'Upright'}). If you integrate the lessons of the present, the horizon opens toward ${future?.card.name} (${future?.isReversed ? 'Reversed' : 'Upright'}), offering a transformative resolution.`;
  } else if (spread.id === 'mind-body-spirit') {
    const [mind, body, spirit] = drawnCards;
    synthesis = `Triune alignment requires harmonizing your mental state (${mind?.card.name}), physical reality and health (${body?.card.name}), and higher spiritual soul purpose (${spirit?.card.name}). Rebalance where tension has built up.`;
  } else if (spread.id === 'yes-no') {
    const primary = drawnCards[0];
    let yesWeight = 0;
    drawnCards.forEach((dc) => {
      if (dc.card.yesNo === 'Strong Yes') yesWeight += dc.isReversed ? -1 : 2;
      else if (dc.card.yesNo === 'Yes') yesWeight += dc.isReversed ? -1 : 1;
      else if (dc.card.yesNo === 'Maybe') yesWeight += 0;
      else if (dc.card.yesNo === 'No') yesWeight += dc.isReversed ? 1 : -1;
      else if (dc.card.yesNo === 'Strong No') yesWeight += dc.isReversed ? 1 : -2;
    });

    const finalVerdict =
      yesWeight > 1 ? 'Clear Yes' : yesWeight < -1 ? 'Definitive No' : 'Conditional / Seek Clarity';

    verdictSummary = `Oracle Verdict: **${finalVerdict}** (Primary Anchor: ${primary.card.name} — ${primary.card.yesNo}). ${primary.card.yesNoContext}`;
    synthesis = `While the primary card delivers the verdict, the supporting cards reveal the underlying conditions and practical path forward.`;
  }

  // Final counsel
  const counsel = `**Oracle’s Final Counsel**: ${
    drawnCards[drawnCards.length - 1]?.card.advice ||
    'Walk forward with steady mindfulness, integrity, and trust in the unfoldment of your sacred path.'
  }`;

  return {
    overview,
    cardAnalyses,
    synthesis,
    verdictSummary,
    counsel,
  };
}
