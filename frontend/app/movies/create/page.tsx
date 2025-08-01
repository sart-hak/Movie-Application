import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/server-api';
import CreateMovieClient from '@/components/CreateMovieClient';

export default async function CreateMoviePage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/');
  }

  return (
    <div className="page-container min-h-screen">
      <CreateMovieClient />
    </div>
  );
} 