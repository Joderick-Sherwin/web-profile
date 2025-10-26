import { useEffect, useRef, useState } from "react";
import { Code, Brain, Wrench, Users, Sparkles, Zap } from "lucide-react";

const skillCategories = [
  {
    icon: Code,
    title: "Technical Skills",
    skills: ["Python", "Flask", "HTML", "CSS", "Machine Learning", "Deep Learning"]
  },
  {
    icon: Brain,
    title: "AI/ML Expertise",
    skills: ["Natural Language Processing", "Computer Vision", "Prompt Engineering"]
  },
  {
    icon: Wrench,
    title: "Tools & Frameworks",
    skills: ["TensorFlow", "Keras", "Scikit-learn", "OpenCV", "Pandas"]
  },
  {
    icon: Users,
    title: "Soft Skills",
    skills: ["Project Management", "Team Leadership", "Effective Communication", "Time Management"]
  }
];

const Skills = () => {
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
    <section id="skills" ref={sectionRef} className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* AI-themed background elements */}
      <div className="absolute inset-0 opacity-20">
        <Zap className="absolute top-1/4 right-20 w-12 h-12 sm:w-16 sm:h-16 text-accent animate-float" />
        <Brain className="absolute bottom-1/4 left-20 w-12 h-12 sm:w-16 sm:h-16 text-primary animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Skills & Expertise</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className={`card-glass ai-border rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-glow transition-all duration-500 group hover:scale-[1.02] relative overflow-hidden ${
                  isVisible ? "animate-scale-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Animated decision boundary on hover */}
                <svg className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ mixBlendMode: "screen" }}>
                  <defs>
                    <linearGradient id={`boundary-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "hsl(200, 95%, 55%)", stopOpacity: 0.3 }}>
                        <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" style={{ stopColor: "hsl(280, 70%, 65%)", stopOpacity: 0.3 }}>
                        <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                      </stop>
                    </linearGradient>
                  </defs>
                  <path d="M 0,50 Q 50,20 100,50 T 200,50" fill="none" stroke={`url(#boundary-${index})`} strokeWidth="2" opacity="0.5">
                    <animate attributeName="d" values="M 0,50 Q 50,20 100,50 T 200,50;M 0,50 Q 50,80 100,50 T 200,50;M 0,50 Q 50,20 100,50 T 200,50" dur="3s" repeatCount="indefinite" />
                  </path>
                </svg>
                {/* Data stream effect on hover */}
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary/50 via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* AI sparkle indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors duration-300 neural-glow">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-muted/50 hover:bg-primary/20 rounded-lg text-foreground/90 transition-all duration-300 hover:scale-105 cursor-default border border-border/50 hover:border-primary/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
