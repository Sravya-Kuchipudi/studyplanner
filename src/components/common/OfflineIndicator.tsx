
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Function to handle online status changes
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setIsVisible(true);
      
      // Auto-hide the online indicator after a delay
      if (online) {
        toast.success("You're back online!", {
          description: "Your changes will now sync automatically."
        });
        
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      } else {
        toast.warning("You're offline", {
          description: "Don't worry, you can still view and edit your study plan."
        });
      }
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  
  if (isOnline && !isVisible) return null;
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 z-50 shadow-lg px-4 py-2 rounded-full flex items-center text-sm transition-all duration-300 animate-fade-in",
        isOnline 
          ? "bg-green-100 border border-green-200 text-green-700" 
          : "bg-amber-100 border border-amber-200 text-amber-700"
      )}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 mr-2 text-green-500" />
          <span>Back Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 mr-2 text-amber-500" />
          <span>Offline Mode - Changes saved locally</span>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
