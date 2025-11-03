import { useEffect, useRef, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NeuralNetwork = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      const animate = () => {
        if (workerRef.current) {
          workerRef.current.postMessage({
            type: 'animate',
            timestamp: Date.now(),
          });
        }
        animationId = requestAnimationFrame(animate);
      };
      
      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationId);
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
      }

      const nodes: Node[] = [];
      const nodeCount = isMobile ? 20 : 50;
      const maxDistance = isMobile ? 100 : 150;

      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        nodes.push({ x, y, vx: 0, vy: 0, targetX: x, targetY: y });
      }

      const changeTargets = () => {
        nodes.forEach(node => {
          node.targetX = Math.random() * canvas.width;
          node.targetY = Math.random() * canvas.height;
        });
      };

      const targetInterval = setInterval(changeTargets, 8000);

      let lastTime = 0;
      const fps = 60;
      const frameDelay = 1000 / fps;

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= frameDelay) {
          ctx.fillStyle = "rgba(22, 22, 26, 0.05)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          nodes.forEach((node, i) => {
            const dx = node.targetX - node.x;
            const dy = node.targetY - node.y;
            node.vx = dx * 0.005;
            node.vy = dy * 0.005;
            
            node.x += node.vx;
            node.y += node.vy;

            const pulse = Math.sin(currentTime * 0.001 + i) * 0.5 + 1.5;
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(79, 209, 255, 1)";
            ctx.fill();

            // Optimized: only check forward connections
            for (let j = i + 1; j < nodes.length; j++) {
              const otherNode = nodes[j];
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distanceSq = dx * dx + dy * dy;

              if (distanceSq < maxDistance * maxDistance) {
                const distance = Math.sqrt(distanceSq);
                const opacity = (1 - distance / maxDistance) * 0.3;
                
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(otherNode.x, otherNode.y);
                ctx.strokeStyle = `rgba(79, 209, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });

          lastTime = currentTime;
        }

        requestAnimationFrame(animate);
      };

      animate(0);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        clearInterval(targetInterval);
      };
    }
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ mixBlendMode: "screen" }}
    />
  );
});

NeuralNetwork.displayName = "NeuralNetwork";

export default NeuralNetwork;
