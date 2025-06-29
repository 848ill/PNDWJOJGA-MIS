// components/dashboard/AiInsightsDisplay.tsx
'use client'; // This component will run on the client-side

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuitIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionDiv } from "@/components/shared/MotionDiv";

interface Insight {
  title: string;
  summary: string;
}

interface AiInsightsDisplayProps {
  insights: Insight[] | null;
  isLoading: boolean;
}

export const AiInsightsDisplay = ({ insights, isLoading }: AiInsightsDisplayProps) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">AI-Generated Insights</CardTitle>
          <BrainCircuitIcon className="h-6 w-6 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : insights && insights.length > 0 ? (
            <ul className="space-y-3 pt-4">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="ml-3 text-sm">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</p>
                    <p className="text-gray-600 dark:text-gray-400">{insight.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pt-4 text-center text-gray-500">No AI insights available at the moment.</p>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
};