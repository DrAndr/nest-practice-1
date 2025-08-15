import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../models/roles.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    try {
      const role = await this.roleModel.create(dto);
      return role;
    } catch (e) {
      throw new NotFoundException(e.id, e.message);
    }
  }

  async delete(id: number): Promise<number | void> {
    try {
      return await this.roleModel.destroy({ where: { id } }); // returns deletion status 1/0
    } catch (e) {
      throw new NotFoundException(e.id, e.message);
    }
  }

  async getAllRoles(limit: number, offset: number): Promise<Role[]> {
    return this.roleModel.findAll({ limit, offset });
  }

  async getRoleByValue(value: string): Promise<Role | null> {
    try {
      return await this.roleModel.findOne({ where: { value } });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}
