import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterRiderDto } from './dto/register-rider.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { userId: number; email: string; role: string };
}

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('register/client')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: RegisterDto){
        return this.authService.registerClient(dto);
    }

    @Post('register/rider')
    @HttpCode(HttpStatus.CREATED)
    registerRider(@Body() dto: RegisterRiderDto){
        return this.authService.registerRider(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        console.log('Login attempt with email:', dto.email);
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: RequestWithUser) {
        return this.authService.getProfile(req.user.userId);
    }

}
