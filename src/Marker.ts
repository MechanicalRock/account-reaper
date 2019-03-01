import { Account } from 'aws-sdk/clients/organizations';
import { DateUtil } from './utils/DateUtil';

export class Marker {

  private SANDBOX_REGEX = /sandbox/i;

  deriveAccountsToMark(orgAccounts: Account[]): Account[] {
    let markedAccounts = [];

    for (const account of orgAccounts) {
      if (this.shouldMarkForDeletion(account)) {
        markedAccounts.push(account);
      }
    }
    return markedAccounts;
  }

  private shouldMarkForDeletion(account: Account): boolean {
    const { Name, JoinedTimestamp: date } = account,
      isSandboxAccount = Name && this.SANDBOX_REGEX.test(Name);
    return date && isSandboxAccount ? this.isOlderThan30Days(date) : false;
  }

  private isOlderThan30Days(date: Date): boolean {
    const noDaysOld = new DateUtil().differenceInDays(date.getTime());
    return noDaysOld >= 30;
  }

}
