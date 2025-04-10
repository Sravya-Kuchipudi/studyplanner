
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Upload, PlusCircle, Trash2, FileText, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
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

interface ScheduleItem {
  id: string;
  date: Date;
  title: string;
  description: string;
  method?: StudyMethod;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

const StudyPlanner = () => {
  const [date, setDate] = useState<Date>();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [studyMethod, setStudyMethod] = useState<StudyMethod>("pomodoro");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
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
      const savedSchedule = localStorage.getItem("study-schedule");
      if (savedSchedule) {
        const parsed = JSON.parse(savedSchedule);
        setScheduleItems(
          parsed.map((item: any) => ({
            ...item,
            date: new Date(item.date),
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
      localStorage.setItem("study-schedule", JSON.stringify(scheduleItems));
    } catch (error) {
      console.error("Error saving schedule to local storage", error);
    }
  }, [scheduleItems]);
  
  useEffect(() => {
    try {
      localStorage.setItem("uploaded-files", JSON.stringify(uploadedFiles));
    } catch (error) {
      console.error("Error saving files to local storage", error);
    }
  }, [uploadedFiles]);

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
      method: studyMethod,
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

  return (
    <>
      <div className={cn("space-y-6", isFocusMode && "max-w-3xl mx-auto")}>
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

        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="plan">Plan & Schedule</TabsTrigger>
            <TabsTrigger value="focus">Focus Mode</TabsTrigger>
            <TabsTrigger value="settings">Settings & Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan" className="space-y-4">
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
                    
                    <Button onClick={handleAddSchedule} className="bg-studyhub-600 hover:bg-studyhub-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add to Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadedFiles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No files uploaded yet
                    </p>
                  ) : (
                    <div className="space-y-2">
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
                            {item.method && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-studyhub-100 text-studyhub-800">
                                  {item.method === "pomodoro" && "Pomodoro"}
                                  {item.method === "spaced" && "Spaced Repetition"}
                                  {item.method === "custom" && "Custom Method"}
                                </span>
                              </div>
                            )}
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

export default StudyPlanner;
