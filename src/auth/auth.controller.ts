import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // METODO POST PARA REGISTRAR AL USUARIO CLIENTE
    @Post('register/client')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: RegisterDto){
        return this.authService.registerClient(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        console.log('Login attempt with email:', dto.email);
        return this.authService.login(dto);
    }



}
