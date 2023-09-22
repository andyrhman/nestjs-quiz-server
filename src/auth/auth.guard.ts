import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Check if the user is Authenticated
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['user_session'];

    if (!jwt) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      return this.jwtService.verify(jwt);
    } catch (error) {
      throw new UnauthorizedException('User not authenticated');
    }
  }
}