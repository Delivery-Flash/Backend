import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class RateOrderDto {
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación mínima es 1 estrella' })
  @Max(5, { message: 'La calificación máxima es 5 estrellas' })
  stars!: number;

  // Optional comment field
  @IsOptional()
  @IsString({ message: 'El comentario debe ser texto' })
  @MaxLength(500, { message: 'El comentario no puede superar 500 caracteres' })
  comment?: string;
}
