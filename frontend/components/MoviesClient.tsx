'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from 'react-query';
import { useAuth } from '@/lib/auth-context';
import { moviesApi } from '@/lib/api';
import { PaginatedMovies } from '@/types';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, LogOut } from 'lucide-react';

interface MoviesClientProps {
  initialData: PaginatedMovies | null;
  initialPage: number;
  initialSearch: string;
}

export default function MoviesClient({ initialData, initialPage, initialSearch }: MoviesClientProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';

  const { data: paginatedData, isLoading, error, refetch } = useQuery(
    ['movies', currentPage, searchQuery],
    () => moviesApi.getAll(currentPage, 8, searchQuery || undefined),
    {
      initialData: currentPage === initialPage && searchQuery === initialSearch ? initialData : undefined,
      keepPreviousData: false,
      staleTime: 0,
      cacheTime: 60000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('search', query.trim());
    }
    params.set('page', '1');
    
    queryClient.removeQueries(['movies']);
    router.replace(`/movies?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    params.set('page', page.toString());
    
    router.replace(`/movies?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="page-container min-h-screen">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading movies</p>
          <button
            onClick={() => refetch()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderPagination = () => {
    if (!paginatedData || paginatedData.totalPages <= 1) return null;

    const { page, totalPages } = paginatedData;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Prev
        </button>

        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={isLoading}
            className={`w-10 h-10 rounded font-medium transition-colors ${
              pageNum === currentPage
                ? 'text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            style={{ backgroundColor: pageNum === currentPage ? '#2BD17E' : 'transparent' }}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isLoading}
          className="px-4 py-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Next
        </button>
      </div>
    );
  };

  const renderNoResults = () => {
    if (searchQuery) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              No movies found for "{searchQuery}"
            </h2>
            <p className="text-white/60 mb-6">
              Try adjusting your search terms or browse all movies
            </p>
            <button
              onClick={() => handleSearch('')}
              className="btn-secondary mr-4"
            >
              Clear Search
            </button>
            <button
              onClick={() => router.push('/movies/create')}
              className="btn-primary"
            >
              Add New Movie
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your movie list is empty
            </h2>
            <p className="text-white/60 mb-6">
              Start building your collection by adding your first movie
            </p>
            <button
              onClick={() => router.push('/movies/create')}
              className="btn-primary"
            >
              Add Your First Movie
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-8 pb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <h1 className="text-4xl font-semibold text-white">My movies</h1>
          <button
            onClick={() => router.push('/movies/create')}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors self-start md:self-auto"
        >
          <span className="text-sm">Logout</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="px-8 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search movies..."
        />
      </div>

      <div className="px-8 pb-8">
        {paginatedData && paginatedData.movies.length === 0 ? (
          renderNoResults()
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 justify-items-start">
              {paginatedData?.movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onEdit={() => router.push(`/movies/edit/${movie.id}`)}
                  onDelete={() => {
                    queryClient.invalidateQueries(['movies']);
                    refetch();
                  }}
                />
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </>
  );
} 