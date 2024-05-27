import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(context: ExecutionContext) {
    if (this.roles.length == 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const manager = request.user;
    const userRoles: string = manager && manager.role;
    for (const role of this.roles) {
      if (userRoles && userRoles === role) {
        return true;
      }
    }
    return false;
  }
}
