import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './roles.model';
import { UserRoles } from './user_roles.model';
import { Post } from './posts.model';
import { File } from './files.model';

interface UserCreationAttributes {
  name?: string;
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({ example: '1', description: 'Unique user id.' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'Mike', description: 'User name.' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'new user' })
  name: string;

  @ApiProperty({ example: 'user@email.com', description: 'User email.' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password.' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'false', description: 'Is user banned.' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({
    example: 'spam',
    description: 'Why the user has been banned.',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @ApiProperty({
    example: '[{value: "admin", description:""}]',
    description: 'User roles',
  })
  @BelongsToMany(() => Role, () => UserRoles)
  roles: [Role];

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => File)
  files: File[];
}
