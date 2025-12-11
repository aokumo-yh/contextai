# Babel Fish - AI-Powered Cultural Intelligence for Global Business

Real-time cultural guidance that prevents miscommunication in international business conversations.

## Overview

Babel Fish is an AI assistant that acts as your cultural interpreter during cross-cultural business meetings. It listens to conversations, detects cultural moments (like indirect refusals, silence meaning, and communication styles), and provides instant guidance on how to navigate cultural differences.

## Key Features

- Real-time conversation transcription and translation
- AI-powered cultural moment detection
- Live visual alerts for critical cultural mismatches
- Context-aware suggestions for appropriate responses
- Voice-enabled insights delivered discretely
- Cultural dimension analysis based on Erin Meyer's Culture Map
- Support for major business cultures (US, Japan, Germany, Brazil, India, China, Nordic)

## How Babel Fish Uses AI/LLMs

### 1. VOICE INPUT (Speech-to-Text)
**Technology:** ElevenLabs STT API or Web Speech API
**Purpose:** Convert spoken audio to text in any language
**Flow:**
- User speaks → Audio captured
- Sent to STT API
- Returns text transcript
- Detects language automatically

### 2. TRANSLATION (Multi-language Support)
**Technology:** Google Cloud Translation API or DeepL API
**Purpose:** Real-time translation between languages
**Flow:**
- Original text: "前向きに検討します" (Japanese)
- Translation API: Detects Japanese → Translates to English
- Returns: "I will consider it positively"
- Shows both versions to user

### 3. CULTURAL ANALYSIS (Core Intelligence)
**Technology:** Claude Opus 4 API (Anthropic)
**Purpose:** Detect cultural moments and provide guidance
**Why Opus 4:** Best at understanding subtle cultural nuances
**Flow:**
- Receives conversation context + cultural profiles
- Analyzes for patterns (soft no, silence, directness, etc.)
- Uses Erin Meyer's Culture Map framework (8 dimensions)
- Returns structured JSON with:
  * Cultural moment detected
  * Urgency level
  * Explanation
  * Actionable suggestions
  * Avatar states

Example Claude API Call:
```json
{
  "model": "claude-opus-4-20250514",
  "messages": [{
    "role": "user",
    "content": "Speaker A (US Tech) said: 'When can we decide?'
                Speaker B (Japanese Corp) responded: 'That might be difficult'

                Analyze for cultural moments."
  }]
}
```

Response:
```json
{
  "detected": true,
  "type": "soft_no",
  "urgency": "critical",
  "insight": "'Difficult' is strong rejection in Japanese",
  "suggestions": [
    "This means NO. Stop pushing.",
    "Ask: 'What concerns do you have?'",
    "Give them space to build consensus"
  ]
}
```

### 4. VOICE OUTPUT (Text-to-Speech)
**Technology:** ElevenLabs TTS API or Web Speech API
**Purpose:** Speak insights aloud (whisper mode)
**Flow:**
- Cultural alert generated
- If voice output enabled
- Send insight text to TTS API
- Returns audio
- Plays through headphones/speakers

### 5. SUGGESTION GENERATION
**Technology:** Claude Opus 4
**Purpose:** Generate context-aware next steps
**Flow:**
- After detecting cultural moment
- Claude generates 3-5 actionable suggestions
- Tailored to specific cultural context
- Helps user respond appropriately

## AI/LLM Usage Summary

```
┌─────────────────┬──────────────────┬─────────────────┐
│ Component       │ Technology       │ Purpose         │
├─────────────────┼──────────────────┼─────────────────┤
│ Voice Input     │ ElevenLabs STT   │ Speech → Text   │
│ Translation     │ Google Translate │ Language Bridge │
│ Analysis        │ Claude Opus 4    │ Cultural Intel  │
│ Voice Output    │ ElevenLabs TTS   │ Text → Speech   │
│ Suggestions     │ Claude Opus 4    │ Action Guidance │
└─────────────────┴──────────────────┴─────────────────┘
```

## Technical Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **AI/ML APIs:**
  - Anthropic Claude Opus 4 (Cultural Analysis)
  - ElevenLabs (Speech-to-Text & Text-to-Speech)
  - Google Cloud Translation API
- **Database:** Supabase (for conversation history and analytics)

## Use Cases

### 1. International Sales Negotiations
A US tech company negotiating with a Japanese manufacturing firm. When the Japanese team says "We'll consider it positively," Babel Fish detects this as a soft refusal and alerts the US team to stop pushing and ask clarifying questions.

### 2. Cross-Cultural Team Meetings
A German manager leading a team with Brazilian and Indian members. When silence occurs after a direct question, Babel Fish explains that high-context cultures may need more time to process and respond.

### 3. M&A Due Diligence
Chinese and Nordic companies in merger talks. Babel Fish helps both sides understand different approaches to trust-building, decision-making, and communication styles.

## Cultural Dimensions (Erin Meyer's Culture Map)

Babel Fish analyzes conversations across 8 cultural dimensions:

1. **Communication:** Low-context (explicit) ↔ High-context (implicit)
2. **Evaluation:** Direct negative feedback ↔ Indirect negative feedback
3. **Persuading:** Principles-first ↔ Applications-first
4. **Leading:** Egalitarian ↔ Hierarchical
5. **Deciding:** Consensual ↔ Top-down
6. **Trusting:** Task-based ↔ Relationship-based
7. **Disagreeing:** Confrontational ↔ Avoids confrontation
8. **Scheduling:** Linear-time ↔ Flexible-time

## Getting Started

### Prerequisites
- Node.js 18+
- API keys (optional but recommended):
  - **Anthropic Claude** - Required for AI-powered cultural analysis
  - **DeepL or Google Translate** - Optional for translation
  - **ElevenLabs** - Optional for premium voice quality

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/babel-fish.git
cd babel-fish

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Add your API keys to .env (see below)
# At minimum, add VITE_ANTHROPIC_API_KEY for cultural analysis

# 5. Start development server
npm run dev
```

The app will run at `http://localhost:5173` and show which AI services are active in the sidebar.

### API Keys Setup

Babel Fish works with browser fallbacks, but API keys unlock the full AI translation pipeline:

#### 1. Anthropic Claude (Recommended)
**Used for:** AI-powered cultural analysis
**Get your key:** https://console.anthropic.com/account/keys
**Pricing:** $30 free credits, then ~$0.015 per conversation
**Add to `.env`:**
```env
VITE_ANTHROPIC_API_KEY=sk-ant-api...
```

#### 2. DeepL Translation (Optional)
**Used for:** High-quality business translations
**Get your key:** https://www.deepl.com/pro-api
**Pricing:** Free tier 500k chars/month
**Add to `.env`:**
```env
VITE_DEEPL_API_KEY=your-deepl-key...
```

#### 3. Google Cloud Translation (Optional Fallback)
**Used for:** Translation when DeepL unavailable
**Get your key:** https://console.cloud.google.com/apis/credentials
**Pricing:** $20 per 1M characters
**Add to `.env`:**
```env
VITE_GOOGLE_TRANSLATE_API_KEY=AIza...
```

#### 4. ElevenLabs (Optional)
**Used for:** Premium voice input/output
**Get your key:** https://elevenlabs.io/app/settings/api-keys
**Pricing:** Free tier available, $5/month for 30k chars
**Add to `.env`:**
```env
VITE_ELEVENLABS_API_KEY=sk_...
```

### Translation Pipeline in Action

When all services are configured:

```
1. User speaks: "前向きに検討します" (Japanese)
   ↓
2. ElevenLabs STT transcribes: "前向きに検討します"
   ↓
3. DeepL translates: "I will consider it positively"
   ↓
4. Claude Opus analyzes ORIGINAL Japanese text
   → Detects: "Soft no" pattern
   → Insight: "This is a polite refusal in Japanese culture"
   ↓
5. Display to user:
   - Original: "前向きに検討します"
   - Translation: "I will consider it positively"
   - Cultural Alert: "⚠️ This is a SOFT NO"
   - Suggestions: ["Stop pushing", "Ask about concerns", "Give space"]
   ↓
6. ElevenLabs TTS speaks insight (if enabled)
```

### Checking AI Services Status

The app displays real-time status of all AI services in the sidebar:
- ✅ Green checkmark = Service active
- ❌ Gray X = Using fallback (browser APIs or pattern matching)

### Environment Variables

Complete `.env` template:

```env
# AI Services (add your keys)
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
VITE_DEEPL_API_KEY=your_deepl_key_here
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_key_here
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Database (pre-configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AIServicesStatus.tsx       # Shows which AI services are active
│   ├── AudioVisualization.tsx
│   ├── CulturalAvatar.tsx
│   ├── CulturalIntelligencePanel.tsx
│   ├── CultureGapChart.tsx
│   ├── CultureGapDisplay.tsx
│   ├── CultureSelector.tsx
│   ├── InsightCard.tsx
│   ├── LanguageVoiceSettings.tsx
│   ├── LiveAlertCard.tsx
│   ├── SuggestionsPanel.tsx
│   └── TranscriptDisplay.tsx
├── services/            # AI/ML API integrations
│   ├── anthropic.ts    # Claude Opus 4 cultural analysis
│   ├── elevenLabs.ts   # Speech-to-Text & Text-to-Speech
│   └── translation.ts  # DeepL + Google Translate
├── culturalAnalysis.ts  # Fallback pattern-based analysis
├── demoData.ts          # Demo conversation scenarios
├── types.ts             # TypeScript definitions
└── App.tsx              # Main application logic

```

## Demo Mode

Babel Fish includes a built-in demo showcasing a US-Japan business negotiation with real-time cultural insights. Click "Load Demo Conversation" to see it in action.

## Future Enhancements

- Mobile app for iOS/Android
- Integration with video conferencing platforms (Zoom, Teams, Google Meet)
- Conversation analytics dashboard
- Custom culture profiles
- Team collaboration features
- Historical conversation playback with insights

## Research Foundation

Babel Fish is built on research from:
- **Erin Meyer's "The Culture Map"** - Framework for understanding cultural differences
- **Edward T. Hall's Context Theory** - High vs. low-context communication
- **Geert Hofstede's Cultural Dimensions** - Power distance, individualism, uncertainty avoidance

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

## Support

For questions or issues, please open a GitHub issue or contact support@babelfish.ai

---

Built with AI, designed for humans navigating the complexity of global business.
