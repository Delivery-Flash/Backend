import { ConflictException, Injectable, InternalServerErrorException,}
from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Prisma } from '@prisma/client';
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    
  constructor(private prisma: PrismaService) {}

  async registerClient(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe una cuenta con este correo');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      const user = await this.prisma.user.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          age: dto.age,
          email: dto.email,
          password: hashedPassword,
        },
      });

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya hay una cuenta con este correo');
      }
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }
}