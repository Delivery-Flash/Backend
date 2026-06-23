import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { VehicleType} from '@prisma/client';

export class RegisterRiderDto {
  @IsString({ message: 'El primer nombre debe ser texto' })
  @MinLength(3, { message: 'El primer nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El primer nombre no puede superar 100 caracteres' })
  first_name!: string;

  @IsString({ message: 'Los apellidos deben ser texto' })
  @MinLength(3, { message: 'Los apellidos deben tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'Los apellidos no pueden superar 100 caracteres' })
  last_name!: string;

  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(13, { message: 'Debes tener al menos 13 años para registrarte' })
  @Max(120, { message: 'Ingresa una edad válida' })
  age!: number;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  @MinLength(5, { message: 'El correo debe tener al menos 5 caracteres' })
  email!: string;

  @IsString()
  @MinLength(3, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsString({ message: 'La placa debe ser texto' })
  @MinLength(2, { message: 'La placa debe tener al menos 2 caracteres' })
  @MaxLength(20, { message: 'La placa no puede superar 20 caracteres' })
  license_plate!: string;

  @IsEnum(VehicleType, {
    message: `El tipo de vehículo debe ser uno de: ${Object.values(VehicleType).join(', ')}`,
  })
  vehicle_type!: VehicleType;

  @IsOptional()
  @IsString({ message: 'El modelo del vehículo debe ser texto' })
  @MaxLength(100, { message: 'El modelo no puede superar 100 caracteres' })
  vehicle_model?: string;

  @IsOptional()
  @IsString({ message: 'La zona debe ser texto' })
  zone?: string;
}
