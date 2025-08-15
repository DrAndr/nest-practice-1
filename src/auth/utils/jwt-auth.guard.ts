import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = ctx.switchToHttp().getRequest();

    try {
      const authorization = req.headers.authorization;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (_) {
      throw new UnauthorizedException('Unauthorized');
    }

    return false;
  }
}
