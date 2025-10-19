'use server';

import { firestore } from './firebase/admin';
import type { Task, Report } from './firestore-types';

const TASKS_COLLECTION = 'tasks';
const REPORTS_COLLECTION = 'reports';
const ALERTS_COLLECTION = 'alerts';
const SYSTEMS_COLLECTION = 'systems';

// Task Functions
export async function createTask(task: Omit<Task, 'id' | 'createdAt'>) {
  const taskWithTimestamp = {
    ...task,
    createdAt: new Date(),
  };
  const docRef = await firestore.collection(TASKS_COLLECTION).add(taskWithTimestamp);
  return docRef.id;
}

export async function getTask(taskId: string): Promise<Task | null> {
  const doc = await firestore.collection(TASKS_COLLECTION).doc(taskId).get();
  if (!doc.exists) return null;
  const data = doc.data() as any;
  return { id: doc.id, ...data, createdAt: data.createdAt.toDate() } as Task;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  await firestore.collection(TASKS_COLLECTION).doc(taskId).update(updates);
}

export async function addTaskLog(taskId: string, log: string) {
    const task = await getTask(taskId);
    if(task && task.steps) {
        const currentStepIndex = task.steps.findIndex(s => s.status === 'in-progress' || s.status === 'failed');
        if(currentStepIndex !== -1) {
            task.steps[currentStepIndex].log = log;
            await updateTask(taskId, { steps: task.steps });
        }
    }
}

// Report Functions
export async function createReport(report: Omit<Report, 'id'>) {
  const docRef = await firestore.collection(REPORTS_COLLECTION).doc(report.taskId).set(report);
  return report.taskId;
}

export async function getReport(taskId: string): Promise<Report | null> {
  const doc = await firestore.collection(REPORTS_COLLECTION).doc(taskId).get();
  if (!doc.exists) return null;
  const data = doc.data() as any;
  return { id: doc.id, ...data, generatedAt: data.generatedAt.toDate() } as Report;
}

// Genkit Tool Functions
export async function getTasksByStatus(status: 'in-progress' | 'completed' | 'failed') {
    const snapshot = await firestore.collection(TASKS_COLLECTION).where('status', '==', status).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getSystemHealth() {
    const snapshot = await firestore.collection(SYSTEMS_COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getRcaReportSummary(taskId: string) {
    const report = await getReport(taskId);
    return report ? { taskId: report.taskId, summary: report.report.substring(0, 200) + '...' } : null;
}
