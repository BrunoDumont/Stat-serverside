import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { IntegrationAppService } from './integration-app.service';
import { IntegrationAppController } from './integration-app.controller';
import {IntegrationApp} from "./integration-app.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([IntegrationApp]),
  ],
  providers: [IntegrationAppService],
  controllers: [IntegrationAppController]
})
export class IntegrationAppModule {}
