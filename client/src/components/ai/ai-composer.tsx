import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Square, Play, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIComposerProps {
  onCodeGenerated: (code: string) => void;
  onPlay: () => void;
  isPlaying: boolean;
}

interface CompositionStep {
  step: number;
  description: string;
  code: string;
  timestamp: Date;
}

export function AIComposer({ onCodeGenerated, onPlay, isPlaying }: AIComposerProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [compositionSteps, setCompositionSteps] = useState<CompositionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [compositionPrompt, setCompositionPrompt] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const composeTrackMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return apiRequest("POST", "/api/ai/compose-track", {
        prompt,
        maxSteps: 50
      });
    },
    onSuccess: (data) => {
      handleCompositionStep(data);
    },
    onError: (error) => {
      toast({
        title: "Composition Error",
        description: "Failed to generate composition step",
        variant: "destructive",
      });
      setIsComposing(false);
    }
  });

  const continueCompositionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/ai/continue-composition", {
        currentCode: compositionSteps[compositionSteps.length - 1]?.code || "",
        step: currentStep + 1
      });
    },
    onSuccess: (data) => {
      handleCompositionStep(data);
    }
  });

  const handleCompositionStep = (data: any) => {
    const newStep: CompositionStep = {
      step: currentStep + 1,
      description: data.description || `Step ${currentStep + 1}`,
      code: data.code,
      timestamp: new Date()
    };

    setCompositionSteps(prev => [...prev, newStep]);
    setCurrentStep(prev => prev + 1);
    onCodeGenerated(data.code);

    // Auto-continue if not finished and under 50 steps
    if (!data.isComplete && currentStep < 49) {
      setTimeout(() => {
        continueCompositionMutation.mutate();
      }, 2000);
    } else {
      setIsComposing(false);
      toast({
        title: "Composition Complete",
        description: `Generated ${currentStep + 1} composition steps`,
        variant: "default",
      });
    }
  };

  const startComposition = () => {
    if (!compositionPrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please describe what kind of track you want to create",
        variant: "destructive",
      });
      return;
    }

    setIsComposing(true);
    setCompositionSteps([]);
    setCurrentStep(0);
    composeTrackMutation.mutate(compositionPrompt);
  };

  const stopComposition = () => {
    setIsComposing(false);
    continueCompositionMutation.reset();
    composeTrackMutation.reset();
  };

  const continueComposition = () => {
    if (currentStep >= 49) {
      toast({
        title: "Step Limit Reached",
        description: "Maximum 50 composition steps reached. Please start a new composition.",
        variant: "destructive",
      });
      return;
    }
    
    setIsComposing(true);
    continueCompositionMutation.mutate();
  };

  return (
    <Card className="bg-black/90 border-purple-900/50">
      <CardHeader>
        <CardTitle className="text-purple-400 font-mono flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI COMPOSER
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Composition Prompt */}
        <div className="space-y-2">
          <label className="text-sm font-mono text-purple-300">
            TRACK DESCRIPTION:
          </label>
          <textarea
            value={compositionPrompt}
            onChange={(e) => setCompositionPrompt(e.target.value)}
            placeholder="e.g., 'progressive techno with evolving bassline'"
            className="w-full h-16 p-2 bg-black/50 border border-purple-700 text-purple-200 placeholder-purple-500 font-mono text-xs resize-none"
            disabled={isComposing}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isComposing ? (
            <>
              <Button
                onClick={startComposition}
                disabled={!compositionPrompt.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 font-mono text-sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                START COMPOSITION
              </Button>
              {compositionSteps.length > 0 && currentStep < 49 && (
                <Button
                  onClick={continueComposition}
                  variant="outline"
                  className="border-purple-700 text-purple-400 hover:bg-purple-900/30 font-mono text-sm"
                >
                  CONTINUE
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={stopComposition}
              variant="destructive"
              className="flex-1 font-mono text-sm"
            >
              <Square className="h-4 w-4 mr-1" />
              STOP COMPOSITION
            </Button>
          )}
        </div>

        {/* Progress */}
        {(isComposing || compositionSteps.length > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-purple-400">
              <span>PROGRESS</span>
              <span>{currentStep}/50 STEPS</span>
            </div>
            <Progress
              value={(currentStep / 50) * 100}
              className="h-2 bg-purple-900/50"
            />
            {isComposing && (
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                COMPOSING STEP {currentStep + 1}...
              </div>
            )}
          </div>
        )}

        {/* Composition Steps */}
        {compositionSteps.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-mono text-purple-300">
              HISTORY:
            </div>
            <ScrollArea className="h-24">
              <div className="space-y-1">
                {compositionSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-2 bg-purple-900/20 border border-purple-700/30 rounded text-xs font-mono"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant="outline" className="text-purple-400 border-purple-600 text-xs px-1 py-0">
                        {step.step}
                      </Badge>
                      <span className="text-purple-500 text-xs">
                        {step.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-purple-200 text-xs truncate">{step.description}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Playback Controls */}
        {compositionSteps.length > 0 && (
          <div className="flex gap-2 pt-2 border-t border-purple-700/30">
            <Button
              onClick={onPlay}
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              className="flex-1 font-mono text-sm"
            >
              {isPlaying ? (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  STOP
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  PLAY
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}