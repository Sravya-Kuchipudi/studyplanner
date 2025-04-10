
import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type StudyMethod = 'pomodoro' | 'spaced' | 'feynman' | 'active' | 'retrieval' | 'custom';

interface StudyMethodProps {
  value: StudyMethod;
  onChange: (method: StudyMethod) => void;
}

interface MethodOption {
  id: StudyMethod;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

const StudyMethodSelector = ({ value, onChange }: StudyMethodProps) => {
  const methods: MethodOption[] = [
    {
      id: 'pomodoro',
      name: 'Pomodoro',
      description: 'Focus for 25 mins, then take a 5-minute break'
    },
    {
      id: 'spaced',
      name: 'Spaced Repetition',
      description: 'Review material at increasing intervals'
    },
    {
      id: 'feynman',
      name: 'Feynman Technique',
      description: 'Learn by teaching/explaining concepts'
    },
    {
      id: 'active',
      name: 'Active Recall',
      description: 'Actively stimulate memory during learning'
    },
    {
      id: 'retrieval',
      name: 'Retrieval Practice',
      description: 'Test yourself to reinforce learning'
    },
    {
      id: 'custom',
      name: 'Custom Method',
      description: 'Create your own study method'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Study Method
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                  <HelpCircle size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Choose a study method that works best for you. Each method has different approaches to help you retain information.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {methods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "flex items-start space-x-2 rounded-md border p-3 cursor-pointer hover:border-studyhub-300 transition-colors",
                value === method.id && "border-studyhub-500 bg-studyhub-50"
              )}
              onClick={() => onChange(method.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {value === method.id ? (
                  <div className="h-5 w-5 rounded-full bg-studyhub-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyMethodSelector;
