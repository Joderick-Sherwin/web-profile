import { Brain, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const AIAssistantIndicator = () => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={`absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-1000 ${
            pulse ? "scale-150 opacity-0" : "scale-100 opacity-100"
          }`}
        />
        
        {/* Main indicator */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-glow border-2 border-primary/50">
          <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
          
          {/* Sparkle effect */}
          <Sparkles 
            className={`absolute -top-1 -right-1 w-4 h-4 text-accent transition-all duration-300 ${
              pulse ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </div>
        
        {/* Rotating ring */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
          <div className="w-full h-full rounded-full border-2 border-transparent border-t-primary/50 border-r-primary/30" />
        </div>
      </div>
      
      {/* Status text */}
      <div className="mt-2 text-center">
        <p className="text-xs font-mono text-primary animate-pulse">AI Active</p>
      </div>
    </div>
  );
};

export default AIAssistantIndicator;
