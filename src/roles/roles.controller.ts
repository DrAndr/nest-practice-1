import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateRoleDto} from "./dto/create-role.dto";
import {Role} from "./roles.model";
import {RolesService} from "./roles.service";
import {PaginationDto} from "../utils/dto/pagination.dto";

@ApiTags('Roles') // tag for the swagger  documentation
@Controller('roles')
export class RolesController {

	constructor(private readonly roleService: RolesService) {}

	@Post()
	create(@Body() dto: CreateRoleDto): Promise<Role> {
		return this.roleService.create(dto);
	}

	@Delete(':id')
	delete(@Param('id') id: number): Promise<number | void> {
		return this.roleService.delete(id);
	}

	@Get()
	getAllRoles(@Query() query: PaginationDto): Promise<Role[]> {
		const lim = query.limit ?? 100;
		const offs = query.offset ?? 0;

		return this.roleService.getAllRoles(lim, offs);
	}

	@Get(':value')
	getRoleByValue(@Param('value') value: string): Promise<Role | null> {
		return this.roleService.getRoleByValue(value);
	}
}
