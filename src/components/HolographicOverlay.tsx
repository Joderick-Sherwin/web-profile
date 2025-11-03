import { useEffect, useRef, memo } from "react";

const HolographicOverlay = memo(() => {
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let position = 0;
    let animationFrameId: number;

    const animate = () => {
      position = (position + 0.5) % 100;
      if (scanLineRef.current) {
        scanLineRef.current.style.top = `${position}%`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Scanning line effect */}
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_20px_rgba(79,209,255,0.8)]"
        style={{
          top: "0%",
          willChange: "top",
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/40" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/40" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/40" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/40" />
    </div>
  );
});

HolographicOverlay.displayName = "HolographicOverlay";

export default HolographicOverlay;
