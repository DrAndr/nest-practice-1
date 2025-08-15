import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "./users.model";
import {Post} from "./posts.model";

interface  IUploadFiles{

}

@Table({tableName: 'files'})
export class File extends Model<File, IUploadFiles>{

	@ApiProperty({example: '1', description: 'Unique file id.'})
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	declare id: number;

	@ApiProperty({example: 'uploads/logo-hash.png', description: 'File url.'})
	@Column({type: DataType.STRING, allowNull: false})
	url!: string;

	@ApiProperty({example: 'logo-hash.png', description: 'File name.'})
	@Column({type: DataType.STRING, allowNull: false})
	name!: string;

	@ApiProperty({example: 'logo.png', description: 'Original file name.'})
	@Column({type: DataType.STRING, allowNull: false})
	originalname!: string;

	@ApiProperty({example: 'image/jpeg', description: 'Mime type.'})
	@Column({type: DataType.STRING, allowNull: false})
	mimetype!: string;

	@ApiProperty({example: '999', description: 'Mime type.'})
	@Column({type: DataType.NUMBER, allowNull: false})
	size!: number;

	@ForeignKey(() => User)
	@Column({type: DataType.NUMBER, allowNull: false})
	userId!: number;

	@BelongsTo(() => User)
	owner: User;
}