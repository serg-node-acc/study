import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {Public} from "../../guards/isPublic.guard";

@Controller('auth')
export class AuthController {
    constructor(private  readonly authService: AuthService) {
    }

    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) {
        console.log(dto)
        return this.authService.login(dto)
    }
}
