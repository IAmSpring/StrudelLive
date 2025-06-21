import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Sample {
  id: number;
  name: string;
  category: string;
  duration: number;
}

const sampleCategories = [
  { name: "drums", icon: "fa-drum", color: "strudel-accent" },
  { name: "melodic", icon: "fa-music", color: "strudel-secondary" },
  { name: "bass", icon: "fa-wave-square", color: "strudel-primary" },
  { name: "ambient", icon: "fa-cloud", color: "strudel-warning" },
];

export function SamplesPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: samples = [] } = useQuery({
    queryKey: ["/api/samples", selectedCategory].filter(Boolean),
    queryFn: async () => {
      const url = selectedCategory ? `/api/samples?category=${selectedCategory}` : "/api/samples";
      const response = await fetch(url);
      return response.json();
    },
  });

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${seconds}s`;
  };

  const handleSamplePlay = (sample: Sample, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement sample preview playback
    console.log("Playing sample:", sample.name);
  };

  const handleSampleInsert = (sample: Sample) => {
    // TODO: Implement sample insertion into editor
    console.log("Inserting sample:", sample.name);
  };

  const groupedSamples = samples.reduce((acc: Record<string, Sample[]>, sample: Sample) => {
    if (!acc[sample.category]) {
      acc[sample.category] = [];
    }
    acc[sample.category].push(sample);
    return acc;
  }, {});

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-strudel-primary" : ""}
            >
              All
            </Button>
            {sampleCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className={selectedCategory === category.name ? "bg-strudel-primary" : ""}
              >
                <i className={`fas ${category.icon} mr-1`}></i>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selectedCategory ? (
            // Show samples for selected category
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center capitalize">
                <i className={`fas ${sampleCategories.find(c => c.name === selectedCategory)?.icon} mr-2`}></i>
                {selectedCategory}
              </h4>
              <div className="space-y-1">
                {(groupedSamples[selectedCategory] || []).map((sample: Sample) => (
                  <div
                    key={sample.id}
                    className="flex items-center justify-between p-2 bg-strudel-surface-light rounded-lg hover:bg-strudel-surface-light/80 cursor-pointer group"
                    onClick={() => handleSampleInsert(sample)}
                  >
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-6 h-6 bg-strudel-primary hover:bg-strudel-primary/80 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleSamplePlay(sample, e)}
                      >
                        <i className="fas fa-play text-white text-xs"></i>
                      </button>
                      <span className="text-sm text-slate-200">{sample.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {sample.duration ? formatDuration(sample.duration) : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Show all categories with samples
            Object.entries(groupedSamples).map(([categoryName, categorySamples]) => {
              const categoryInfo = sampleCategories.find(c => c.name === categoryName);
              return (
                <div key={categoryName}>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center capitalize">
                    <i className={`fas ${categoryInfo?.icon || "fa-folder"} mr-2`}></i>
                    {categoryName} ({categorySamples.length})
                  </h4>
                  <div className="space-y-1">
                    {categorySamples.slice(0, 3).map((sample: Sample) => (
                      <div
                        key={sample.id}
                        className="flex items-center justify-between p-2 bg-strudel-surface-light rounded-lg hover:bg-strudel-surface-light/80 cursor-pointer group"
                        onClick={() => handleSampleInsert(sample)}
                      >
                        <div className="flex items-center space-x-2">
                          <button
                            className="w-6 h-6 bg-strudel-primary hover:bg-strudel-primary/80 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleSamplePlay(sample, e)}
                          >
                            <i className="fas fa-play text-white text-xs"></i>
                          </button>
                          <span className="text-sm text-slate-200">{sample.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {sample.duration ? formatDuration(sample.duration) : "N/A"}
                        </span>
                      </div>
                    ))}
                    {categorySamples.length > 3 && (
                      <button
                        className="w-full text-xs text-strudel-primary hover:text-strudel-primary/80 py-1"
                        onClick={() => setSelectedCategory(categoryName)}
                      >
                        View all {categorySamples.length} samples
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {samples.length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-waveform-lines text-slate-500 text-2xl mb-2"></i>
              <p className="text-slate-400 text-sm">No samples available</p>
              <p className="text-slate-500 text-xs">Upload samples to get started</p>
            </div>
          )}
        </div>

        {/* Sample Upload */}
        <div className="border-t border-strudel-surface-light pt-4 mt-6">
          <button className="w-full p-3 border-2 border-dashed border-strudel-surface-light hover:border-strudel-primary rounded-lg text-slate-400 hover:text-strudel-primary transition-colors group">
            <i className="fas fa-upload mb-2 group-hover:text-strudel-primary"></i>
            <div className="text-sm">Upload Sample</div>
            <div className="text-xs text-slate-500 mt-1">WAV, MP3, FLAC supported</div>
          </button>
        </div>
      </div>
    </ScrollArea>
  );
}
