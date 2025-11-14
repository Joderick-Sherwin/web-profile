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

interface WorkerMessage {
  type: 'init' | 'animate' | 'mousemove';
  width?: number;
  height?: number;
  isMobile?: boolean;
  mouseX?: number;
  mouseY?: number;
}

let particles: Particle[] = [];
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let particleCount = 50; // Reduced from 80
let isMobile = false;
let mouseX = 0;
let mouseY = 0;

const colors = [
  "hsl(200, 95%, 55%)",
  "hsl(270, 60%, 60%)",
  "hsl(280, 70%, 65%)",
];

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, width, height, isMobile: mobile, mouseX: mx, mouseY: my } = e.data;

  if (type === 'init' && width && height) {
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
    particleCount = mobile ? 20 : 50; // Reduced for better performance
    isMobile = mobile || false;

    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }
  }

  if (type === 'mousemove' && mx !== undefined && my !== undefined) {
    mouseX = mx;
    mouseY = my;
  }

  if (type === 'animate' && ctx && canvas) {
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

      if (distanceSq < 22500) { // 150^2
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

      // Draw trail
      particle.trail.forEach((point, index) => {
        const trailOpacity = (index / particle.trail.length) * 0.5;
        const trailSize = particle.size * (index / particle.trail.length);
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${trailOpacity})`).replace("hsl", "hsla");
        ctx.fill();
      });

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace(")", `, ${particle.opacity})`).replace("hsl", "hsla");
      ctx.fill();

      particle.trail = particle.trail.map(point => ({
        ...point,
        opacity: point.opacity * 0.95
      }));
    });

    const imageBitmap = canvas.transferToImageBitmap();
    (self as any).postMessage({ type: 'frame', imageBitmap }, [imageBitmap]);
  }
};
