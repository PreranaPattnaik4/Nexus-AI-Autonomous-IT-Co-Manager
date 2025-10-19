'use server';

import {
  Alert,
  ChatMessage,
  Task,
  Step,
} from '@/lib/firestore-types';
import {
  createTask,
  getTask,
  updateTask,
  addTaskLog,
  getReport,
  createReport,
} from './firestore-helpers';
import { multiStepTaskExecution } from '@/ai/flows/multi-step-task-execution';
import { proactiveIssueResolution } from '@/ai/flows/proactive-issue-resolution';
import { taskSelfHealing } from '@/ai/flows/task-self-healing';
import { generateRcaReport } from '@/ai/flows/rca-report-generation';
import { simulateCommand } from '@/ai/flows/command-simulation';
import { askRca } from '@/ai/flows/conversational-rca';
import { generateAudio } from '@/ai/flows/tts';
import { revalidatePath } from 'next/cache';

// Utility to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createTaskAction(goal: string) {
  try {
    // 1. Call the Planner Agent to get the steps
    const plan = await multiStepTaskExecution(goal);

    // 2. Create the task document in Firestore
    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      goal: plan.goal,
      status: 'in-progress',
      progress: 0,
      steps: plan.steps.map(
        (step): Step => ({
          description: step.description,
          status: 'pending',
          action: 'unknown',
        })
      ),
    };

    const taskId = await createTask(newTask as Task);

    // 3. Asynchronously start the simulation
    simulateTaskExecutionAction(taskId);

    revalidatePath('/dashboard');
    revalidatePath('/tasks');
    return { success: true, taskId };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task.' };
  }
}

export async function resolveAlertAction(alert: Omit<Alert, 'id' | 'timestamp'>) {
  try {
    // 1. Call the Proactive Agent to get a goal
    const { goal } = await proactiveIssueResolution({
      title: alert.title,
      description: alert.description,
    });

    // 2. Create a new task with the generated goal
    return await createTaskAction(goal);
  } catch (error) {
    console.error('Error resolving alert:', error);
    return { success: false, error: 'Failed to resolve alert.' };
  }
}

export async function retryTaskAction(task: Task) {
  try {
    const failedStep = task.steps.find((step) => step.status === 'failed');
    if (!failedStep) {
      throw new Error('No failed step found to retry.');
    }

    // 1. Call the Retry Agent
    const { goal } = await taskSelfHealing({
      goal: task.goal,
      failureLog: failedStep.log || 'No log available for the failure.',
    });

    // 2. Create the new, corrected task
    const result = await createTaskAction(goal);

    // 3. Update the original task status to 'superseded'
    if (result.success) {
      await updateTask(task.id, { status: 'superseded' });
      revalidatePath('/tasks');
    }

    return result;
  } catch (error) {
    console.error('Error retrying task:', error);
    return { success: false, error: 'Failed to retry task.' };
  }
}

export async function generateRcaReportAction(taskId: string) {
  try {
    // Check if report already exists
    const existingReport = await getReport(taskId);
    if (existingReport) {
      return { success: true, report: existingReport.report };
    }

    // 1. Fetch task logs
    const task = await getTask(taskId);
    if (!task) throw new Error('Task not found.');

    const logs = task.steps
      .map((step) => `[${step.status}] ${step.description}: ${step.log || 'No log'}`)
      .join('\n');

    // 2. Call the Reporter Agent
    const markdownReport = await generateRcaReport({
      goal: task.goal,
      logs: [logs],
    });

    // 3. Save the report to Firestore
    await createReport({
      taskId,
      report: markdownReport,
      generatedAt: new Date(),
    });

    return { success: true, report: markdownReport };
  } catch (error) {
    console.error('Error generating RCA report:', error);
    return { success: false, error: 'Failed to generate RCA report.' };
  }
}

export async function simulateCommandAction(command: string) {
  try {
    // 1. Call the Console Agent
    const output = await simulateCommand(command);
    return { success: true, output };
  } catch (error) {
    console.error('Error simulating command:', error);
    return { success: false, error: 'Failed to simulate command.' };
  }
}

export async function askHealthAssistantAction(messages: ChatMessage[]) {
    try {
        // 1. Extract latest user query
        const query = messages[messages.length - 1].content;

        // 2. Call the Conversational Agent
        const response = await askRca(query);
        
        return { success: true, response };
    } catch (error) {
        console.error('Error with health assistant:', error);
        return { success: false, error: 'Assistant failed to respond.' };
    }
}

export async function generateSpeechAction(text: string) {
    try {
        // 1. Call the TTS Agent
        const { media } = await generateAudio(text);
        return { success: true, media };
    } catch (error) {
        console.error('Error generating speech:', error);
        return { success: false, error: 'Failed to generate speech.' };
    }
}

export async function simulateTaskExecutionAction(taskId: string) {
  const task = await getTask(taskId);
  if (!task) return;

  const totalSteps = task.steps.length;
  let completedSteps = 0;

  for (let i = 0; i < totalSteps; i++) {
    const step = task.steps[i];

    // Simulate work
    await sleep(Math.random() * 1500 + 500); // Wait 0.5-2 seconds

    // Update step status
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo
    step.status = isSuccess ? 'completed' : 'failed';
    step.log = isSuccess
      ? `Step ${i + 1} completed successfully.`
      : `Step ${i + 1} failed due to a simulated error.`;
    
    if(isSuccess) {
        completedSteps++;
    }

    const progress = Math.round((completedSteps / totalSteps) * 100);

    await updateTask(taskId, { steps: task.steps, progress });
    await addTaskLog(taskId, step.log);

    if (!isSuccess) {
      await updateTask(taskId, { status: 'failed' });
      revalidatePath('/dashboard');
      revalidatePath('/tasks');
      return; // Stop execution on failure
    }
  }

  // Mark task as completed
  await updateTask(taskId, { status: 'completed', progress: 100 });
  revalidatePath('/dashboard');
  revalidatePath('/tasks');
}
