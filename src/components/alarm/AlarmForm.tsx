
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface NewAlarm {
  time: string;
  active: boolean;
  label: string;
  days: string[];
}

interface AlarmFormProps {
  onAddAlarm: (alarm: NewAlarm) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AlarmForm = ({ onAddAlarm, isOpen, setIsOpen }: AlarmFormProps) => {
  const [newAlarm, setNewAlarm] = useState<NewAlarm>({
    time: "",
    active: true,
    label: "",
    days: []
  });

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

  const handleSave = () => {
    onAddAlarm(newAlarm);
    setNewAlarm({
      time: "",
      active: true,
      label: "",
      days: []
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-studyhub-600 hover:bg-studyhub-700" onClick={handleSave}>
            Save Alarm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmForm;
