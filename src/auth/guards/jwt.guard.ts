import {JwtService} from "@nestjs/jwt";
import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from "@nestjs/common";

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest();

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new HttpException("Пользователь не найден", HttpStatus.UNAUTHORIZED);
        }

        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            throw new HttpException("Пользователь не найден", HttpStatus.UNAUTHORIZED);
        }

        try {
            req.user = await this.jwtService.verifyAsync(token)
            return true;

        } catch {
            throw new HttpException("Пользователь не найден", HttpStatus.UNAUTHORIZED);
        }
    }
}