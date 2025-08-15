import {Model, Table, Column, DataType, BelongsToMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "./users.model";
import {File} from "./files.model";

interface ICreatePost {
	title: string;
	content: string;
	userId: number;
	previewImage?: number;
}

@Table({tableName: 'posts'})
export class Post extends Model<Post, ICreatePost> {

	@ApiProperty({example: 'example1', description: 'Unique user id.'})
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	declare id: number;

	@ApiProperty({example: 'My awesome post.', description: 'The post title.'})
	@Column({type: DataType.STRING, allowNull: false})
	title: string;

	@ApiProperty({example: '...content...', description: 'The post content.'})
	@Column({type: DataType.STRING, allowNull: false})
	content: string;

	@ApiProperty({ example: 5, description: 'The file id used as preview image.' })
	@ForeignKey(() => File)
	@Column({ type: DataType.INTEGER, allowNull: true })
	previewImage: number;

	@BelongsTo(() => File)
	previewFile: File;

	@ForeignKey(() => User)
	@Column({type: DataType.NUMBER, allowNull: false})
	userId: number;

	@BelongsTo(() => User)
	author: User;

	@ApiProperty({example: 'true', description: 'Is published'})
	@Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
	published: boolean;
}
