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
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 30,
        color: project.color,
        technologies: project.technologies,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      // Check if hovering over a node
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
      ctx.fillStyle = "rgba(22, 22, 26, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections based on shared technologies
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
            const opacity = sharedTech.length / 5;

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(79, 209, 255, ${opacity * 0.4})`;
            ctx.lineWidth = hoveredNode === i || hoveredNode === j ? 3 : 1.5;
            ctx.stroke();

            // Draw shared tech label at midpoint
            if (hoveredNode === i || hoveredNode === j) {
              const midX = (node.x + otherNode.x) / 2;
              const midY = (node.y + otherNode.y) / 2;
              ctx.fillStyle = "rgba(79, 209, 255, 0.8)";
              ctx.font = "10px monospace";
              ctx.fillText(sharedTech[0], midX, midY);
            }
          }
        });
      });

      // Update and draw nodes
      nodes.forEach(node => {
        // Gentle floating motion
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        const padding = 50;
        if (node.x < padding || node.x > canvas.width - padding) node.vx *= -1;
        if (node.y < padding || node.y > canvas.height - padding) node.vy *= -1;

        const isHovered = hoveredNode === node.id;
        const size = isHovered ? node.radius * 1.3 : node.radius;

        // Draw glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size + 10);
        gradient.addColorStop(0, node.color.replace(")", ", 0.6)").replace("hsl", "hsla"));
        gradient.addColorStop(1, node.color.replace(")", ", 0)").replace("hsl", "hsla"));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw title
        ctx.fillStyle = "white";
        ctx.font = isHovered ? "bold 14px sans-serif" : "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const words = node.title.split(" ");
        words.forEach((word, i) => {
          ctx.fillText(word, node.x, node.y + (i - words.length / 2 + 0.5) * 16);
        });

        // Show tech count on hover
        if (isHovered) {
          ctx.font = "10px monospace";
          ctx.fillStyle = "rgba(79, 209, 255, 1)";
          ctx.fillText(`${node.technologies.length} techs`, node.x, node.y + size + 20);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hoveredNode]);

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
