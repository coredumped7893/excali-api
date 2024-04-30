import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { UserMeDTO } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  public getUserMe(@Req() req: Request): UserMeDTO {
    console.log('req', req.sessionStore);
    return {
      uid: req.user.toString(),
      email: '', //@TODO read from db
    };
  }
}
