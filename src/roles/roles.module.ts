import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {Role} from "../models/roles.model";
import {User} from "../models/users.model";
import {UserRoles} from "../models/user_roles.model";


@Module({
	providers: [RolesService],
	controllers: [RolesController],
	imports: [
		SequelizeModule.forFeature([Role, User, UserRoles])
	],
	exports: [RolesService]
})
export class RolesModule {
}
