import {Controller, Req, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Res} from '@nestjs/common';
import { Body } from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import { UserService } from './user.service';
import {User} from "./user.entity";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";

const fs = require('fs')


//dto
import {LoginUserDTO} from "./dto/login.dto";
import {SignUpUserDTO} from "./dto/signUp.dto";
import {ChangeUserDataDTO} from "./dto/changeUserData.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('currentUser')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req): Promise<User | Message> {
    return await this.userService.findUser(req.user);
  }

  @Post('login')
  async login(@Req() req, @Body() body: LoginUserDTO): Promise<User | Message> {
    return await this.userService.login(body);
  }

  @Post('signup')
  async signUp(@Req() req, @Body() body: SignUpUserDTO): Promise<User | Message> {
    return await this.userService.signUp(body);
  }

  @Post('changeUserData')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',  {
    storage: diskStorage({
      destination: "./uploads/avatar",
      filename: (req: any, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
        const user_id = req.user;
        callback(null, `avatar_${user_id}_${file.originalname}`)
      }
    })
  }))
  async changeUserData(@Req() req, @Body() body: ChangeUserDataDTO, @UploadedFile() file: Express.Multer.File): Promise<Message> {
    const user = await this.userService.findUser(req.user);
    if(body.file === 'null'){
      try {
        fs.unlinkSync(`${process.cwd()}/uploads/avatar/${user.avatar}`)
      } catch(err) {}
      user.avatar = null
    }
    if(file && file.filename) {
      try {
        fs.unlinkSync(`${process.cwd()}/uploads/avatar/${user.avatar}`)
      } catch(err) {}
      user.avatar = file.filename
    }
    return await this.userService.changeUserData(user, body);
  }

  @Get('avatar/:imageName')
  async findUserName(@Param('imageName') imageName, @Res() res): Promise<object>{
    return res.sendfile(`${process.cwd()}/uploads/avatar/${imageName}`)
  }
}