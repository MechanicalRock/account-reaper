import { Account } from 'aws-sdk/clients/organizations';
import { getTimeNow } from './utils';

export class Marker {

  private MILLISECONDS_IN_DAY = 86400000;
  private TODAY = getTimeNow();
  private SANDBOX_REGEX = new RegExp('sandbox', 'g');

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
      isSandboxAccount = Name && this.SANDBOX_REGEX.test(Name.toLowerCase());
    return date && isSandboxAccount ? this.isOlderThan30Days(date) : false;
  }

  private isOlderThan30Days(date: Date): boolean {
    const noDaysOld = this.howManyDaysAgo(date);
    return noDaysOld > 30;
  }

  private howManyDaysAgo(date: Date): number {
    return (this.TODAY - date.getTime()) / this.MILLISECONDS_IN_DAY;
  }
}
