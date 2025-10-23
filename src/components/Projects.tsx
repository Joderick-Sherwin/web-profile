import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "TerraDefender - Military IPB System",
    description: "Engineered a Deep Learning-based system for analyzing terrain, infrastructure, and environmental conditions from aerial and satellite imagery.",
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
    highlights: [
      "Real-time facial expression tracking",
      "Interactive personalized animations",
      "Applications in messaging and gaming"
    ],
    technologies: ["Python", "OpenCV", "MediaPipe"]
  },
  {
    title: "Project WraithCast",
    description: "A real-time wireframe camera system designed to capture and render 3D skeletal representations of environments and objects.",
    highlights: [
      "High-speed imaging with depth-sensing technology",
      "Optimized for rapid rendering and streaming",
      "Ideal for terrain analysis and AR simulations"
    ],
    technologies: ["Python", "Computer Vision", "3D Rendering", "Real-time Processing"]
  },
  {
    title: "RAG Project",
    description: "Combines document retrieval with generative AI models to provide highly accurate and context-aware responses.",
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
    highlights: [
      "Real-time audio recording and playback",
      "Waveform visualization for audio monitoring",
      "User-friendly interface for voice transcription"
    ],
    technologies: ["Python", "PyQt5", "Speech Recognition", "Audio Processing"]
  }
];

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Featured Projects</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`card-glass rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-glow transition-all duration-500 group hover:scale-[1.05] flex flex-col relative overflow-hidden ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              {/* AI sparkle indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              
              <p className="text-sm sm:text-base text-foreground/80 mb-6 leading-relaxed flex-grow">
                {project.description}
              </p>

              <div className="mb-6">
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

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, techIdx) => (
                  <span
                    key={techIdx}
                    className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
