import { Insight } from '../types';

interface CulturalInsightEntryProps {
  insight: Insight;
}

export function CulturalInsightEntry({ insight }: CulturalInsightEntryProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getAlertLabel = () => {
    if (insight.urgency === 'critical') return 'Critical Alert';
    if (insight.urgency === 'alert') return 'Cultural Alert';
    return 'Insight';
  };

  return (
    <div className="mb-4 animate-slide-in-up">
      <div className="text-xs text-gray-500 mb-1">
        [{formatTime(insight.timestamp)}]
      </div>
      <div className="text-sm">
        <span className="font-semibold text-blue-600">
          [{getAlertLabel()}]
        </span>
        <span className="text-gray-800 ml-1">
          {insight.text}
        </span>
      </div>
    </div>
  );
}
