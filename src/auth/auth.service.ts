import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async validateUser(email: string, displayName: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });

    if (user) {
      return user;
    }

    //Register anyone on their first sign-in
    const newUser = this.userRepo.create({ email, displayName });
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findUser(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.userRepo.findOne({ where: { id } });
    return user.id || null;
  }
}
