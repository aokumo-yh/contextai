import { Check, X, Info } from 'lucide-react';
import { isElevenLabsConfigured } from '../services/elevenLabs';
import { isTranslationConfigured } from '../services/translation';
import { isAnthropicConfigured } from '../services/anthropic';

interface ServiceStatus {
  name: string;
  description: string;
  configured: boolean;
  fallback?: string;
}

export function AIServicesStatus() {
  const services: ServiceStatus[] = [
    {
      name: 'ElevenLabs',
      description: 'Voice I/O (STT & TTS)',
      configured: isElevenLabsConfigured(),
      fallback: 'Web Speech API',
    },
    {
      name: 'Claude Opus 4',
      description: 'Cultural Analysis',
      configured: isAnthropicConfigured(),
      fallback: 'Pattern matching',
    },
    {
      name: 'Google Translate',
      description: 'Real-time translation',
      configured: isTranslationConfigured(),
      fallback: 'No translation',
    },
  ];

  const allConfigured = services.every(s => s.configured);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} className="text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">AI Services Status</h3>
      </div>

      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-2 bg-white rounded border border-gray-100"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{service.name}</span>
                {service.configured ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <X size={14} className="text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-500">{service.description}</p>
            </div>
            {!service.configured && service.fallback && (
              <span className="text-xs text-gray-400 ml-2">
                Using: {service.fallback}
              </span>
            )}
          </div>
        ))}
      </div>

      {!allConfigured && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
          <p className="text-xs text-amber-700">
            Add API keys to <code className="bg-amber-100 px-1 rounded">.env</code> for full AI capabilities
          </p>
        </div>
      )}
    </div>
  );
}
