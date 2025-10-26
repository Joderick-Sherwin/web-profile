import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MLDemo = () => {
  const [input, setInput] = useState(5);
  const [output, setOutput] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple ML simulation: y = 2x + 3 with some "noise"
  const runPrediction = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const prediction = 2 * input + 3 + (Math.random() - 0.5) * 2;
      setOutput(Math.round(prediction * 100) / 100);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 w-80 card-glass ai-border rounded-2xl p-6 shadow-glow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Live ML Demo</h3>
          <p className="text-xs text-muted-foreground">Linear Regression Model</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-foreground/80 mb-2 block">
            Input Value: <span className="text-primary font-bold">{input}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={input}
            onChange={(e) => setInput(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <Button
          onClick={runPrediction}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            "Run Prediction"
          )}
        </Button>

        {output !== null && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 animate-fade-in">
            <div className="text-sm text-foreground/70 mb-1">Predicted Output:</div>
            <div className="text-2xl font-bold text-primary">{output}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Model: y = 2x + 3
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Adjust input to see real-time predictions
        </div>
      </div>
    </div>
  );
};

export default MLDemo;
