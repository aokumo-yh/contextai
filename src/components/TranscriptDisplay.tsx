import { useEffect, useRef } from 'react';
import { TranscriptEntry } from '../types';

interface TranscriptDisplayProps {
  entries: TranscriptEntry[];
  showSilence: boolean;
}

export function TranscriptDisplay({ entries, showSilence }: TranscriptDisplayProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex-shrink-0">
        Live Transcript
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              Start a conversation or load a demo scenario
              <br />
              <span className="text-sm">Transcript will appear here in real-time</span>
            </p>
          </div>
        ) : (
          <>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg shadow-sm transition-all animate-slide-in-up ${
                  entry.speaker === 'You'
                    ? 'bg-blue-50 border-l-4 border-[#0E71EB]'
                    : 'bg-gray-50 border-l-4 border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-700">
                    {entry.speaker}
                    {entry.language && entry.language !== 'en-US' && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        ({entry.language})
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                {entry.originalText && entry.translatedText ? (
                  <>
                    <p className="text-gray-600 text-sm italic mb-2">
                      {entry.originalText}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {entry.translatedText}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-800">{entry.text}</p>
                )}
              </div>
            ))}
            {showSilence && (
              <div className="flex justify-center py-2">
                <span className="text-gray-400 text-sm animate-pulse">
                  ...
                </span>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
