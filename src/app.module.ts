import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './core/user/user.module';
import {JwtModule} from "@nestjs/jwt";

export const jwtConstants = {
  secret: 'DO NOT USE THIS aa VALUE. INSTEAD, CREATE ds A COMPLEX SECRET AND KEEP 2 IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '365d' },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
