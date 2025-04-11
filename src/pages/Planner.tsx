
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Upload, PlusCircle, Trash2, FileText, Eye, CheckCircle2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import FocusMode from "@/components/focus/FocusMode";
import StudyMethodSelector, { StudyMethod } from "@/components/study/StudyMethodSelector";
import PrivacyInfo from "@/components/common/PrivacyInfo";
import Onboarding from "@/components/onboarding/Onboarding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  method?: StudyMethod;
  tags: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

const Planner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as 'low' | 'medium' | 'high',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [studyMethod, setStudyMethod] = useState<StudyMethod>("pomodoro");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [completionRate, setCompletionRate] = useState(0);
  
  // Check if first time user
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding-completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);
  
  // Load data from local storage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("planner-tasks");
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        setTasks(
          parsed.map((task: any) => ({
            ...task,
            date: new Date(task.date),
          }))
        );
      }
      
      const savedFiles = localStorage.getItem("uploaded-files");
      if (savedFiles) {
        setUploadedFiles(JSON.parse(savedFiles));
      }
    } catch (error) {
      console.error("Error loading data from local storage", error);
    }
  }, []);
  
  // Save data to local storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("planner-tasks", JSON.stringify(tasks));
      // Calculate completion rate
      if (tasks.length > 0) {
        const completedCount = tasks.filter(task => task.completed).length;
        setCompletionRate(Math.round((completedCount / tasks.length) * 100));
      } else {
        setCompletionRate(0);
      }
    } catch (error) {
      console.error("Error saving tasks to local storage", error);
    }
  }, [tasks]);
  
  useEffect(() => {
    try {
      localStorage.setItem("uploaded-files", JSON.stringify(uploadedFiles));
    } catch (error) {
      console.error("Error saving files to local storage", error);
    }
  }, [uploadedFiles]);

  const handleAddTask = () => {
    if (!date || !newTask.title) {
      toast.error("Please select a date and enter a title");
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      date,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      completed: false,
      method: studyMethod,
      tags: newTask.tags,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      tags: [],
    });
    toast.success("Task added successfully");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task removed");
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast(task.completed ? "Task marked incomplete" : "Task completed!");
    }
  };

  const addTag = () => {
    if (newTag && !newTask.tags.includes(newTag)) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, newTag]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // Create file URL
      const fileUrl = URL.createObjectURL(file);
      
      // Add to uploaded files
      const newFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: fileUrl
      };
      
      setUploadedFiles([...uploadedFiles, newFile]);
      
      toast.success(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const handleViewFile = (file: UploadedFile) => {
    setViewingFile(file);
    setShowFileDialog(true);
  };

  const handleDeleteFile = (id: string) => {
    const fileToDelete = uploadedFiles.find(file => file.id === id);
    if (fileToDelete?.url) {
      URL.revokeObjectURL(fileToDelete.url);
    }
    
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
    toast.success("File removed");
  };
  
  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    date && isSameDay(task.date, date)
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <FileText className="h-4 w-4 text-green-500" />;
    } else if (fileType.includes('image')) {
      return <FileText className="h-4 w-4 text-purple-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className={cn("space-y-6", isFocusMode && "max-w-3xl mx-auto")}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Planner</h1>
            <p className="text-muted-foreground">
              Organize your tasks, track progress, and boost productivity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              id="schedule-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
              disabled={isProcessing}
            />
            <label htmlFor="schedule-upload">
              <Button variant="outline" className="cursor-pointer" asChild disabled={isProcessing || isFocusMode}>
                <div>
                  {isProcessing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-t-primary border-l-primary border-r-primary"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </>
                  )}
                </div>
              </Button>
            </label>
          </div>
        </div>

        {tasks.length > 0 && (
          <Card className="bg-gradient-to-r from-studyhub-50 to-studyhub-100/30">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h3 className="font-medium mb-2 sm:mb-0">Your Progress</h3>
                <div className="text-sm font-medium">{completionRate}% Complete</div>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <div>{tasks.filter(t => t.completed).length} completed</div>
                <div>{tasks.filter(t => !t.completed).length} pending</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="focus">Focus Mode</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 order-1 md:order-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 order-3 md:order-2">
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        placeholder="E.g., Complete math assignment"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        placeholder="Enter task details here..."
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-3 sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Tags</label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {newTask.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center gap-1 px-2 py-1">
                              {tag}
                              <button 
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="h-3 w-3 rounded-full ml-1">
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newTag) {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            disabled={!newTag}
                            onClick={addTag}>
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <div className="grid grid-cols-3 gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={newTask.priority === "low" ? "default" : "outline"}
                            className={cn(
                              newTask.priority === "low" && "bg-green-600 hover:bg-green-700",
                              "h-9"
                            )}
                            onClick={() => setNewTask({...newTask, priority: "low"})}
                          >
                            Low
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={newTask.priority === "medium" ? "default" : "outline"}
                            className={cn(
                              newTask.priority === "medium" && "bg-amber-500 hover:bg-amber-600",
                              "h-9"
                            )}
                            onClick={() => setNewTask({...newTask, priority: "medium"})}
                          >
                            Med
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={newTask.priority === "high" ? "default" : "outline"}
                            className={cn(
                              newTask.priority === "high" && "bg-red-600 hover:bg-red-700",
                              "h-9"
                            )}
                            onClick={() => setNewTask({...newTask, priority: "high"})}
                          >
                            High
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium mb-1">Study Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={studyMethod === "pomodoro" ? "default" : "outline"}
                          className={cn(
                            studyMethod === "pomodoro" && "bg-studyhub-600 hover:bg-studyhub-700"
                          )}
                          onClick={() => setStudyMethod("pomodoro")}
                        >
                          Pomodoro
                        </Button>
                        <Button
                          type="button"
                          variant={studyMethod === "spaced" ? "default" : "outline"}
                          className={cn(
                            studyMethod === "spaced" && "bg-studyhub-600 hover:bg-studyhub-700"
                          )}
                          onClick={() => setStudyMethod("spaced")}
                        >
                          Spaced
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStudyMethod("custom")}
                          className={cn(
                            studyMethod === "custom" && "border-studyhub-600 text-studyhub-700"
                          )}
                        >
                          Custom
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddTask} 
                      className="bg-studyhub-600 hover:bg-studyhub-700"
                      disabled={!newTask.title || !date}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-1 order-2 md:order-3">
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadedFiles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No files uploaded yet
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-md"
                        >
                          <div className="font-medium truncate max-w-[180px] flex items-center">
                            {getFileIcon(file.type)}
                            <span className="ml-2">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewFile(file)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {date ? (
                    <>Tasks for {format(date, "MMMM d, yyyy")}</>
                  ) : (
                    <>All Tasks</>
                  )}
                </CardTitle>
                {tasksForSelectedDate.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {tasksForSelectedDate.filter(t => t.completed).length}/{tasksForSelectedDate.length} completed
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {tasksForSelectedDate.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    No tasks scheduled for this date
                  </p>
                ) : (
                  <div className="space-y-4">
                    {tasksForSelectedDate.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-start justify-between p-4 border rounded-lg transition-colors",
                          task.completed ? "bg-muted/50 border-muted" : "hover:bg-muted/20"
                        )}
                      >
                        <div className="flex gap-4">
                          <Button 
                            variant="ghost"
                            size="icon" 
                            className={cn(
                              "h-6 w-6 rounded-full p-0 mr-2",
                              task.completed && "text-green-500"
                            )}
                            onClick={() => handleToggleComplete(task.id)}
                          >
                            <CheckCircle2 className={cn(
                              "h-5 w-5",
                              task.completed ? "fill-current" : "fill-none"
                            )} />
                          </Button>
                          
                          <div>
                            <h3 className={cn(
                              "font-medium",
                              task.completed && "line-through text-muted-foreground"
                            )}>
                              {task.title}
                            </h3>
                            
                            <p className={cn(
                              "text-sm text-muted-foreground mt-1",
                              task.completed && "line-through"
                            )}>
                              {task.description || "No description provided"}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge className={cn("mr-1", getPriorityColor(task.priority))}>
                                {task.priority}
                              </Badge>
                              
                              {task.method && (
                                <Badge variant="outline">
                                  {task.method === "pomodoro" && "Pomodoro"}
                                  {task.method === "spaced" && "Spaced Repetition"}
                                  {task.method === "custom" && "Custom Method"}
                                </Badge>
                              )}
                              
                              {task.tags && task.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-gray-100">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="focus">
            <FocusMode onFocusChange={(focusing) => setIsFocusMode(focusing)} />
            <div className="mt-6">
              <StudyMethodSelector value={studyMethod} onChange={setStudyMethod} />
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <PrivacyInfo />
              
              <Card>
                <CardHeader>
                  <CardTitle>App Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Onboarding</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Review the app introduction and feature tour
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowOnboarding(true)}
                      >
                        Show Onboarding
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {viewingFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6 bg-muted/30 rounded-md border">
            {viewingFile && (
              <div className="h-full flex items-center justify-center">
                {viewingFile.type.includes('pdf') ? (
                  <iframe 
                    src={viewingFile.url} 
                    className="w-full h-full min-h-[500px] border-none"
                    title={viewingFile.name}
                  />
                ) : viewingFile.type.includes('image') ? (
                  <img 
                    src={viewingFile.url} 
                    alt={viewingFile.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">File Preview</h3>
                    <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                    <Button 
                      onClick={() => window.open(viewingFile.url, '_blank')}
                      className="bg-studyhub-600 hover:bg-studyhub-700"
                    >
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Onboarding 
        open={showOnboarding} 
        onComplete={() => setShowOnboarding(false)} 
      />
    </>
  );
};

export default Planner;
