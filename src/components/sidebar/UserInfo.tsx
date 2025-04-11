
import React from "react";
import { User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface UserInfoProps {
  username: string;
  collapsed: boolean;
}

export const UserInfo = ({ username, collapsed }: UserInfoProps) => {
  const { theme } = useTheme();
  
  if (collapsed) return null;
  
  return (
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
  );
};
