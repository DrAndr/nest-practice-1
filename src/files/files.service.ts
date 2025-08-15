import {HttpException, HttpStatus, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as uuid from 'uuid';
import sharp from "sharp";
import {MFile} from "./dto/MFile";
import {IFileData} from "./interfaces/IFileData";

import {File} from "../models/files.model";
import {IOnDelete} from "../utils/interfaces/IOnDelete";
import {fileExists} from "../utils/fileExists";



import isArray from "lodash/isArray";
import toLower from "lodash/toLower";

@Injectable()
export class FilesService {

	constructor(@InjectModel(File) private readonly filesModel: typeof File) {}

	private async fileFilter(files: MFile[]): Promise<MFile[]> {

		return await Promise.all(
			files.map(async file => {

				const mimetype = file.mimetype as string;
				const fileType = mimetype.split('/').at(-1);
				const hashName = uuid.v4();
				const [fileOriginalName, type] = file.originalname.split('.');

				if (mimetype.includes('image') && toLower(fileType) !== 'svg+xml') {
					const buffer = await this.convertToWebp(file.buffer);
					return new MFile({
						buffer,
						originalname: `${hashName}.webp`,
						filename: fileOriginalName,
						mimetype: `image/webp`,
					});
				}

				return new MFile({
					buffer: file.buffer,
					originalname: `${hashName}.${type}`,
					filename: fileOriginalName,
					mimetype
				});
			})
		)
	}

	private convertToWebp(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}

	private getFilePath(fileUrl): string {
		return path.join(__dirname, '..', '..', fileUrl)
	}

	async createFile(fileData: MFile[], userId: number, folder = ''): Promise<File[]> {
		const isSingle = !isArray(fileData);
		const filteredFiles: MFile[] = await this.fileFilter(isSingle ? [fileData] : fileData);
		const uploadFolder: string = path.join(__dirname, '..', '..', 'uploads', folder);

		// create folder if not exists
		await fs.mkdir(uploadFolder, {recursive: true});

		return await Promise.all(
			filteredFiles.map(async (file: MFile): Promise<any> => {
				try {
					const filePath = path.join(uploadFolder, file.originalname)
					await fs.writeFile(filePath, file.buffer);
					const stats = await fs.stat(filePath);

					const fileData: IFileData = {
						url: path.join('uploads', folder, file.originalname),
						name: file.originalname,
						size: stats.size,
						mimetype: file.mimetype,
						originalname: file?.filename || '',
						userId
					};

					try {
						return await this.filesModel.create(fileData);
					} catch (e) {
						console.error(e);
					}

				} catch (e) {
					throw new InternalServerErrorException(`ERROR while file recording: ${e.message}`)
				}
			})
		);
	}

	async delete(id: number): Promise<IOnDelete> {
		const file = await this.filesModel.findByPk(id);

		if (file) {
			const filePath = this.getFilePath(file.get('url'));
			const isFileExist = await fileExists(filePath);

			if (isFileExist) {
				try {
					await fs.unlink(filePath)
				} catch (e) {
					console.error('File not exists: ', e.message);
				}
			}

			await file.destroy();
			return {
				statusCode: HttpStatus.OK,
				success: true,
				message: `File with id=${id} has been deleted.`,
			};
		}
		return 		 {
			statusCode: HttpStatus.NOT_FOUND,
			success: false,
			message: `File not found.`,
		};
	}
}
