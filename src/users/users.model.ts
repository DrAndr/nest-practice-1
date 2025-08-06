import {Model, Table, Column, DataType} from 'sequelize-typescript';

interface UserCreationAttributes {
	name: string;
	email: string;
	password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttributes> {
	@Column({type: DataType.STRING, allowNull: false})
	name: string;

	@Column({type: DataType.STRING, allowNull: false})
	email: string;

	@Column({type: DataType.STRING, allowNull: false})
	password: string;

	@Column({type: DataType.BOOLEAN, defaultValue: false})
	banned: boolean;

	@Column({type: DataType.STRING, allowNull: true})
	banReason: string;
}
