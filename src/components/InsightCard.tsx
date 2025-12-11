import { Insight } from '../types';

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const urgencyConfig = {
    calm: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      label: 'Calm',
    },
    alert: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-700',
      label: 'Alert',
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      label: 'Critical',
    },
  };

  const config = urgencyConfig[insight.urgency];

  return (
    <div
      className={`${config.bg} ${config.border} border-2 rounded-lg p-4 shadow-sm transition-all hover:shadow-md animate-slide-in-up`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{insight.icon}</span>
          <span className={`${config.badge} px-2 py-1 rounded-full text-xs font-semibold`}>
            {config.label}
          </span>
        </div>
        <span className="text-xs text-gray-500">{formatTime(insight.timestamp)}</span>
      </div>
      <p className="text-gray-800 text-sm leading-relaxed">{insight.text}</p>
    </div>
  );
}
