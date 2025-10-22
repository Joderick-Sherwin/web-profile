import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
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
    <section id="contact" ref={sectionRef} className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Get In Touch</span>
          </h2>
        </div>

        <div className={`card-glass rounded-2xl p-8 md:p-12 shadow-card transition-all duration-700 ${isVisible ? "animate-scale-in" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          <p className="text-xl text-center text-foreground/80 mb-12 leading-relaxed">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
            Feel free to reach out!
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <a 
                href="mailto:jodericksherwinjohn@gmail.com"
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-primary/10 transition-all duration-300 group hover:scale-105"
              >
                <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground group-hover:text-primary transition-colors duration-300">
                    jodericksherwinjohn@gmail.com
                  </p>
                </div>
              </a>

              <a 
                href="tel:+917094944667"
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-primary/10 transition-all duration-300 group hover:scale-105"
              >
                <div className="p-3 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors duration-300">
                  <Phone className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground group-hover:text-secondary transition-colors duration-300">
                    +91 70949 44667
                  </p>
                </div>
              </a>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-foreground">Chennai, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  asChild
                  className="flex-1 bg-primary hover:bg-primary/90 shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <a href="https://github.com/joderick" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </a>
                </Button>
                <Button 
                  asChild
                  className="flex-1 bg-secondary hover:bg-secondary/90 transition-all duration-300 hover:scale-105"
                >
                  <a href="https://linkedin.com/in/joderick" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-5 w-5" />
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
