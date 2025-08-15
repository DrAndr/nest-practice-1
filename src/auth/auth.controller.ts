import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import IAuthResponse from './interfaces/IAuthResponse';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({ status: 201, description: 'Authenticate user' })
  @Post('/login')
  login(@Body() body: LoginDto): Promise<IAuthResponse> {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, description: 'Register user' })
  @Post('/register')
  register(@Body() body: RegisterDto): Promise<IAuthResponse> {
    return this.authService.register(body);
  }
}
