
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const DashboardLayout = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className={`container mx-auto py-4 ${isMobile ? 'px-3' : 'px-6'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
