import { DrawnCard, TarotSpread } from '@/types/tarot';
import { generateDeterministicSynthesis, SynthesisResult } from './readingSynthesis';

export async function synthesizeTarotReading(
  question: string,
  spread: TarotSpread,
  drawnCards: DrawnCard[],
  customApiKey?: string
): Promise<{ result: SynthesisResult; source: string }> {
  const apiKey =
    customApiKey?.trim() ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('tarot_gemini_api_key')?.trim()
      : undefined);

  if (!apiKey) {
    const fallback = generateDeterministicSynthesis(question, spread, drawnCards);
    return {
      result: fallback,
      source: 'Dark Forest Deterministic Oracle Engine',
    };
  }

  try {
    const cardsDescription = drawnCards
      .map(
        (dc, idx) =>
          `${idx + 1}. [Position: ${dc.positionName} - "${dc.positionDescription}"]\n` +
          `   Card: ${dc.card.name} (${dc.isReversed ? 'REVERSED' : 'UPRIGHT'})\n` +
          `   Keywords: ${(dc.isReversed ? dc.card.reversedKeywords : dc.card.uprightKeywords).join(', ')}\n` +
          `   Dark Forest Guide Meaning: ${dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning}\n` +
          `   Yes/No Orientation: ${dc.card.yesNo} ("${dc.card.yesNoContext}")\n` +
          `   Advice: ${dc.card.advice}`
      )
      .join('\n\n');

    const prompt = `You are an ancient, compassionate, and deeply perceptive tarot reader steeped in the Dark Forest tarot tradition, Rider-Waite symbolism, and esoteric mysticism.
A seeker has approached you for an oracle reading with the following intention or question:
"${question ? question : 'General Spiritual Direction & Guidance'}"

Spread Chosen: ${spread.name} (${spread.subtitle})
Cards Drawn:
${cardsDescription}

Provide a profound, immersive, and grounded tarot interpretation formatted as JSON with the following structure:
{
  "overview": "A 2-3 sentence evocative astrological/elemental opening reflecting on the querent's question and the general energetic signature of the draw.",
  "cardAnalyses": [
    {
      "positionName": "Name of position",
      "cardName": "Card Name (Orientation)",
      "isReversed": false,
      "interpretation": "2-3 sentences weaving this specific card in its position directly to the querent's question and circumstances."
    }
  ],
  "synthesis": "A rich 2-3 paragraph holistic narrative connecting all drawn cards into a unified storyline, explaining how they interact with each other and what hidden currents they illuminate.",
  "verdictSummary": "If this was a Yes/No question or spread, provide a definitive yet nuanced verdict; otherwise an empowering one-sentence thematic summary.",
  "counsel": "Actionable, wise, and compassionate occult guidance for the querent on how to walk forward."
}

Return ONLY valid JSON matching this schema, without markdown code block backticks.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      result: parsed,
      source: 'Gemini Oracle',
    };
  } catch (err) {
    console.warn('Gemini client call failed, using Dark Forest engine:', err);
    const fallback = generateDeterministicSynthesis(question, spread, drawnCards);
    return {
      result: fallback,
      source: 'Dark Forest Deterministic Oracle Engine (Offline)',
    };
  }
}
