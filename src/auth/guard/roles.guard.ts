import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { Repository } from 'typeorm';
import { UserRoleEntity } from '../../user/entity/user-role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = await this.userRepository.findOne({
      where: { id: request.user },
      relations: {
        roles: true,
      },
    });
    return this.matchRoles(roles, user.roles);
  }

  private matchRoles(roles: string[], userRoles: UserRoleEntity[]): boolean {
    return (
      userRoles
        .map((userRole) => userRole.name)
        .filter((userRole) => roles.includes(userRole)).length > 0
    );
  }
}
