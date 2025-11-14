import { useEffect, useRef, useState } from "react";
import { useVisibilityState } from "@/hooks/use-parallax";
import { Mail, Phone, MapPin, Github, Linkedin, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isVisible, hasEntered } = useVisibilityState(sectionRef, { threshold: 0.2 });

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* AI-themed background elements */}
      <div className="absolute inset-0 opacity-20">
        <Send className="absolute top-1/4 left-10 w-12 h-12 sm:w-16 sm:h-16 text-primary animate-float" />
        <Sparkles className="absolute bottom-1/3 right-10 w-10 h-10 sm:w-14 sm:h-14 text-accent animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : (hasEntered ? "animate-slide-down" : "opacity-0")}` }>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Get In Touch</span>
          </h2>
        </div>

        <div className={`card-glass rounded-2xl p-6 sm:p-8 md:p-12 shadow-card hover:shadow-glow transition-all duration-700 group relative ${isVisible ? "animate-scale-in" : (hasEntered ? "animate-scale-out" : "opacity-0")}`} style={{ animationDelay: "0.2s" }}>
          {/* AI sparkle indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <p className="text-lg sm:text-xl text-center text-foreground/80 mb-12 leading-relaxed">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
            Feel free to reach out!
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            <div className="space-y-4 sm:space-y-6">
              <a 
                href="mailto:jodericksherwinjohn@gmail.com"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-xl hover:bg-primary/10 transition-all duration-300 group hover:scale-105"
              >
                <div className="p-2 sm:p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors duration-300 neural-glow">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                  <p className="text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300 break-all">
                    jodericksherwinjohn@gmail.com
                  </p>
                </div>
              </a>

              <a 
                href="tel:+917094944667"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-xl hover:bg-primary/10 transition-all duration-300 group hover:scale-105"
              >
                <div className="p-2 sm:p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors duration-300">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm sm:text-base text-foreground group-hover:text-secondary transition-colors duration-300">
                    +91 70949 44667
                  </p>
                </div>
              </a>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-xl">
                <div className="p-2 sm:p-3 bg-accent/20 rounded-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
                  <p className="text-sm sm:text-base text-foreground">Chennai, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  asChild
                  className="flex-1 bg-primary hover:bg-primary/90 shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <a href="https://github.com/Joderick-Sherwin" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    GitHub
                  </a>
                </Button>
                <Button 
                  asChild
                  className="flex-1 bg-secondary hover:bg-secondary/90 transition-all duration-300 hover:scale-105"
                >
                  <a href="https://www.linkedin.com/in/joderick-sherwin-j" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 shadow-glow transition-all duration-300 hover:scale-105"
            >
              <a href="mailto:jodericksherwinjohn@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Send Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
