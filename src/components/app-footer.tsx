
'use client';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Logo } from './icons';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import FaqPage from '@/app/faq/page';
import { Github, Linkedin, Twitter, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function AppFooter() {
  return (
    <footer className="border-t bg-background text-card-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Logo className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-bold">Nexus AI</h2>
            </div>
            <p className="text-sm text-muted-foreground pr-8">
              Nexus AI is an autonomous IT co-manager that uses agentic AI to
              understand goals, create plans, and execute tasks across your
              infrastructure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"><LifeBuoy className="w-4 h-4 mr-2"/>FAQ</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <FaqPage />
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary">Contact</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ContactPage />
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-primary">About NexusAI</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <AboutPage />
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">About the Project</h3>
            <p className="text-sm text-muted-foreground">
              This project was built for the SuperHack 2025 (Google Cloud +
              Firebase AI Challenge) to demonstrate the power of agentic AI.
            </p>
          </div>
           <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                 <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                 <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © 2025 Nexus AI | Built by FutureCoders with Google Gemini + Firebase
        </div>
      </div>
    </footer>
  );
}
