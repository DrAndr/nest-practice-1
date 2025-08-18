import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsInt, IsOptional, IsString, Length} from "class-validator";
import {Type} from "class-transformer";

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Role value (name)' }) // describe response
  @IsString({ message: 'The role name should by unique.' })
  @Length(3, 16, {
    message: 'The role value should by between 3 and 16 characters.',
  })
  @Type(() => String)
  value: string;

  @ApiProperty({ example: 'Can CRUD* users; \n Can CRUD* roles; \n Can CRUD* posts.', description: 'String' })
  @IsOptional()
  description: string;
}
