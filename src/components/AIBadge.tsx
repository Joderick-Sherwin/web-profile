import { Brain } from "lucide-react";

const AIBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
      <Brain className="h-4 w-4 text-primary animate-pulse" />
      <span className="text-sm font-semibold text-primary">AI Powered</span>
      <div className="flex gap-1">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
};

export default AIBadge;
