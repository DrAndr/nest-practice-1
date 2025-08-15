import {
	Body,
	Controller,
	Get, HttpCode,
	Post,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {PostsService} from "./posts.service";
import {AddPostDto} from "./dto/add-post.dto";
import {PaginationDto} from "../utils/dto/pagination.dto";
import {Post as P} from "../models/posts.model";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/utils/jwt-auth.guard";
import {Roles} from "../auth/utils/roles-auth.decorator";
import {RolesGuard} from "../auth/utils/roles.guard";


@ApiTags('Posts')
@Controller('posts')
export class PostsController {

	constructor(private readonly postsService: PostsService) {}

	@ApiOperation({summary: 'Create new post'})
	@Post()
	@UseGuards(JwtAuthGuard)
	@Roles('ADMIN')
	@UseGuards(RolesGuard)
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('image'))
	addPost(
		@UploadedFile() previewImage: Express.Multer.File,
		@Body() dto: AddPostDto,
		@Req() req): Promise<P> {

		const userId = req.user.id;
		return this.postsService.create({dto, previewImage, userId});
	}

	@ApiOperation({summary: 'Get post by id'})
	@Get(':id')
	findByPk(@Query('id') id ): Promise<P | null> {
		return this.postsService.findByPk(id);
	}

	@ApiOperation({summary: 'Get all posts'})
	@Get()
	findAll(@Query() query: PaginationDto ): Promise<P[]> {
		const lim = query.limit ?? 100;
		const offs = query.offset ?? 0;

		return this.postsService.findAll({limit:lim, offset:offs});
	}
}
