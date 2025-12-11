interface AudioVisualizationProps {
  isActive: boolean;
}

export function AudioVisualization({ isActive }: AudioVisualizationProps) {
  const bars = [0, 1, 2, 3, 4];

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-purple-500 to-teal-500 rounded-full transition-all ${
            isActive ? 'animate-pulse' : ''
          }`}
          style={{
            height: isActive ? `${20 + (i % 3) * 10}px` : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}
