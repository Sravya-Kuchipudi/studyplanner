
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlarmClock, 
  Bell, 
  Plus, 
  Trash2, 
  Clock,
  BellRing,
  Volume2
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface Alarm {
  id: string;
  time: string;
  active: boolean;
  label: string;
  days: string[];
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Alarm = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "1",
      time: "08:00",
      active: true,
      label: "Morning Study",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    },
    {
      id: "2",
      time: "15:30",
      active: false,
      label: "Afternoon Review",
      days: ["Mon", "Wed", "Fri"]
    }
  ]);
  const [newAlarm, setNewAlarm] = useState<Omit<Alarm, "id">>({
    time: "",
    active: true,
    label: "",
    days: []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update current time every second
  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  // Check for alarms that should ring
  useEffect(() => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    const currentDay = WEEKDAYS[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];

    const ringingAlarm = alarms.find(alarm => 
      alarm.active && 
      alarm.time === currentTimeString &&
      alarm.days.includes(currentDay) &&
      currentTime.getSeconds() === 0
    );

    if (ringingAlarm && !ringingAlarmId) {
      setRingingAlarmId(ringingAlarm.id);
      playAlarmSound();
      toast.info(
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-studyhub-500 animate-pulse" />
          <div>
            <strong>Alarm!</strong> {ringingAlarm.label}
          </div>
        </div>,
        {
          duration: 60000, // 1 minute
          action: {
            label: "Stop",
            onClick: () => {
              setRingingAlarmId(null);
              stopAlarmSound();
            }
          }
        }
      );
    }
  }, [currentTime, alarms, ringingAlarmId]);

  const playAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => {
        console.error("Error playing alarm sound:", error);
        toast.error("Could not play alarm sound. Please check your browser settings.");
      });
    }
  };

  const stopAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAddAlarm = () => {
    if (!newAlarm.time) {
      toast.error("Please set a time for the alarm");
      return;
    }

    if (newAlarm.days.length === 0) {
      toast.error("Please select at least one day for the alarm");
      return;
    }

    const id = crypto.randomUUID();
    setAlarms([...alarms, { ...newAlarm, id }]);
    setNewAlarm({
      time: "",
      active: true,
      label: "",
      days: []
    });
    setIsDialogOpen(false);
    toast.success("Alarm added successfully");
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
    toast.success("Alarm deleted");
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(
      alarms.map(alarm => 
        alarm.id === id 
          ? { ...alarm, active: !alarm.active } 
          : alarm
      )
    );
  };

  const handleToggleDay = (day: string) => {
    if (newAlarm.days.includes(day)) {
      setNewAlarm({
        ...newAlarm,
        days: newAlarm.days.filter(d => d !== day)
      });
    } else {
      setNewAlarm({
        ...newAlarm,
        days: [...newAlarm.days, day]
      });
    }
  };

  // For testing purposes - allows triggering the alarm manually
  const handleTestAlarm = () => {
    if (!ringingAlarmId && alarms.length > 0) {
      const testAlarm = alarms[0];
      setRingingAlarmId(testAlarm.id);
      playAlarmSound();
      toast.info(
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-studyhub-500 animate-pulse" />
          <div>
            <strong>Test Alarm!</strong> {testAlarm.label}
          </div>
        </div>,
        {
          duration: 10000, // 10 seconds for test
          action: {
            label: "Stop",
            onClick: () => {
              setRingingAlarmId(null);
              stopAlarmSound();
            }
          }
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alarm</h1>
          <p className="text-muted-foreground">
            Set alarms for your study sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestAlarm}
            className="hidden sm:flex"
          >
            Test Alarm
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-studyhub-600 hover:bg-studyhub-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Alarm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Alarm</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={newAlarm.time}
                    onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label</label>
                  <Input
                    placeholder="E.g., Math Study Time"
                    value={newAlarm.label}
                    onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Repeat on days</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={newAlarm.days.includes(day) ? "default" : "outline"}
                        className={
                          newAlarm.days.includes(day) 
                            ? "bg-studyhub-600 hover:bg-studyhub-700" 
                            : ""
                        }
                        onClick={() => handleToggleDay(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-studyhub-600 hover:bg-studyhub-700" onClick={handleAddAlarm}>
                  Save Alarm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-studyhub-500" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-4xl font-bold mb-1">
              {format(currentTime, "hh:mm:ss a")}
            </div>
            <div className="text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-studyhub-500" />
            Your Alarms
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alarms.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No alarms set</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                Set alarms to remind you of your study sessions
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 bg-studyhub-600 hover:bg-studyhub-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Alarm
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alarms.map(alarm => (
                <div
                  key={alarm.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${alarm.active ? 'bg-studyhub-100 text-studyhub-700' : 'bg-muted text-muted-foreground'}`}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {alarm.time} {alarm.label && `- ${alarm.label}`}
                        {ringingAlarmId === alarm.id && (
                          <span className="ml-2 inline-flex items-center">
                            <Volume2 className="h-4 w-4 text-studyhub-600 animate-pulse" />
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-1 mt-1">
                        {alarm.days.map(day => (
                          <span key={day} className="bg-muted px-1.5 py-0.5 rounded-md text-xs">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alarm.active}
                      onCheckedChange={() => handleToggleAlarm(alarm.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(alarm.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio element for alarm sound */}
      <audio ref={audioRef} src="/alarm-sound.mp3" preload="auto" />
    </div>
  );
};

export default Alarm;
