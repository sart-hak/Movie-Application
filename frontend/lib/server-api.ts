import { cookies } from 'next/headers';
import { 
  Movie, 
  PaginatedMovies,
  User 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthHeaders() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  return {
    'Content-Type': 'application/json',
    'Cookie': `token=${token}`,
  };
}

export async function getMoviesSSR(page: number = 1, limit: number = 8, search?: string): Promise<PaginatedMovies | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await fetch(`${API_BASE_URL}/movies?${params}`, {
      headers: {
        'Cookie': `token=${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return null;
  }
}

export async function getMovieByIdSSR(id: number): Promise<Movie | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      headers: {
        'Cookie': `token=${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

export async function getUserFromToken(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user')?.value;
    
    if (!userCookie) {
      return null;
    }

    return JSON.parse(userCookie);
  } catch (error) {
    console.error('Error parsing user from token:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const user = cookieStore.get('user')?.value;
  
  return !!(token && user);
} 