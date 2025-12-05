import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {Reflector} from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,  private reflector: Reflector,) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if(isPublic) {
            return true;
        }

        if (!token) {
            return false;
        }

        try {
            const payload = this.jwtService.verify(token);
            request.user = payload;
            return true;
        } catch {
            return false;
        }
    }

    private extractTokenFromHeader(request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}