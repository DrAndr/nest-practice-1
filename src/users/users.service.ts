import {Injectable} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {ExceptionHandler} from "@nestjs/core/errors/exception-handler";

@Injectable()
export class UsersService {

	constructor(@InjectModel(User) private userModel: typeof User) {
	}

	async createUser(userDto: CreateUserDto): Promise<User> {
		const user = await this.userModel.create(userDto);
		return user;
	}

	async getUsers(): Promise<User[] | []> {
		try{
			const users = await this.userModel.findAll();
			return users;
		}catch (e) {
			console.error(e.error);
		}
		return [];
	}

	async getUserById(id: number): Promise<User | null> {
		try{
			const user = await this.userModel.findOne({where: {id}});
			return user;
		}catch (e) {
			throw new ExceptionHandler();
		}
		return null;
	}
}
