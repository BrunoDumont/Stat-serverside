import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { IntegrationUserService } from './integration-user.service';
import { IntegrationUserController } from './integration-user.controller';
import {IntegrationUser} from "./integration-user.entity";
import {IntegrationApp} from "../integration-app/integration-app.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([IntegrationUser, IntegrationApp]),
  ],
  providers: [IntegrationUserService],
  controllers: [IntegrationUserController]
})
export class IntegrationUserModule {}
