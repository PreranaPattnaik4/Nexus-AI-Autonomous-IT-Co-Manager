
import Link from 'next/link';
import { GoalForm } from '@/components/dashboard/goal-form';
import { TasksList } from '@/components/dashboard/tasks-list';
import { MetricsCharts } from '@/components/dashboard/metrics-charts';
import { AlertsCard } from '@/components/dashboard/alerts-card';
import { TaskStats } from '@/components/dashboard/task-stats';
import { SystemHealthSummary } from '@/components/dashboard/system-health-summary';
import { AiInsightsCard } from '@/components/dashboard/ai-insights-card';
import { GeminiThinkingMap } from '@/components/dashboard/gemini-thinking-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BookOpen, Bot, ArrowRight, LifeBuoy, Info, Phone, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react';
import { featureGuideCards, examplePromptCategories, thinkingSteps } from '@/lib/data-help';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function Connector({ isLast = false }: { isLast?: boolean }) {
  if (isLast) return null;
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full h-px bg-border -mx-2"></div>
    </div>
  );
}

const faqData = [
  {
    question: "What is Nexus AI?",
    answer: "Nexus AI is a proactive, agentic AI solution for IT management. It goes beyond simple automation by understanding high-level goals, planning multi-step tasks, and autonomously executing them to manage your IT infrastructure."
  },
  {
    question: "Who can use Nexus AI?",
    answer: "Nexus AI is designed for IT managers, DevOps engineers, and system administrators who are responsible for managing, monitoring, and maintaining infrastructure. It acts as an intelligent co-manager to help automate complex workflows and resolve issues proactively."
  },
  {
    question: "How do I give a goal to the AI?",
    answer: "On the dashboard, use the 'Goal-Based Task Management' form. Type your objective in natural language, like 'Ensure all production servers are patched,' and the AI will create an actionable plan."
  },
  {
    question: "Is this tool running real commands on my systems?",
    answer: "No. For this demo, all actions are simulated. Nexus AI shows you the commands it *would* run, but no actual changes are made to any of your infrastructure, ensuring a safe environment for exploration."
  },
  {
    question: "What happens when a task fails?",
    answer: "If a task fails, you can use the 'Retry with AI' button. The AI will analyze the failure logs, formulate a new, corrected plan, and re-initiate the task in a self-healing loop."
  },
  {
    question: "How does Nexus AI align with responsible AI practices?",
    answer: "Nexus AI is designed as a safe, educational demonstration. All operations are fully simulated and do not affect real-world systems. This 'simulation-first' approach ensures that you can explore the power of agentic AI for IT management without any risk, adhering to principles of safety and transparency."
  },
   {
    question: "Can Nexus AI make mistakes?",
    answer: "Yes. Nexus AI is designed to assist and automate many tasks, but it can make errors or provide incomplete/incorrect information. Always verify important outputs before acting."
  },
  {
    question: "Should I rely on Nexus AI for professional, financial, legal, or safety-critical decisions?",
    answer: "No. Do not make professional, legal, medical, financial, or safety-critical decisions based solely on Nexus AI’s results. Use the assistant to inform your work, then validate findings with qualified human experts."
  },
  {
    question: "What should I do before acting on an AI suggestion that affects money or business strategy?",
    answer: "Double-check the data and reasoning, run tests in a non-production/staging environment, and consult a domain expert or financial advisor. Treat AI suggestions as recommendations—not final decisions."
  },
  {
    question: "How should I use Nexus AI during early-stage product or industry development?",
    answer: "Use Nexus AI for research and prototyping, but do thorough validation and human review before launching features, changing infrastructure, or making public claims. Maintain version control, testing, and rollback procedures."
  },
  {
    question: "What does “check twice” mean in practice?",
    answer: "Verify data sources, replicate the results when possible, inspect logs, and if the decision is high-risk (money, reputation, safety), get a second opinion from a human expert before proceeding."
  },
  {
    question: "How do I report a suspected AI error or harmful suggestion?",
    answer: "You can report any issues through our contact channels. Please provide a snippet of the AI's output, the timestamp, and what you expected versus what you received. We will review it to improve the model. <a href='/contact' class='text-primary hover:underline'>Report an issue here.</a>"
  },
  {
    question: "Does Nexus AI explain how confident it is in an answer?",
    answer: "The assistant may provide confidence indicators for certain outputs, but this is not guaranteed for all responses. If no confidence score is shown, treat the output as potentially uncertain and validate it independently."
  },
  {
    question: "Who is responsible if an AI suggestion causes harm?",
    answer: "The user and their organization are ultimately responsible for any actions or decisions taken based on AI-generated output. We strongly recommend implementing internal review and approval processes for any critical actions suggested by the AI."
  },
  {
    question: "Is Nexus AI fully deployed and production-ready?",
    answer: "Nexus AI is currently in its development stage. We are continuously improving its performance, reliability, and decision-making capabilities. Stay connected — we are coming soon with fully powered Agentic AI solutions that will take autonomous IT management to the next level."
  }
];

function FaqSection() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <LifeBuoy className="h-5 w-5" />
          <CardTitle>Frequently Asked Questions</CardTitle>
        </div>
        <CardDescription className="!font-bold !text-destructive">
            Important: Nexus AI is an assistive tool. Always verify outputs and consult human experts before making professional, financial or safety-critical decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
         <div className="mt-6 rounded-lg border border-dashed p-4 text-center">
            <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-semibold">Need Expert Help?</h4>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
                For critical issues, you can escalate to a human reviewer.
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/contact">Contact Support</Link>
            </Button>
        </div>
         <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                <p>Nexus AI is still evolving. Stay tuned for updates as we expand Agentic AI-powered capabilities and release new enterprise features.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

function HelpContent() {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
            <div className='flex items-center gap-2'>
                <Bot className="h-5 w-5" />
                <CardTitle>The IT Manager's Workflow Pipeline</CardTitle>
            </div>
            <CardDescription>From goal to resolution, here’s how Nexus AI automates your tasks.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-center pt-2">
            {thinkingSteps.map((step, index) => (
            <React.Fragment key={step.name}>
                <div className="flex flex-col items-center text-center w-36">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-secondary-foreground mb-2">
                    <step.icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold">{step.name}</p>
                <p className="text-xs text-muted-foreground mt-1 hidden md:block">{step.description}</p>
                </div>
                <Connector isLast={index === thinkingSteps.length - 1} />
            </React.Fragment>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Guide</CardTitle>
          <CardDescription>Learn about the key sections of the application.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureGuideCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="flex flex-col text-center items-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-secondary-foreground mb-4">
                        <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1">{feature.description}</p>
                     <Button variant="outline" size="sm" asChild>
                        <Link href={feature.href}>
                            Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </Card>
              );
            })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className='flex items-center gap-2'>
                <BookOpen className="h-5 w-5" />
                <CardTitle>How to Use Nexus AI</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <p>Nexus AI is designed to be intuitive. Here’s the primary workflow:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>
                    <strong>Submit a Goal:</strong> Go to the <a href="/dashboard" className="text-primary hover:underline">Dashboard</a> and use the "Goal-Based Task Management" form. Type a high-level objective in natural language (e.g., "Deploy the new marketing site").
                </li>
                <li>
                    <strong>AI Planning:</strong> Nexus AI's Planner Agent will analyze your goal and break it down into a series of actionable, technical steps. A new task will appear in the "Recent Tasks" list.
                </li>
                <li>
                    <strong>Monitor Execution:</strong> Watch the task's progress in real-time. You can click "Details" to see the status of each individual step and any logs from the (simulated) execution.
                </li>
                 <li>
                    <strong>Handle Issues:</strong> If an alert appears (e.g., "High CPU"), use the "Resolve with AI" button to have Nexus autonomously create a new task to fix it. If a task fails, use "Retry with AI" to let the agent analyze the failure and attempt a corrected plan.
                </li>
                <li>
                    <strong>Review Reports:</strong> For completed or failed tasks, view the AI-generated Root Cause Analysis (RCA) report to understand what happened.
                </li>
            </ol>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <div className='flex items-center gap-2'>
                <Lightbulb className="h-5 w-5" />
                <CardTitle>Example Task Prompts</CardTitle>
            </div>
             <CardDescription>
                Use these prompts as inspiration for your own goals.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue={examplePromptCategories[0].category} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto">
                    {examplePromptCategories.map((cat) => (
                        <TabsTrigger key={cat.category} value={cat.category} className="whitespace-normal">{cat.category}</TabsTrigger>
                    ))}
                </TabsList>
                {examplePromptCategories.map((cat) => (
                    <TabsContent key={cat.category} value={cat.category} className="mt-4">
                        <ul className="list-disc space-y-2 pl-5 font-mono text-sm text-accent-foreground/90">
                            {cat.prompts.map((prompt, index) => (
                                <li key={index}>
                                    <p>{prompt}</p>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                ))}
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const status = searchParams?.status as 'in-progress' | 'completed' | 'failed' | undefined;
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
      <div className="col-span-1 lg:col-span-5">
        <TaskStats />
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 gap-6">
        <SystemHealthSummary />
        <AiInsightsCard />
      </div>
      
      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-1">
            <GoalForm />
        </div>
        <div className="lg:col-span-1">
            <GeminiThinkingMap />
        </div>
      </div>

      <div className="col-span-1 lg:col-span-5">
        <TasksList statusFilter={status} />
      </div>

      <div className="col-span-1 lg:col-span-5">
        <MetricsCharts />
      </div>

      <div id="alerts" className="col-span-1 lg:col-span-5">
        <AlertsCard />
      </div>
      
      <div className="col-span-1 lg:col-span-5">
        <HelpContent />
      </div>
      
       <div className="col-span-1 lg:col-span-5">
        <FaqSection />
      </div>
    </div>
  );
}

    
