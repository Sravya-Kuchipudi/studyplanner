
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { BellRing, VolumeX } from "lucide-react";
import CurrentTime from "@/components/alarm/CurrentTime";
import AlarmList from "@/components/alarm/AlarmList";
import AlarmForm from "@/components/alarm/AlarmForm";
import TestAlarmButton from "@/components/alarm/TestAlarmButton";

interface Alarm {
  id: string;
  time: string;
  active: boolean;
  label: string;
  days: string[];
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ALARM_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

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

  const handleAddAlarm = (newAlarm: Omit<Alarm, "id">) => {
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

  const handleTestAlarm = (withSound: boolean = true) => {
    if (!ringingAlarmId && alarms.length > 0) {
      const testAlarm = alarms[0];
      setRingingAlarmId(testAlarm.id);
      
      if (withSound) {
        playAlarmSound();
      }
      
      toast.info(
        <div className="flex items-center gap-2">
          {withSound ? (
            <BellRing className="h-5 w-5 text-studyhub-500 animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <strong>{withSound ? "Test Alarm!" : "Silent Test Alarm!"}</strong> {testAlarm.label}
          </div>
        </div>,
        {
          duration: 10000, // 10 seconds for test
          action: {
            label: "Stop",
            onClick: () => {
              setRingingAlarmId(null);
              if (withSound) {
                stopAlarmSound();
              }
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
          <TestAlarmButton onTestAlarm={handleTestAlarm} />
          <AlarmForm 
            onAddAlarm={handleAddAlarm} 
            isOpen={isDialogOpen} 
            setIsOpen={setIsDialogOpen} 
          />
        </div>
      </div>

      <CurrentTime />

      <AlarmList 
        alarms={alarms}
        ringingAlarmId={ringingAlarmId}
        onToggle={handleToggleAlarm}
        onDelete={handleDeleteAlarm}
        onAdd={() => setIsDialogOpen(true)}
      />

      <audio ref={audioRef} src={ALARM_SOUND_URL} preload="auto" />
    </div>
  );
};

export default Alarm;
