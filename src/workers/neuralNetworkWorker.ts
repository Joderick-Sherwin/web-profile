interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
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

    // Initialize nodes
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
      });
    }

    // Change targets periodically
    setInterval(() => {
      nodes.forEach(node => {
        node.targetX = Math.random() * width;
        node.targetY = Math.random() * height;
      });
    }, 8000);
  }

  if (type === 'animate' && ctx && canvas) {
    ctx.fillStyle = "rgba(22, 22, 26, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw nodes
    nodes.forEach((node, i) => {
      const dx = node.targetX - node.x;
      const dy = node.targetY - node.y;
      node.vx = dx * 0.005;
      node.vy = dy * 0.005;
      
      node.x += node.vx;
      node.y += node.vy;

      const pulse = Math.sin((timestamp || 0) * 0.001 + i) * 0.5 + 1.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(79, 209, 255, 1)";
      ctx.fill();

      // Draw connections (optimized: only check forward to avoid duplicates)
      for (let j = i + 1; j < nodes.length; j++) {
        const otherNode = nodes[j];
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        const distanceSq = dx * dx + dy * dy;
        const maxDistanceSq = maxDistance * maxDistance;

        if (distanceSq < maxDistanceSq) {
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

    const imageBitmap = canvas.transferToImageBitmap();
    (self as any).postMessage({ type: 'frame', imageBitmap }, [imageBitmap]);
  }
};
