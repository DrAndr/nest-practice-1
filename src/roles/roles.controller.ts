import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query, UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '../models/roles.model';
import { RolesService } from './roles.service';
import { PaginationDto } from '../utils/dto/pagination.dto';
import {Roles} from "../auth/utils/roles-auth.decorator";
import {RolesGuard} from "../auth/utils/roles.guard";
import {User} from "../models/users.model";

@ApiTags('Roles') // tag for the swagger  documentation
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 200, description: 'Return created role', type: Role }) // describe request (request example described in the modelRole (type: Role))
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(dto);
  }

  @ApiOperation({ summary: 'Delete role by passed id' })
  @ApiResponse({ status: 200, description: 'Return founded by ID role', type: Role })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<number | void> {
    return this.roleService.delete(id);
  }

  @ApiOperation({ summary: 'Return all roles' })
  @ApiResponse({ status: 200, description: 'Return list of exiting roles', type: [Role] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAllRoles(@Query() query: PaginationDto): Promise<Role[]> {
    const lim = query.limit ?? 100;
    const offs = query.offset ?? 0;

    return this.roleService.getAllRoles(lim, offs);
  }

  @ApiOperation({ summary: 'Getting role by role name' })
  @ApiResponse({ status: 200, description: 'Return founded by role name role', type: Role })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get(':value')
  getRoleByValue(@Param('value') value: string): Promise<Role | null> {
    return this.roleService.getRoleByValue(value);
  }
}
