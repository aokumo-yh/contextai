import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Insight } from '../types';

interface LiveAlertCardProps {
  insight: Insight;
  showTranslation?: boolean;
}

const urgencyConfig = {
  info: {
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    icon: Info,
    iconColor: 'text-blue-600',
    label: 'Cultural Insight',
  },
  alert: {
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
    label: 'Cultural Warning',
  },
  critical: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    label: 'Critical Alert',
  },
};

export function LiveAlertCard({ insight, showTranslation = false }: LiveAlertCardProps) {
  const config = urgencyConfig[insight.urgency as keyof typeof urgencyConfig] || urgencyConfig.info;
  const Icon = config.icon;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`border-l-4 ${config.border} ${config.bg} rounded-lg p-4 shadow-md animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        <div className={`${config.iconColor} mt-0.5`}>
          <Icon size={24} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${config.iconColor} text-sm`}>
              {config.label}
            </h4>
            <span className="text-xs text-gray-500">{formatTime(insight.timestamp)}</span>
          </div>

          {showTranslation && insight.originalText && insight.translatedText ? (
            <div className="space-y-3 mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Original:</p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {insight.originalText}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Translated:</p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {insight.translatedText}
                </p>
              </div>

              {insight.culturalMeaning && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Cultural Meaning:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insight.culturalMeaning}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              {insight.text}
            </p>
          )}

          {insight.suggestion && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">What to do:</p>
              <p className="text-sm text-gray-700">
                {insight.suggestion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
