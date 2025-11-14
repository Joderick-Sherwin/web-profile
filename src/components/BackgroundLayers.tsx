import { memo } from 'react';
import { useParallax } from '@/hooks/use-parallax';
import NeuralNetwork from './NeuralNetwork';
import CircuitPattern from './CircuitPattern';
import AIParticles from './AIParticles';

const BackgroundLayers = memo(() => {
  const parallaxSlow = useParallax(0.2);
  const parallaxMedium = useParallax(0.4);
  const parallaxFast = useParallax(0.6);

  return (
    <>
      {/* Fixed gradient base */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]" />
      
      {/* Slow parallax layer - Neural Network */}
      <div 
        className="fixed inset-0"
        style={{ 
          transform: `translateY(${parallaxSlow}px)`,
          willChange: 'transform'
        }}
      >
        <NeuralNetwork />
      </div>

      {/* Medium parallax layer - Circuit Pattern */}
      <div 
        className="fixed inset-0"
        style={{ 
          transform: `translateY(${parallaxMedium}px)`,
          willChange: 'transform'
        }}
      >
        <CircuitPattern />
      </div>

      {/* Fast parallax layer - Particles */}
      <div 
        className="fixed inset-0"
        style={{ 
          transform: `translateY(${parallaxFast}px)`,
          willChange: 'transform'
        }}
      >
        <AIParticles />
      </div>
    </>
  );
});

BackgroundLayers.displayName = 'BackgroundLayers';

export default BackgroundLayers;
