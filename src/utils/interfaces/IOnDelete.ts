import { HttpStatus } from '@nestjs/common';

export interface IOnDelete {
  statusCode: HttpStatus;
  success: boolean;
  message: string;
}
