
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
  LogIn
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-5xl w-full px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-studyhub-500 to-studyhub-700">
          Welcome to StudyHub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Your all-in-one platform for effective studying, progress tracking, and note organization
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button 
            className="bg-studyhub-600 hover:bg-studyhub-700" 
            size="lg" 
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-studyhub-600 text-studyhub-600 hover:bg-studyhub-50" 
            asChild
          >
            <Link to="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Log In
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <Link to={feature.path} key={index} className="block hover:no-underline">
              <Card className="h-full transition-all duration-200 hover:border-studyhub-400 hover:shadow-md">
                <CardHeader className="space-y-1">
                  <div className="flex justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                  <Button variant="link" className="mt-4 text-studyhub-600" asChild>
                    <span>Go to {feature.title} →</span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
