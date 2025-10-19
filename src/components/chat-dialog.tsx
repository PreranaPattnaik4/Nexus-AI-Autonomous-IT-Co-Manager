
'use client';

import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Bot, CornerDownLeft, Loader, MessageCircle, Mic, MicOff, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage } from '@/lib/firestore-types';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './icons';


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

export function ChatDialog() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPending, setIsPending] = useState(false);
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
    const messageContent = inputValue;
    if(!messageContent.trim()) return;

    const userMessage: ChatMessage = {
        id: nanoid(),
        role: 'user',
        content: messageContent,
        createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsPending(true);

    // Simulate AI response
    setTimeout(() => {
        const aiMessage: ChatMessage = {
            id: nanoid(),
            role: 'model',
            content: `This is a static response for: "${messageContent}". In a real application, this would be a dynamic answer from the AI. For example, the root cause for the DB server issue was a corrupted index.`,
            createdAt: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsPending(false);
    }, 1500);

    setInputValue(''); 
    inputRef.current?.focus();
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground"
        >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={cn(
            "sm:max-w-xl h-full flex flex-col fixed right-0 top-0 translate-x-0 translate-y-0 rounded-l-none border-l bg-background/80 backdrop-blur-lg shadow-lg pt-10",
            "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
        )}
      >
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <Logo className="h-6 w-6 text-blue-900 dark:text-blue-900" />
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-blue-900 dark:text-blue-900">Nexus AI</DialogTitle>
              <DialogDescription>Autonomous IT Co-Manager with Agentic AI Power</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 -mr-6" ref={scrollAreaRef}>
                <div className='space-y-6 pb-4 pr-6'>
                    {messages.length === 0 && (
                        <div className="p-4 text-center space-y-4">
                            <div>
                                <h3 className="font-semibold">Welcome to the Nexus AI Assistant.</h3>
                                <p className="text-sm text-muted-foreground">How can I help you today?</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Or try one of these examples:</p>
                                <ul className="text-sm list-disc pl-5 mt-2 space-y-1 font-mono text-left text-accent-foreground/80">
                                    <li>What went wrong with the DB server last week?</li>
                                    <li>Give me a summary of a recent report.</li>
                                    <li>Why did the worker VM go offline?</li>
                                </ul>
                            </div>
                        </div>
                    )}
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

            <div className="border-t pt-4">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="relative flex w-full items-center gap-2"
                >
                    <Input
                        ref={inputRef}
                        name="message"
                        placeholder={isRecording ? "Listening..." : "Ask about a past incident..."}
                        className="pr-24 bg-background/80"
                        autoComplete="off"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isPending}
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
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
