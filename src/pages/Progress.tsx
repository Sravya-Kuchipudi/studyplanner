import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  BookOpen, 
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Plus,
  Trash2
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Progress as ProgressBar } from "@/components/ui/progress";

interface Subject {
  name: string;
  lessons: number;
  completed: number;
  color: string;
  timeSpent?: number;
}

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const initialSubjects: Subject[] = [
  { name: "Mathematics", lessons: 24, completed: 18, color: "#6b66f8", timeSpent: 0 },
  { name: "Physics", lessons: 20, completed: 12, color: "#8189ff", timeSpent: 0 },
  { name: "Chemistry", lessons: 18, completed: 10, color: "#a0b0ff", timeSpent: 0 },
  { name: "Biology", lessons: 16, completed: 14, color: "#c4d0ff", timeSpent: 0 },
  { name: "Computer Science", lessons: 22, completed: 8, color: "#5d49eb", timeSpent: 0 }
];

const getRandomColor = () => {
  const colors = ["#6b66f8", "#8189ff", "#a0b0ff", "#c4d0ff", "#5d49eb", "#4c9fe0", "#5a7dc2"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ProgressTracker = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState<Omit<Subject, "color">>({
    name: "",
    lessons: 0,
    completed: 0
  });
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  useEffect(() => {
    const savedSubjects = localStorage.getItem('studySubjects');
    
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects(initialSubjects);
    }
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      const timeSpentData = JSON.parse(localStorage.getItem('studyTimeSpent') || '{}');
      
      const updatedSubjects = subjects.map(subject => ({
        ...subject,
        timeSpent: timeSpentData[subject.name] || 0
      }));
      
      setSubjects(updatedSubjects);
    }
  }, [subjects.length]);

  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('studySubjects', JSON.stringify(subjects));
    }
  }, [subjects]);

  const totalLessons = subjects.reduce((acc, subject) => acc + subject.lessons, 0);
  const completedLessons = subjects.reduce((acc, subject) => acc + subject.completed, 0);
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalTimeSpent = subjects.reduce((acc, subject) => acc + (subject.timeSpent || 0), 0);

  const pieData = subjects.map(subject => ({
    name: subject.name,
    value: subject.lessons,
    color: subject.color
  }));

  const barData = subjects.map(subject => ({
    name: subject.name,
    completed: subject.completed,
    remaining: subject.lessons - subject.completed,
    color: subject.color
  }));

  const timeData = subjects.map(subject => ({
    name: subject.name,
    value: subject.timeSpent || 0,
    color: subject.color
  }));

  const chartConfig = subjects.reduce((config, subject) => {
    return {
      ...config,
      [subject.name]: {
        label: subject.name,
        color: subject.color,
      }
    };
  }, {});

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error("Please enter a subject name");
      return;
    }
    
    if (newSubject.lessons <= 0) {
      toast.error("Please enter a valid number of lessons");
      return;
    }
    
    if (newSubject.completed > newSubject.lessons) {
      toast.error("Completed lessons cannot exceed total lessons");
      return;
    }

    const updatedSubjects = [
      ...subjects,
      {
        ...newSubject,
        color: getRandomColor(),
        timeSpent: 0
      }
    ];

    setSubjects(updatedSubjects);
    setNewSubject({
      name: "",
      lessons: 0,
      completed: 0
    });
    setIsAddDialogOpen(false);
    toast.success("Subject added successfully");
  };

  const handleEditSubject = () => {
    if (!editingSubject) return;
    
    if (!editingSubject.name) {
      toast.error("Please enter a subject name");
      return;
    }
    
    if (editingSubject.lessons <= 0) {
      toast.error("Please enter a valid number of lessons");
      return;
    }
    
    if (editingSubject.completed > editingSubject.lessons) {
      toast.error("Completed lessons cannot exceed total lessons");
      return;
    }

    const updatedSubjects = subjects.map(subject => 
      subject.name === editingSubject?.name ? {...editingSubject, timeSpent: subject.timeSpent || 0} : subject
    );

    setSubjects(updatedSubjects);
    setEditingSubject(null);
    setIsEditDialogOpen(false);
    toast.success("Subject updated successfully");
  };

  const handleDeleteSubject = () => {
    if (!subjectToDelete) return;
    
    const updatedSubjects = subjects.filter(
      subject => subject.name !== subjectToDelete.name
    );
    
    setSubjects(updatedSubjects);
    setSubjectToDelete(null);
    toast.success("Subject deleted successfully");
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject({...subject});
    setIsEditDialogOpen(true);
  };

  const confirmDeleteSubject = (subject: Subject) => {
    setSubjectToDelete(subject);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Progress Tracker</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-studyhub-600 hover:bg-studyhub-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Add a new subject to track your progress
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Name</label>
                  <Input
                    placeholder="E.g., Mathematics"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Lessons</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="E.g., 20"
                    value={newSubject.lessons || ""}
                    onChange={(e) => setNewSubject({ ...newSubject, lessons: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Completed Lessons</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="E.g., 5"
                    value={newSubject.completed || ""}
                    onChange={(e) => setNewSubject({ ...newSubject, completed: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject}>
                  Add Subject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">
          Track your learning progress across all subjects
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-studyhub-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Active learning subjects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Clock className="h-4 w-4 text-studyhub-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Lessons across all subjects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons}</div>
            <p className="text-xs text-muted-foreground">
              Lessons completed so far
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Total study time
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Progress Visualization</CardTitle>
          </div>
          <CardDescription>
            Visualize your study progress across different subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <PieChartIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-1">
                <BarChartIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Detailed</span>
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Time Spent</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="h-[350px] w-full">
              <TabsContent value="overview" className="h-full mt-0">
                {subjects.length > 0 ? (
                  <ChartContainer className="h-full" config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No subjects added yet</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="detailed" className="h-full mt-0">
                {subjects.length > 0 ? (
                  <ChartContainer className="h-full" config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Lessons', angle: -90, position: 'insideLeft' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar 
                          dataKey="completed" 
                          name="Completed" 
                          fill="#4CAF50"
                        />
                        <Bar 
                          dataKey="remaining" 
                          name="Remaining" 
                          fill="#FFA726"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No subjects added yet</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="time" className="h-full mt-0">
                {subjects.length > 0 && subjects.some(s => (s.timeSpent || 0) > 0) ? (
                  <ChartContainer className="h-full" config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeData.filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${formatTime(value as number)}`}
                          dataKey="value"
                        >
                          {timeData.filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No study time recorded yet</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
          <CardDescription>
            Detailed breakdown of your progress in each subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No subjects added</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                Add subjects to track your learning progress
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Subject
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {subjects.map((subject) => {
                const percentage = Math.round((subject.completed / subject.lessons) * 100);
                return (
                  <div key={subject.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{subject.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:gap-3 sm:items-center mt-1">
                          <p className="text-sm text-muted-foreground">
                            {subject.completed} of {subject.lessons} lessons completed
                          </p>
                          {subject.timeSpent && subject.timeSpent > 0 && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> 
                              {formatTime(subject.timeSpent)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-bold text-sm bg-muted px-2 py-1 rounded-full"
                          style={{ color: subject.color }}
                        >
                          {percentage}%
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(subject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {subject.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => confirmDeleteSubject(subject)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <ProgressBar value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the details for this subject
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Name</label>
              <Input
                placeholder="E.g., Mathematics"
                value={editingSubject?.name || ""}
                onChange={(e) => setEditingSubject(prev => prev ? {...prev, name: e.target.value} : null)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Lessons</label>
              <Input
                type="number"
                min="1"
                placeholder="E.g., 20"
                value={editingSubject?.lessons || ""}
                onChange={(e) => setEditingSubject(prev => prev ? {...prev, lessons: parseInt(e.target.value) || 0} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Completed Lessons</label>
              <Input
                type="number"
                min="0"
                placeholder="E.g., 5"
                value={editingSubject?.completed || ""}
                onChange={(e) => setEditingSubject(prev => prev ? {...prev, completed: parseInt(e.target.value) || 0} : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubject}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressTracker;
