import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Upload } from "lucide-react";

const sampleCategories = {
  ALL: "all",
  DRUMS: "drums", 
  MELODIC: "melodic",
  BASS: "bass",
  AMBIENT: "ambient"
};

const sampleLibrary = {
  drums: [
    { name: "bd", description: "Bass Drum", bank: "RolandTR909" },
    { name: "sd", description: "Snare Drum", bank: "RolandTR909" },
    { name: "hh", description: "Hi-Hat Closed", bank: "RolandTR909" },
    { name: "oh", description: "Hi-Hat Open", bank: "RolandTR909" },
    { name: "cp", description: "Hand Clap", bank: "RolandTR909" },
    { name: "rim", description: "Rim Shot", bank: "RolandTR909" },
    { name: "crash", description: "Crash Cymbal", bank: "RolandTR909" },
    { name: "ride", description: "Ride Cymbal", bank: "RolandTR909" }
  ],
  melodic: [
    { name: "piano", description: "Piano", bank: "acoustic" },
    { name: "rhodes", description: "Electric Piano", bank: "electric" },
    { name: "lead", description: "Synth Lead", bank: "synth" },
    { name: "pad", description: "String Pad", bank: "synth" },
    { name: "pluck", description: "Synth Pluck", bank: "synth" },
    { name: "bell", description: "Bell", bank: "acoustic" }
  ],
  bass: [
    { name: "bass", description: "Bass Synth", bank: "synth" },
    { name: "subbass", description: "Sub Bass", bank: "synth" },
    { name: "reese", description: "Reese Bass", bank: "synth" },
    { name: "wobble", description: "Wobble Bass", bank: "synth" }
  ],
  ambient: [
    { name: "wind", description: "Wind", bank: "nature" },
    { name: "rain", description: "Rain", bank: "nature" },
    { name: "noise", description: "White Noise", bank: "noise" },
    { name: "vinyl", description: "Vinyl Crackle", bank: "texture" }
  ]
};

export function SamplesPanel() {
  const [selectedCategory, setSelectedCategory] = useState(sampleCategories.ALL);
  const [searchTerm, setSearchTerm] = useState("");

  const getSamples = () => {
    let samples: any[] = [];
    if (selectedCategory === sampleCategories.ALL) {
      samples = Object.values(sampleLibrary).flat();
    } else {
      samples = sampleLibrary[selectedCategory as keyof typeof sampleLibrary] || [];
    }
    
    if (searchTerm) {
      samples = samples.filter(sample => 
        sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return samples;
  };

  const playSample = (sampleName: string) => {
    console.log(`Playing sample: ${sampleName}`);
    // This would integrate with the audio engine
  };

  const insertSampleCode = (sampleName: string) => {
    // This would insert s("sampleName") into the editor
    console.log(`Insert: s("${sampleName}")`);
  };

  return (
    <div className="flex flex-col h-full bg-black/90">
      {/* Header */}
      <div className="p-4 border-b border-cyan-900/50">
        <h3 className="text-cyan-300 font-mono text-sm font-semibold">SAMPLES</h3>
      </div>

      {/* Category Filters */}
      <div className="p-3 border-b border-cyan-900/30">
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(sampleCategories).map(([key, value]) => (
            <Button
              key={value}
              onClick={() => setSelectedCategory(value)}
              variant={selectedCategory === value ? "default" : "outline"}
              size="sm"
              className={`text-xs font-mono ${
                selectedCategory === value
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "border-cyan-700 text-cyan-400 hover:bg-cyan-900/30"
              }`}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-cyan-900/30">
        <input
          type="text"
          placeholder="Search samples..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-black/50 border border-cyan-700 text-cyan-200 placeholder-cyan-500 font-mono text-xs rounded"
        />
      </div>

      {/* Samples List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {getSamples().length === 0 ? (
            <div className="text-center py-8">
              <div className="text-cyan-500 mb-2">📦</div>
              <p className="text-cyan-400 text-sm font-mono">No samples available</p>
              <p className="text-cyan-600 text-xs font-mono mt-1">Upload samples to get started</p>
            </div>
          ) : (
            getSamples().map((sample, index) => (
              <div
                key={`${sample.name}-${index}`}
                className="group p-2 bg-cyan-900/10 border border-cyan-700/30 rounded hover:bg-cyan-900/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-cyan-300 font-mono text-sm font-semibold">
                        {sample.name}
                      </code>
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1 py-0 border-cyan-600 text-cyan-400"
                      >
                        {sample.bank}
                      </Badge>
                    </div>
                    <p className="text-cyan-500 text-xs font-mono mt-1">
                      {sample.description}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => playSample(sample.name)}
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0 border-cyan-600 text-cyan-400 hover:bg-cyan-900/50"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => insertSampleCode(sample.name)}
                      size="sm"
                      variant="outline"
                      className="h-6 w-8 p-0 border-cyan-600 text-cyan-400 hover:bg-cyan-900/50 text-xs font-mono"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Upload Section */}
      <div className="p-3 border-t border-cyan-900/30">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 font-mono text-xs"
        >
          <Upload className="h-3 w-3 mr-1" />
          Upload Sample
        </Button>
        <p className="text-cyan-600 text-xs font-mono mt-1 text-center">
          WAV, MP3, FLAC supported
        </p>
      </div>
    </div>
  );
}