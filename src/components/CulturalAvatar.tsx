import { Culture } from '../types';

type EmotionalState = 'neutral' | 'uncomfortable' | 'considering' | 'satisfied' | 'alert';

interface CulturalAvatarProps {
  culture: Culture;
  label: 'You' | 'Them';
  emotionalState: EmotionalState;
  size?: number;
}

const cultureTraits: Record<Culture, { flag: string; traits: string[] }> = {
  'US Tech': { flag: '🇺🇸', traits: ['Direct', 'Fast-paced', 'Task-focused'] },
  'Japanese Corporate': { flag: '🇯🇵', traits: ['Indirect', 'Consensus', 'Relationship-focused'] },
  'German Engineering': { flag: '🇩🇪', traits: ['Precise', 'Structured', 'Process-driven'] },
  'Brazilian Startup': { flag: '🇧🇷', traits: ['Warm', 'Flexible', 'Collaborative'] },
  'Indian IT': { flag: '🇮🇳', traits: ['Hierarchical', 'Detailed', 'Respectful'] },
  'French Business': { flag: '🇫🇷', traits: ['Intellectual', 'Debate-oriented', 'Quality-focused'] },
  'Chinese Enterprise': { flag: '🇨🇳', traits: ['Hierarchical', 'Relationship-based', 'Long-term'] },
  'UK Financial': { flag: '🇬🇧', traits: ['Formal', 'Reserved', 'Detail-oriented'] },
  'Australian Casual': { flag: '🇦🇺', traits: ['Direct', 'Informal', 'Egalitarian'] },
  'Scandinavian Flat': { flag: '🇸🇪', traits: ['Consensus', 'Egalitarian', 'Balanced'] },
};

const avatarColors: Record<EmotionalState, { bg: string; border: string; emoji: string }> = {
  neutral: { bg: 'bg-gray-100', border: 'border-gray-300', emoji: '😊' },
  uncomfortable: { bg: 'bg-orange-50', border: 'border-orange-400', emoji: '😰' },
  considering: { bg: 'bg-blue-50', border: 'border-blue-400', emoji: '🤔' },
  satisfied: { bg: 'bg-green-50', border: 'border-green-400', emoji: '😌' },
  alert: { bg: 'bg-red-50', border: 'border-red-400', emoji: '😬' },
};

export function CulturalAvatar({ culture, label, emotionalState, size = 128 }: CulturalAvatarProps) {
  const traits = cultureTraits[culture] || cultureTraits['US Tech'];
  const colors = avatarColors[emotionalState];
  const emojiSize = Math.floor(size * 0.5);

  return (
    <div className="flex flex-col items-center">
      <p className={`font-bold text-gray-700 mb-3 ${size >= 200 ? 'text-lg' : 'text-sm'}`}>{label}</p>

      <div
        className={`rounded-full border-4 ${colors.border} ${colors.bg} flex items-center justify-center transition-all duration-500 transform hover:scale-105 shadow-xl`}
        style={{ width: size, height: size, fontSize: `${emojiSize}px` }}
      >
        {colors.emoji}
      </div>

      <div className={`text-center ${size >= 200 ? 'mt-4' : 'mt-3'}`}>
        <p className={`text-gray-500 mb-1 ${size >= 200 ? 'text-sm' : 'text-xs'}`}>{culture}</p>
        <div className={`flex items-center gap-1 text-gray-600 ${size >= 200 ? 'text-sm' : 'text-xs'}`}>
          <span className={size >= 200 ? 'text-xl' : 'text-base'}>{traits.flag}</span>
          <span>{traits.traits.join(' | ')}</span>
        </div>
      </div>

      <div className={`mt-2 px-3 py-1 rounded-full bg-gray-100 font-medium text-gray-700 capitalize ${size >= 200 ? 'text-sm' : 'text-xs'}`}>
        {emotionalState}
      </div>
    </div>
  );
}
