
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

export const SidebarLink = ({ to, icon, label, collapsed }: SidebarLinkProps) => {
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
