import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/server-api';
import LoginClient from '@/components/LoginClient';

export default async function HomePage() {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    redirect('/movies');
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <LoginClient />
      </div>
    </div>
  );
} 