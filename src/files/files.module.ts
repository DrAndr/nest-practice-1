import {forwardRef, Module} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {ServeStaticModule} from "@nestjs/serve-static";
import path from "path";
import process from "node:process";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../models/users.model";
import {File} from "../models/files.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
  imports: [
    SequelizeModule.forFeature([User,File]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      }
    }),
    RolesModule,
    forwardRef(()=>AuthModule)
  ],
})
export class FilesModule {}
