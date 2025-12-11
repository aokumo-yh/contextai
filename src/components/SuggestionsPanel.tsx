import { Culture } from '../types';

interface SuggestionsPanelProps {
  yourCulture: Culture;
  theirCulture: Culture;
  voiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
}

const cultureSuggestions: Record<Culture, string[]> = {
  'Japanese Corporate': [
    'Give them time to build consensus with their team',
    'Acknowledge their perspective before presenting yours',
    'Ask: "What concerns can we address together?"',
    'Use indirect language: "Perhaps we could explore..."',
    'Allow silence for thoughtful consideration',
    'Avoid public disagreement or criticism',
  ],
  'US Tech': [
    'Be direct and concise in your communication',
    'Emphasize speed and agility in decision-making',
    'Focus on innovation and disruption potential',
    'Use data to support your arguments',
    'Propose quick action items and next steps',
  ],
  'German Business': [
    'Provide detailed specifications and timelines',
    'Back all claims with concrete data and evidence',
    'Follow established procedures and protocols',
    'Allow adequate time for thorough planning',
    'Separate business discussions from personal relationship',
  ],
};

export function SuggestionsPanel({ theirCulture, voiceEnabled, onVoiceToggle }: SuggestionsPanelProps) {
  const suggestions = cultureSuggestions[theirCulture] || [];

  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        💡 Suggestions
      </h3>
      <ul className="space-y-2 mb-4">
        {suggestions.slice(0, 4).map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-blue-600 text-xs mt-0.5">•</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline text-left">
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
      <div className="pt-3 border-t">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            🔊 Voice Output for Suggestions
          </span>
          <button
            onClick={() => onVoiceToggle(!voiceEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              voiceEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                voiceEnabled ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
