import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 10)
  @Type(() => Number)
  publishingYear?: number;
} 