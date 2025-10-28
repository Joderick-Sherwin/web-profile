import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface ProjectNode {
  id: number;
  title: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  technologies: string[];
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

  useEffect(() => {
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
        radius: 35,
        color: project.color,
        technologies: project.technologies,
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
        if (distance < node.radius) {
          setHoveredNode(node.id);
          foundHover = true;
        }
      });
      if (!foundHover) setHoveredNode(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(22, 22, 26, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply forces to nodes
      nodes.forEach((node, i) => {
        // Mouse repulsion force
        const dx = node.x - mousePos.x;
        const dy = node.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150;
          node.vx += (dx / distance) * force * 0.5;
          node.vy += (dy / distance) * force * 0.5;
        }

        // Node-to-node repulsion
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
      });

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i >= j) return;

          const sharedTech = node.technologies.filter(tech =>
            otherNode.technologies.includes(tech)
          );

          if (sharedTech.length > 0) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const isConnected = hoveredNode === i || hoveredNode === j;
            const opacity = (sharedTech.length / 5) * (isConnected ? 1 : 0.5);

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `hsla(var(--primary), ${opacity})`;
            ctx.lineWidth = isConnected ? 3 : 1.5;
            ctx.stroke();

            if (isConnected) {
              const midX = (node.x + otherNode.x) / 2;
              const midY = (node.y + otherNode.y) / 2;
              ctx.fillStyle = "hsla(var(--primary), 0.9)";
              ctx.font = "11px monospace";
              ctx.textAlign = "center";
              ctx.fillText(sharedTech.join(", "), midX, midY);
            }
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode === node.id;
        const size = isHovered ? node.radius * 1.4 : node.radius;

        // Draw glow
        if (isHovered) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size + 20);
          gradient.addColorStop(0, node.color.replace(")", ", 0.8)").replace("hsl", "hsla"));
          gradient.addColorStop(1, node.color.replace(")", ", 0)").replace("hsl", "hsla"));
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 20, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = isHovered ? 15 : 5;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        // Draw title
        ctx.fillStyle = "white";
        ctx.font = isHovered ? "bold 13px sans-serif" : "11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        const words = node.title.split(" ");
        words.forEach((word, i) => {
          ctx.fillText(word, node.x, node.y + (i - words.length / 2 + 0.5) * 15);
        });
        ctx.shadowBlur = 0;

        if (isHovered) {
          ctx.font = "10px monospace";
          ctx.fillStyle = node.color;
          ctx.fillText(`${node.technologies.length} technologies`, node.x, node.y + size + 25);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hoveredNode, mousePos.x, mousePos.y]);

  return (
    <div className="relative w-full h-[600px] card-glass ai-border rounded-2xl overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-primary">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-semibold">Project Network Graph</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        Nodes connected by shared technologies • Hover to explore
      </div>
    </div>
  );
};

export default ProjectsNetwork;
