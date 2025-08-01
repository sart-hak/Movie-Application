export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: number;
  title: string;
  publishingYear: number;
  poster?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMovies {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface CreateMovieData {
  title: string;
  publishingYear: number;
  poster?: File;
}

export interface UpdateMovieData {
  title?: string;
  publishingYear?: number;
  poster?: File;
} 