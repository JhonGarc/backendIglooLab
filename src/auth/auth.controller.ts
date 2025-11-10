import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from './guards/supabase.auth.guard';

@ApiTags('auth') // Agrupa los endpoints en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión con Supabase' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 400, description: 'Error en credenciales o datos inválidos' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }



  @UseGuards(SupabaseAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión de usuario autenticado' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' })
  @ApiResponse({ status: 400, description: 'Token malformado o inválido' })
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      return {
        success: false,
        code: 400,
        message: 'Falta el encabezado Authorization',
      };
    }

    const token = authHeader.replace('Bearer ', '');
    return this.authService.logout(token);
  }
}
