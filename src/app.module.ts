import { Module } from '@nestjs/common';

import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {Dialect} from "sequelize/lib/sequelize";
import * as process from "node:process";
import {User} from "./users/users.model";
import {UsersModule} from "./users/users.module";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UserRoles} from "./utils/relations/user_roles.model";
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({envFilePath: `.${process.env.NODE_ENV}.env`}),
    SequelizeModule.forRoot({
      dialect : process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      // entities: [],
      synchronize: true,
      autoLoadModels: true,
      models: [User, Role, UserRoles],
    }),
    UsersModule,
    RolesModule,
    AuthModule
  ],

})
export class AppModule {}
