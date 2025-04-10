
import { useState, useEffect } from "react";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import GoalSetting from "@/components/dashboard/GoalSetting";
import MotivationTracker from "@/components/dashboard/MotivationTracker";
import StudyReminders from "@/components/dashboard/StudyReminders";
import { useIsMobile } from "@/hooks/use-mobile";
import PageContainer from "@/components/layout/PageContainer";
import BackToHome from "@/components/navigation/BackToHome";
import WelcomeBanner from "@/components/common/WelcomeBanner";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  
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
    // Check if first visit to dashboard
    const hasVisitedDashboard = localStorage.getItem("dashboard-visited");
    if (!hasVisitedDashboard) {
      setShowWelcome(true);
      localStorage.setItem("dashboard-visited", "true");
    }
    
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
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-studyhub-600" aria-label="Loading dashboard" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <PageContainer
      heading="Your Dashboard"
      subheading="Track your progress, set goals, and stay motivated"
    >
      {showWelcome && (
        <WelcomeBanner 
          title="Welcome to your Dashboard!" 
          message="This is your study command center. Track progress, set goals, and stay on top of your study schedule." 
        />
      )}
      
      <div className="flex justify-between items-center mb-2">
        <BackToHome className="mb-4" />
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
    </PageContainer>
  );
};

export default Dashboard;
