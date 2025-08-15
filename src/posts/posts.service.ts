import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Post} from "../models/posts.model";
import {InjectModel} from "@nestjs/sequelize";
import {FindOptions} from "sequelize";
import {FilesService} from "../files/files.service";
import {File} from '../models/files.model';
import {ICreatePost} from "./interfaces/ICreatePost";
import {Role} from "../models/roles.model";
import {MFile} from "../files/dto/MFile";
import {AddPostDto} from "./dto/add-post.dto";


@Injectable()
export class PostsService {

	constructor(@InjectModel(Post) private readonly postsModel: typeof Post,
	            private readonly fileService: FilesService
	) {
	}

	async create(params): Promise<Post | any> {
		const {dto, previewImage, userId} = params;
		const createdFile: File[] = await this.fileService.createFile([previewImage], userId, 'posts');
		const previewImageId = createdFile[0].get('id');
		try {
			const newPost = await this.postsModel.create({...dto, previewImage: previewImageId, userId, published: false});
			return await this.findByPk(newPost.get('id'))
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				const messages = error.errors.map((e: any) => e.message);
				throw new HttpException(
					{message: 'Validation error', details: messages},
					HttpStatus.BAD_REQUEST
				);
			}
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	async findByPk(id: number): Promise<Post | null> {
		return await this.postsModel.findByPk(id, {
			include: {
				all: true,
				// nested: true,
				attributes: {exclude: ['password']} // Exclude user PWD from response
			}
		});
	}

	async findOne(options: FindOptions): Promise<Post | null> {
		return await this.postsModel.findOne(options);
	}

	async findAll(options: FindOptions): Promise<Post[]> {
		return await this.postsModel.findAll(options);
	}
}
