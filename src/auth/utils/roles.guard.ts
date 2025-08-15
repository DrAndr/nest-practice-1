import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {ROLES_KEY} from "../constants";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService,
	            private readonly reflector: Reflector) {
	}

	canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		try {
			const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
				ctx.getHandler(),
				ctx.getClass()
			]);

			if (!requiredRoles?.length) return true; // Entity allowed for all

			const req = ctx.switchToHttp().getRequest();
			const authorization = req.headers.authorization;
			const [bearer, token] = authorization.split(' ');

			const user = this.jwtService.verify(token);
			const validationResult = user.roles.some((role) => requiredRoles.includes(role?.value));

			return validationResult;
		} catch (e) {
			throw new UnauthorizedException("Unauthorized");
		}


		return false;
	}

}