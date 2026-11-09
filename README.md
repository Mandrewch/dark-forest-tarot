# Dark Forest Tarot — Vintage Occult Reading Sanctuary & Grimoire

An interactive, responsive Tarot Reading web application based on the complete [Dark Forest Tarot Card Meanings Guide](https://darkforesttarotcards.com/en-gb/blogs/news/tarot-card-meanings-complete-guide), featuring authentic Rider-Waite-Smith symbolism, an antique parchment aesthetic, procedural Web Audio effects, and hybrid Gemini AI interpretation.

---

## 🔮 Highlights & Features

### 1. Complete 78-Card Grimoire (Encyclopedia)
- **All 22 Major Arcana** (The Fool through The World) with upright/reversed meanings, spiritual lessons, Roman numerals, and elemental correspondences.
- **All 56 Minor Arcana** across the four sacred suits:
  - **Wands** (Fire, Passion, Inspiration, Ambition)
  - **Cups** (Water, Emotions, Intuition, Love)
  - **Swords** (Air, Intellect, Truth, Discernment)
  - **Pentacles** (Earth, Material Prosperity, Manifestation, Health)
- **Direct Yes/No Oracle Matrix**: Every card provides its explicit Dark Forest Yes/No orientation and contextual guidance.
- **Search & Filters**: Instant search by card name, keyword, suit, or Yes/No verdict.

### 2. Multi-Spread Reading Suite
- **Daily Oracle / Single Guidance** (1 Card): Quick spiritual focus or morning meditation.
- **Past • Present • Future** (3 Cards): Classic temporal progression uncovering roots, current realities, and emergent horizons.
- **Mind • Body • Spirit** (3 Cards): Triune alignment diagnostic for holistic well-being.
- **Yes / No Oracle** (3 Cards): Direct clarity with supporting root causes and strategic counsel.

### 3. Interactive Occult Ritual
- **Intention & Query Formulation**: Suggested sacred prompts or custom inquiries.
- **Fisher-Yates 3D Shuffle**: Realistic deck randomization with sound effects.
- **Fanned Deck Selection**: Querents can intuitively hover and choose cards from a fanned ribbon or select "Auto-Deal".
- **Reversal Probability**: Toggleable realistic ~35% reversal distribution with inverted card art and shadow work meanings.
- **Interactive 3D Card Flipping**: Flip each card individually or reveal all simultaneously.

### 4. Procedural Web Audio Engine
- Built with the native Web Audio API — zero external audio assets required.
- Realistic card riffle shuffle, paper draw slide, flip swoosh, and a 528 Hz transformation frequency singing bowl chime.
- Instant mute/unmute toggle in the navigation bar.

### 5. Hybrid Gemini AI & Offline Fallback Engine
- Integrates Google's modern Gemini API (`@google/genai`) to generate holistic, narrative readings weaving your question, drawn cards, and spread positions into a cohesive story.
- Built-in **Deterministic Fallback Engine**: If no API key is set, the app automatically generates a rich synthesis derived directly from the Dark Forest guide without breaking or failing.
- In-App Settings modal allows querents to provide a custom Gemini API key or let the server environment handle it.

### 6. Export & Ephemeral Privacy
- One-click **Copy Reading (Markdown)** formatted with all cards, positions, and synthesis.
- Print-ready view for saving as a parchment PDF or hardcopy journal entry.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on v24)
- npm or pnpm

### Running in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

### Configuring Gemini API (Optional)
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Or enter your API key directly in the app via the **Settings (gear icon)** in the top navigation bar.

---

## 📜 Credits & Provenance
- Card Meanings & Guidance: [Dark Forest Tarot Card Meanings Complete Guide](https://darkforesttarotcards.com/en-gb/blogs/news/tarot-card-meanings-complete-guide)
- Deck Imagery: 1909 Rider-Waite-Smith Tarot Deck (Pamela Colman Smith & Arthur Edward Waite, Public Domain)
