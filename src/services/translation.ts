export interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
  service: 'deepl' | 'google' | 'fallback';
}

interface TranslationConfig {
  deeplApiKey?: string;
  googleApiKey?: string;
}

let config: TranslationConfig = {};

export function initializeTranslation(deeplApiKey?: string, googleApiKey?: string) {
  config = {
    deeplApiKey,
    googleApiKey,
  };
}

async function translateWithDeepL(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  if (!config.deeplApiKey) {
    throw new Error('DeepL API key not configured');
  }

  const deeplLangMap: Record<string, string> = {
    'en-US': 'EN-US', 'en-GB': 'EN-GB', 'en-CA': 'EN', 'en-IN': 'EN',
    'en-SG': 'EN', 'en-AU': 'EN', 'en-NZ': 'EN', 'en-ZA': 'EN',
    'fr-CA': 'FR', 'es-MX': 'ES', 'pt-BR': 'PT-BR',
    'fr-FR': 'FR', 'de-DE': 'DE', 'es-ES': 'ES', 'it-IT': 'IT',
    'nl-NL': 'NL', 'pl-PL': 'PL', 'ru-RU': 'RU',
    'sv-SE': 'SV', 'no-NO': 'NB', 'da-DK': 'DA', 'fi-FI': 'FI',
    'pt-PT': 'PT-PT', 'el-GR': 'EL', 'tr-TR': 'TR',
    'ja-JP': 'JA', 'zh-CN': 'ZH', 'zh-TW': 'ZH', 'ko-KR': 'KO',
    'id-ID': 'ID',
  };

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${config.deeplApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: deeplLangMap[targetLang] || 'EN',
      source_lang: sourceLang ? deeplLangMap[sourceLang] : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepL API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    originalText: text,
    translatedText: data.translations[0].text,
    detectedLanguage: data.translations[0].detected_source_language.toLowerCase(),
    targetLanguage: targetLang,
    service: 'deepl',
  };
}

async function translateWithGoogle(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  if (!config.googleApiKey) {
    throw new Error('Google Translate API key not configured');
  }

  const googleLangMap: Record<string, string> = {
    'en-US': 'en', 'en-GB': 'en', 'en-CA': 'en', 'en-IN': 'en',
    'en-SG': 'en', 'en-AU': 'en', 'en-NZ': 'en', 'en-ZA': 'en',
    'fr-CA': 'fr', 'es-MX': 'es', 'pt-BR': 'pt',
    'fr-FR': 'fr', 'de-DE': 'de', 'es-ES': 'es', 'it-IT': 'it',
    'nl-NL': 'nl', 'pl-PL': 'pl', 'ru-RU': 'ru',
    'sv-SE': 'sv', 'no-NO': 'no', 'da-DK': 'da', 'fi-FI': 'fi',
    'pt-PT': 'pt', 'el-GR': 'el', 'tr-TR': 'tr',
    'ja-JP': 'ja', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', 'ko-KR': 'ko',
    'hi-IN': 'hi', 'th-TH': 'th', 'vi-VN': 'vi',
    'id-ID': 'id', 'fil-PH': 'fil',
    'ar-SA': 'ar', 'ar-AE': 'ar', 'he-IL': 'he',
  };

  const params = new URLSearchParams({
    key: config.googleApiKey,
    q: text,
    target: googleLangMap[targetLang] || 'en',
  });

  if (sourceLang) {
    params.append('source', googleLangMap[sourceLang] || 'auto');
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?${params}`,
    {
      method: 'POST',
    }
  );

  if (!response.ok) {
    throw new Error(`Google Translate API error: ${response.statusText}`);
  }

  const data = await response.json();
  const translation = data.data.translations[0];

  return {
    originalText: text,
    translatedText: translation.translatedText,
    detectedLanguage: translation.detectedSourceLanguage || sourceLang || 'unknown',
    targetLanguage: targetLang,
    service: 'google',
  };
}

function fallbackTranslation(
  text: string,
  targetLang: string,
  sourceLang?: string
): TranslationResult {
  return {
    originalText: text,
    translatedText: text,
    detectedLanguage: sourceLang || 'unknown',
    targetLanguage: targetLang,
    service: 'fallback',
  };
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResult> {
  try {
    if (config.googleApiKey) {
      return await translateWithGoogle(text, targetLang, sourceLang);
    }
  } catch (error) {
    console.warn('Google Translate failed, trying DeepL:', error);
  }

  try {
    if (config.deeplApiKey) {
      return await translateWithDeepL(text, targetLang, sourceLang);
    }
  } catch (error) {
    console.warn('DeepL translation failed, using fallback:', error);
  }

  console.warn('No translation service available, returning original text');
  return fallbackTranslation(text, targetLang, sourceLang);
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    if (config.googleApiKey) {
      const result = await translateWithGoogle(text, 'en-US');
      return result.detectedLanguage;
    }

    if (config.deeplApiKey) {
      const result = await translateWithDeepL(text, 'en-US');
      return result.detectedLanguage;
    }
  } catch (error) {
    console.error('Language detection failed:', error);
  }

  return 'unknown';
}

export function isTranslationConfigured(): boolean {
  return !!(config.deeplApiKey || config.googleApiKey);
}
