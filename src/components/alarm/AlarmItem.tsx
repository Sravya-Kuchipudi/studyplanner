
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Trash2, Volume2 } from "lucide-react";

interface AlarmProps {
  id: string;
  time: string;
  active: boolean;
  label: string;
  days: string[];
  isRinging: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlarmItem = ({ 
  id, 
  time, 
  active, 
  label, 
  days, 
  isRinging,
  onToggle, 
  onDelete 
}: AlarmProps) => {
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isRinging ? 'border-studyhub-500 dark:border-studyhub-400 bg-studyhub-50 dark:bg-studyhub-900/30' : 'hover:bg-muted/50'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${active ? 'bg-studyhub-100 text-studyhub-700 dark:bg-studyhub-900 dark:text-studyhub-300' : 'bg-muted text-muted-foreground'} ${isRinging ? 'animate-pulse' : ''}`}>
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium">
            {time} {label && `- ${label}`}
            {isRinging && (
              <span className="ml-2 inline-flex items-center">
                <Volume2 className="h-4 w-4 text-studyhub-600 animate-pulse" />
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-1 mt-1">
            {days.map(day => (
              <span key={day} className={`px-1.5 py-0.5 rounded-md text-xs ${active ? 'bg-studyhub-100 text-studyhub-700 dark:bg-studyhub-900 dark:text-studyhub-300' : 'bg-muted'}`}>
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={active}
          onCheckedChange={() => onToggle(id)}
          className={isRinging ? "ring-2 ring-offset-2 ring-studyhub-500 dark:ring-studyhub-400" : ""}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default AlarmItem;
