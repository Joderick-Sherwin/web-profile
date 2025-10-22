import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]" />
      
      {/* Animated particles/dots */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient glow-text">
            Joderick Sherwin J
          </h1>
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-foreground/90">
            Machine Learning Engineer
          </h2>
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <p className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transforming ideas into intelligent solutions through Deep Learning, Computer Vision, and NLP
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <Button 
            onClick={() => scrollToSection("contact")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105"
          >
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
          </Button>
          
          <Button 
            onClick={() => scrollToSection("projects")}
            variant="outline"
            size="lg"
            className="border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            View Projects
          </Button>
        </div>

        <div className="flex gap-6 justify-center mt-12 animate-slide-up" style={{ animationDelay: "0.9s" }}>
          <a 
            href="https://github.com/joderick" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            <Github className="h-6 w-6" />
          </a>
          <a 
            href="https://linkedin.com/in/joderick" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a 
            href="mailto:jodericksherwinjohn@gmail.com"
            className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown 
            className="h-8 w-8 text-primary cursor-pointer" 
            onClick={() => scrollToSection("about")}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
