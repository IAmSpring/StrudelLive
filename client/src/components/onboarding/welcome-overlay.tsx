import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Play, Sparkles, MessageCircle } from "lucide-react";

interface WelcomeOverlayProps {
  onClose: () => void;
  onGenerateRandomBeat: () => void;
  onShowAIComposer: () => void;
  onShowChat: () => void;
}

export function WelcomeOverlay({ onClose, onGenerateRandomBeat, onShowAIComposer, onShowChat }: WelcomeOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Strudel Live Coding!",
      content: (
        <div className="space-y-4">
          <p className="text-cyan-300 font-mono text-sm">
            Create algorithmic music with code in real-time. Perfect for live performances and creative exploration.
          </p>
          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded p-3">
            <h4 className="text-cyan-300 font-mono text-xs font-semibold mb-2">QUICK START:</h4>
            <ul className="text-cyan-400 font-mono text-xs space-y-1">
              <li>• Write Strudel patterns in the editor</li>
              <li>• Press Ctrl+Enter to evaluate code</li>
              <li>• Use PLAY button to start audio</li>
              <li>• Modify code while playing for live coding</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "AI-Powered Features",
      content: (
        <div className="space-y-4">
          <p className="text-purple-300 font-mono text-sm">
            Get help from AI assistants for learning and composition.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-green-900/20 border border-green-700/30 rounded p-3">
              <h4 className="text-green-300 font-mono text-xs font-semibold mb-1">AI CHAT</h4>
              <p className="text-green-400 font-mono text-xs">Ask questions about Strudel syntax, get coding help, and learn techniques</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-700/30 rounded p-3">
              <h4 className="text-purple-300 font-mono text-xs font-semibold mb-1">AI COMPOSER</h4>
              <p className="text-purple-400 font-mono text-xs">Describe a track concept and let AI create it iteratively</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start?",
      content: (
        <div className="space-y-4">
          <p className="text-orange-300 font-mono text-sm">
            Choose how you'd like to begin your live coding journey:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => { onGenerateRandomBeat(); onClose(); }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-mono"
            >
              <Play className="h-4 w-4 mr-2" />
              Generate Random Beat
            </Button>
            <Button 
              onClick={() => { onShowAIComposer(); onClose(); }}
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-900/30 font-mono"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Try AI Composer
            </Button>
            <Button 
              onClick={() => { onShowChat(); onClose(); }}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-900/30 font-mono"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with AI Assistant
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[600px] max-w-[90vw] bg-black/95 border-cyan-700">
        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-cyan-400 hover:text-cyan-300"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-cyan-300 font-mono text-lg">
            {steps[currentStep].title}
          </CardTitle>
          <div className="flex space-x-1 mt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-cyan-400' : 'bg-cyan-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 font-mono"
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white font-mono"
              >
                Let's Go!
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}