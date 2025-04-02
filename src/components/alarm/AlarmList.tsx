
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock, Bell, Plus } from "lucide-react";
import AlarmItem from "./AlarmItem";

interface Alarm {
  id: string;
  time: string;
  active: boolean;
  label: string;
  days: string[];
}

interface AlarmListProps {
  alarms: Alarm[];
  ringingAlarmId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const AlarmList = ({ 
  alarms, 
  ringingAlarmId, 
  onToggle, 
  onDelete, 
  onAdd 
}: AlarmListProps) => {
  return (
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
              onClick={onAdd}
              className="mt-4 bg-studyhub-600 hover:bg-studyhub-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Alarm
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map(alarm => (
              <AlarmItem
                key={alarm.id}
                id={alarm.id}
                time={alarm.time}
                active={alarm.active}
                label={alarm.label}
                days={alarm.days}
                isRinging={ringingAlarmId === alarm.id}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlarmList;
