import { useRef } from "react";
import { useVisibilityState } from "@/hooks/use-parallax";
import { Briefcase, Calendar, Sparkles, Cpu } from "lucide-react";

const experiences = [
  {
    title: "Machine Learning Engineer Intern",
    company: "Revol Process Solutions Pvt. Ltd",
    period: "Jan 2024 - July 2024",
    responsibilities: [
      "Designed and implemented content-based and collaborative filtering recommendation models using Python and Scikit-learn",
      "Developed and deployed RESTful APIs using Python Flask to serve machine learning predictions",
      "Integrated recommendation systems into web applications, ensuring seamless functionality and real-time performance",
      "Collaborated with cross-functional teams to optimize model accuracy and system scalability"
    ]
  },
  {
    title: "Project Intern - IoT & ES",
    company: "Revol Process Solutions Pvt. Ltd",
    period: "Sep 2022 - Nov 2022",
    responsibilities: [
      "Developed a system to enable RS232 serial data transfer from Arduino to a remote server via Wi-Fi (ESP8266/ESP32)",
      "Configured and programmed Arduino microcontrollers for real-time data transmission and remote monitoring",
      "Ensured stable and secure communication between hardware and server using network protocols",
      "Strengthened understanding of IoT communication protocols, serial interfacing, and hardware-software integration"
    ]
  }
];

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isVisible, hasEntered } = useVisibilityState(sectionRef, { threshold: 0.2 });

  return (
    <section id="experience" ref={sectionRef} className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      {/* AI-themed background elements */}
      <div className="absolute inset-0 opacity-20">
        <Cpu className="absolute top-1/3 right-10 w-12 h-12 sm:w-16 sm:h-16 text-secondary animate-float" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute bottom-1/4 left-10 w-10 h-10 sm:w-14 sm:h-14 text-accent animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? "animate-slide-up" : (hasEntered ? "animate-slide-down" : "opacity-0")}` }>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-gradient">Experience</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30 hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${
                  isVisible ? "animate-slide-in-right" : (hasEntered ? "animate-fade-out" : "opacity-0")
                }`}
                style={{ animationDelay: `${0.2 + index * 0.2}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary shadow-glow hidden md:block" />

                <div className="md:ml-20 card-glass rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-glow transition-all duration-500 group hover:scale-[1.02] relative">
                  {/* AI sparkle indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-secondary font-semibold mt-1">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm sm:text-base">{exp.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm sm:text-base">{exp.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex gap-3 text-sm sm:text-base text-foreground/80">
                        <span className="text-primary mt-1.5 flex-shrink-0">▹</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
