import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPd } from '../interfaces/JwtPd.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }  
  // ACA SE EJECUTA LUEGO DE  VALIDAR EL TOKEN
  async validate(payload: JwtPd) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}