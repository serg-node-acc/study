import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import {verify} from "argon2";

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
                private jwtService: JwtService
                ) {}
    async login(dto: LoginDto) {
        const user = await  this.prisma.user.findUnique({
            where: {
                login:dto.login,
            }
        })

        if (!user) {
           throw new UnauthorizedException()
        }

        const isPasswordValid = await verify(user.password, dto.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException()
        }

        const payload = { sub: user.id, username: user.login };

        return {
            access_token: await this.jwtService.signAsync(payload),
        }

    }
}
