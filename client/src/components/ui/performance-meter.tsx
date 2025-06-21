interface PerformanceMeterProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  colorThresholds?: {
    good: number;
    warning: number;
  };
  className?: string;
}

export function PerformanceMeter({ 
  label, 
  value, 
  max, 
  unit = "%", 
  colorThresholds = { good: 50, warning: 75 },
  className = ""
}: PerformanceMeterProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = () => {
    if (percentage <= colorThresholds.good) return "bg-strudel-accent";
    if (percentage <= colorThresholds.warning) return "bg-strudel-warning";
    return "bg-strudel-error";
  };

  const getTextColor = () => {
    if (percentage <= colorThresholds.good) return "strudel-accent";
    if (percentage <= colorThresholds.warning) return "strudel-warning";
    return "strudel-error";
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="w-24 h-2 bg-strudel-surface-light rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {Math.round(value)}{unit}
        </span>
      </div>
    </div>
  );
}
