import { createContext, useContext, useState, ReactNode } from "react";

interface AIContextType {
  isAIActive: boolean;
  isTransitioning: boolean;
  toggleAI: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [isAIActive, setIsAIActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleAI = () => {
    setIsTransitioning(true);
    
    // Wait for door to close, then switch theme
    setTimeout(() => {
      setIsAIActive(prev => !prev);
      
      // Add/remove AI theme class to body
      if (!isAIActive) {
        document.body.classList.add('ai-activated');
      } else {
        document.body.classList.remove('ai-activated');
      }
    }, 1000);
    
    // End transition after door opens
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);
  };

  return (
    <AIContext.Provider value={{ isAIActive, isTransitioning, toggleAI }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
