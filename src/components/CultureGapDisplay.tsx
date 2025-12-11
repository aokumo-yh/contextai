import { Culture } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface CultureGapDisplayProps {
  yourCulture: Culture;
  theirCulture: Culture;
}

const cultureScores: Record<Culture, Record<string, number>> = {
  'US Tech': {
    'Communication': 9,
    'Hierarchy': 3,
    'Time': 9,
    'Trust': 2,
    'Disagreement': 8,
    'Scheduling': 8,
    'Persuasion': 8,
    'Decision': 4
  },
  'Japanese Corporate': {
    'Communication': 2,
    'Hierarchy': 9,
    'Time': 4,
    'Trust': 9,
    'Disagreement': 2,
    'Scheduling': 3,
    'Persuasion': 3,
    'Decision': 9
  },
  'German Engineering': {
    'Communication': 8,
    'Hierarchy': 5,
    'Time': 9,
    'Trust': 4,
    'Disagreement': 7,
    'Scheduling': 9,
    'Persuasion': 7,
    'Decision': 5
  },
  'Brazilian Startup': {
    'Communication': 5,
    'Hierarchy': 6,
    'Time': 3,
    'Trust': 8,
    'Disagreement': 4,
    'Scheduling': 2,
    'Persuasion': 4,
    'Decision': 6
  },
  'Indian IT': {
    'Communication': 4,
    'Hierarchy': 8,
    'Time': 5,
    'Trust': 7,
    'Disagreement': 3,
    'Scheduling': 5,
    'Persuasion': 5,
    'Decision': 8
  },
  'French Business': {
    'Communication': 7,
    'Hierarchy': 7,
    'Time': 6,
    'Trust': 6,
    'Disagreement': 9,
    'Scheduling': 6,
    'Persuasion': 9,
    'Decision': 6
  },
  'Chinese Enterprise': {
    'Communication': 3,
    'Hierarchy': 9,
    'Time': 4,
    'Trust': 9,
    'Disagreement': 2,
    'Scheduling': 4,
    'Persuasion': 4,
    'Decision': 9
  },
  'UK Financial': {
    'Communication': 6,
    'Hierarchy': 6,
    'Time': 7,
    'Trust': 5,
    'Disagreement': 5,
    'Scheduling': 7,
    'Persuasion': 6,
    'Decision': 5
  },
  'Australian Casual': {
    'Communication': 8,
    'Hierarchy': 2,
    'Time': 7,
    'Trust': 3,
    'Disagreement': 7,
    'Scheduling': 6,
    'Persuasion': 7,
    'Decision': 3
  },
  'Scandinavian Flat': {
    'Communication': 7,
    'Hierarchy': 2,
    'Time': 7,
    'Trust': 4,
    'Disagreement': 6,
    'Scheduling': 7,
    'Persuasion': 6,
    'Decision': 8
  }
};

export function CultureGapDisplay({ yourCulture, theirCulture }: CultureGapDisplayProps) {
  const yourScores = cultureScores[yourCulture] || cultureScores['US Tech'];
  const theirScores = cultureScores[theirCulture] || cultureScores['Japanese Corporate'];

  const chartData = Object.keys(yourScores).map(dimension => ({
    dimension,
    you: yourScores[dimension],
    them: theirScores[dimension],
  }));

  const calculateGap = (dimension: string): number => {
    return Math.abs(yourScores[dimension] - theirScores[dimension]);
  };

  const topGaps = Object.keys(yourScores)
    .map(dim => ({ dimension: dim, gap: calculateGap(dim) }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Culture Gap Analysis</h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#4b5563', fontSize: 11 }}
            />
            <Radar
              name="You"
              dataKey="you"
              stroke="#0E71EB"
              fill="#0E71EB"
              fillOpacity={0.3}
            />
            <Radar
              name="Them"
              dataKey="them"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs font-semibold text-gray-600">Largest Gaps:</p>
        {topGaps.map(({ dimension, gap }) => (
          <div key={dimension} className="flex items-center justify-between text-xs">
            <span className="text-gray-700">{dimension}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${gap > 6 ? 'bg-red-500' : gap > 4 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                  style={{ width: `${(gap / 10) * 100}%` }}
                />
              </div>
              <span className={`font-semibold ${gap > 6 ? 'text-red-600' : gap > 4 ? 'text-orange-600' : 'text-yellow-600'}`}>
                {gap}/10 {gap > 6 ? '⚠️' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
