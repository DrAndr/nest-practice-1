import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../models/users.model";
import {Role} from "../models/roles.model";
import {UserRoles} from "../models/user_roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../models/posts.model";
// import {File} from "../models/files.model";

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [
		SequelizeModule.forFeature([
			User,
			Role,
			UserRoles,
			Post,
			// File
		]),
		RolesModule,
		forwardRef(()=>AuthModule)
	],
	exports: [
		UsersService,
	]
})
export class UsersModule {}
