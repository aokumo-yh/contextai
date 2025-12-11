import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Square, AlertCircle, BarChart3, X } from 'lucide-react';
import { Culture, TranscriptEntry, Insight, Language } from './types';
import { analyzeCultural, generateSilenceInsight } from './culturalAnalysis';
import { speakText, initializeElevenLabs, transcribeAudio, isElevenLabsConfigured } from './services/elevenLabs';
import { initializeAnthropic, analyzeCulturalMoment, isAnthropicConfigured } from './services/anthropic';
import { initializeTranslation, translateText, isTranslationConfigured } from './services/translation';
import { CultureSelector } from './components/CultureSelector';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { CulturalIntelligencePanel } from './components/CulturalIntelligencePanel';
import { AudioVisualization } from './components/AudioVisualization';
import { CulturalAvatar } from './components/CulturalAvatar';
import { LiveAlertCard } from './components/LiveAlertCard';
import { LanguageVoiceSettings } from './components/LanguageVoiceSettings';
import { CultureGapChart } from './components/CultureGapChart';

type EmotionalState = 'neutral' | 'uncomfortable' | 'considering' | 'satisfied' | 'alert';

function App() {
  const [yourCulture, setYourCulture] = useState<Culture>('US Tech');
  const [theirCulture, setTheirCulture] = useState<Culture>('Japanese Corporate');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showSilence, setShowSilence] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showCultureGap, setShowCultureGap] = useState(false);
  const [yourEmotionalState, setYourEmotionalState] = useState<EmotionalState>('neutral');
  const [theirEmotionalState, setTheirEmotionalState] = useState<EmotionalState>('neutral');
  const [yourLanguage, setYourLanguage] = useState<Language>('en-US');
  const [theirLanguage, setTheirLanguage] = useState<Language>('ja-JP');
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [elevenLabsEnabled, setElevenLabsEnabled] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioMimeTypeRef = useRef<string>('audio/webm');
  const lastSpokeRef = useRef<number>(Date.now());
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentSpeakerRef = useRef<'You' | 'Them'>('You');
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (elevenLabsKey) {
      initializeElevenLabs(elevenLabsKey);
      setElevenLabsEnabled(true);
      setSpeechSupported(true);
      console.log('✅ ElevenLabs initialized as PRIMARY STT & TTS engine');
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSpeechSupported(!!SpeechRecognition);
      console.log('⚠️ ElevenLabs not configured. Falling back to browser speech APIs');
    }

    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (anthropicKey && anthropicKey !== 'your_anthropic_key_here') {
      initializeAnthropic(anthropicKey, 'claude-opus-4-20250514');
      console.log('✅ Claude Opus 4 initialized for cultural analysis');
    }

    const googleKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    const deeplKey = import.meta.env.VITE_DEEPL_API_KEY;
    if (googleKey || deeplKey) {
      initializeTranslation(deeplKey, googleKey);
      console.log('✅ Translation services initialized');
    }
  }, []);

  useEffect(() => {
    let silenceTimer: NodeJS.Timeout;

    if (isListening && transcript.length > 0) {
      silenceTimer = setTimeout(() => {
        setShowSilence(true);
      }, 3000);
    } else {
      setShowSilence(false);
    }

    return () => clearTimeout(silenceTimer);
  }, [isListening, transcript]);

  const addInsight = (insight: Omit<Insight, 'id'>) => {
    const newInsight: Insight = {
      ...insight,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    setInsights(prev => [newInsight, ...prev]);

    if (insight.urgency === 'critical') {
      setTheirEmotionalState('uncomfortable');
      setYourEmotionalState('alert');
    } else if (insight.urgency === 'alert') {
      setTheirEmotionalState('considering');
      setYourEmotionalState('alert');
    }

    setTimeout(() => {
      setTheirEmotionalState('neutral');
      setYourEmotionalState('neutral');
    }, 5000);

    if (voiceOutputEnabled) {
      try {
        if (elevenLabsEnabled) {
          speakText(insight.text);
        } else if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(insight.text);
          utterance.lang = yourLanguage;
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        console.error('Speech error:', e);
      }
    }
  };

  const processTranscriptText = async (transcriptText: string, detectedLanguage?: string) => {
    const sourceLanguage = detectedLanguage || yourLanguage;

    const languageBase = (lang: string) => lang.split('-')[0].toLowerCase();
    const userLanguageBase = languageBase(yourLanguage);
    const detectedLanguageBase = languageBase(sourceLanguage);
    const isUserSpeaking = userLanguageBase === detectedLanguageBase;

    currentSpeakerRef.current = isUserSpeaking ? 'You' : 'Them';

    let translatedText = transcriptText;
    let originalText = transcriptText;
    let needsTranslation = sourceLanguage !== yourLanguage && !isUserSpeaking;

    if (isTranslationConfigured() && needsTranslation) {
      try {
        const translation = await translateText(transcriptText, yourLanguage, sourceLanguage);
        translatedText = translation.translatedText;
        originalText = transcriptText;
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    const newEntry: TranscriptEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      speaker: currentSpeakerRef.current,
      text: isUserSpeaking ? transcriptText : translatedText,
      originalText: needsTranslation ? originalText : undefined,
      translatedText: needsTranslation ? translatedText : undefined,
      language: sourceLanguage,
    };

    setTranscript(prev => [...prev, newEntry]);

    if (isAnthropicConfigured()) {
      try {
        const analysis = await analyzeCulturalMoment({
          originalText: transcriptText,
          translatedText: needsTranslation ? translatedText : undefined,
          speakerCulture: isUserSpeaking ? yourCulture : theirCulture,
          listenerCulture: isUserSpeaking ? theirCulture : yourCulture,
          conversationContext: transcript.slice(-3).map(t => t.text),
          targetLanguage: yourLanguage,
          isUserSpeaking: isUserSpeaking,
        });

        if (analysis.detected && analysis.insight) {
          addInsight({
            urgency: analysis.urgency,
            icon: isUserSpeaking ? '💡' : '🎯',
            text: analysis.insight,
            culturalMeaning: analysis.culturalMeaning,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error('Cultural analysis error:', error);
      }
    } else {
      const result = analyzeCultural(translatedText, theirCulture, 0);
      if (result.triggered && result.insight) {
        addInsight(result.insight);
      }
    }

    lastSpokeRef.current = Date.now();

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      if (Date.now() - lastSpokeRef.current > 5000) {
        const silenceInsight = generateSilenceInsight(
          Date.now() - lastSpokeRef.current,
          theirCulture
        );
        addInsight(silenceInsight);
      }
    }, 5500);
  };

  const startElevenLabsListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }

      console.log('Using MediaRecorder mimeType:', mimeType || 'default');
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioMimeTypeRef.current = mimeType || 'audio/webm';
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);

          const audioBlob = new Blob(audioChunksRef.current, { type: audioMimeTypeRef.current });

          if (audioBlob.size > 10000) {
            try {
              const languageToUse = voiceInputEnabled ? yourLanguage : 'en-US';
              console.log('Sending audio to ElevenLabs STT:', audioBlob.size, 'bytes', 'Language:', languageToUse);
              const result = await transcribeAudio(audioBlob, languageToUse);
              console.log('ElevenLabs transcription result:', result);
              if (result.text && result.text.trim()) {
                await processTranscriptText(result.text, result.detectedLanguage);
              }
              audioChunksRef.current = [];
            } catch (error) {
              console.error('ElevenLabs transcription error:', error);
              addInsight({
                urgency: 'alert',
                icon: '⚠️',
                text: `Transcription error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                timestamp: new Date(),
              });
            }
          }
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      lastSpokeRef.current = Date.now();

      recordingIntervalRef.current = setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 3000);

    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Could not access microphone. Please grant permission and try again.');
    }
  };

  const startBrowserListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceInputEnabled ? yourLanguage : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      lastSpokeRef.current = Date.now();
    };

    recognition.onresult = async (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          await processTranscriptText(transcriptText);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
    }
  };

  const startRealListening = () => {
    if (elevenLabsEnabled) {
      startElevenLabsListening();
    } else {
      startBrowserListening();
    }
  };

  const handleStartStop = () => {
    if (isListening) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setIsListening(false);
      setShowSilence(false);
    } else {
      setTranscript([]);
      setInsights([]);
      startRealListening();
    }
  };

  const clearAll = () => {
    setTranscript([]);
    setInsights([]);
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-[1800px] mx-auto h-[calc(100vh-3rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-6 flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0E71EB] flex items-center gap-2">
                <span>🐟</span> Context AI
              </h1>
              <p className="text-sm text-gray-600 mt-1">Cultural Intelligence Assistant</p>
            </div>

            <div className="mb-6">
              <CultureSelector
                label="Your Culture"
                value={yourCulture}
                onChange={setYourCulture}
                disabled={isListening}
              />
              <CultureSelector
                label="Their Culture"
                value={theirCulture}
                onChange={setTheirCulture}
                disabled={isListening}
              />
            </div>

            <button
              onClick={handleStartStop}
              disabled={!speechSupported}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg mb-4 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-[#0E71EB] hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isListening ? (
                <>
                  <Square size={20} /> Stop Session
                </>
              ) : (
                <>
                  <Play size={20} /> Start Session
                </>
              )}
            </button>

            {elevenLabsEnabled && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                <AlertCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 font-medium">
                  ✅ ElevenLabs Active - Premium STT & TTS
                </p>
              </div>
            )}

            {!speechSupported && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Speech recognition not available
                </p>
              </div>
            )}

            <LanguageVoiceSettings
              yourLanguage={yourLanguage}
              theirLanguage={theirLanguage}
              voiceInputEnabled={voiceInputEnabled}
              voiceOutputEnabled={voiceOutputEnabled}
              onYourLanguageChange={setYourLanguage}
              onTheirLanguageChange={setTheirLanguage}
              onVoiceInputToggle={setVoiceInputEnabled}
              onVoiceOutputToggle={setVoiceOutputEnabled}
              isListening={isListening && voiceInputEnabled}
            />

            <div className="border-t pt-4 mt-auto">
              <button
                onClick={() => setShowCultureGap(true)}
                className="w-full py-2 px-4 bg-[#0E71EB] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm mb-3"
              >
                <BarChart3 size={16} /> View Culture Map
              </button>
              {(transcript.length > 0 || insights.length > 0) && (
                <button
                  onClick={clearAll}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden">
            <TranscriptDisplay entries={transcript} showSilence={showSilence} />
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
            <CulturalIntelligencePanel
              transcript={transcript}
              insights={insights}
              yourCulture={yourCulture}
              theirCulture={theirCulture}
              voiceEnabled={voiceOutputEnabled}
              onVoiceToggle={setVoiceOutputEnabled}
            />
          </div>
        </div>
      </div>

      {showCultureGap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Culture Map</h2>
              <button
                onClick={() => setShowCultureGap(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CultureGapChart yourCulture={yourCulture} theirCulture={theirCulture} transcript={transcript} />
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                <strong>{yourCulture}</strong> vs <strong>{theirCulture}</strong>.
                Higher values indicate greater emphasis on that dimension.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
