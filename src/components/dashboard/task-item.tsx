'use client';

import { useState, useTransition, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Loader, ChevronDown, ChevronUp, Bot, Recycle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RcaReportDialog } from './rca-report-dialog';
import type { Task } from '@/lib/firestore-types';
import { useToast } from '@/hooks/use-toast';
import { retryTaskAction } from '@/lib/actions';

const statusIcons = {
  'in-progress': <Loader className="h-4 w-4 animate-spin text-blue-500" />,
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
  superseded: <Recycle className="h-4 w-4 text-gray-500" />,
};

const stepStatusIcons = {
  pending: <Loader className="h-3 w-3 animate-spin text-muted-foreground" />,
  completed: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  failed: <XCircle className="h-3 w-3 text-red-500" />,
};

function StepLog({ log }: { log: string }) {
    return (
        <div className="mt-1 text-xs text-muted-foreground pl-5 border-l border-dashed border-border ml-1.5 font-mono bg-muted/50 p-2 rounded-md">
            {log}
        </div>
    );
}

function RetryButton({ task }: { task: Task }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleRetry = () => {
        startTransition(async () => {
            const result = await retryTaskAction(task);
            if(result.success) {
                toast({
                    title: 'AI Self-Healing Initiated',
                    description: `AI is analyzing the failure for task '${task.id}' and creating a new plan.`,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error || 'Failed to retry task.',
                });
            }
        });
    };

    return (
        <Button variant="outline" size="sm" onClick={handleRetry} disabled={isPending}>
            <Bot className={cn('mr-2 h-4 w-4', isPending && 'animate-spin')} />
            {isPending ? 'Analyzing...' : 'Retry with AI'}
        </Button>
    );
}

export function TaskItem({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // This ensures the time is only calculated on the client, after hydration
    setTimeAgo(formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }));
  }, [task.createdAt]);

  const statusIcon = statusIcons[task.status];
  const isFinished = task.status === 'completed' || task.status === 'failed';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <h3 className="text-base font-medium truncate pr-4">{task.goal}</h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {statusIcon}
            <Badge
              variant={
                task.status === 'completed'
                  ? 'default'
                  : task.status === 'failed'
                  ? 'destructive'
                  : task.status === 'superseded'
                  ? 'outline'
                  : 'secondary'
              }
              className={cn('capitalize', task.status === 'completed' && 'bg-green-600' )}
            >
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Progress value={task.progress} className="h-2 flex-1" />
            <span className="text-xs font-medium text-muted-foreground w-10 text-right">{task.progress}%</span>
        </div>
         <p className="text-xs text-muted-foreground">
            {timeAgo ? `Created ${timeAgo}` : 'Created...'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="ml-2">Details</span>
              </Button>
            </CollapsibleTrigger>
            {isFinished && task.id && <RcaReportDialog taskId={task.id} />}
          </div>
          {task.status === 'failed' && <RetryButton task={task} />}
        </div>
      </div>
      <CollapsibleContent className="mt-4 space-y-3 pl-4">
        {task.steps.map((step, index) => (
          <div key={index}>
            <div className="flex items-center text-sm">
              {stepStatusIcons[step.status]}
              <span className={cn('ml-2', step.status === 'pending' && 'text-muted-foreground')}>{step.description}</span>
            </div>
            {step.log && <StepLog log={step.log} />}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
