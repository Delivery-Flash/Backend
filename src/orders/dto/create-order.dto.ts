import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString({ message: 'El origen debe ser texto' })
  @MinLength(3, { message: 'El origen debe tener al menos 3 caracteres' })
  origin!: string;

  @IsString({ message: 'El destino debe ser texto' })
  @MinLength(3, { message: 'El destino debe tener al menos 3 caracteres' })
  destination!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  description?: string;

  @IsNumber({}, { message: 'La distancia debe ser un número' })
  @Min(0.1, { message: 'La distancia debe ser mayor a 0' })
  distanceKm!: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio sugerido debe ser un número' })
  @Min(0, { message: 'El precio sugerido no puede ser negativo' })
  suggested_price?: number;

  @IsOptional()
  @IsString({ message: 'La zona debe ser texto' })
  zone?: string;

}
