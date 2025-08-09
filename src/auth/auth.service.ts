import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import bcrypt from 'bcryptjs';

import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";
import {UsersService} from "../users/users.service";
import {User} from "../users/users.model";

import IAuthResponse from "./interfaces/IAuthResponse";
import {JWT_SALT} from "./constants";
import {map} from "lodash";


@Injectable()
export class AuthService {

	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {
	}

	async login(body: LoginDto): Promise<IAuthResponse> {
		const user = await this.validateUser(body);
		console.log('user', user)
		if (!user) throw new UnauthorizedException({message: 'Wrong login or password.'});
		return await this.generateToken(user);
	}

	async register(body: RegisterDto): Promise<IAuthResponse> {
		const {email, password} = body;

		const candidate = await this.usersService.getUserByEmail(email);
		if (candidate) {
			throw new HttpException(`The '${email}' email already used.`, HttpStatus.BAD_REQUEST);
		}

		const hashedPassword = await bcrypt.hash(password, JWT_SALT);
		const user = await this.usersService.createUser({
			...body,
			password: hashedPassword
		});

		if (user) {
			return await this.generateToken(user);
		} else {
			throw new HttpException(`User was\`t registered`, HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Generate JWT token
	 * @param user
	 */
	async generateToken(user: User): Promise<IAuthResponse> {
		const payload = {
			id: user.id,
			email: user.get('email'),
			roles: map(user.get('roles'),
				(role)=> ({id: role.get('id'), value: role.get('value')})
			),
		}

		return {token: this.jwtService.sign(payload)};
	}

	private async validateUser(body: LoginDto): Promise<User | null> {
		let valid = false;
		const user = await this.usersService.getUserByEmail(body.email);

		if (user) {
			valid = await bcrypt.compare(body.password, user.get('password'));
		}

		if (!valid)
			throw new UnauthorizedException({message: 'Invalid email or password'});

		return user;
	}

}
