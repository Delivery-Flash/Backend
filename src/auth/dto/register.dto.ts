import {
  IsEmail,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
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
  @MinLength(5, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;
}