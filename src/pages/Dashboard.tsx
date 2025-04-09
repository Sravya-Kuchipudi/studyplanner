
import { useState, useEffect } from "react";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import GoalSetting from "@/components/dashboard/GoalSetting";
import MotivationTracker from "@/components/dashboard/MotivationTracker";
import StudyReminders from "@/components/dashboard/StudyReminders";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data for the dashboard
  const subjectsData = [
    { name: "Math", progress: 75, target: 90, color: "#8B5CF6" },
    { name: "Physics", progress: 60, target: 85, color: "#8B5CF6" },
    { name: "Chemistry", progress: 45, target: 80, color: "#8B5CF6" },
    { name: "Biology", progress: 80, target: 90, color: "#8B5CF6" },
    { name: "English", progress: 85, target: 85, color: "#8B5CF6" },
  ];
  
  const currentStreak = 7;
  const bestStreak = 14;
  
  const motivationMessages = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "The secret of your future is hidden in your daily routine.",
    "Don't wish it were easier; wish you were better.",
    "Discipline is the bridge between goals and accomplishment.",
    "The harder you work for something, the greater you'll feel when you achieve it."
  ];
  
  // Randomly select a motivation message
  const [motivationMessage, setMotivationMessage] = useState("");
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationMessages.length);
      setMotivationMessage(motivationMessages[randomIndex]);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-studyhub-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress, set goals, and stay motivated
        </p>
      </div>
      
      {/* Progress overview section */}
      <ProgressOverview 
        subjects={subjectsData} 
        currentStreak={currentStreak} 
        bestStreak={bestStreak}
      />
      
      {/* Goal setting section */}
      <GoalSetting />
      
      {/* Reminders and motivation section - 2 column on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StudyReminders />
        <MotivationTracker 
          currentStreak={currentStreak} 
          motivationMessage={motivationMessage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
