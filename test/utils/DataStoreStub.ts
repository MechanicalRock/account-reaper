import { Account } from 'aws-sdk/clients/organizations';
import { SSMDataStore, DataStore } from '../../src/DataStore';

class DataStoreStub implements DataStore {

  constructor(public markedAccounts: MarkedAccount[] = []) { }

  async markAccounts(accounts: Account[]) {
    const currentAccounts = await this.getMarkedAccounts();
    this.markedAccounts = SSMDataStore.reconcileMarkedAccounts(currentAccounts, accounts);
  }

  unmarkAccount(account: MarkedAccount): void {
    throw new Error("Method not implemented.");
  }

  async getMarkedAccounts(): Promise<MarkedAccount[]> {
    return this.markedAccounts;
  }
}

export function createDataStoreStub(): DataStore {
  return new DataStoreStub();
}
