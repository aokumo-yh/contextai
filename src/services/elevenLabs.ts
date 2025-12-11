export interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
}

export interface SpeechToTextResult {
  text: string;
  detectedLanguage?: string;
}

let config: ElevenLabsConfig | null = null;

export function initializeElevenLabs(apiKey: string, voiceId?: string) {
  config = {
    apiKey,
    voiceId: voiceId || 'EXAVITQu4vr4xnSDxMaL',
  };
}

export async function transcribeAudio(audioBlob: Blob, language?: string): Promise<SpeechToTextResult> {
  if (!config) {
    console.warn('ElevenLabs not initialized. Using Web Speech API as fallback.');
    throw new Error('ElevenLabs not configured. Use Web Speech API instead.');
  }

  try {
    const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const formData = new FormData();
    formData.append('file', audioBlob, `audio.${extension}`);
    formData.append('model_id', 'scribe_v1');

    if (language && language !== 'en-US') {
      const languageCode = language.split('-')[0];
      formData.append('language_code', languageCode);
    }

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': config.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs STT API response:', errorText);
      throw new Error(`ElevenLabs STT API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    return {
      text: data.text,
      detectedLanguage: data.language || language,
    };
  } catch (error) {
    console.error('ElevenLabs STT error:', error);
    throw error;
  }
}

export async function speakText(text: string): Promise<void> {
  if (!config) {
    throw new Error('ElevenLabs not initialized. Please configure ElevenLabs API key.');
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  audio.play();

  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };
}

export function isElevenLabsConfigured(): boolean {
  return config !== null;
}
