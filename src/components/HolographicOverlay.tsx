import { useEffect, useState } from "react";

const HolographicOverlay = () => {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Scanning line effect */}
      <div
        className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_20px_rgba(79,209,255,0.8)]"
        style={{
          top: `${scanPosition}%`,
          transition: "top 0.02s linear",
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
};

export default HolographicOverlay;
