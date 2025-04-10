
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WelcomeBannerProps {
  title?: string;
  message?: string;
  className?: string;
}

const WelcomeBanner = ({
  title = "Welcome to StudyHub!",
  message = "Your personal study planning assistant. Create schedules, track progress, and achieve your academic goals.",
  className,
}: WelcomeBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const hasSeenBanner = localStorage.getItem("welcome-banner-dismissed");
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("welcome-banner-dismissed", "true");
  };
  
  if (!isVisible) return null;
  
  return (
    <Card className={cn("relative border-studyhub-300 bg-gradient-to-r from-studyhub-50 to-white dark:from-studyhub-900/20 dark:to-background mb-6", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2" 
        onClick={handleDismiss}
        aria-label="Dismiss welcome message"
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="pt-6 pb-4">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{message}</p>
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs px-3 py-1 h-auto border-studyhub-300 hover:bg-studyhub-100 hover:text-studyhub-800"
            onClick={handleDismiss}
          >
            Got it
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
