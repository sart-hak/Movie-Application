'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { moviesApi } from '@/lib/api';
import { CreateMovieData } from '@/types';
import { Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateMovieClient() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMovieData>();

  const createMutation = useMutation(moviesApi.create, {
    onSuccess: () => {
      toast.success('Movie created successfully!');
      router.push('/movies');
    },
    onError: () => {
      toast.error('Failed to create movie');
    },
  });

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
    setPreviewUrl('');
  };

  const onSubmit = (data: CreateMovieData) => {
    const movieData = {
      ...data,
      poster: selectedFile || undefined,
    };
    createMutation.mutate(movieData);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-semibold text-white mb-12">Create a new movie</h1>

      <div className="flex gap-12 items-start">
        <div className="flex-1">
          {!selectedFile ? (
            <div className="upload-area h-96">
              <label htmlFor="poster" className="cursor-pointer flex flex-col items-center justify-center h-full">
                <Download className="h-8 w-8 text-white/60 mb-4" />
                <span className="text-white/60">Drop an image here</span>
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
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
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
                disabled={createMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {createMutation.isLoading ? 'Creating...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 