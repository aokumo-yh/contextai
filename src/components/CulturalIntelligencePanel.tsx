import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { TranscriptEntry, Insight, Culture } from '../types';
import { SuggestionsPanel } from './SuggestionsPanel';

interface StreamItem {
  type: 'transcript' | 'insight';
  timestamp: Date;
  data: TranscriptEntry | Insight;
}

interface CulturalIntelligencePanelProps {
  transcript: TranscriptEntry[];
  insights: Insight[];
  yourCulture: Culture;
  theirCulture: Culture;
  voiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
}

export function CulturalIntelligencePanel({
  transcript,
  insights,
  yourCulture,
  theirCulture,
  voiceEnabled,
  onVoiceToggle,
}: CulturalIntelligencePanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const stream: StreamItem[] = [
    ...transcript.map(t => ({ type: 'transcript' as const, timestamp: t.timestamp, data: t })),
    ...insights.map(i => ({ type: 'insight' as const, timestamp: i.timestamp, data: i })),
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stream.length]);

  const getAlertLabel = (urgency: string) => {
    if (urgency === 'critical') return 'Critical Alert';
    if (urgency === 'alert') return 'Cultural Alert';
    return 'Insight';
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0 flex items-center gap-2">
        Cultural Intelligence Panel
        <div className="relative inline-block">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-[#0E71EB] transition-colors cursor-help"
            aria-label="Technical stack information"
          >
            <Info size={18} />
          </button>
          {showTooltip && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-4 z-50 animate-fade-in">
              <div className="font-semibold mb-2 text-[#0E71EB]">Powered by AI:</div>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#0E71EB] flex-shrink-0">•</span>
                  <span><strong>Claude Opus 4:</strong> Analyzes cultural nuances in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0E71EB] flex-shrink-0">•</span>
                  <span><strong>ElevenLabs:</strong> Voice transcription (speech-to-text)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0E71EB] flex-shrink-0">•</span>
                  <span><strong>ElevenLabs:</strong> Voice synthesis (text-to-speech)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0E71EB] flex-shrink-0">•</span>
                  <span><strong>Google Translate API:</strong> Multi-language translation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0E71EB] flex-shrink-0">•</span>
                  <span><strong>Culture Map Framework:</strong> Based on Erin Meyer's research</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-3">
        {stream.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-center text-sm">
              Real-time cultural insights will appear here during conversations
            </p>
          </div>
        ) : (
          stream.map((item, index) => {
            if (item.type === 'transcript') {
              const entry = item.data as TranscriptEntry;
              return (
                <div key={`t-${entry.id}`} className="text-sm animate-slide-in-up">
                  <span className="text-gray-500 text-xs">[{formatTime(entry.timestamp)}] </span>
                  <span className="font-semibold text-gray-800">{entry.speaker}: </span>
                  <span className="text-gray-700">{entry.text}</span>
                </div>
              );
            } else {
              const insight = item.data as Insight;
              return (
                <div key={`i-${insight.id}`} className="animate-slide-in-up">
                  <div className="text-sm bg-blue-50 border-l-4 border-[#0E71EB] p-3 rounded">
                    <span className="font-semibold text-[#0E71EB]">
                      [{getAlertLabel(insight.urgency)}]
                    </span>
                    <span className="text-gray-800 ml-1">{insight.text}</span>
                  </div>
                </div>
              );
            }
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t pt-4 flex-shrink-0">
        <SuggestionsPanel
          yourCulture={yourCulture}
          theirCulture={theirCulture}
          voiceEnabled={voiceEnabled}
          onVoiceToggle={onVoiceToggle}
        />
      </div>
    </div>
  );
}
