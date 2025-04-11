import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  PieChart, 
  FileText, 
  AlarmClock, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  User,
  Sun,
  Moon,
  Eye,
  Notebook
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarLink = ({ to, icon, label, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 p-3 rounded-md transition-all",
        isActive 
          ? "bg-studyhub-100 text-studyhub-800 font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center p-2"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { username, logout } = useAuth();
  const { theme, setTheme } = useTheme();

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

      {!collapsed && (
        <div className="px-4 py-2">
          <div className={cn(
            "rounded-md p-3 flex items-center gap-3",
            theme === "dark" 
              ? "bg-sidebar-accent text-sidebar-foreground" 
              : "bg-studyhub-50 text-studyhub-700"
          )}>
            <div className={cn(
              "p-1 rounded-full",
              theme === "dark" 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "bg-studyhub-100 text-studyhub-700"
            )}>
              <User size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm truncate">{username}</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
          </div>
        </div>
      )}

      <Separator className="my-2" />

      <div className="flex-1 overflow-auto p-2">
        <nav className="space-y-1">
          <SidebarLink 
            to="/planner" 
            icon={<Notebook size={collapsed ? 24 : 20} />} 
            label="Planner" 
            collapsed={collapsed} 
          />
          <SidebarLink 
            to="/dashboard" 
            icon={<Calendar size={collapsed ? 24 : 20} />} 
            label="Study Planner" 
            collapsed={collapsed} 
          />
          <SidebarLink 
            to="/progress" 
            icon={<PieChart size={collapsed ? 24 : 20} />} 
            label="Progress" 
            collapsed={collapsed} 
          />
          <SidebarLink 
            to="/notes" 
            icon={<FileText size={collapsed ? 24 : 20} />} 
            label="My Notes" 
            collapsed={collapsed} 
          />
          <SidebarLink 
            to="/alarm" 
            icon={<AlarmClock size={collapsed ? 24 : 20} />} 
            label="Alarm" 
            collapsed={collapsed} 
          />
          <SidebarLink 
            to="/chat" 
            icon={<MessageSquare size={collapsed ? 24 : 20} />} 
            label="Chat" 
            collapsed={collapsed} 
          />
        </nav>
      </div>

      <div className="p-2 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-muted-foreground hover:bg-muted",
                collapsed && "justify-center p-2"
              )}
            >
              {theme === "light" && <Sun size={collapsed ? 24 : 20} />}
              {theme === "dark" && <Moon size={collapsed ? 24 : 20} />}
              {theme === "colorBlind" && <Eye size={collapsed ? 24 : 20} />}
              {!collapsed && <span className="ml-3">Theme</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={collapsed ? "center" : "start"} side="right">
            <DropdownMenuLabel>Theme Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("colorBlind")} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              <span>High Contrast (Colorblind)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-muted-foreground hover:bg-muted hover:text-destructive",
            collapsed && "justify-center p-2"
          )}
          onClick={logout}
        >
          <LogOut size={collapsed ? 24 : 20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};
