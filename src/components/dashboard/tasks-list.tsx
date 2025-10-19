
'use client';

import { ListChecks, CheckCheck, XCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskItem } from './task-item';
import { Task } from '@/lib/firestore-types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function TasksListSkeleton() {
  return (
    <div className="space-y-6 pr-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

const pageConfig = {
  all: {
    icon: <ListChecks className="h-5 w-5" />,
    title: 'Recent Tasks',
    description: "An overview of all the agent's tasks.",
  },
  'in-progress': {
    icon: <Loader className="h-5 w-5 animate-spin" />,
    title: 'In Progress Tasks',
    description: "Tasks the agent is currently working on.",
  },
  completed: {
    icon: <CheckCheck className="h-5 w-5" />,
    title: 'Completed Tasks',
    description: 'A history of all tasks successfully completed by the agent.',
  },
  failed: {
    icon: <XCircle className="h-5 w-5" />,
    title: 'Failed Tasks',
    description: 'Tasks that failed during execution.',
  },
};

export const allStaticTasks: Task[] = [
    {
        id: 'task-1',
        goal: 'Ensure all production servers are patched',
        status: 'in-progress',
        progress: 40,
        createdAt: new Date(),
        steps: [
            { description: 'Create Jira ticket', action: 'create_jira_ticket', status: 'completed', log: 'Ticket NEX-123 created.' },
            { description: 'List all production servers', action: 'list_servers', status: 'completed', log: 'Found 2 servers.' },
            { description: 'Apply security patch to web-server-01', action: 'apply_patch', status: 'in-progress' },
            { description: 'Apply security patch to web-server-02', action: 'apply_patch', status: 'pending' },
            { description: 'Verify patch installation', action: 'verify_patch', status: 'pending' },
        ]
    },
    {
        id: 'task-2',
        goal: 'Onboard new developer to the project-x repository',
        status: 'completed',
        progress: 100,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        steps: [
            { description: 'Grant repository access', action: 'grant_access', status: 'completed', log: 'Access granted.' },
            { description: 'Send welcome email', action: 'send_email', status: 'completed', log: 'Email sent.' },
        ]
    },
    {
        id: 'task-3',
        goal: 'Diagnose and fix high CPU on cache server',
        status: 'completed',
        progress: 100,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        steps: [
            { description: 'Analyze server metrics', action: 'analyze_metrics', status: 'completed' },
            { description: 'Clear expired cache keys', action: 'clear_cache', status: 'completed', log: 'Cleared 5,234 keys.' },
        ]
    },
    {
        id: 'task-4',
        goal: 'Reboot staging database server',
        status: 'failed',
        progress: 50,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        steps: [
            { description: 'Notify team on Slack', action: 'send_slack', status: 'completed', log: 'Notification sent to #ops-channel.' },
            { description: 'Initiate reboot command', action: 'reboot_vm', status: 'failed', log: 'Connection timed out. Server unreachable.' },
            { description: 'Verify server status', action: 'verify_status', status: 'pending' },
        ]
    },
    {
        id: 'task-5',
        goal: '[Self-Correction] The goal "Reboot staging database server" failed.',
        status: 'in-progress',
        progress: 25,
        createdAt: new Date(),
        steps: [
            { description: 'Create high-priority Jira ticket', action: 'create_jira_ticket', status: 'completed', log: 'Ticket NEX-124 created.' },
            { description: 'Attempt to connect via recovery console', action: 'connect_recovery', status: 'in-progress' },
            { description: 'Force restart from hypervisor', action: 'force_restart', status: 'pending' },
        ]
    },
    {
        id: 'task-6',
        goal: 'Deploy web app',
        status: 'superseded',
        progress: 100,
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        steps: [
             { description: 'Run build script', action: 'run_build', status: 'completed' },
             { description: 'Deploy to staging', action: 'deploy_staging', status: 'completed' },
        ]
    }
];


function TaskListView({ tasks, loading, heightClass }: { tasks: Task[] | null, loading: boolean, heightClass: string }) {
    return (
        <ScrollArea className={heightClass}>
          {loading ? (
             <TasksListSkeleton />
          ) : (
            <div className="space-y-6 pr-6">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No tasks found for this filter.</p>
              )}
            </div>
          )}
        </ScrollArea>
    );
}


export function TasksList({ statusFilter }: { statusFilter?: 'in-progress' | 'completed' | 'failed' | undefined }) {

  const loading = false;
  
  const tasks = useMemo(() => {
    if (!statusFilter) {
      return allStaticTasks;
    }
    return allStaticTasks.filter(task => task.status === statusFilter);
  }, [statusFilter]);
  
  const [currentTab, setCurrentTab] = useState(statusFilter || 'all');

  const filteredTasks = useMemo(() => {
    if (currentTab === 'all') return allStaticTasks.filter(t => t.status !== 'superseded');
    return allStaticTasks.filter(task => task.status === currentTab);
  }, [currentTab]);


  const config = pageConfig[statusFilter || 'all'];

  const scrollAreaHeight = statusFilter ? 'h-[calc(100vh-220px)]' : 'h-80';

  if (statusFilter && !['in-progress', 'completed', 'failed'].includes(statusFilter)) {
      // On the main /tasks page, handle filter
     return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <div className="flex items-center gap-2">
                {config.icon}
                <CardTitle>{config.title}</CardTitle>
                </div>
                <CardDescription>
                {config.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TaskListView tasks={tasks} loading={loading} heightClass={scrollAreaHeight} />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          {pageConfig['all'].icon}
          <CardTitle>{pageConfig['all'].title}</CardTitle>
        </div>
        <CardDescription>
          {pageConfig['all'].description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
            <TaskListView tasks={filteredTasks} loading={loading} heightClass={scrollAreaHeight} />
        </Tabs>
      </CardContent>
    </Card>
  );
}

