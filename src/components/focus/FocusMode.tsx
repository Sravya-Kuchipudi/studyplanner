
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BellOff, 
  Monitor, 
  Timer, 
  Volume2, 
  VolumeX, 
  Check,
  Clock
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FocusModeProps {
  onFocusChange?: (isFocusing: boolean) => void;
}

const FocusMode = ({ onFocusChange }: FocusModeProps) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [remainingTime, setRemainingTime] = useState(focusTime * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle pomodoro timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPomodoro && isFocusMode) {
      interval = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Time's up, switch between focus and break
            const nextIsBreak = !isBreak;
            const nextDuration = nextIsBreak ? breakTime * 60 : focusTime * 60;
            
            setIsBreak(nextIsBreak);
            
            // Show notification
            toast(
              nextIsBreak ? "Break time!" : "Focus time!", 
              { 
                description: nextIsBreak 
                  ? `Take a ${breakTime} minute break` 
                  : `Time to focus for ${focusTime} minutes`
              }
            );
            
            // Play sound if not muted
            if (!isMuted) {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.log("Audio play failed:", e));
            }
            
            return nextDuration;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoro, isFocusMode, breakTime, focusTime, isBreak, isMuted]);

  // Calculate progress percentage
  useEffect(() => {
    const totalTime = isBreak ? breakTime * 60 : focusTime * 60;
    const percentage = 100 - (remainingTime / totalTime * 100);
    setProgress(percentage);
  }, [remainingTime, focusTime, breakTime, isBreak]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle focus mode toggle
  const handleFocusModeToggle = (enabled: boolean) => {
    setIsFocusMode(enabled);
    
    if (enabled) {
      toast("Focus mode activated", {
        description: "Notifications and distractions minimized"
      });
      
      // Reset timer if pomodoro is enabled
      if (isPomodoro) {
        setIsBreak(false);
        setRemainingTime(focusTime * 60);
      }
    } else {
      toast("Focus mode deactivated");
      if (isFullscreen && document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
    
    if (onFocusChange) {
      onFocusChange(enabled);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-studyhub-600" />
          Focus Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="focus-mode" 
                checked={isFocusMode}
                onCheckedChange={handleFocusModeToggle}
              />
              <Label htmlFor="focus-mode">Enable Focus Mode</Label>
            </div>
            {isFocusMode && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-8 w-8"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8"
                >
                  <Monitor size={16} />
                </Button>
              </div>
            )}
          </div>

          {isFocusMode && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="pomodoro" 
                      checked={isPomodoro}
                      onCheckedChange={setIsPomodoro}
                    />
                    <Label htmlFor="pomodoro">Pomodoro Timer</Label>
                  </div>
                  {isPomodoro && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        setIsBreak(false);
                        setRemainingTime(focusTime * 60);
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
                
                {isPomodoro && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="text-3xl font-bold">
                        {formatTime(remainingTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isBreak ? "Break Time" : "Focus Time"}
                      </div>
                      <Progress value={progress} className="w-full h-1.5 mt-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Focus Duration ({focusTime} min)</Label>
                        <Slider 
                          defaultValue={[focusTime]} 
                          max={60} 
                          min={5} 
                          step={5}
                          onValueChange={(val) => setFocusTime(val[0])}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Break Duration ({breakTime} min)</Label>
                        <Slider 
                          defaultValue={[breakTime]} 
                          max={30} 
                          min={1} 
                          step={1}
                          onValueChange={(val) => setBreakTime(val[0])}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="border rounded-md px-3 py-1 text-sm flex items-center">
                  <BellOff className="h-3.5 w-3.5 mr-1" />
                  <span>Notifications minimized</span>
                </div>
                {isPomodoro && (
                  <div className="border rounded-md px-3 py-1 text-sm flex items-center">
                    <Timer className="h-3.5 w-3.5 mr-1" />
                    <span>Pomodoro active</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusMode;
