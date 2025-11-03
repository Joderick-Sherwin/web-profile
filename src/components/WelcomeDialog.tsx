import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Zap } from "lucide-react";

const WELCOME_DIALOG_KEY = "welcome-dialog-last-shown";
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem(WELCOME_DIALOG_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) > TWELVE_HOURS) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_DIALOG_KEY, Date.now().toString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to My Portfolio
          </DialogTitle>
          <DialogDescription className="text-left space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">AI-Powered Experience</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle the AI assistant indicator (floating orb) to activate an enhanced, interactive version of the portfolio with AI features.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Chat with AI</p>
                  <p className="text-sm text-muted-foreground">
                    When AI is activated, use the chat feature to ask questions about my projects, experience, and skills.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Explore Projects</p>
                  <p className="text-sm text-muted-foreground">
                    Scroll through to discover my work in AI, computer vision, and full-stack development.
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleClose} className="w-full">
          Get Started
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
