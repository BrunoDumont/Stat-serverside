import {HttpService, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IntegrationUser} from "./integration-user.entity";
import {IntegrationApp} from "../integration-app/integration-app.entity";
import {User} from "../user/user.entity";

type TypeUserFBResponse = {
  id: string;
  name: string;
};

@Injectable()
export class IntegrationUserService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(IntegrationApp)
    private appRepository: Repository<IntegrationApp>,
    @InjectRepository(IntegrationUser)
    private integrationUserRepository: Repository<IntegrationUser>,
  ) {
  }

  async getIntegrationUsers(user_id: number): Promise<IntegrationUser[]> {
    return await this.integrationUserRepository.find({
      where: {
        user: {id: user_id},
      },
      relations: ['app', 'cabinets'],
    });
  }

  async addIntegrationAccount(
    uid: string,
    name: string,
    token: string,
    app_id: number,
    user_id: number,
  ): Promise<IntegrationUser> {
    const exists_token = await this.integrationUserRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (exists_token) {
      throw new Error(
        `Аккаунт с таким токеном интегрирован у пользователя ${exists_token.user.username}`,
      );
    }
    const account = new IntegrationUser();
    account.uid = uid ? uid : '';
    account.name = name;
    account.token = token;
    account.token_date_update = new Date();
    // account.user = {
    //   id: user_id
    // };
    // account.app = {
    //   id: app_id
    // };
    return await this.integrationUserRepository.save(account);
  }

  async loginFB(user_id: number, token: string): Promise<IntegrationUser | Message> {
    const app_fb = await this.appRepository.findOne({
      where: { name: 'Facebook' },
    });
    try {
      const url_access_token = `https://graph.facebook.com/v${app_fb.version}/oauth/access_token?grant_type=fb_exchange_token&client_id=${app_fb.uid}&client_secret=${app_fb.key}&fb_exchange_token=${token}`;
      const response = await this.httpService.get(url_access_token).toPromise();
      const access_token = response.data['access_token'];
      const url = `https://graph.facebook.com/v${app_fb.version}/me?fields=name,id&access_token=${access_token}`;
      const answer = await this.httpService.get(url).toPromise();
      const user_response: TypeUserFBResponse = answer.data;
      const account_fb = await this.integrationUserRepository.findOne({
        where: {
          uid: user_response.id,
        },
      });
      let answer_user;
      if (account_fb) {
        if (account_fb.token === access_token) {
          return {
            type: 'error',
            message: 'Токен не требует замены, обновите токен позже'
          };
        } else {
          account_fb.name = user_response.name;
          account_fb.token = access_token;
          account_fb.token_date_update = new Date();
          answer_user = await this.integrationUserRepository.save(account_fb);
        }
      } else {
        const save_user = new IntegrationUser();
        save_user.uid = user_response.id;
        save_user.name = user_response.name;
        save_user.token = access_token;
        save_user.token_date_update = new Date();
        save_user.app = app_fb;
        const temp_user = new User();
        temp_user.id = user_id
        save_user.user = temp_user;
        answer_user = await this.integrationUserRepository.save(save_user);
      }
      return answer_user;
    } catch {
      return {
        type: 'error',
        message: 'Не удалось установить соединение с Facebook'
      }
    }
  }
}
