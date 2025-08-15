import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { join, map, values } from 'lodash';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  private isClass(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || !this.isClass(metadata.metatype)) {
      return value;
    }

    const obj = plainToInstance(metadata.metatype, value); // get expected fields,
    const errors = await validate(obj); // compare expected and passed fields

    if (errors.length > 0) {
      const message = map(
        errors,
        (error) =>
          `${error.property} - ${join(values(error.constraints), ', ')}`,
      );
      throw new ValidationException(message);
    }

    return obj;
  }
}
