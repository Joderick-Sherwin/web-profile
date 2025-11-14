import { useEffect, useRef, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NeuralNetwork = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetFps = prefersReducedMotion ? 15 : 30;
    let running = true;

    // Check for OffscreenCanvas support
    const supportsOffscreen = typeof OffscreenCanvas !== 'undefined';
    
    if (supportsOffscreen) {
      // Use Web Worker for better performance
      workerRef.current = new Worker(
        new URL('../workers/neuralNetworkWorker.ts', import.meta.url),
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

      let animationId: number;
      let lastTime = 0;
      const animate = (time: number) => {
        if (!running) return;
        const delta = time - lastTime;
        if (delta >= 1000 / targetFps) {
          if (workerRef.current) {
            workerRef.current.postMessage({
              type: 'animate',
              timestamp: Date.now(),
            });
          }
          lastTime = time;
        }
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);

      const handleVisibility = () => {
        running = !document.hidden;
        if (running) {
          lastTime = 0;
          cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(animate);
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationId);
        document.removeEventListener('visibilitychange', handleVisibility);
        workerRef.current?.terminate();
      };
    } else {
      // Fallback to main thread with optimizations
      const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      interface Node {
        x: number;
        y: number;
        vx: number;
        vy: number;
        targetX: number;
        targetY: number;
        size: number;
        targetSize: number;
        pulsePhase: number;
        connections: number[];
      }

      const nodes: Node[] = [];
      const nodeCount = prefersReducedMotion ? (isMobile ? 12 : 20) : (isMobile ? 18 : 40);
      const maxDistance = isMobile ? 90 : 140;

      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        nodes.push({ 
          x, 
          y, 
          vx: 0, 
          vy: 0, 
          targetX: x, 
          targetY: y,
          size: 1 + Math.random() * 2,
          targetSize: 1 + Math.random() * 3,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
        });
      }

      const changeTargets = () => {
        nodes.forEach(node => {
          node.targetX = Math.random() * canvas.width;
          node.targetY = Math.random() * canvas.height;
          node.targetSize = 1 + Math.random() * 3;
        });
      };

      const targetInterval = setInterval(changeTargets, 6000);

      let lastTime = 0;
      const fps = targetFps;
      const frameDelay = 1000 / fps;

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= frameDelay) {
          ctx.fillStyle = "rgba(22, 22, 26, 0.03)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const time = currentTime * 0.001;

          nodes.forEach((node, i) => {
            // Movement
            const dx = node.targetX - node.x;
            const dy = node.targetY - node.y;
            node.vx = dx * 0.005;
            node.vy = dy * 0.005;
            
            node.x += node.vx;
            node.y += node.vy;

            // Dynamic size animation
            const sizeDiff = node.targetSize - node.size;
            node.size += sizeDiff * 0.02;

            // Pulsing effect
            node.pulsePhase += 0.02;
            const pulse = Math.sin(node.pulsePhase) * 0.5 + 1;
            const breathe = Math.sin(time * 0.5 + i) * 0.3 + 1;
            const finalSize = node.size * pulse * breathe;

            // Update connections
            node.connections = [];
            for (let j = i + 1; j < nodes.length; j++) {
              const otherNode = nodes[j];
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distanceSq = dx * dx + dy * dy;

              if (distanceSq < maxDistance * maxDistance) {
                node.connections.push(j);
              }
            }

            // Draw connections
            node.connections.forEach(j => {
              const otherNode = nodes[j];
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              const baseOpacity = (1 - distance / maxDistance) * 0.7;
              const sizeInfluence = (node.size + otherNode.size) / 6;
              const opacity = baseOpacity * sizeInfluence;
              const lineWidth = 1 + opacity * 2;
              
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              
              const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
              gradient.addColorStop(0, `rgba(79, 209, 255, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(100, 220, 255, ${opacity * 1.2})`);
              gradient.addColorStop(1, `rgba(79, 209, 255, ${opacity})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = lineWidth;
              ctx.stroke();
            });

            // Draw node with glow
            const glowSize = finalSize * 3.5;
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
            gradient.addColorStop(0, "rgba(79, 209, 255, 1)");
            gradient.addColorStop(0.4, "rgba(79, 209, 255, 0.6)");
            gradient.addColorStop(1, "rgba(79, 209, 255, 0)");
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Core node
            ctx.beginPath();
            ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(79, 209, 255, 1)";
            ctx.fill();
            
            // Inner highlight
            ctx.beginPath();
            ctx.arc(node.x - finalSize * 0.3, node.y - finalSize * 0.3, finalSize * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(150, 230, 255, 0.6)";
            ctx.fill();
          });

          lastTime = currentTime;
        }

        requestAnimationFrame(animate);
      };

      animate(0);

      const handleVisibility = () => {
        running = !document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibility);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        clearInterval(targetInterval);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
});

NeuralNetwork.displayName = "NeuralNetwork";

export default NeuralNetwork;
