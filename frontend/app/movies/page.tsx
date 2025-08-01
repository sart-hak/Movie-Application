import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getMoviesSSR, isAuthenticated } from '@/lib/server-api';
import MoviesClient from '@/components/MoviesClient';
import LoadingSpinner from '@/components/LoadingSpinner';

interface MoviesPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/');
  }

  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams.search;
  
  const paginatedData = await getMoviesSSR(page, 8, search);

  return (
    <div className="page-container min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <MoviesClient 
          initialData={paginatedData} 
          initialPage={page}
          initialSearch={search || ''}
        />
      </Suspense>
    </div>
  );
} 