import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

export interface PaginatedMovies {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async findAll(page: number = 1, limit: number = 8, search?: string): Promise<PaginatedMovies> {
    const skip = (page - 1) * limit;
    
    let queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .orderBy('movie.createdAt', 'DESC');

    if (search && search.trim()) {
      const searchTerm = search.trim();
      queryBuilder = queryBuilder.where('LOWER(movie.title) LIKE LOWER(:search)', { 
        search: `%${searchTerm}%` 
      });
    }

    const [movies, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      movies,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto, posterPath?: string): Promise<Movie> {
    const movie = this.movieRepository.create({
      ...createMovieDto,
      poster: posterPath,
    });
    return this.movieRepository.save(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto, posterPath?: string): Promise<Movie> {
    const movie = await this.findOne(id);

    Object.assign(movie, updateMovieDto);
    if (posterPath) {
      movie.poster = posterPath;
    }

    return this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  async search(query: string, page: number = 1, limit: number = 8): Promise<PaginatedMovies> {
    return this.findAll(page, limit, query);
  }
} 