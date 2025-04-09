
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <Card className="shadow-md border-studyhub-200 dark:border-studyhub-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-studyhub-500" />
          Current Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <div className="text-5xl font-bold mb-2 studyhub-gradient text-transparent bg-clip-text">
            {format(currentTime, "hh:mm:ss a")}
          </div>
          <div className="text-muted-foreground text-lg">
            {format(currentTime, "EEEE, MMMM d, yyyy")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentTime;
