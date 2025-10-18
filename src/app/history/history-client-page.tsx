
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History, CheckCheck, XCircle, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksList } from '@/components/dashboard/tasks-list';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { allStaticTasks } from '@/components/dashboard/tasks-list';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

function ReportsList() {
    const loading = false;

    const historicalTasks = useMemo(() => 
        allStaticTasks
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        []
    );

    if (loading) {
        return (
            <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-2 border-b pb-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
            </div>
        );
    }

    return (
         <div className="space-y-2">
            {historicalTasks.map(task => (
                <div key={task.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div className='flex-1'>
                        <p className="font-semibold text-sm">{task.goal}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {format(task.createdAt, 'PPP')}
                        </p>
                    </div>
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
                        className={cn('capitalize w-24 justify-center', task.status === 'completed' && 'bg-green-600' )}
                        >
                        {task.status.replace('-', ' ')}
                    </Badge>
                </div>
            ))}
        </div>
    );
}

export default function HistoryClientPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'completed';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <CardTitle>Task & Report History</CardTitle>
        </div>
        <CardDescription>
          Review past activities, including completed tasks, failures, and a 30-day task log.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="completed">
                <CheckCheck className="mr-2 h-4 w-4" />
                Completed
            </TabsTrigger>
            <TabsTrigger value="failed">
                <XCircle className="mr-2 h-4 w-4" />
                Failed
            </TabsTrigger>
            <TabsTrigger value="log">
                <BookOpen className="mr-2 h-4 w-4" />
                30-Day Task Log
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="completed" className="mt-4">
            <TasksList statusFilter="completed" />
          </TabsContent>

          <TabsContent value="failed" className="mt-4">
            <TasksList statusFilter="failed" />
          </TabsContent>

          <TabsContent value="log" className="mt-4">
            <ReportsList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
