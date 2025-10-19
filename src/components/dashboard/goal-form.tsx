'use client';

import { useRef, useTransition } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createTaskAction } from '@/lib/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Generating...' : 'Create Task'}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}

const GoalFormSchema = z.object({
  goal: z.string().min(10, 'Goal must be at least 10 characters long.'),
});

export function GoalForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof GoalFormSchema>>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: {
      goal: '',
    },
  });

  const onSubmit = (values: z.infer<typeof GoalFormSchema>) => {
    startTransition(async () => {
      const result = await createTaskAction(values.goal);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Successfully created task. Agent is starting execution...',
          action: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Goal-Based Task Management</CardTitle>
        <CardDescription>
          Submit a high-level goal in natural language. Nexus AI will create an actionable plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="goal">Your Goal</Label>
                  <FormControl>
                    <Textarea
                      id="goal"
                      placeholder="e.g., 'Ensure all production servers are patched' or 'Onboard new developer to the project-x repository'"
                      rows={4}
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-start">
              <SubmitButton pending={isPending} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
