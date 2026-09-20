import {
    CanActivate,
    ExecutionContext, ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {ROLES_KEY} from "./decorators/role.decorator";
import {User} from "../model/user.model";
import {Role} from "../../roles/model/role.model";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService,
                private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) {
            return true;
        }

        const req = context.switchToHttp().getRequest();

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new HttpException("Пользователь не найден", HttpStatus.UNAUTHORIZED);
        }

        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            throw new HttpException("Пользователь не найден", HttpStatus.UNAUTHORIZED);
        }

        let user: User;

        try {
            user = await this.jwtService.verifyAsync(token);
        } catch {
            throw new HttpException("Пользователь не найден", HttpStatus.UNAUTHORIZED);
        }

        req.user = user;

        const hasRequiredRole = user.roles.some(
            (role: Role) => requiredRoles.includes(role.value),
        );

        if (!hasRequiredRole) {
            throw new ForbiddenException("Недостаточно прав для выполнения этого действия");
        }

        return true;

    }
}