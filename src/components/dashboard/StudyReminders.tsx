
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bell, Plus, Trash2 } from "lucide-react";

interface Reminder {
  id: string;
  time: string;
  days: string[];
  active: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StudyReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: crypto.randomUUID(),
      time: "09:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      active: true,
    }
  ]);
  const [newReminderTime, setNewReminderTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleAddReminder = () => {
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }
    
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      time: newReminderTime,
      days: [...selectedDays],
      active: true,
    };
    
    setReminders([...reminders, newReminder]);
    toast.success("Reminder added successfully");
  };
  
  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
  };
  
  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success("Reminder deleted");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-studyhub-500" />
          Study Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reminder-time">Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <Button
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    className={`px-3 py-1 h-8 ${selectedDays.includes(day) ? "bg-studyhub-600" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <Button onClick={handleAddReminder} className="w-full bg-studyhub-600 hover:bg-studyhub-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Your Reminders</h3>
            <div className="space-y-3">
              {reminders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No reminders set</p>
              ) : (
                reminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">{reminder.time}</p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.days.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={reminder.active}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyReminders;
