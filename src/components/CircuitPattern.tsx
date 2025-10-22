const CircuitPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Horizontal lines */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <line x1="100" y1="150" x2="200" y2="150" stroke="currentColor" strokeWidth="1" className="text-secondary" />
            
            {/* Vertical lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" className="text-accent" />
            <line x1="150" y1="100" x2="150" y2="200" stroke="currentColor" strokeWidth="1" className="text-primary" />
            
            {/* Nodes/connection points */}
            <circle cx="50" cy="50" r="3" fill="currentColor" className="text-primary animate-pulse" />
            <circle cx="100" cy="50" r="2" fill="currentColor" className="text-secondary" />
            <circle cx="50" cy="100" r="2" fill="currentColor" className="text-accent" />
            <circle cx="150" cy="150" r="3" fill="currentColor" className="text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
            <circle cx="100" cy="150" r="2" fill="currentColor" className="text-secondary" />
            <circle cx="150" cy="100" r="2" fill="currentColor" className="text-accent" />
            
            {/* Corner connections */}
            <path d="M 50 50 L 100 50" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <path d="M 50 50 L 50 100" stroke="currentColor" strokeWidth="1" className="text-accent" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
};

export default CircuitPattern;
