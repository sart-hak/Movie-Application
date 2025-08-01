import axios from 'axios';
import {
  LoginData,
  RegisterData,
  Movie,
  PaginatedMovies,
  CreateMovieData,
  UpdateMovieData,
  User
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authApi = {
  login: async (data: LoginData): Promise<{ message: string; user: User }> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ message: string; user: User }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export const moviesApi = {
  getAll: async (page: number = 1, limit: number = 8, search?: string): Promise<PaginatedMovies> => {
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }

    const response = await api.get('/movies', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Movie> => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  create: async (data: CreateMovieData): Promise<Movie> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('publishingYear', data.publishingYear.toString());
    if (data.poster) {
      formData.append('poster', data.poster);
    }

    const response = await api.post('/movies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: UpdateMovieData): Promise<Movie> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.publishingYear) formData.append('publishingYear', data.publishingYear.toString());
    if (data.poster) formData.append('poster', data.poster);

    const response = await api.patch(`/movies/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/movies/${id}`);
  },
}; 