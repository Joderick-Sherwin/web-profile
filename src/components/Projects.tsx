import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
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
    <section id="projects" ref={sectionRef} className="py-24 px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Featured Projects</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`card-glass rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 group hover:scale-[1.05] flex flex-col ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              
              <p className="text-foreground/80 mb-6 leading-relaxed flex-grow">
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

              <div className="flex gap-3 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-primary/50 hover:bg-primary/10 transition-all duration-300"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-secondary/50 hover:bg-secondary/10 transition-all duration-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Demo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
