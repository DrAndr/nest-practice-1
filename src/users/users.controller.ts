import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../models/users.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/utils/roles-auth.decorator';
import { RolesGuard } from '../auth/utils/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ValidationPipe } from '../utils/pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/utils/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user.' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created user.',
    type: User,
  })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto): Promise<User | null> {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return users list', type: [User] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return user by id', type: User })
  @Get('/:id')
  getById(@Param('id') id: number): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Assign role to user.' })
  @ApiResponse({
    status: 200,
    description: 'Return updated user data',
    type: User,
  })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto): Promise<User | null> {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Ban user.' })
  @ApiResponse({
    status: 200,
    description: 'Return updated user data',
    type: User,
  })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserDto): Promise<User> {
    return this.usersService.ban(dto);
  }
}
