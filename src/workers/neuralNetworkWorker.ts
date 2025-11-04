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

interface WorkerMessage {
  type: 'init' | 'animate';
  width?: number;
  height?: number;
  isMobile?: boolean;
  timestamp?: number;
}

let nodes: Node[] = [];
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let nodeCount = 50;
let maxDistance = 150;
let animationId: number | null = null;

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, width, height, isMobile, timestamp } = e.data;

  if (type === 'init' && width && height) {
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
    nodeCount = isMobile ? 20 : 50;
    maxDistance = isMobile ? 100 : 150;

    // Initialize nodes with dynamic properties
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
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

    // Dynamic behavior changes
    setInterval(() => {
      nodes.forEach(node => {
        node.targetX = Math.random() * width;
        node.targetY = Math.random() * height;
        node.targetSize = 1 + Math.random() * 3;
      });
    }, 6000);
  }

  if (type === 'animate' && ctx && canvas) {
    ctx.fillStyle = "rgba(22, 22, 26, 0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = (timestamp || 0) * 0.001;

    // Update and draw nodes with dynamic sizing
    nodes.forEach((node, i) => {
      // Movement
      const dx = node.targetX - node.x;
      const dy = node.targetY - node.y;
      node.vx = dx * 0.005;
      node.vy = dy * 0.005;
      
      node.x += node.vx;
      node.y += node.vy;

      // Dynamic size animation (grow/shrink)
      const sizeDiff = node.targetSize - node.size;
      node.size += sizeDiff * 0.02;

      // Pulsing effect
      node.pulsePhase += 0.02;
      const pulse = Math.sin(node.pulsePhase) * 0.5 + 1;
      const breathe = Math.sin(time * 0.5 + i) * 0.3 + 1;
      const finalSize = node.size * pulse * breathe;

      // Update connections dynamically
      node.connections = [];
      for (let j = i + 1; j < nodes.length; j++) {
        const otherNode = nodes[j];
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        const distanceSq = dx * dx + dy * dy;
        const maxDistanceSq = maxDistance * maxDistance;

        if (distanceSq < maxDistanceSq) {
          node.connections.push(j);
        }
      }

      // Draw connections with dynamic opacity
      node.connections.forEach(j => {
        const otherNode = nodes[j];
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Connection strength based on distance and node sizes
        const baseOpacity = (1 - distance / maxDistance) * 0.7;
        const sizeInfluence = (node.size + otherNode.size) / 6;
        const opacity = baseOpacity * sizeInfluence;
        
        // Dynamic line width based on connection strength
        const lineWidth = 1 + opacity * 2;
        
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(otherNode.x, otherNode.y);
        
        // Gradient line for more depth
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

    const imageBitmap = canvas.transferToImageBitmap();
    (self as any).postMessage({ type: 'frame', imageBitmap }, [imageBitmap]);
  }
};
