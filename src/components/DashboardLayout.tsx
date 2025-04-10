
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const DashboardLayout = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Handle API errors globally
  useEffect(() => {
    const handleAPIError = (event: ErrorEvent) => {
      if (event.message.includes('API') || event.message.includes('fetch')) {
        console.error('API Error:', event.error);
        toast({
          title: "Connection Error",
          description: "There was a problem connecting to the service. Please try again later.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('error', handleAPIError);
    return () => window.removeEventListener('error', handleAPIError);
  }, [toast]);

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const capitalizedPath = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Home';
    document.title = `StudyHub | ${capitalizedPath}`;
  }, [location]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-hidden bg-background">
        <ScrollArea className="h-screen w-full" type="auto">
          <div className={`min-h-screen pb-12 pt-4 ${isMobile ? 'px-4' : 'px-8'}`}>
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default DashboardLayout;
