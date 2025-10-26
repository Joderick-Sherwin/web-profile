import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
  pulseSpeed: number;
}

const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

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

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const nodes: Node[] = [];
    const nodeCount = 60;
    const maxDistance = 150;
    const hoverDistance = 100;

    // Initialize nodes with pulse properties
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(22, 22, 26, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update pulse
        node.pulse += node.pulseSpeed;
        const pulseSize = 2 + Math.sin(node.pulse) * 1.5;

        // Scroll effect - nodes drift with scroll
        const scrollEffect = Math.sin(scrollY * 0.01 + i) * 0.2;
        node.x += node.vx + scrollEffect;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Check hover distance
        const mouseDistance = Math.sqrt(
          Math.pow(node.x - mousePos.x, 2) + Math.pow(node.y - mousePos.y, 2)
        );
        const isHovered = mouseDistance < hoverDistance;

        // Draw node with glow effect
        const nodeSize = isHovered ? pulseSize * 1.5 : pulseSize;
        const glowIntensity = isHovered ? 20 : 10;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowIntensity);
        gradient.addColorStop(0, isHovered ? "rgba(79, 209, 255, 0.8)" : "rgba(79, 209, 255, 0.4)");
        gradient.addColorStop(1, "rgba(79, 209, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowIntensity, 0, Math.PI * 2);
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? "hsl(200, 100%, 70%)" : "hsl(200, 95%, 55%)";
        ctx.fill();

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;

          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            const lineWidth = isHovered || mouseDistance < hoverDistance ? 2 : 1;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = isHovered 
              ? `rgba(79, 209, 255, ${opacity * 0.6})` 
              : `rgba(79, 209, 255, ${opacity * 0.3})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mousePos, scrollY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default NeuralNetwork;
