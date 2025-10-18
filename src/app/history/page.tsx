
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import HistoryClientPage from './history-client-page';

function HistoryLoading() {
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
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryLoading />}>
      <HistoryClientPage />
    </Suspense>
  );
}
