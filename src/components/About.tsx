import { useEffect, useRef, useState } from "react";
import { Brain, Sparkles } from "lucide-react";

const About = () => {
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
    <section id="about" ref={sectionRef} className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* AI-themed background elements */}
      <div className="absolute inset-0 opacity-20">
        <Brain className="absolute top-1/4 left-10 w-12 h-12 sm:w-16 sm:h-16 text-primary animate-float" />
        <Sparkles className="absolute bottom-1/3 right-10 w-10 h-10 sm:w-14 sm:h-14 text-accent animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center">
            <span className="text-gradient">About Me</span>
          </h2>
        </div>

        <div className={`card-glass rounded-2xl p-6 sm:p-8 md:p-12 shadow-card hover:shadow-glow transition-all duration-700 group ${isVisible ? "animate-scale-in" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          {/* AI sparkle indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground/90 mb-6">
            I am an Honours Computer Science and Engineering student at{" "}
            <span className="text-primary font-semibold">Rajalakshmi Engineering College</span>, 
            driven by a deep interest in Machine Learning and real-world application of technology.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground/90 mb-6">
            With a strong foundation in programming and practical experience gained through diverse 
            projects and hackathons, I bring a problem-solving mindset, collaborative spirit, and a 
            passion for continuous learning.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground/90">
            I thrive in dynamic environments and am always eager to take on challenges that contribute 
            to both personal and professional growth. Currently based in{" "}
            <span className="text-secondary font-semibold">Chennai, Tamil Nadu, India</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
