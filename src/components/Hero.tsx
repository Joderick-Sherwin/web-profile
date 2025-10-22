import { ArrowDown, Github, Linkedin, Mail, Brain, Code, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NeuralNetwork from "./NeuralNetwork";
import CircuitPattern from "./CircuitPattern";
import AIParticles from "./AIParticles";
import DataStream from "./DataStream";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]" />
      
      {/* AI-themed background elements */}
      <NeuralNetwork />
      <CircuitPattern />
      <AIParticles />
      <DataStream />
      
      {/* Floating AI icons */}
      <div className="absolute inset-0 opacity-10">
        <Brain className="absolute top-1/4 left-1/4 w-16 h-16 text-primary animate-float" />
        <Cpu className="absolute top-1/3 right-1/3 w-12 h-12 text-secondary animate-float" style={{ animationDelay: "1s" }} />
        <Code className="absolute bottom-1/4 left-1/3 w-14 h-14 text-accent animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-slide-up mb-6" style={{ animationDelay: "0.05s" }}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm neural-glow">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">AI Engineer</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        </div>
        
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
