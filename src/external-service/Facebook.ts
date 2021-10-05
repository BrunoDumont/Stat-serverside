import AbstractService from './abstractService';

export default class Facebook extends AbstractService {
  constructor(account, httpService) {
    super(account, httpService);
  }
  async statusAccount(): Promise<boolean> {
    let status = false;
    const url = `https://graph.facebook.com/v${this.account.app.version}/${this.account.uid}?access_token=${this.account.token}`;
    const resp: any = await fetch(url).then((resp) => resp.json());
    if (!resp.error) status = true;
    return status;
  }
  async getCampaignsId(){
    let result = []
    const url = `https://graph.facebook.com/v${this.account.app.version}/${this.account.uid}?` + new URLSearchParams({
      access_token: this.account.token,
      fields: 'adaccounts{campaigns{id,name}}',

    });

    const resp: any = await this.httpService.get(url).toPromise()

    if(resp.data.error) return result;
    const adaccounts = resp.data.adaccounts.data
    adaccounts.forEach(adaccount => {

      if(adaccount.campaigns){
        const campaigns = adaccount.campaigns.data
        campaigns.forEach(campaign => {
          result.push({
            type: this.account.app.name,
            uid: campaign.id,
            name: campaign.name
          })
        })

      }
    })
    return result
  }
}
