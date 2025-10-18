

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Phone, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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

export default function FaqPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
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
    </div>
  );
}

    