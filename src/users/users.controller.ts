import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./users.model";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({summary: 'Create user'})
	@ApiResponse({status: 201, description: 'Successfully created user', type: User})
	@Post()
	create(@Body() userDto: CreateUserDto) {
		console.log('userDto', userDto)
		return this.usersService.createUser(userDto)
	}

	@ApiOperation({summary: 'Get users'})
	@ApiResponse({status: 200, description: 'Return users list', type: [User]})
	@Get()
	getAll(): Promise<User[]> {
		return this.usersService.getUsers();
	}

	@ApiOperation({summary: 'Create user'})
	@ApiResponse({status: 200, description: 'Return user by id', type: User})
	@Get('/:id')
	getById(@Param('id') id: number): Promise<User | null> {
		return this.usersService.getUserById(id);
	}

}
