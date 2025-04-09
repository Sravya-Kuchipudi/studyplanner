
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Target, CalendarIcon, Plus, Check } from "lucide-react";

interface Goal {
  id: string;
  subject: string;
  weakTopics: string;
  deadline: Date | undefined;
}

const GoalSetting = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Goal>({
    id: crypto.randomUUID(),
    subject: "",
    weakTopics: "",
    deadline: undefined
  });
  
  const handleAddGoal = () => {
    if (!newGoal.subject) {
      toast.error("Please enter a subject");
      return;
    }
    
    setGoals([...goals, newGoal]);
    setNewGoal({
      id: crypto.randomUUID(),
      subject: "",
      weakTopics: "",
      deadline: undefined
    });
    toast.success("Study goal added successfully");
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-studyhub-500" />
          Set Study Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="E.g., Mathematics, Physics"
                value={newGoal.subject}
                onChange={(e) => setNewGoal({...newGoal, subject: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weakTopics">Weak Topics (Optional)</Label>
              <Textarea
                id="weakTopics"
                placeholder="Topics you need to focus on"
                value={newGoal.weakTopics}
                onChange={(e) => setNewGoal({...newGoal, weakTopics: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newGoal.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newGoal.deadline ? format(newGoal.deadline, "PPP") : "Select deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGoal.deadline}
                    onSelect={(date) => setNewGoal({...newGoal, deadline: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button onClick={handleAddGoal} className="w-full bg-studyhub-600 hover:bg-studyhub-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Current Goals</h3>
            {goals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No goals added yet</p>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{goal.subject}</h4>
                      {goal.deadline && (
                        <span className="text-xs text-muted-foreground">
                          Due: {format(goal.deadline, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                    {goal.weakTopics && (
                      <p className="text-sm mt-1 text-muted-foreground">{goal.weakTopics}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
