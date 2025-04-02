
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Volume2, VolumeX } from "lucide-react";

interface TestAlarmButtonProps {
  onTestAlarm: (withSound: boolean) => void;
}

const TestAlarmButton = ({ onTestAlarm }: TestAlarmButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hidden sm:flex">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TestAlarmButton;
