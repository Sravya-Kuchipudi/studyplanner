
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Clock, 
  PieChart, 
  FileText, 
  MessageSquare, 
  AlarmClock,
  LayoutDashboard,
  LogIn,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import WelcomeBanner from "@/components/common/WelcomeBanner";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6 text-studyhub-600" />,
      title: "Dashboard",
      description: "View your personalized study dashboard with progress and goals",
      path: "/dashboard"
    },
    {
      icon: <Clock className="h-6 w-6 text-studyhub-600" />,
      title: "Study Planner",
      description: "Organize your study sessions and manage your time effectively",
      path: "/planner"
    },
    {
      icon: <PieChart className="h-6 w-6 text-studyhub-600" />,
      title: "Progress Tracker",
      description: "Track your learning progress across different subjects",
      path: "/progress"
    },
    {
      icon: <FileText className="h-6 w-6 text-studyhub-600" />,
      title: "My Notes",
      description: "Store and organize all your study notes in one place",
      path: "/notes"
    },
    {
      icon: <AlarmClock className="h-6 w-6 text-studyhub-600" />,
      title: "Study Alarm",
      description: "Set alarms to remind you of your study sessions",
      path: "/alarm"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-studyhub-600" />,
      title: "Study Chat",
      description: "Chat with AI assistant for help with your studies",
      path: "/chat"
    }
  ];

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-background to-studyhub-50 dark:from-background dark:to-background/90">
      <main className="flex-1 flex flex-col">
        <div className="container px-4 py-8 md:py-12 lg:py-16 flex flex-col items-center">
          <WelcomeBanner 
            title="Welcome to StudyHub!" 
            message="Your all-in-one platform for effective studying, progress tracking, and note organization."
          />
          
          <div className="max-w-[85rem] w-full text-center space-y-8 md:space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-studyhub-600 to-studyhub-800 mx-auto">
                Master Your Study Journey
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Your all-in-one platform for effective studying, progress tracking, and note organization
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mx-auto">
              <Button 
                className="bg-studyhub-600 hover:bg-studyhub-700 transition-all shadow-lg hover:shadow-xl shadow-studyhub-600/20" 
                size="lg" 
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-studyhub-400 text-studyhub-700 hover:bg-studyhub-100 transition-all" 
                asChild
              >
                <Link to="/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Log In
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-6xl">
            {features.map((feature, index) => (
              <Link 
                to="/login" 
                key={index} 
                className="block hover:no-underline group"
              >
                <Card className="h-full transition-all duration-200 hover:border-studyhub-400 hover:shadow-lg hover:shadow-studyhub-100/30 dark:hover:shadow-studyhub-900/20">
                  <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                      <div className="p-3 rounded-full bg-studyhub-100 dark:bg-studyhub-900/30 text-studyhub-600">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                    <Button 
                      variant="link" 
                      className="mt-4 text-studyhub-600 group-hover:underline" 
                    >
                      <span>
                        Login to access
                        <ArrowRight className="ml-1 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 bg-gradient-to-b from-transparent to-studyhub-100/50 dark:to-background">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudyHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
