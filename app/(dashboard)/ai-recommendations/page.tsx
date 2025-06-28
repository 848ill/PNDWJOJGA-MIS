// app/(dashboard)/ai-recommendations/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { generateAiReport } from './action';
import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowRight } from 'lucide-react';

export default function AiRecommendationsPage() {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    setReport('');
    
    const result = await generateAiReport();

    if (result.success) {
      setReport(result.report);
    } else {
      setReport(result.report);
    }
    setLoading(false);
  };

  // FIX: Custom components with improved styling for better contrast and readability.
  const markdownComponents = {
    h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold mb-6 text-foreground" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-xl font-semibold border-b pb-2 mt-8 mb-4 text-foreground" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-none space-y-4 pl-2" {...props} />,
    li: ({node, ...props}: any) => (
      <li className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
        {/* FIX: Set body text color to muted-foreground for better hierarchy */}
        <span className="flex-1 text-muted-foreground">{props.children}</span>
      </li>
    ),
    // FIX: All paragraph text will now use the standard muted foreground color
    p: ({node, ...props}: any) => <p className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-4" {...props} />,
    strong: ({node, ...props}: any) => <strong className="font-semibold text-foreground" {...props} />,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Strategy Recommendations</h1>
        <Button onClick={handleGenerateReport} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate New Report'
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Generated Report</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center text-muted-foreground">The AI is analyzing data, this may take a moment...</p>}

          {!loading && !report && (
            <div className="text-center text-muted-foreground py-10">
              <p>Click "Generate New Report" to get started.</p>
              <p className="text-sm">The AI will analyze the latest 100 complaints and provide strategic advice.</p>
            </div>
          )}

          {report && (
            // FIX: Removed the generic 'prose' class to allow our custom styles to take full control.
            <div className="max-w-none">
              <ReactMarkdown components={markdownComponents}>{report}</ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}