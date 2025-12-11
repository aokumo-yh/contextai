import { Globe, Volume2, Mic } from 'lucide-react';
import { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface LanguageVoiceSettingsProps {
  yourLanguage: Language;
  voiceInputEnabled: boolean;
  voiceOutputEnabled: boolean;
  onYourLanguageChange: (lang: Language) => void;
  onVoiceInputToggle: (enabled: boolean) => void;
  onVoiceOutputToggle: (enabled: boolean) => void;
  isListening?: boolean;
}

export function LanguageVoiceSettings({
  yourLanguage,
  voiceInputEnabled,
  voiceOutputEnabled,
  onYourLanguageChange,
  onVoiceInputToggle,
  onVoiceOutputToggle,
  isListening = false,
}: LanguageVoiceSettingsProps) {
  return (
    <div className="border-b pb-4 mb-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Globe size={16} />
        Language & Voice
      </h3>

      <div className="space-y-3">
        <LanguageSelector
          value={yourLanguage}
          onChange={onYourLanguageChange}
          label="Your Language"
        />

        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={voiceInputEnabled}
              onChange={(e) => onVoiceInputToggle(e.target.checked)}
              className="w-4 h-4 text-[#0E71EB] border-gray-300 rounded focus:ring-2 focus:ring-[#0E71EB]"
            />
            <Mic size={16} className={isListening ? 'text-green-500' : 'text-[#0E71EB]'} />
            <span className="text-sm text-gray-700 font-medium">Voice Input (STT)</span>
            {isListening && (
              <span className="ml-auto flex gap-0.5">
                <span className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </span>
            )}
          </label>
          <p className="text-xs text-gray-500 pl-9">Use selected language for speech recognition</p>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={voiceOutputEnabled}
              onChange={(e) => onVoiceOutputToggle(e.target.checked)}
              className="w-4 h-4 text-[#0E71EB] border-gray-300 rounded focus:ring-2 focus:ring-[#0E71EB]"
            />
            <Volume2 size={16} className="text-[#0E71EB]" />
            <span className="text-sm text-gray-700 font-medium">Voice Output (TTS)</span>
          </label>
          <p className="text-xs text-gray-500 pl-9">Speak insights aloud using ElevenLabs</p>
        </div>
      </div>
    </div>
  );
}
