'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { Movie } from '@/types';
import { moviesApi } from '@/lib/api';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface MovieCardProps {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation(moviesApi.delete, {
    onSuccess: () => {
      toast.success('Movie deleted successfully');
      onDelete();
      setShowDeleteModal(false);
    },
    onError: () => {
      toast.error('Failed to delete movie');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(movie.id);
  };

  const imageUrl = movie.poster
    ? `http://localhost:3001${movie.poster}`
    : '/placeholder-movie.jpg';

  return (
    <>
      <div className="movie-card cursor-pointer group hover:border-blue-400 hover:border-2">
        <div className="relative h-[400px] bg-gray-700">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-movie.jpg';
            }}
          />

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Edit className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-white mb-1 truncate">
            {movie.title}
          </h3>
          <p className="text-white/60 text-sm">
            {movie.publishingYear}
          </p>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Movie
            </h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to delete "{movie.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary"
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="flex-1 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50"
                style={{ backgroundColor: '#2BD17E' }}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 