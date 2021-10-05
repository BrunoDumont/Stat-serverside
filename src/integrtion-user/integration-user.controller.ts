import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../user/auth/jwt-auth.guard";
import {IntegrationUserService} from "./integration-user.service";
import {IntegrationUser} from "./integration-user.entity";
import {User} from "../user/user.entity";

@Controller('integration-user')
export class IntegrationUserController {
  constructor(private readonly integrationUserService: IntegrationUserService) {}

  @Get('getIntegrationUsers')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req): Promise<IntegrationUser[]> {
    const user_id = req.user
    return await this.integrationUserService.getIntegrationUsers(user_id);
  }

  @Post('loginFB')
  @UseGuards(JwtAuthGuard)
  async loginFB(@Req() req, @Body() body: { token:string }): Promise<IntegrationUser | Message> {
    const user_id: number = req.user
    return await this.integrationUserService.loginFB(user_id, body.token);
  }
}
