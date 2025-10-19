'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { nanoid } from 'nanoid';
import { Bot, CornerDownLeft, Loader, Mic, MicOff, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage } from '@/lib/firestore-types';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { askHealthAssistantAction, generateSpeechAction } from '@/lib/actions';


function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? <Loader className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

function Message({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex items-start gap-4', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-md rounded-lg p-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {msg.role === 'model' ? (
             <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }} />
        ) : (
            <p className="text-sm">{msg.content}</p>
        )}
       
      </div>
      {isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback>IT</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default function ChatPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const recognitionRef = useRef<any>(null);

   useEffect(() => {
    if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
            };
            
            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                formRef.current?.requestSubmit();
            };
            
            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
                toast({
                    variant: 'destructive',
                    title: 'Voice Recognition Error',
                    description: `An error occurred: ${event.error}. Please try again.`
                })
            };

        } else {
            console.warn('Speech recognition not supported in this browser.');
        }
    }
  }, [toast]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        toast({
            variant: 'destructive',
            title: 'Unsupported Feature',
            description: 'Your browser does not support voice recognition.'
        });
        return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };


  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('div:first-child') as HTMLDivElement;
        if(scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);


 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageContent = inputValue.trim();
    if (!messageContent) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: nanoid(),
        role: 'user',
        content: messageContent,
        createdAt: new Date(),
      },
    ];
    setMessages(newMessages);
    setInputValue('');
    inputRef.current?.focus();

    startTransition(async () => {
      const result = await askHealthAssistantAction(newMessages);
      if (result.success && result.response) {
        const aiMessage: ChatMessage = {
          id: nanoid(),
          role: 'model',
          content: result.response,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        
        // Generate and play audio
        const audioResult = await generateSpeechAction(result.response);
        if (audioResult.success && audioResult.media) {
            const audio = new Audio(audioResult.media);
            audio.play();
        }

      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'The assistant failed to respond.',
        });
        // Remove the user's message if the API call fails
        setMessages(messages);
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      <header className='mb-4'>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5"/> System Health Assistant</CardTitle>
                <CardDescription>Ask me anything about system health, tasks, alerts, or past incidents.</CardDescription>
            </CardHeader>
             {messages.length === 0 && (
                 <CardContent>
                    <p className="text-sm text-muted-foreground">Examples:</p>
                    <ul className="text-sm list-disc pl-5 mt-2 space-y-1 font-mono text-accent-foreground/80">
                        <li>How many tasks are in progress?</li>
                        <li>What is the status of the DB server?</li>
                        <li>Give me a summary of a recent report.</li>
                        <li>Why did the worker VM go offline?</li>
                    </ul>
                </CardContent>
            )}
        </Card>
      </header>

      <main className="flex-1">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className='space-y-6 pb-4 pr-4'>
                {messages.map((msg) => (
                    <Message key={msg.id} msg={msg} />
                ))}
                {isPending && (
                  <div className="flex items-start gap-4">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-lg p-3 bg-muted">
                      <Loader className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
            </div>
        </ScrollArea>
      </main>

      <footer className="border-t pt-4">
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="relative flex w-full items-center gap-2"
            >
                <Input
                    ref={inputRef}
                    name="message"
                    placeholder={isRecording ? "Listening..." : "Ask about system health..."}
                    className="pr-24"
                    autoComplete="off"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-12">
                   <Button type="button" size="icon" variant="ghost" onClick={handleMicClick}>
                        {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                        <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                    </Button>
                </div>
                <div className="absolute right-2">
                    <SubmitButton pending={isPending} />
                </div>
            </form>
      </footer>
    </div>
  );
}
