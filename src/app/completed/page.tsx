import { redirect } from 'next/navigation';

export default function CompletedPage() {
  redirect('/history?tab=completed');
}
