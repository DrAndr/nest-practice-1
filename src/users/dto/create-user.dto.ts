import {ApiProperty} from "@nestjs/swagger";
import {
	IsEmail,
	IsOptional,
	IsString,
	IsArray,
	IsInt, Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {

	@ApiProperty({example: 'Mike', description: 'User name.'})
	@IsOptional()
	@IsString({message: 'Provide correct name.'})
	readonly name?: string;

	@ApiProperty({example: 'user@email.com', description: 'User email.'})
	@IsEmail({}, {message: 'Invalid email address.'})
	readonly email: string;

	@ApiProperty({example: '12345678', description: 'User password.'})
	@IsString({message: 'Provide correct password.'})
	@Length(8, 16, {message: 'The password should by between 8 and 16 characters.'})
	readonly password: string;


	@ApiProperty({example: '[1, 2]', description: 'User roles.'})
	@IsOptional()
	@IsArray({message: 'Expected array of roles id`s'})
	@IsInt({ each: true , message: 'Id should be passed as number value.'})
	@Type(() => Number)
	readonly roles?: number[];
}