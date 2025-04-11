
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Import the newly created components
import { UserInfo } from "./sidebar/UserInfo";
import { NavigationLinks } from "./sidebar/NavigationLinks";
import { ThemeToggle } from "./sidebar/ThemeToggle";
import { LogoutButton } from "./sidebar/LogoutButton";

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { username, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4">
        {!collapsed && (
          <div className="font-bold text-xl text-studyhub-800 flex-1">StudyHub</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <UserInfo username={username} collapsed={collapsed} />

      <Separator className="my-2" />

      <div className="flex-1 overflow-auto p-2">
        <NavigationLinks collapsed={collapsed} />
      </div>

      <div className="p-2 space-y-2">
        <ThemeToggle collapsed={collapsed} />
        <LogoutButton collapsed={collapsed} onLogout={logout} />
      </div>
    </div>
  );
};

export default AppSidebar;
