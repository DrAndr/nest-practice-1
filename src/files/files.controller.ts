import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/utils/roles-auth.decorator';
import { RolesGuard } from '../auth/utils/roles.guard';
import { JwtAuthGuard } from '../auth/utils/jwt-auth.guard';
import { IOnDelete } from '../utils/interfaces/IOnDelete';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
    @Query('folder') folder?: string,
  ) {
    const userId = req.user.id;
    return this.filesService.createFile(files, userId, folder);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(200)
  async delete(@Param('id') id: number): Promise<IOnDelete> {
    return this.filesService.delete(id);
  }
}
