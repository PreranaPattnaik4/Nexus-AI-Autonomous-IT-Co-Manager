'use client';

import { useTransition } from 'react';
import { AlertTriangle, Bot, CheckCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert } from '@/lib/firestore-types';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { initialAlerts } from '@/lib/data';
import { resolveAlertAction } from '@/lib/actions';


const severityIcons = {
  high: <AlertTriangle className="h-5 w-5 text-red-500" />,
  medium: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  low: <Info className="h-5 w-5 text-blue-500" />,
};

function ResolveButton({ alert }: { alert: Omit<Alert, 'id' | 'timestamp'> }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const result = await resolveAlertAction(alert);
      if (result.success) {
        toast({
            title: 'Action Initiated',
            description: `Creating a new task to resolve: ${alert.title}`,
            action: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || `Failed to create task for alert: ${alert.title}`,
        });
      }
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={handleClick} disabled={isPending}>
      <Bot className={cn('mr-2 h-4 w-4', isPending && 'animate-spin')} />
      {isPending ? 'Resolving...' : 'Resolve with AI'}
    </Button>
  );
}

function AlertsListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      ))}
    </div>
  );
}

export function AlertsCard() {
  const alerts = initialAlerts.map((a, i) => ({ ...a, id: `alert-${i}`, timestamp: new Date(Date.now() - i * 60000 * 15) }));
  const loading = false;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle>Active Alerts</CardTitle>
        </div>
        <CardDescription>
          Critical issues that may require attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-56">
          {loading ? (
            <AlertsListSkeleton />
          ) : (
            <div className="space-y-4">
              {alerts && alerts?.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {severityIcons[alert.severity]}
                      <div>
                        <h3 className="text-sm font-semibold leading-tight">{alert.title}</h3>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp && formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <ResolveButton alert={{ title: alert.title, description: alert.description, severity: alert.severity }} />
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">No active alerts.</p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
