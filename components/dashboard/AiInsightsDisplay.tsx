// components/dashboard/AiInsightsDisplay.tsx
'use client'; // This component will run on the client-side

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Shadcn Accordion
import { Badge } from '@/components/ui/badge'; // Shadcn Badge

// Install lucide-react if you haven't: npm install lucide-react
import { Lightbulb, Info, AlertTriangle, CheckCircle } from 'lucide-react'; 

// Define a type for the AI insight data structure
interface AiInsight {
  id: string; // Unique ID for the insight (e.g., complaint ID)
  mainTopic: string | null;
  summary: string | null;
  advice: string | null;
  whatToDo: string | null;
  sentiment: string | null;
  categoryName: string | null;
}

interface AiInsightsDisplayProps {
  insights: AiInsight[];
}

export default function AiInsightsDisplay({ insights }: AiInsightsDisplayProps) {
  const getSentimentBadgeVariant = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'negative': return 'destructive';
      case 'positive': return 'default';
      case 'neutral': return 'secondary';
      default: return 'outline';
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
          <CardDescription>Intelligent analysis of your complaint data.</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
          <p>No AI insights available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Recommendations</CardTitle>
        <CardDescription>Intelligent analysis of your complaint data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {insights.map((insight) => (
            <AccordionItem key={insight.id} value={insight.id}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium text-left truncate pr-4">
                    {insight.mainTopic || 'General Insight'}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {insight.categoryName && <Badge variant="outline">{insight.categoryName}</Badge>}
                    {insight.sentiment && (
                      <Badge variant={getSentimentBadgeVariant(insight.sentiment)}>
                        {insight.sentiment}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  {insight.summary && (
                    <p><strong className="font-semibold">Summary:</strong> {insight.summary}</p>
                  )}
                  {insight.advice && (
                    <p><strong className="font-semibold">Advice:</strong> {insight.advice}</p>
                  )}
                  {insight.whatToDo && (
                    <p><strong className="font-semibold">Action:</strong> {insight.whatToDo}</p>
                  )}
                  {!insight.summary && !insight.advice && !insight.whatToDo && (
                    <p className="italic">No detailed analysis available.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}