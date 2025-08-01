'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { moviesApi } from '@/lib/api';
import { UpdateMovieData, Movie } from '@/types';
import { Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditMovieClientProps {
  movie: Movie;
}

export default function EditMovieClient({ movie }: EditMovieClientProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateMovieData>();

  useEffect(() => {
    setValue('title', movie.title);
    setValue('publishingYear', movie.publishingYear);
    if (movie.poster) {
      setPreviewUrl(`http://localhost:3001${movie.poster}`);
    }
  }, [movie, setValue]);

  const updateMutation = useMutation(
    (data: UpdateMovieData) => moviesApi.update(movie.id, data),
    {
      onSuccess: () => {
        toast.success('Movie updated successfully!');
        router.push('/movies');
      },
      onError: () => {
        toast.error('Failed to update movie');
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(movie.poster ? `http://localhost:3001${movie.poster}` : '');
  };

  const onSubmit = (data: UpdateMovieData) => {
    const movieData = {
      ...data,
      poster: selectedFile || undefined,
    };
    updateMutation.mutate(movieData);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-semibold text-white mb-12">Edit</h1>

      <div className="flex gap-12 items-start">
        <div className="flex-1">
          {!previewUrl ? (
            <div className="upload-area h-96">
              <label htmlFor="poster" className="cursor-pointer flex flex-col items-center justify-center h-full">
                <Download className="h-8 w-8 text-white/60 mb-4" />
                <span className="text-white/60">Drop other image here</span>
                <input
                  id="poster"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative upload-area flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-contain rounded-lg max-h-96 max-w-full"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-4">
                <label htmlFor="poster" className="cursor-pointer bg-[#2BD17E] text-white px-4 py-2 rounded text-sm hover:brightness-110 transition-all">
                  Change Image
                  <input
                    id="poster"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="input-field"
                placeholder="Title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('publishingYear', {
                  required: 'Publishing year is required',
                  min: {
                    value: 1800,
                    message: 'Year must be 1800 or later',
                  },
                  max: {
                    value: new Date().getFullYear() + 10,
                    message: 'Year cannot be more than 10 years in the future',
                  },
                  valueAsNumber: true,
                })}
                type="number"
                className="input-field"
                placeholder="Publishing year"
              />
              {errors.publishingYear && (
                <p className="mt-2 text-sm text-red-400">{errors.publishingYear.message}</p>
              )}
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 btn-secondary"
                disabled={updateMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {updateMutation.isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 