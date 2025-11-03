import { useEffect, useRef, memo, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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

const AIParticles = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

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

    const particles: Particle[] = [];
    const particleCount = isMobile ? 30 : 80; // Reduce on mobile
    const colors = [
      "hsl(200, 95%, 55%)",  // primary
      "hsl(270, 60%, 60%)",  // secondary
      "hsl(280, 70%, 65%)",  // accent
    ];

    // Initialize particles
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
    let mouseMoveTimeout: number;

    // Throttle mouse events on mobile
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) {
        if (mouseMoveTimeout) return;
        mouseMoveTimeout = window.setTimeout(() => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          mouseMoveTimeout = 0;
        }, 50);
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Add current position to trail (shorter on mobile)
        particle.trail.push({ x: particle.x, y: particle.y, opacity: 0.8 });
        
        // Limit trail length
        const maxTrailLength = isMobile ? 5 : 10;
        if (particle.trail.length > maxTrailLength) {
          particle.trail.shift();
        }

        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction - stronger attraction/repulsion
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.x -= (dx / distance) * force * 3;
          particle.y -= (dy / distance) * force * 3;
        }

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw trail with glowing effect (reduced on mobile)
        particle.trail.forEach((point, index) => {
          const trailOpacity = (index / particle.trail.length) * 0.5;
          const trailSize = particle.size * (index / particle.trail.length);
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(")", `, ${trailOpacity})`).replace("hsl", "hsla");
          if (!isMobile) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color;
          }
          ctx.fill();
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${particle.opacity})`).replace("hsl", "hsla");
        if (!isMobile) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = particle.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Update trail opacities
        particle.trail = particle.trail.map(point => ({
          ...point,
          opacity: point.opacity * 0.95
        }));
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
