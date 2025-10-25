import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { useAI } from "@/contexts/AIContext";

const AITransition = () => {
  const { isTransitioning } = useAI();
  const [showGear, setShowGear] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      // Show gear after door starts closing
      setTimeout(() => setShowGear(true), 400);
      // Hide gear before door opens
      setTimeout(() => setShowGear(false), 1600);
    }
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top garage door panel */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-background via-card to-card/95 border-b-4 border-primary/30 garage-door-close">
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-border/50"
              style={{ height: '8.33%', marginTop: i === 0 ? '0' : '0' }}
            />
          ))}
        </div>
      </div>

      {/* Bottom garage door panel */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-card to-card/95 border-t-4 border-primary/30 garage-door-close-bottom">
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-full border-t border-border/50"
              style={{ height: '8.33%', marginBottom: i === 0 ? '0' : '0' }}
            />
          ))}
        </div>
      </div>

      {/* Rotating gear in center */}
      {showGear && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Settings className="w-24 h-24 text-primary animate-spin" style={{ animationDuration: '1s' }} />
            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AITransition;
