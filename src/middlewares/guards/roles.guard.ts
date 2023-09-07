import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'config/decorations/roles.decorator';
import { Role } from 'config/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

 canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    console.log("requiredRoles: ", requiredRoles);
    
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    console.log("user guard role: ", user);
    return requiredRoles.some((role) => user.roles === role);
    // return true;
  }  
}
