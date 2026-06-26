import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/register-response.dto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPd } from './interfaces/JwtPd.interface';
import { RegisterRiderDto } from './dto/register-rider.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    
  constructor(private prisma: PrismaService,
              private jwtService: JwtService, 
  ) {}

  /**
   * REGISTRO DE CLIENTE
  */
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

  /**
   * REGISTRO DE RIDER
   */
  
  async registerRider(dto: RegisterRiderDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe una cuenta con este correo');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      // Creacion del usuario
      const user = await this.prisma.user.create({
        data: {
          first_name: dto.first_name,
          last_name:  dto.last_name,
          age:        dto.age,
          email:      dto.email,
          password:   hashedPassword,
          role:       'RIDER',
        },
      });

      // Creacion del perfil del rider
      const riderProfile = await this.prisma.riderProfile.create({
        data: {
          user_id:       user.id,
          license_plate: dto.license_plate,
          vehicle_type:  dto.vehicle_type,
          vehicle_model: dto.vehicle_model,
          zone:          dto.zone ?? 'ZONA_1',
        },
      });

      return {
        id:            user.id,
        first_name:    user.first_name,
        last_name:     user.last_name,
        age:           user.age,
        email:         user.email,
        role:          user.role,
        license_plate: riderProfile.license_plate,
        vehicle_type:  riderProfile.vehicle_type,
        vehicle_model: riderProfile.vehicle_model,
        zone:          riderProfile.zone,
        is_verified:   riderProfile.is_verified,
        createdAt:     user.createdAt,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya hay una cuenta con este correo');
      }
      throw new InternalServerErrorException('Error al registrar el rider');
    }
  }

  /**
   * INICIO DE SESIÓN
   */
  async login(dto: LoginDto): Promise<LoginResponseDto> {
    
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // COMPARACION DE CONTRASEÑAS
    const passwordValido = await bcrypt.compare(dto.password, user.password);

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // ESTO SE MANDA DENTRO DEL TOKEN
    const payload: JwtPd = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    // RETORNO DEL TOKEN Y DATOS DEL USUARIO 
    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * OBTENER PERFIL DEL USUARIO
   */

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      profile_photo: user.profile_photo,
    };
  }

  async updateProfilePhoto(userId: number, profile_photo: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { profile_photo },
    });

    return { id: updated.id, profile_photo_url: updated.profile_photo };
  }

  // este metodo sirve para traer todo el perfil del rider
  async getRiderProfile(userId: number) {
    const riderProfile = await this.prisma.riderProfile.findUnique({
      where: { user_id: userId },
      include: { user: true },
    });

    if (!riderProfile) {
      throw new NotFoundException('Perfil de rider no encontrado');
    }

    return {
      id: riderProfile.user.id,
      first_name: riderProfile.user.first_name,
      last_name: riderProfile.user.last_name,
      age: riderProfile.user.age,
      email: riderProfile.user.email,
      role: riderProfile.user.role,
      license_plate: riderProfile.license_plate,
      vehicle_type: riderProfile.vehicle_type,
      vehicle_model: riderProfile.vehicle_model,
      zone: riderProfile.zone,
      is_verified: riderProfile.is_verified,
      createdAt: riderProfile.user.createdAt,
    };
  }
}