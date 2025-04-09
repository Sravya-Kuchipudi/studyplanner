
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

interface MotivationTrackerProps {
  currentStreak: number;
  motivationMessage: string;
}

const MotivationTracker = ({ currentStreak, motivationMessage }: MotivationTrackerProps) => {
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
  
  const handleFeedback = (type: 'liked' | 'disliked') => {
    setFeedback(type);
    // In a real implementation, we would send this feedback to the server
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-studyhub-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-md">
          <p className="italic text-center">{motivationMessage}</p>
        </div>
        
        {currentStreak > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {currentStreak > 5 
                ? `Amazing! You've been consistent for ${currentStreak} days.` 
                : `You're on a ${currentStreak}-day streak. Keep it up!`}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFeedback('liked')}
          className={feedback === 'liked' ? 'bg-muted' : ''}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFeedback('disliked')}
          className={feedback === 'disliked' ? 'bg-muted' : ''}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          Not helpful
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MotivationTracker;
