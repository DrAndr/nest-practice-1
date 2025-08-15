import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '../models/posts.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { FilesModule } from '../files/files.module';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    SequelizeModule.forFeature([User, Post]),
    forwardRef(() => AuthModule),
    RolesModule,
    FilesModule,
  ],
  exports: [PostsService],
})
export class PostsModule {}
