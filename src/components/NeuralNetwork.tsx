import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const nodes: Node[] = [];
    const nodeCount = 50;
    const maxDistance = 150;

    // Initialize nodes with target positions
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
      });
    }

    // Change targets periodically for smooth architecture changes
    const changeTargets = () => {
      nodes.forEach(node => {
        node.targetX = Math.random() * canvas.width;
        node.targetY = Math.random() * canvas.height;
      });
    };

    const targetInterval = setInterval(changeTargets, 8000);

    const animate = () => {
      ctx.fillStyle = "rgba(22, 22, 26, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes with smooth transitions
      nodes.forEach((node, i) => {
        // Smoothly move towards target position
        const dx = node.targetX - node.x;
        const dy = node.targetY - node.y;
        node.vx = dx * 0.005;
        node.vy = dy * 0.005;
        
        node.x += node.vx;
        node.y += node.vy;

        // Draw node with subtle pulsing
        const pulse = Math.sin(Date.now() * 0.001 + i) * 0.5 + 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(var(--primary))";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "hsl(var(--primary))";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;

          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(79, 209, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(targetInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default NeuralNetwork;
