
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  collapsed: boolean;
  onLogout: () => void;
}

export const LogoutButton = ({ collapsed, onLogout }: LogoutButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      className={cn(
        "w-full justify-start text-muted-foreground hover:bg-muted hover:text-destructive",
        collapsed && "justify-center p-2"
      )}
      onClick={onLogout}
    >
      <LogOut size={collapsed ? 24 : 20} />
      {!collapsed && <span className="ml-3">Logout</span>}
    </Button>
  );
};
