//core
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import {UserController} from "./user.controller";
import { UserService } from './user.service';
import { User } from './user.entity';

//config
import { JwtStrategy } from './auth/jwt.strategy';
import config from "../../config/config";


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: config.secret,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
