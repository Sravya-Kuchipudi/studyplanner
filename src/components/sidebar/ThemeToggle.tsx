
import React from "react";
import { Sun, Moon, Eye } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  collapsed: boolean;
}

export const ThemeToggle = ({ collapsed }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  
  return (
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
  );
};
