import { redirect, notFound } from 'next/navigation';
import { isAuthenticated, getMovieByIdSSR } from '@/lib/server-api';
import EditMovieClient from '@/components/EditMovieClient';

interface EditMoviePageProps {
  params: {
    id: string;
  };
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/');
  }

  const movieId = parseInt(params.id);
  
  if (isNaN(movieId)) {
    redirect('/movies');
  }

  const movie = await getMovieByIdSSR(movieId);

  if (!movie) {
    notFound();
  }

  return (
    <div className="page-container min-h-screen">
      <EditMovieClient movie={movie} />
    </div>
  );
} 