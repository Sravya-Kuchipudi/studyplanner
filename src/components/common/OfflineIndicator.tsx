
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Function to handle online status changes
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast.success("You're back online!", {
          description: "Your changes will now sync automatically."
        });
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
  
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background border rounded-full shadow-lg px-4 py-2 flex items-center text-sm animate-fade-in">
      <WifiOff className="h-4 w-4 mr-2 text-amber-500" />
      <span>Offline Mode - Changes saved locally</span>
    </div>
  );
};

export default OfflineIndicator;
