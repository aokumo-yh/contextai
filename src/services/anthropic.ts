import { Culture, UrgencyLevel } from '../types';

export interface CulturalAnalysisRequest {
  originalText: string;
  translatedText?: string;
  speakerCulture: Culture;
  listenerCulture: Culture;
  conversationContext?: string[];
  targetLanguage: string;
  isUserSpeaking: boolean;
}

export interface CulturalAnalysisResponse {
  detected: boolean;
  type?: 'soft_no' | 'indirect_yes' | 'silence_meaning' | 'hierarchy' | 'consensus' | 'directness' | 'time_perception';
  urgency: UrgencyLevel;
  insight: string;
  culturalMeaning?: string;
  suggestions: string[];
  avatarState?: {
    speaker: 'neutral' | 'uncomfortable' | 'considering' | 'satisfied' | 'alert';
    listener: 'neutral' | 'uncomfortable' | 'considering' | 'satisfied' | 'alert';
  };
}

interface AnthropicConfig {
  apiKey: string;
  model: string;
}

let config: AnthropicConfig | null = null;

export function initializeAnthropic(apiKey: string, model: string = 'claude-opus-4-20250514') {
  config = {
    apiKey,
    model,
  };
}

function buildCulturalAnalysisPrompt(request: CulturalAnalysisRequest): string {
  const { originalText, translatedText, speakerCulture, listenerCulture, conversationContext, targetLanguage, isUserSpeaking } = request;

  const contextStr = conversationContext && conversationContext.length > 0
    ? `\n\nConversation context:\n${conversationContext.join('\n')}`
    : '';

  const languageInstruction = targetLanguage !== 'en-US'
    ? `\n\nIMPORTANT: All responses (insight, culturalMeaning, suggestions) MUST be written in the language: ${targetLanguage}. Do NOT use English.`
    : '';

  if (isUserSpeaking) {
    return `You are a cultural intelligence expert providing real-time coaching for cross-cultural business conversations.

Your Culture: ${speakerCulture}
Their Culture: ${listenerCulture}
You just said: "${originalText}"
${contextStr}${languageInstruction}

Based on Erin Meyer's Culture Map framework, analyze what you just said and provide SUGGESTIONS for how to improve your communication for the ${listenerCulture} audience.

Consider:
- Is your tone appropriate for their culture? (Direct vs. Indirect communication)
- Are you showing appropriate respect and hierarchy awareness?
- Is your pacing and approach to decision-making aligned with their culture?
- Could your message be misunderstood due to cultural differences?

Respond with a JSON object:
{
  "detected": true/false,
  "type": "suggestion",
  "urgency": "calm|alert|critical",
  "insight": "Brief coaching message${languageInstruction ? ' in ' + targetLanguage : ''}",
  "culturalMeaning": "Why this matters for ${listenerCulture}${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
  "suggestions": [
    "Specific improvement 1${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
    "Specific improvement 2${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
    "Specific improvement 3${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}"
  ]
}

Only provide suggestions if there's a meaningful cultural adjustment to make. If your communication is already appropriate, return detected: false.`;
  } else {
    return `You are a cultural intelligence expert analyzing business conversations for cultural moments and misunderstandings.

Speaker Culture: ${speakerCulture}
Your Culture: ${listenerCulture}

They just said: "${originalText}"
${translatedText ? `Translation: "${translatedText}"` : ''}
${contextStr}${languageInstruction}

Analyze the ORIGINAL text for cultural nuances based on Erin Meyer's Culture Map framework (8 dimensions: Communication, Evaluation, Persuading, Leading, Deciding, Trusting, Disagreeing, Scheduling).

Detect if there is a significant cultural moment that you (${listenerCulture}) might misunderstand.

Common patterns to look for:
- Soft No (Japanese: "difficult", "前向きに検討", "考えさせて"; Chinese: "inconvenient"; German: direct no)
- Indirect Yes (High-context cultures: implied agreement; Low-context: explicit yes)
- Silence meaning (Asian cultures: thoughtful consideration; Western: awkwardness)
- Hierarchy signals (Formal titles, indirect suggestions from superiors)
- Consensus vs Top-down (Group harmony vs individual decision)
- Direct vs Indirect feedback
- Time perception (Linear vs Flexible)

Provide CONTEXT explaining what they really mean culturally.

Respond with a JSON object:
{
  "detected": true/false,
  "type": "soft_no|indirect_yes|silence_meaning|hierarchy|consensus|directness|time_perception",
  "urgency": "calm|alert|critical",
  "insight": "What they just said and what it means${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
  "culturalMeaning": "What this REALLY means in ${speakerCulture} culture${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
  "suggestions": [
    "How to respond appropriately 1${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
    "How to respond appropriately 2${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}",
    "How to respond appropriately 3${languageInstruction ? ' (in ' + targetLanguage + ')' : ''}"
  ]
}

Only detect significant moments. If nothing culturally significant, return detected: false.`;
  }
}

export async function analyzeCulturalMoment(
  request: CulturalAnalysisRequest
): Promise<CulturalAnalysisResponse> {
  if (!config) {
    console.warn('Anthropic not initialized. Using fallback analysis.');
    return {
      detected: false,
      urgency: 'calm',
      insight: 'Cultural analysis not available. Please configure Anthropic API key.',
      suggestions: [],
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: buildCulturalAnalysisPrompt(request),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]) as CulturalAnalysisResponse;

    if (result.detected && result.urgency === 'critical') {
      result.avatarState = {
        speaker: 'uncomfortable',
        listener: 'alert',
      };
    } else if (result.detected && result.urgency === 'alert') {
      result.avatarState = {
        speaker: 'considering',
        listener: 'alert',
      };
    }

    return result;
  } catch (error) {
    console.error('Anthropic cultural analysis error:', error);
    return {
      detected: false,
      urgency: 'calm',
      insight: 'Cultural analysis temporarily unavailable.',
      suggestions: [],
    };
  }
}

export async function generateSuggestions(
  culturalMoment: string,
  yourCulture: Culture,
  theirCulture: Culture
): Promise<string[]> {
  if (!config) {
    return [
      'Be aware of cultural differences',
      'Ask clarifying questions',
      'Give them time to respond',
    ];
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `You are a cultural intelligence advisor.

Cultural moment detected: ${culturalMoment}
Your culture: ${yourCulture}
Their culture: ${theirCulture}

Generate 3-5 actionable, specific suggestions for how to respond appropriately in this situation.
Be concise, direct, and practical.

Return as a JSON array of strings: ["suggestion 1", "suggestion 2", ...]`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Anthropic suggestion generation error:', error);
    return [
      'Be aware of cultural differences in communication',
      'Ask open-ended clarifying questions',
      'Give them time and space to respond',
    ];
  }
}

export function isAnthropicConfigured(): boolean {
  return config !== null;
}
