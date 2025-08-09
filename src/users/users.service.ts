import {Body, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import isArray from "lodash/isArray";
import {ExceptionsHandler} from "@nestjs/core/exceptions/exceptions-handler";
import {Role} from "../roles/roles.model";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

@Injectable()
export class UsersService {

	constructor(@InjectModel(User)
	            private readonly userModel: typeof User,
	            private readonly rolesService: RolesService
	) {
	}

	async createUser(dto: CreateUserDto): Promise<User | null> {
		const user = await this.userModel.create(dto);

		// check is user roles provided
		if (!dto?.roles || !isArray(dto.roles)) {

			// get role by value
			let role = await this.rolesService.getRoleByValue('USER');

			// or create common USER role
			if (!role) {
				role = await this.rolesService.create({value: 'USER', description: 'Common user role'})
			}

			// throw exception if we have mo user role and cant create
			if (!role.id) throw new ExceptionsHandler()

			// finally add the USER role to DB
			await user.$set('roles', [role.id])
		} else {
			await user.$set('roles', dto.roles);
		}

		return await this.getUserById(user.id);
	}

	async getUsers(): Promise<User[]> {
		return await this.userModel.findAll({include: [Role]}); // or {include: {all: true}};
	}

	async getUserById(id: number): Promise<User | null> {
		return await this.userModel.findOne({where: {id}, include: [Role]});
	}

	async getUserByEmail(email: string): Promise<User | null> {
		return await this.userModel.findOne({where: {email}, include: [Role]});
	}

	async addRole(dto: AddRoleDto): Promise<User | null> {
		const user = await this.userModel.findByPk(dto.userId);
		const role = await this.rolesService.getRoleByValue(dto.roleValue);

		if (!user) {
			throw new NotFoundException('User does not found.');
		}
		if (!role) {
			throw new NotFoundException('User does not found.');
		}

		await user.$add('roles', role.id);
		await user.save();
		return await this.getUserById(user.id);
	}

	async ban(dto: BanUserDto): Promise<User> {

		/**
		 * Old approach, still work but not too obviously
		 */
			// const user = await this.userModel.findByPk(dto.id);
		//
		// if (!user) {
		// 	throw new NotFoundException('User not found.');
		// }
		//
		// user.dataValues.banned = true;
		// user.dataValues.banReason = dto?.banReason || '';
		//
		// return user.save();

		/**
		 * Looks more clear, since record updated obviously
		 */
		const [count, [updatedUser]] = await this.userModel.update(
			{ banned: true, banReason: dto?.banReason || '' },
			{ where: { id: dto.id }, returning: true }
		);

		if (!count) {
			throw new NotFoundException('User not found.');
		}

		return updatedUser;
	}
}
