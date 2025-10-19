'use client';

import { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import { generateRcaReportAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function RcaReportDialog({ taskId }: { taskId: string }) {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpen = async () => {
    if (report) return;
    setIsLoading(true);

    const result = await generateRcaReportAction(taskId);
    if (result.success && result.report) {
      const htmlReport = marked.parse(result.report);
      setReport(htmlReport);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to generate RCA report.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && setReport('')}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" onClick={handleOpen}>
          <FileText className="mr-2 h-4 w-4" />
          View RCA Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Root Cause Analysis Report</DialogTitle>
          <DialogDescription>AI-generated report for task: {taskId}</DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto rounded-md border p-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Generating report...</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: report }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
