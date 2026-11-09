import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { generateDeterministicSynthesis } from '@/lib/readingSynthesis';
import { DrawnCard, TarotSpread } from '@/types/tarot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, spread, drawnCards, customApiKey } = body as {
      question: string;
      spread: TarotSpread;
      drawnCards: DrawnCard[];
      customApiKey?: string;
    };

    if (!spread || !drawnCards || drawnCards.length === 0) {
      return NextResponse.json({ error: 'Missing spread or drawn cards' }, { status: 400 });
    }

    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      // Fallback directly to deterministic synthesis
      const fallbackResult = generateDeterministicSynthesis(question, spread, drawnCards);
      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        source: 'Dark Forest Deterministic Oracle Engine',
        result: fallbackResult,
      });
    }

    // Call Gemini API via @google/genai
    try {
      const ai = new GoogleGenAI({ apiKey });

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

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return NextResponse.json({
        success: true,
        isAiGenerated: true,
        source: 'Gemini Oracle',
        result: parsed,
      });
    } catch (aiError) {
      console.warn('Gemini API call failed or timed out, falling back to Dark Forest engine:', aiError);
      const fallbackResult = generateDeterministicSynthesis(question, spread, drawnCards);
      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        source: 'Dark Forest Deterministic Oracle Engine (Fallback)',
        result: fallbackResult,
      });
    }
  } catch (error) {
    console.error('Error generating reading:', error);
    return NextResponse.json({ error: 'Internal server error processing reading' }, { status: 500 });
  }
}
