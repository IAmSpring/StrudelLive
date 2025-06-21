import { Slider } from "@/components/ui/slider";

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function VolumeSlider({ value, onChange, className = "" }: VolumeSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  const getVolumeIcon = () => {
    if (value === 0) return "fa-volume-mute";
    if (value < 33) return "fa-volume-low";
    if (value < 66) return "fa-volume-down";
    return "fa-volume-up";
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <i className={`fas ${getVolumeIcon()} text-slate-400 text-sm`}></i>
      <div className="w-16">
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          max={100}
          step={1}
          className="cursor-pointer"
        />
      </div>
      <span className="text-xs text-slate-400 w-8">{value}%</span>
    </div>
  );
}
