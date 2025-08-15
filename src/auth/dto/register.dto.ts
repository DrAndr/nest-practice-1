import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'Mike', description: 'User name.' })
  readonly name: string;

  @ApiProperty({ example: 'user@email.com', description: 'User email.' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'New password.' })
  readonly password: string;

  @ApiProperty({ example: '[1, 2]', description: 'User roles.' })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  readonly roles?: number[];
}
