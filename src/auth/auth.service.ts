import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserRoleEntity } from '../user/entity/user-role.entity';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
  ) {}

  async validateUser(email: string, displayName: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });

    if (user) {
      return user;
    }

    //In case of DEFAULT_USER_ROLE is not set, user will be registered without any role
    const roles = await this.userRoleRepo.find({
      where: { name: process.env.DEFAULT_USER_ROLE },
    });

    //Register anyone on their first sign-in
    const newUser = this.userRepo.create({ email, displayName, roles });
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user?.id || null;
  }
}
