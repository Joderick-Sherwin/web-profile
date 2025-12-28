import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import HolographicOverlay from "@/components/HolographicOverlay";
import AIAssistantIndicator from "@/components/AIAssistantIndicator";
import AITransition from "@/components/AITransition";
import AIChat from "@/components/AIChat";
import BackgroundLayers from "@/components/BackgroundLayers";
import WelcomeDialog from "@/components/WelcomeDialog";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Parallax background layers */}
      <BackgroundLayers />
      
      {/* Global AI effects */}
      <HolographicOverlay />
      <AIAssistantIndicator />
      <AITransition />
      <AIChat />
      <WelcomeDialog />
      
      {/* Content sections with parallax */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        
        {/* Footer */}
        <footer className="relative py-8 text-center text-muted-foreground border-t border-border/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
          <p className="relative z-10">© 2025 Joderick Sherwin J. <br></br>Built with passion and code.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
