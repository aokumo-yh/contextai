import { Culture, TranscriptEntry } from '../types';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { analyzeCulturalDimensions } from '../services/culturalDimensionAnalysis';

interface CultureGapChartProps {
  yourCulture: Culture;
  theirCulture: Culture;
  transcript: TranscriptEntry[];
}

export function CultureGapChart({ yourCulture, theirCulture, transcript }: CultureGapChartProps) {
  const yourDimensions = analyzeCulturalDimensions(transcript, 'You', yourCulture);
  const theirDimensions = analyzeCulturalDimensions(transcript, 'Them', theirCulture);

  const dimensions = Object.keys(yourDimensions);

  const data = dimensions.map((dimension) => ({
    dimension,
    you: yourDimensions[dimension as keyof typeof yourDimensions],
    them: theirDimensions[dimension as keyof typeof theirDimensions],
  }));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
          <Radar
            name={yourCulture}
            dataKey="you"
            stroke="#9333ea"
            fill="#9333ea"
            fillOpacity={0.4}
          />
          <Radar
            name={theirCulture}
            dataKey="them"
            stroke="#14b8a6"
            fill="#14b8a6"
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '12px',
            }}
            formatter={(value) => {
              const labels = [
                'Low',
                'Very Low',
                'Low',
                'Medium-Low',
                'Medium',
                'Medium-High',
                'High',
                'Very High',
                'Extremely High',
                'Critical',
                'Extreme',
              ];
              return labels[(value as number) % labels.length];
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
