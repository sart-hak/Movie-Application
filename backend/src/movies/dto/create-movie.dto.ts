import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear() + 10)
  @Type(() => Number)
  publishingYear: number;
} 