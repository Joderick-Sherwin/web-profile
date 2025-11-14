import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { toast } from "sonner";
import ProjectsNetwork from "./ProjectsNetwork";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntersectionObserver, useVisibilityState } from "@/hooks/use-parallax";

const projects = [
  {
    title: "TerraDefender - Military IPB System",
    description: "Engineered a Deep Learning-based system for analyzing terrain, infrastructure, and environmental conditions from aerial and satellite imagery.",
    readOutDetails: "TerraDefender is a military intelligence preparation system I engineered using deep learning. It analyzes terrain, infrastructure, and environmental conditions from aerial and satellite imagery. The system uses advanced neural networks for terrain classification and building extraction, with multithreading for optimized processing. It generates geospatially accurate enhanced maps that support military operations.",
    highlights: [
      "Built models for terrain classification and building extraction",
      "Implemented multithreading for optimized processing",
      "Generated geospatially accurate DL-enhanced maps"
    ],
    technologies: ["Python", "TensorFlow", "Keras", "OpenCV", "Flask"]
  },
  {
    title: "Analyst Recommendation System",
    description: "Developed an AI-driven recommendation system to match analysts with projects based on expertise, performance, and task context.",
    readOutDetails: "This is an AI-driven recommendation system I developed to intelligently match analysts with projects. It considers their expertise, past performance, and the specific context of each task. Using machine learning algorithms, it automates the analyst selection process and provides dynamic real-time recommendations, significantly improving project efficiency and analyst utilization.",
    highlights: [
      "Utilized ML algorithms for optimal assignments",
      "Automated analyst selection process",
      "Supports dynamic real-time recommendations"
    ],
    technologies: ["Python", "Scikit-learn", "Pandas", "Flask", "SQL"]
  },
  {
    title: "Animoji Simulation Project",
    description: "Developed a real-time facial tracking system using computer vision to replicate user expressions on 3D animated characters.",
    readOutDetails: "The Animoji Simulation Project is a real-time facial tracking system I built using computer vision. It captures user expressions and replicates them on 3D animated characters instantly. Using OpenCV and MediaPipe, it tracks facial movements with high precision, enabling interactive personalized animations. This technology has applications in messaging platforms, gaming, and virtual communication.",
    highlights: [
      "RReal-time 3D wireframe rendering",
      "Preserves anonymity and identity",
      "Useful in legal and security applications"
    ],
    technologies: ["Python", "OpenCV", "MediaPipe"]
  },
  {
    title: "Project WraithCast",
    description: "A real-time wireframe camera system that captures 3D skeletal and facial expressions while preserving user anonymity.",
    readOutDetails: "Project WraithCast is a real-time wireframe camera system that captures and renders skeletal 3D structures and facial expressions while maintaining anonymity. It combines depth sensing and expression tracking to visualize human motion and emotion without revealing identity. This makes it ideal for use in criminal case proceedings, witness protection, and privacy-preserving surveillance or analysis.",
    highlights: [
      "High-speed imaging with depth-sensing technology",
      "Optimized for rapid rendering and streaming",
      "Ideal for terrain analysis and AR simulations"
    ],
    technologies: ["Python", "Computer Vision", "MediaPipe", "Real-time Processing"]
  },
  {
    title: "RAG Project",
    description: "Combines document retrieval with generative AI models to provide highly accurate and context-aware responses.",
    readOutDetails: "This RAG project implements a Retrieval Augmented Generation system that combines document retrieval with generative AI models. It uses vector databases to find relevant information and feeds it to large language models for highly accurate, context-aware responses. This hybrid approach significantly improves AI output reliability and relevance, making it perfect for enterprise question-answering systems and knowledge management platforms.",
    highlights: [
      "Hybrid retrieval and generation approach",
      "Improved AI output reliability and relevance",
      "Suitable for enterprise Q&A and knowledge management"
    ],
    technologies: ["Python", "NLP", "Vector Databases", "LLMs", "RAG Architecture"]
  },
  {
    title: "Mental Health Chatbot",
    description: "Uses natural language processing to provide empathetic support and mental health assistance to users.",
    readOutDetails: "The Mental Health Chatbot is a compassionate AI system I developed using natural language processing. It detects emotional cues in user messages and responds with appropriate empathy and support. The chatbot provides evidence-based coping strategies and self-help guidance while maintaining a privacy-focused design for sensitive conversations. It uses sentiment analysis to understand user emotional states and adapt responses accordingly.",
    highlights: [
      "Detects emotional cues and responds appropriately",
      "Provides coping strategies and self-help guidance",
      "Privacy-focused design for sensitive conversations"
    ],
    technologies: ["Python", "NLP", "Sentiment Analysis", "Chatbot Framework"]
  },
  {
    title: "Speech to Text Converter",
    description: "A PyQt5-based application that transcribes spoken language into written text with high accuracy.",
    readOutDetails: "This Speech to Text Converter is a desktop application I built using PyQt5 that transcribes spoken language into written text with high accuracy. It features real-time audio recording and playback, along with waveform visualization for monitoring audio quality. The user-friendly interface makes voice transcription accessible and efficient, utilizing advanced speech recognition algorithms for reliable text conversion.",
    highlights: [
      "Real-time audio recording and playback",
      "Waveform visualization for audio monitoring",
      "User-friendly interface for voice transcription"
    ],
    technologies: ["Python", "PyQt5", "Speech Recognition", "Audio Processing"]
  }
];

type Project = (typeof projects)[number];

interface ProjectCardProps {
  project: Project;
  index: number;
  isAIActive: boolean;
  isMobile: boolean;
  onSpeak: (project: Project) => void;
}

const ProjectCard = ({ project, index, isAIActive, isMobile, onSpeak }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isCardVisible = useIntersectionObserver(cardRef, { threshold: 0.2, rootMargin: '150px' });

  return (
    <div
      ref={cardRef}
      onClick={() => onSpeak(project)}
      className={`card-glass ai-border rounded-2xl p-6 sm:p-8 shadow-card transition-all duration-700 group flex flex-col relative overflow-hidden ${
        isCardVisible ? "animate-scale-in" : "animate-scale-out"
      } ${isAIActive ? "cursor-pointer" : ""} ${!isMobile ? "hover:shadow-glow" : ""}`}
      style={{
        animationDelay: `${0.15 + index * 0.08}s`,
        perspective: "1000px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        contentVisibility: isCardVisible ? 'visible' : 'auto',
        containIntrinsicSize: '400px',
      }}
      onMouseMove={(e) => {
        if (isMobile) return;
        const el = e.currentTarget as HTMLDivElement;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 6;
        const rotateX = -((y - centerY) / centerY) * 6;
        el.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        el.style.setProperty('--px', `${x}px`);
        el.style.setProperty('--py', `${y}px`);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = 'rotateY(0deg) rotateX(0deg)';
      }}
    >
      {/* AI sparkle indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </div>

      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animation: "holographic-scan 2s linear infinite" }} />
      {/* Interactive neural glow following cursor */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              `radial-gradient(600px circle at var(--px) var(--py), hsl(var(--primary) / 0.18), transparent 40%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      <h3 className={`text-xl sm:text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300 ${isCardVisible ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ animationDelay: `${0.2 + index * 0.08}s` }}>
        {project.title}
      </h3>

      <p className={`text-sm sm:text-base text-foreground/80 mb-6 leading-relaxed flex-grow ${isCardVisible ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ animationDelay: `${0.28 + index * 0.08}s` }}>
        {project.description}
      </p>

      <div className={`mb-6 ${isCardVisible ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ animationDelay: `${0.36 + index * 0.08}s` }}>
        <h4 className="text-sm font-semibold text-secondary mb-3">Key Highlights:</h4>
        <ul className="space-y-2">
          {project.highlights.map((highlight, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-foreground/70">
              <span className="text-primary mt-0.5">▹</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`flex flex-wrap gap-2 mb-6 ${isCardVisible ? 'animate-slide-up' : 'animate-slide-down'}`} style={{ animationDelay: `${0.44 + index * 0.08}s` }}>
        {project.technologies.map((tech, techIdx) => (
          <span
            key={techIdx}
            className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/30 hover:bg-primary/20 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isVisible, hasEntered } = useVisibilityState(sectionRef, { threshold: 0.2 });
  const { isAIActive } = useAI();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isMobile = useIsMobile();

  const speakProjectDetails = (project: typeof projects[0]) => {
    if (!isAIActive) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(project.readOutDetails);
    
    // More natural voice settings
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 0.95; // Slightly lower pitch for natural sound
    utterance.volume = 1;
    
    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Natural') || 
      voice.name.includes('Enhanced') ||
      voice.name.includes('Premium') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error("Failed to read project details");
    };

    window.speechSynthesis.speak(utterance);
    toast.success("Reading project details...");
  };

  useEffect(() => {
    // Ensure voices are loaded for better speech synthesis selection
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : (hasEntered ? "animate-slide-down" : "opacity-0")}` }>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Featured Projects</span>
          </h2>
        </div>

        {/* Network Graph Visualization - Desktop Only */}
        {!isMobile && (
          <div className={`mb-16 transition-all duration-700 ${isVisible ? "animate-slide-up" : "animate-slide-down"}`} style={{ animationDelay: "0.3s" }}>
            <ProjectsNetwork />
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              isAIActive={isAIActive}
              isMobile={isMobile}
              onSpeak={speakProjectDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
