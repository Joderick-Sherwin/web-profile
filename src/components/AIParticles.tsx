import { useEffect, useRef, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const AIParticles = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const supportsOffscreen = typeof OffscreenCanvas !== 'undefined';
    
    if (supportsOffscreen) {
      workerRef.current = new Worker(
        new URL('../workers/particlesWorker.ts', import.meta.url),
        { type: 'module' }
      );

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (workerRef.current) {
          workerRef.current.postMessage({
            type: 'init',
            width: canvas.width,
            height: canvas.height,
            isMobile,
          });
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const ctx = canvas.getContext('bitmaprenderer');
      
      workerRef.current.onmessage = (e) => {
        if (e.data.type === 'frame' && ctx) {
          ctx.transferFromImageBitmap(e.data.imageBitmap);
        }
      };

      let throttleTimeout = 0;
      const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        
        const now = Date.now();
        if (now - throttleTimeout > (isMobile ? 50 : 16)) {
          workerRef.current?.postMessage({
            type: 'mousemove',
            mouseX: e.clientX,
            mouseY: e.clientY,
          });
          throttleTimeout = now;
        }
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      let animationId: number;
      const animate = () => {
        workerRef.current?.postMessage({ type: 'animate' });
        animationId = requestAnimationFrame(animate);
      };
      
      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animationId);
        workerRef.current?.terminate();
      };
    } else {
      // Fallback with optimizations
      const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      interface Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        color: string;
        trail: Array<{ x: number; y: number; opacity: number }>;
      }

      const particles: Particle[] = [];
      const particleCount = isMobile ? 30 : 80;
      const colors = ["hsl(200, 95%, 55%)", "hsl(270, 60%, 60%)", "hsl(280, 70%, 65%)"];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
        });
      }

      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      let lastTime = 0;
      const fps = 60;
      const frameDelay = 1000 / fps;

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= frameDelay) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((particle) => {
            particle.trail.push({ x: particle.x, y: particle.y, opacity: 0.8 });
            
            const maxTrailLength = isMobile ? 5 : 10;
            if (particle.trail.length > maxTrailLength) {
              particle.trail.shift();
            }

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < 22500) {
              const distance = Math.sqrt(distanceSq);
              const force = (150 - distance) / 150;
              particle.x -= (dx / distance) * force * 3;
              particle.y -= (dy / distance) * force * 3;
            }

            if (particle.x < 0 || particle.x > canvas.width) {
              particle.speedX *= -1;
              particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > canvas.height) {
              particle.speedY *= -1;
              particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }

            particle.trail.forEach((point, index) => {
              const trailOpacity = (index / particle.trail.length) * 0.5;
              const trailSize = particle.size * (index / particle.trail.length);
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
              ctx.fillStyle = particle.color.replace(")", `, ${trailOpacity})`).replace("hsl", "hsla");
              ctx.fill();
            });

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(")", `, ${particle.opacity})`).replace("hsl", "hsla");
            ctx.fill();

            particle.trail = particle.trail.map(point => ({
              ...point,
              opacity: point.opacity * 0.95
            }));
          });

          lastTime = currentTime;
        }

        requestAnimationFrame(animate);
      };

      animate(0);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
});

AIParticles.displayName = "AIParticles";

export default AIParticles;
