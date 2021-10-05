import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {IntegrationCabinetService} from "./integration-cabinet.service";
import {JwtAuthGuard} from "../user/auth/jwt-auth.guard";
import {IntegrationCabinet} from "./integration-cabinet.entity";
import {IntegrationApp} from "../integration-app/integration-app.entity";

@Controller('integration-cabinet')
export class IntegrationCabinetController {
  constructor(private readonly integrationCabinetService: IntegrationCabinetService) {
  }

  @Post('getIntegrationCabinetsFromFB')
  @UseGuards(JwtAuthGuard)
  async getIntegrationCabinetsFromFB(@Req() req, @Body() body: { account_id: number }): Promise<IntegrationCabinet[] | Message> {
    const account_id = body.account_id
    return await this.integrationCabinetService.getCabinetsFromFB(account_id);
  }

  @Post('saveIntegrationCabinetsFromFB')
  @UseGuards(JwtAuthGuard)
  async saveIntegrationCabinetsFromFB(
    @Body() body: { account_id: number, cabinets: IntegrationCabinet[] }
  ): Promise<IntegrationCabinet[] | Message> {
    const account_id = body.account_id
    const cabinets = body.cabinets
    return await this.integrationCabinetService.saveCabinetsFromFB(account_id, cabinets);
  }

  @Get('getCampaignsName')
  @UseGuards(JwtAuthGuard)
  async getCampaignsName(@Req() req): Promise<object[]> {
    const user_id = req.user
    return await this.integrationCabinetService.getCampaignsName(user_id);
  }
}
