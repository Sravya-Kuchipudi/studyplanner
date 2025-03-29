
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  BookOpen, 
  CheckCircle,
  AlertCircle,
  Clock
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

// Sample data - in a real app this would come from a database
const subjects = [
  { name: "Mathematics", lessons: 24, completed: 18, color: "#6b66f8" },
  { name: "Physics", lessons: 20, completed: 12, color: "#8189ff" },
  { name: "Chemistry", lessons: 18, completed: 10, color: "#a0b0ff" },
  { name: "Biology", lessons: 16, completed: 14, color: "#c4d0ff" },
  { name: "Computer Science", lessons: 22, completed: 8, color: "#5d49eb" }
];

const Progress = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total lessons and completed lessons
  const totalLessons = subjects.reduce((acc, subject) => acc + subject.lessons, 0);
  const completedLessons = subjects.reduce((acc, subject) => acc + subject.completed, 0);
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  // Prepare data for pie chart - subject distribution
  const pieData = subjects.map(subject => ({
    name: subject.name,
    value: subject.lessons,
    color: subject.color
  }));

  // Prepare data for bar chart - completion by subject
  const barData = subjects.map(subject => ({
    name: subject.name,
    completed: subject.completed,
    remaining: subject.lessons - subject.completed,
    color: subject.color
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Tracker</h1>
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
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons - completedLessons}</div>
            <p className="text-xs text-muted-foreground">
              Lessons yet to complete
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Progress Visualization</CardTitle>
          </div>
          <CardDescription>
            Visualize your study progress across different subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
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
            </TabsList>
            <TabsContent value="overview" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={60}
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} lessons`,
                      `${name}`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="detailed" className="h-full">
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
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="completed" 
                    stackId="a" 
                    name="Completed" 
                    fill="#4CAF50"
                  />
                  <Bar 
                    dataKey="remaining" 
                    stackId="a" 
                    name="Remaining" 
                    fill="#FFA726"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
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
          <div className="space-y-4">
            {subjects.map((subject) => {
              const percentage = Math.round((subject.completed / subject.lessons) * 100);
              return (
                <div key={subject.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subject.completed} of {subject.lessons} lessons completed
                      </p>
                    </div>
                    <span 
                      className="font-bold text-sm bg-muted px-2 py-1 rounded-full"
                      style={{ color: subject.color }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 ease-in-out"
                      style={{ width: `${percentage}%`, backgroundColor: subject.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
