import AbstractService from './abstractService';

export default class VK extends AbstractService {
  constructor(account, httpService) {
    super(account, httpService);
  }
  async statusAccount(): Promise<boolean> {
    // let status = false;
    // const url = `https://dashboard.profitpay.pro/api/wm/flows.json?id=${this.account.uid}-${this.account.token}`;
    // const resp = await fetch(url).then((resp) => resp.json());
    // if (!(resp.status === 'error')) status = true;
    return false;
  }
}
