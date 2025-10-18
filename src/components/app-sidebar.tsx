
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  LayoutDashboard,
  ListChecks,
  CircleHelp,
  Zap,
  MessageCircle,
  Terminal,
  History,
  Loader,
  CheckCheck,
  XCircle,
  AlertTriangle,
  User,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from './icons';
import { Skeleton } from './ui/skeleton';

const navItems = [
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/console', label: 'Command Console', icon: Terminal },
  { href: '/tasks', label: 'All Tasks', icon: ListChecks },
  { href: '/tasks?status=in-progress', label: 'In Progress', icon: Loader },
  { href: '/tasks?status=completed', label: 'Completed', icon: CheckCheck },
  { href: '/tasks?status=failed', label: 'Failed', icon: XCircle },
  { href: '/dashboard#alerts', label: 'Active Alerts', icon: AlertTriangle },
  { href: '/history', label: 'History', icon: History },
  { href: '/integrations', label: 'Integrations', icon: Zap },
  { href: '/profile', label: 'Profile', icon: User },
];

function NavItems() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const tab = searchParams.get('tab');

  const getIsActive = (href: string) => {
    const currentPath = `${pathname}${status ? `?status=${status}` : ''}${tab ? `?tab=${tab}` : ''}`;
    
    // Exact match
    if (href === currentPath) return true;

    // Handle parent routes being active
    if (pathname.startsWith(href) && href !== '/') {
        if (href === '/tasks' && status) return false;
        if (href === '/history' && tab) return false;
        if (pathname !== href) return false;
    }

    // Special cases for tabs pointing to same pages
    if (href === '/tasks?status=completed' && pathname === '/history' && tab === 'completed') return true;
    if (href === '/tasks?status=failed' && pathname === '/history' && tab === 'failed') return true;
    if (href === '/history?tab=completed' && pathname === '/tasks' && status === 'completed') return true;
    if (href === '/history?tab=failed' && pathname === '/tasks' && status === 'failed') return true;
    
    // Handle consolidated profile/settings
    if ((href === '/profile' || href === '/settings') && (pathname === '/profile' || pathname === '/settings')) {
        return true;
    }

    return href === pathname;
  };


  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = getIsActive(item.href);

        return (
          <Button
            key={item.href}
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <Icon className={cn("mr-2 h-4 w-4", item.label === 'In Progress' && isActive && 'animate-spin')} />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </>
  );
}

function NavItemsSkeleton() {
    return (
        <div className='space-y-1'>
            {navItems.map((item) => (
                <Skeleton key={item.href} className="h-10 w-full" />
            ))}
        </div>
    )
}

export function AppSidebar() {
  return (
    <aside className="h-screen w-64 flex-shrink-0 flex flex-col bg-card border-r">
      <div className="flex items-center justify-center h-20 border-b px-4">
        <Link href="/" className='flex items-center gap-2'>
            <Logo className="h-6 w-6 text-blue-900 dark:text-blue-400" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-blue-900 dark:text-blue-400">Nexus AI</h1>
              <p className="text-xs text-muted-foreground">Autonomous IT Co-Manager</p>
            </div>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        <Suspense fallback={<NavItemsSkeleton />}>
            <NavItems />
        </Suspense>
      </nav>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className="w-full justify-start mb-4" asChild>
           <Link href="/help">
              <CircleHelp className="mr-2 h-4 w-4" />
              Help
            </Link>
        </Button>
      </div>
    </aside>
  );
}
