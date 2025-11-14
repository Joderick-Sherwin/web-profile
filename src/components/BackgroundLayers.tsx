import { memo } from 'react';
import { useParallax } from '@/hooks/use-parallax';
import NeuralNetwork from './NeuralNetwork';
import CircuitPattern from './CircuitPattern';
import AIParticles from './AIParticles';

const BackgroundLayers = memo(() => {
  // Slightly reduced parallax speeds to prevent excessive drift
  const parallaxSlow = useParallax(0.1);
  const parallaxMedium = useParallax(0.25);
  const parallaxFast = useParallax(0.35);

  // Clamp helper to keep layers centered and avoid large movement
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const clampedSlow = clamp(parallaxSlow, -80, 80);
  const clampedMedium = clamp(parallaxMedium, -120, 120);
  const clampedFast = clamp(parallaxFast, -160, 160);

  // Subtle depth via scale based on parallax offset
  const scaleSlow = 1 + Math.abs(clampedSlow) / 2000;
  const scaleMedium = 1 + Math.abs(clampedMedium) / 2500;
  const scaleFast = 1 + Math.abs(clampedFast) / 3000;

  return (
    <>
      {/* Fixed gradient base */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]" />
      
      {/* Slow parallax layer - Neural Network (kept centered with clamp) */}
      <div 
        className="fixed inset-0"
        style={{ 
          transform: `translate3d(0, ${clampedSlow}px, 0) scale(${scaleSlow})`,
          willChange: 'transform'
        }}
      >
        <NeuralNetwork />
      </div>

      {/* Medium parallax layer - Circuit Pattern */}
      <div 
        className="fixed inset-0"
        style={{ 
          transform: `translate3d(0, ${clampedMedium}px, 0) scale(${scaleMedium})`,
          willChange: 'transform'
        }}
      >
        <CircuitPattern />
      </div>

      {/* Fast parallax layer - Particles */}
      <div 
        className="fixed inset-0"
        style={{ 
          transform: `translate3d(0, ${clampedFast}px, 0) scale(${scaleFast})`,
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
