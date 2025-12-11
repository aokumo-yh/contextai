export type Culture = 'US Tech' | 'Japanese Corporate' | 'German Business';

export type Language =
  | 'en-US' | 'en-GB' | 'en-CA' | 'en-IN' | 'en-SG' | 'en-AU' | 'en-NZ' | 'en-ZA'
  | 'fr-CA' | 'es-MX' | 'pt-BR'
  | 'fr-FR' | 'de-DE' | 'es-ES' | 'it-IT' | 'nl-NL' | 'pl-PL' | 'ru-RU'
  | 'sv-SE' | 'no-NO' | 'da-DK' | 'fi-FI' | 'pt-PT' | 'el-GR' | 'tr-TR'
  | 'ja-JP' | 'zh-CN' | 'zh-TW' | 'ko-KR' | 'hi-IN' | 'th-TH' | 'vi-VN'
  | 'id-ID' | 'fil-PH'
  | 'ar-SA' | 'ar-AE' | 'he-IL';

export type Speaker = 'You' | 'Them';

export type UrgencyLevel = 'calm' | 'alert' | 'critical';

export interface TranscriptEntry {
  id: string;
  timestamp: Date;
  speaker: Speaker;
  text: string;
  originalText?: string;
  translatedText?: string;
  language?: Language;
}

export interface Insight {
  id: string;
  timestamp: Date;
  urgency: UrgencyLevel;
  icon: string;
  text: string;
  originalText?: string;
  translatedText?: string;
  culturalMeaning?: string;
}

export interface DemoScenario {
  name: string;
  description: string;
  yourCulture: Culture;
  theirCulture: Culture;
  transcript: Omit<TranscriptEntry, 'id'>[];
  insights: Omit<Insight, 'id'>[];
}
