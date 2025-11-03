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
import NeuralNetwork from "@/components/NeuralNetwork";
import CircuitPattern from "@/components/CircuitPattern";
import AIParticles from "@/components/AIParticles";
import FloatingCode from "@/components/FloatingCode";
import WelcomeDialog from "@/components/WelcomeDialog";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Global background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-background to-[hsl(var(--hero-gradient-end))]" />
      <NeuralNetwork />
      <CircuitPattern />
      <AIParticles />
      <FloatingCode />
      
      {/* Global AI effects */}
      <HolographicOverlay />
      <AIAssistantIndicator />
      <AITransition />
      <AIChat />
      <WelcomeDialog />
      
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      
      {/* Footer */}
      <footer className="relative py-8 text-center text-muted-foreground border-t border-border/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <p className="relative z-10">© 2025 Joderick Sherwin J. Built with passion and code.</p>
      </footer>
    </div>
  );
};

export default Index;
