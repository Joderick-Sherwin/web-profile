import { createContext, useContext, useState, ReactNode } from "react";

interface AIContextType {
  isAIActive: boolean;
  toggleAI: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [isAIActive, setIsAIActive] = useState(false);

  const toggleAI = () => {
    setIsAIActive(prev => !prev);
    
    // Add AI theme class to body
    if (!isAIActive) {
      document.body.classList.add('ai-activated');
    } else {
      document.body.classList.remove('ai-activated');
    }
  };

  return (
    <AIContext.Provider value={{ isAIActive, toggleAI }}>
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
