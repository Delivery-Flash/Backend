import { IsInt, Max, Min } from 'class-validator';

export class RateOrderDto {
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación mínima es 1 estrella' })
  @Max(5, { message: 'La calificación máxima es 5 estrellas' })
  stars!: number;
}
