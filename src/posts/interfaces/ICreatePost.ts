import { MFile } from '../../files/dto/MFile';
import { AddPostDto } from '../dto/add-post.dto';

export interface ICreatePost {
  dto: AddPostDto;
  previewImage: MFile;
  userId: number;
}
