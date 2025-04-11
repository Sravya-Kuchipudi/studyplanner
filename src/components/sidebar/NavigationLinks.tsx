
import React from "react";
import { 
  Calendar, 
  PieChart, 
  FileText, 
  AlarmClock, 
  MessageSquare,
  Notebook
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";

interface NavigationLinksProps {
  collapsed: boolean;
}

export const NavigationLinks = ({ collapsed }: NavigationLinksProps) => {
  return (
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
        label="Dashboard" 
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
  );
};
