import {Model, Table, Column, DataType, BelongsToMany, ForeignKey} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/users.model";
import {Role} from "../../roles/roles.model";

interface UserRolesCreationAttributes {
	userId: number;
	roleId: number;
}

@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles, UserRolesCreationAttributes> {

	@ForeignKey(() => User)
	@Column({type: DataType.INTEGER, allowNull: false})
	userId: number;

	@ForeignKey(() => Role)
	@Column({type: DataType.INTEGER, allowNull: false})
	roleId: number;
}
