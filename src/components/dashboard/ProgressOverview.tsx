
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BookOpen, Award, Target } from "lucide-react";

interface SubjectProgress {
  name: string;
  progress: number;
  target: number;
  color: string;
}

interface ProgressOverviewProps {
  subjects: SubjectProgress[];
  currentStreak: number;
  bestStreak: number;
}

const ProgressOverview = ({ subjects, currentStreak, bestStreak }: ProgressOverviewProps) => {
  const chartConfig = {
    progress: {
      label: "Progress",
      color: "#8B5CF6",
    },
    target: {
      label: "Target",
      color: "#D1D5DB",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-studyhub-500" />
            Subject Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjects}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Bar
                  dataKey="progress"
                  fill="var(--color-progress)"
                  radius={[4, 4, 0, 0]}
                  name="Current Progress"
                />
                <Bar
                  dataKey="target"
                  fill="var(--color-target)"
                  radius={[4, 4, 0, 0]}
                  name="Target"
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <ChartTooltipContent payload={payload} />
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-studyhub-500" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">Current Streak</p>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                <span className="text-4xl font-bold">{currentStreak}</span>
                <span className="text-xl font-medium text-muted-foreground">days</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">Best Streak</p>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-studyhub-600" />
                <span className="text-3xl font-bold">{bestStreak}</span>
                <span className="text-lg font-medium text-muted-foreground">days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverview;
