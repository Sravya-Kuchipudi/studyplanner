import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Upload, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScheduleItem {
  id: string;
  date: Date;
  title: string;
  description: string;
}

const StudyPlanner = () => {
  const [date, setDate] = useState<Date>();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [uploadedSchedules, setUploadedSchedules] = useState<string[]>([]);

  const handleAddSchedule = () => {
    if (!date || !newTitle) {
      toast.error("Please select a date and enter a title");
      return;
    }

    const newItem: ScheduleItem = {
      id: crypto.randomUUID(),
      date,
      title: newTitle,
      description: newDescription,
    };

    setScheduleItems([...scheduleItems, newItem]);
    setNewTitle("");
    setNewDescription("");
    setDate(undefined);
    toast.success("Study schedule added successfully");
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
    toast.success("Schedule item removed");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For demo, we'll just keep track of the file name
      setUploadedSchedules([...uploadedSchedules, file.name]);
      toast.success(`Uploaded: ${file.name}`);
      e.target.value = "";
    }
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = [...uploadedSchedules];
    newFiles.splice(index, 1);
    setUploadedSchedules(newFiles);
    toast.success("File removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Planner</h1>
          <p className="text-muted-foreground">
            Manage your study schedules and track your progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            id="schedule-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
          />
          <label htmlFor="schedule-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <div>
                <Upload className="mr-2 h-4 w-4" />
                Upload Schedule
              </div>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Add New Study Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    placeholder="E.g., Math revision"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  placeholder="Enter study details here..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleAddSchedule} className="bg-studyhub-600 hover:bg-studyhub-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            {uploadedSchedules.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No schedules uploaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {uploadedSchedules.map((filename, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="font-medium truncate max-w-[180px]">{filename}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Study Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduleItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No study sessions scheduled yet
            </p>
          ) : (
            <div className="space-y-4">
              {scheduleItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="min-w-[100px] text-center p-2 bg-studyhub-100 text-studyhub-800 rounded-md">
                      {format(item.date, "MMM dd, yyyy")}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSchedule(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanner;
