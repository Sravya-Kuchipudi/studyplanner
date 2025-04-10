
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface OnboardingProps {
  open: boolean;
  onComplete: () => void;
}

const Onboarding = ({ open, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to StudyHub",
      content: (
        <div className="space-y-4 text-center">
          <div className="mx-auto bg-studyhub-100 text-studyhub-800 h-16 w-16 rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold">SH</div>
          </div>
          <h3 className="text-xl font-medium">Your personal study assistant</h3>
          <p className="text-muted-foreground">
            StudyHub helps you organize your study schedule, track your progress,
            and stay focused on your academic goals.
          </p>
        </div>
      )
    },
    {
      title: "Plan Your Study Sessions",
      content: (
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Study Planner</div>
                <div className="text-xs text-muted-foreground">
                  Create schedules, set goals, and organize study materials
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Add study sessions to your calendar, upload materials, and set reminders 
            to stay on track with your study plan.
          </p>
        </div>
      )
    },
    {
      title: "Stay Focused with Focus Mode",
      content: (
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Focus Mode</div>
                <div className="text-xs text-muted-foreground">
                  Use Pomodoro technique and minimize distractions
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Activate Focus Mode to use the Pomodoro technique, eliminate distractions,
            and maximize your productivity during study sessions.
          </p>
        </div>
      )
    },
    {
      title: "Track Your Progress",
      content: (
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Progress Tracker</div>
                <div className="text-xs text-muted-foreground">
                  Monitor your growth and stay motivated
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            View detailed statistics about your study habits, track completion of goals,
            and celebrate your achievements to stay motivated.
          </p>
        </div>
      )
    },
    {
      title: "Ready to Start?",
      content: (
        <div className="space-y-4 text-center">
          <div className="mx-auto bg-studyhub-100 text-studyhub-800 h-16 w-16 rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold">✓</div>
          </div>
          <h3 className="text-xl font-medium">You're all set!</h3>
          <p className="text-muted-foreground">
            Start planning your study sessions, using focus mode, and tracking your progress.
            You can revisit this tour anytime from the help menu.
          </p>
        </div>
      )
    }
  ];
  
  const progress = ((step + 1) / steps.length) * 100;
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = () => {
    localStorage.setItem("onboarding-completed", "true");
    onComplete();
  };
  
  const handleSkip = () => {
    handleComplete();
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleComplete()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{steps[step].title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {steps[step].content}
        </div>
        
        <Progress value={progress} className="mt-2 mb-4" />
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div>
            {step > 0 ? (
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSkip}>
                Skip Tour
              </Button>
            )}
          </div>
          
          <Button size="sm" onClick={handleNext}>
            {step < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
