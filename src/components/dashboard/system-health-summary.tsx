
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const healthData = {
  score: 88, // Example score
};

const getHealthColor = (score: number) => {
  if (score >= 85) return 'hsl(var(--chart-2))'; // Green
  if (score >= 60) return 'hsl(var(--chart-1))'; // Yellow
  return 'hsl(var(--destructive))'; // Red
};

const getHealthLabel = (score: number) => {
  if (score >= 85) return 'Healthy';
  if (score >= 60) return 'Moderate';
  return 'Critical';
};

const healthColor = getHealthColor(healthData.score);
const healthLabel = getHealthLabel(healthData.score);

const chartData = [
  { name: 'Health', value: healthData.score },
  { name: 'Remaining', value: 100 - healthData.score },
];

export function SystemHealthSummary() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5" />
          <CardTitle>System Health</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-around">
        <div className="relative h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                <Cell fill={healthColor} />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
            <span className="text-2xl font-bold" style={{ color: healthColor }}>
              {healthData.score}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold" style={{ color: healthColor }}>{healthLabel}</p>
          <p className="text-xs text-muted-foreground">Overall system stability</p>
        </div>
      </CardContent>
    </Card>
  );
}
