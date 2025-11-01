import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectNode {
  id: number;
  title: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  technologies: string[];
  expanded: boolean;
  targetExpanded: boolean;
  expansionProgress: number;
}

const projects = [
  { title: "TerraDefender", technologies: ["Python", "TensorFlow", "Keras", "OpenCV"], color: "hsl(200, 95%, 55%)" },
  { title: "Analyst System", technologies: ["Python", "Scikit-learn", "Pandas", "Flask"], color: "hsl(270, 60%, 60%)" },
  { title: "Animoji", technologies: ["Python", "OpenCV", "MediaPipe"], color: "hsl(280, 70%, 65%)" },
  { title: "WraithCast", technologies: ["Python", "Computer Vision"], color: "hsl(200, 95%, 55%)" },
  { title: "RAG Project", technologies: ["Python", "NLP", "LLMs"], color: "hsl(270, 60%, 60%)" },
  { title: "Mental Health Bot", technologies: ["Python", "NLP"], color: "hsl(280, 70%, 65%)" },
  { title: "Speech to Text", technologies: ["Python", "PyQt5"], color: "hsl(200, 95%, 55%)" },
];

const ProjectsNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const animationFrameRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Don't start animation until visible
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const nodes: ProjectNode[] = projects.map((project, i) => {
      const angle = (i / projects.length) * Math.PI * 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      return {
        id: i,
        title: project.title,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: project.color,
        technologies: project.technologies,
        expanded: false,
        targetExpanded: false,
        expansionProgress: 0,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      let foundHover = false;
      nodes.forEach(node => {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
        const hoverRadius = 60 + (node.expanded ? node.technologies.length * 15 : 0);
        if (distance < hoverRadius) {
          setHoveredNode(node.id);
          node.targetExpanded = true;
          foundHover = true;
        } else {
          node.targetExpanded = false;
        }
      });
      if (!foundHover) setHoveredNode(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    let lastTime = 0;
    const frameDelay = isMobile ? 1000 / 20 : 1000 / 60; // 20fps on mobile, 60fps on desktop

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameDelay) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      ctx.fillStyle = "rgba(22, 22, 26, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply forces to nodes (simplified on mobile)
      nodes.forEach((node, i) => {
        // Smooth expansion animation
        if (node.targetExpanded && node.expansionProgress < 1) {
          node.expansionProgress = Math.min(1, node.expansionProgress + 0.1);
          node.expanded = node.expansionProgress > 0.5;
        } else if (!node.targetExpanded && node.expansionProgress > 0) {
          node.expansionProgress = Math.max(0, node.expansionProgress - 0.1);
          node.expanded = node.expansionProgress > 0.5;
        }

        if (!isMobile) {
          // Mouse repulsion force (desktop only)
          const dx = node.x - mousePos.x;
          const dy = node.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150 && distance > 0) {
            const force = (150 - distance) / 150;
            node.vx += (dx / distance) * force * 0.5;
            node.vy += (dy / distance) * force * 0.5;
          }

          // Node-to-node repulsion (desktop only)
          nodes.forEach((otherNode, j) => {
            if (i === j) return;
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100 && distance > 0) {
              const force = (100 - distance) / 1000;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          });

          // Spring force to center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const toCenterX = centerX - node.x;
          const toCenterY = centerY - node.y;
          node.vx += toCenterX * 0.0002;
          node.vy += toCenterY * 0.0002;

          // Apply velocity with damping
          node.vx *= 0.95;
          node.vy *= 0.95;
          node.x += node.vx;
          node.y += node.vy;

          // Keep nodes within bounds
          const padding = 60;
          if (node.x < padding) { node.x = padding; node.vx *= -0.5; }
          if (node.x > canvas.width - padding) { node.x = canvas.width - padding; node.vx *= -0.5; }
          if (node.y < padding) { node.y = padding; node.vy *= -0.5; }
          if (node.y > canvas.height - padding) { node.y = canvas.height - padding; node.vy *= -0.5; }
        }
      });

      // Draw inter-project connections (skip on mobile for performance)
      if (!isMobile && !nodes.some(n => n.expanded)) {
        nodes.forEach((node, i) => {
          nodes.forEach((otherNode, j) => {
            if (i >= j) return;
            const sharedTech = node.technologies.filter(tech =>
              otherNode.technologies.includes(tech)
            );
            if (sharedTech.length > 0) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.strokeStyle = `hsla(var(--primary), ${0.1 * sharedTech.length / 5})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });
      }

      // Draw neural networks for each project
      nodes.forEach(node => {
        const progress = node.expansionProgress;
        
        // Neural network structure
        const inputLayerSize = 1;
        const hiddenLayerSize = node.technologies.length;
        const outputLayerSize = 1;
        
        const baseRadius = 20;
        const nodeRadius = 8;
        const layerSpacing = 80 * (1 + progress * 1.5);
        
        // Input layer (project name)
        const inputY = node.y;
        const inputNode = { x: node.x - layerSpacing, y: inputY };
        
        // Hidden layer (technologies) - expanded when hovered
        const hiddenNodes = node.technologies.map((tech, i) => {
          const angleSpread = progress * Math.PI * 0.6;
          const angle = (i - (hiddenLayerSize - 1) / 2) * (angleSpread / Math.max(hiddenLayerSize - 1, 1));
          const spread = progress * 60;
          return {
            x: node.x,
            y: node.y + Math.sin(angle) * spread,
            tech
          };
        });
        
        // Output layer
        const outputNode = { x: node.x + layerSpacing, y: node.y };
        
        // Draw connections
        ctx.strokeStyle = node.color.replace(")", ", 0.3)").replace("hsl", "hsla");
        ctx.lineWidth = 1.5;
        
        // Input to hidden
        hiddenNodes.forEach(hidden => {
          ctx.beginPath();
          ctx.moveTo(inputNode.x, inputNode.y);
          ctx.lineTo(hidden.x, hidden.y);
          ctx.stroke();
        });
        
        // Hidden to output
        hiddenNodes.forEach(hidden => {
          ctx.beginPath();
          ctx.moveTo(hidden.x, hidden.y);
          ctx.lineTo(outputNode.x, outputNode.y);
          ctx.stroke();
        });
        
        // Draw input node
        ctx.beginPath();
        ctx.arc(inputNode.x, inputNode.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw hidden layer nodes
        hiddenNodes.forEach(hidden => {
          ctx.beginPath();
          ctx.arc(hidden.x, hidden.y, nodeRadius * (1 + progress * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowBlur = 8 + progress * 6;
          ctx.shadowColor = node.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Draw technology label when expanded
          if (progress > 0.3) {
            ctx.fillStyle = `rgba(255, 255, 255, ${progress})`;
            ctx.font = "10px monospace";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(hidden.tech, hidden.x - 15, hidden.y);
          }
        });
        
        // Draw output node
        ctx.beginPath();
        ctx.arc(outputNode.x, outputNode.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw project title at center
        ctx.fillStyle = "white";
        ctx.font = progress > 0.5 ? "bold 14px sans-serif" : "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        const words = node.title.split(" ");
        words.forEach((word, i) => {
          ctx.fillText(word, node.x, node.y + (i - words.length / 2 + 0.5) * 16);
        });
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hoveredNode, mousePos.x, mousePos.y, isMobile, isVisible]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isMobile ? 'h-[400px]' : 'h-[600px]'} card-glass ai-border rounded-2xl overflow-hidden`}
    >
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">Loading network graph...</div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-primary">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-semibold">Project Network Graph</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        {isMobile ? 'Tap to explore' : 'Nodes connected by shared technologies • Hover to explore'}
      </div>
    </div>
  );
};

export default ProjectsNetwork;
