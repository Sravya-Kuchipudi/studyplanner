
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Volume2, VolumeX, Power } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TestAlarmButtonProps {
  onTestAlarm: (withSound: boolean) => void;
  onStopAlarm: () => void;
}

const TestAlarmButton = ({ onTestAlarm, onStopAlarm }: TestAlarmButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`${isMobile ? 'w-full' : ''}`}
        >
          Test Alarm
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onTestAlarm(true)}>
          <Volume2 className="mr-2 h-4 w-4" />
          <span>With Sound</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTestAlarm(false)}>
          <VolumeX className="mr-2 h-4 w-4" />
          <span>Without Sound (Silent)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStopAlarm}>
          <Power className="mr-2 h-4 w-4" />
          <span>Stop Alarm</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TestAlarmButton;
