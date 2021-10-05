import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {HttpService, Injectable} from '@nestjs/common';
import {IntegrationApp} from "../integration-app/integration-app.entity";
import {IntegrationUser} from "../integrtion-user/integration-user.entity";
import {IntegrationCabinet} from "./integration-cabinet.entity";
import FactoryService from "../external-service/factoryService";
import {User} from "../user/user.entity";

@Injectable()
export class IntegrationCabinetService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(IntegrationApp)
    private appRepository: Repository<IntegrationApp>,
    @InjectRepository(IntegrationUser)
    private integrationUserRepository: Repository<IntegrationUser>,
    @InjectRepository(IntegrationCabinet)
    private integrationUCabinetRepository: Repository<IntegrationCabinet>,
  ) {
  }

  async getCabinetsFromFB(account_id: number): Promise<IntegrationCabinet[] | Message > {
    const account = await this.integrationUserRepository.findOne({
      where: {id: account_id},
      relations: ['app'],
    });
    try {
      const url = `https://graph.facebook.com/v${account.app.version}/${account.uid}?fields=adaccounts{name}&access_token=${account.token}`;
      const response = await this.httpService.get(url).toPromise();
      const accounts = response.data.adaccounts.data;
      const answer = [];
      const map_cabinets = async (cabinet) => {
        const saved_cabinet = await this.integrationUCabinetRepository.findOne({
          where: {uid: cabinet.id},
          relations: ['account'],
        });
        if (saved_cabinet) {
          if (saved_cabinet.account.id === account_id) return;
          answer.push(saved_cabinet);
          return;
        }
        cabinet.uid = cabinet.id;
        delete cabinet.id;
        answer.push(cabinet);
      };
      for (const item of accounts) {
        await map_cabinets(item);
      }
      return answer;
    } catch {
      return {
        type: 'error',
        message: 'Не удалось получить список кабинетов'
      }
    }
  }

  async saveCabinetsFromFB(
    account_id: number,
    cabinets: IntegrationCabinet[],
  ): Promise<IntegrationCabinet[]> {
    const account = new IntegrationUser();
    account.id = account_id
    const response = [];
    for (const item of cabinets) {
      const exit_cabinet = await this.integrationUCabinetRepository.findOne({
        where: {
          uid: item.uid
        }
      })
      if(!exit_cabinet){
        const cabinet_save = new IntegrationCabinet();
        cabinet_save.uid = item.uid;
        cabinet_save.name = item.name;
        cabinet_save.account = account;
        response.push(await this.integrationUCabinetRepository.save(cabinet_save));
      }
    }
    return response;
  }

  async getCampaignsName(user_id: number): Promise<object[]>{
    let result = []
    const user = new User()
    user.id = user_id
    const integrationUsers = await this.integrationUserRepository.find({
      where: {
        user
      },
      relations: ['app']
    })
    const factory = new FactoryService(this.httpService);
    for(let i =0; i < integrationUsers.length; i++){
      const service = factory.getService(integrationUsers[i]);
      const campaigns = await service.getCampaignsId()
      result = [...result, ...campaigns]
    }

    return result
  }
}
