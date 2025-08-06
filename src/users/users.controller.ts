import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./users.model";

@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() userDto: CreateUserDto) {
		console.log('userDto', userDto)
		return this.usersService.createUser(userDto)
	}

	@Get()
	getAll(): Promise<User[]> {
		return this.usersService.getUsers();
	}

	@Get('/:id')
	getById(@Param('id') id: number): Promise<User | null> {
		return this.usersService.getUserById(id);
	}

}
