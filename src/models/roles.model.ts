import {Model, Table, Column, DataType, BelongsToMany} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "./users.model";
import {UserRoles} from "./user_roles.model";

interface RoleCreationAttributes {
	value: string;
	description: string;
}

@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttributes> {

	@ApiProperty({example: '1', description: 'Unique role id.'})
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	declare id: number;

	@ApiProperty({example: 'admin', description: 'Role name value.'})
	@Column({type: DataType.STRING, allowNull: false, unique: true})
	value: string;

	@ApiProperty({example: 'Can create and manage content', description: 'The role description.'})
	@Column({type: DataType.STRING, allowNull: true})
	description: string;

	@ApiProperty({example: `[${User}]`, description: 'Users aligned to role'})
	@BelongsToMany(() => User, () => UserRoles)
	users: User[];
}
