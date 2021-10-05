import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IntegrationApp} from "./integration-app.entity";

@Injectable()
export class IntegrationAppService {
  constructor(
    @InjectRepository(IntegrationApp)
    private appRepository: Repository<IntegrationApp>,
  ) {
  }

  async getAllApps(): Promise<IntegrationApp[]> {
    return await this.appRepository.find();
  }
}
