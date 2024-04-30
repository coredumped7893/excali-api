import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('Auth guard - user id: ', request.user);
    if (Boolean(JSON.parse(process.env.AUTH_GUARD_DISABLE))) {
      console.log('Skipping auth validation');
      console.log('Mocked user: ', process.env.AUTH_DEFAULT_USER_ID);
      return true;
    }
    return request.isAuthenticated();
  }
}
