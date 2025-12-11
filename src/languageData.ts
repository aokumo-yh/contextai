import { Language } from './types';

export interface LanguageInfo {
  code: Language;
  flag: string;
  name: string;
  nativeName: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East & Africa';
  common?: boolean;
}

export const languageData: LanguageInfo[] = [
  { code: 'en-US', flag: '🇺🇸', name: 'English', nativeName: 'English (US)', region: 'Americas', common: true },
  { code: 'zh-CN', flag: '🇨🇳', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', region: 'Asia-Pacific', common: true },
  { code: 'ja-JP', flag: '🇯🇵', name: 'Japanese', nativeName: '日本語', region: 'Asia-Pacific', common: true },
  { code: 'es-ES', flag: '🇪🇸', name: 'Spanish', nativeName: 'Español', region: 'Europe', common: true },
  { code: 'fr-FR', flag: '🇫🇷', name: 'French', nativeName: 'Français', region: 'Europe', common: true },
  { code: 'de-DE', flag: '🇩🇪', name: 'German', nativeName: 'Deutsch', region: 'Europe', common: true },

  { code: 'en-GB', flag: '🇬🇧', name: 'English', nativeName: 'English (UK)', region: 'Europe' },
  { code: 'en-CA', flag: '🇨🇦', name: 'English', nativeName: 'English (Canada)', region: 'Americas' },
  { code: 'fr-CA', flag: '🇨🇦', name: 'French', nativeName: 'Français (Canada)', region: 'Americas' },
  { code: 'es-MX', flag: '🇲🇽', name: 'Spanish', nativeName: 'Español (México)', region: 'Americas' },
  { code: 'pt-BR', flag: '🇧🇷', name: 'Portuguese', nativeName: 'Português (Brasil)', region: 'Americas' },

  { code: 'it-IT', flag: '🇮🇹', name: 'Italian', nativeName: 'Italiano', region: 'Europe' },
  { code: 'nl-NL', flag: '🇳🇱', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe' },
  { code: 'pl-PL', flag: '🇵🇱', name: 'Polish', nativeName: 'Polski', region: 'Europe' },
  { code: 'ru-RU', flag: '🇷🇺', name: 'Russian', nativeName: 'Русский', region: 'Europe' },
  { code: 'sv-SE', flag: '🇸🇪', name: 'Swedish', nativeName: 'Svenska', region: 'Europe' },
  { code: 'no-NO', flag: '🇳🇴', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe' },
  { code: 'da-DK', flag: '🇩🇰', name: 'Danish', nativeName: 'Dansk', region: 'Europe' },
  { code: 'fi-FI', flag: '🇫🇮', name: 'Finnish', nativeName: 'Suomi', region: 'Europe' },
  { code: 'pt-PT', flag: '🇵🇹', name: 'Portuguese', nativeName: 'Português (Portugal)', region: 'Europe' },
  { code: 'el-GR', flag: '🇬🇷', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe' },
  { code: 'tr-TR', flag: '🇹🇷', name: 'Turkish', nativeName: 'Türkçe', region: 'Europe' },

  { code: 'zh-TW', flag: '🇹🇼', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)', region: 'Asia-Pacific' },
  { code: 'ko-KR', flag: '🇰🇷', name: 'Korean', nativeName: '한국어', region: 'Asia-Pacific' },
  { code: 'hi-IN', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिन्दी', region: 'Asia-Pacific' },
  { code: 'en-IN', flag: '🇮🇳', name: 'English', nativeName: 'English (India)', region: 'Asia-Pacific' },
  { code: 'th-TH', flag: '🇹🇭', name: 'Thai', nativeName: 'ไทย', region: 'Asia-Pacific' },
  { code: 'vi-VN', flag: '🇻🇳', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia-Pacific' },
  { code: 'id-ID', flag: '🇮🇩', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia-Pacific' },
  { code: 'fil-PH', flag: '🇵🇭', name: 'Filipino', nativeName: 'Filipino', region: 'Asia-Pacific' },
  { code: 'en-SG', flag: '🇸🇬', name: 'English', nativeName: 'English (Singapore)', region: 'Asia-Pacific' },
  { code: 'en-AU', flag: '🇦🇺', name: 'English', nativeName: 'English (Australia)', region: 'Asia-Pacific' },
  { code: 'en-NZ', flag: '🇳🇿', name: 'English', nativeName: 'English (New Zealand)', region: 'Asia-Pacific' },

  { code: 'ar-SA', flag: '🇸🇦', name: 'Arabic', nativeName: 'العربية (السعودية)', region: 'Middle East & Africa' },
  { code: 'ar-AE', flag: '🇦🇪', name: 'Arabic', nativeName: 'العربية (الإمارات)', region: 'Middle East & Africa' },
  { code: 'he-IL', flag: '🇮🇱', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East & Africa' },
  { code: 'en-ZA', flag: '🇿🇦', name: 'English', nativeName: 'English (South Africa)', region: 'Middle East & Africa' },
];

export const commonLanguages = languageData.filter(lang => lang.common);

export const languagesByRegion: Record<string, LanguageInfo[]> = {
  'Americas': languageData.filter(lang => lang.region === 'Americas'),
  'Europe': languageData.filter(lang => lang.region === 'Europe'),
  'Asia-Pacific': languageData.filter(lang => lang.region === 'Asia-Pacific'),
  'Middle East & Africa': languageData.filter(lang => lang.region === 'Middle East & Africa'),
};

export function getLanguageInfo(code: Language): LanguageInfo | undefined {
  return languageData.find(lang => lang.code === code);
}

export function searchLanguages(query: string): LanguageInfo[] {
  const lowerQuery = query.toLowerCase();
  return languageData.filter(
    lang =>
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.nativeName.toLowerCase().includes(lowerQuery) ||
      lang.code.toLowerCase().includes(lowerQuery)
  );
}
