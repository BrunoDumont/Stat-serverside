import AbstractService from './abstractService';
import Facebook from './Facebook';
import VK from './VK';
import {IntegrationUser} from "../integrtion-user/integration-user.entity";
import {HttpService} from "@nestjs/common";

export default class FactoryService {
  httpService: HttpService
  constructor(httpService) {
    this.httpService = httpService
  }
  getService(account: IntegrationUser): AbstractService {
    switch (account.app.name) {
      case 'Facebook':
        return new Facebook(account, this.httpService);
      case 'ВКонтакте':
        return new VK(account, this.httpService);
      default:
        return;
    }
  }
}
