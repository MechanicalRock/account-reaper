import { Account } from 'aws-sdk/clients/organizations';
import { SSMDataStore } from '../../src/DataStore';
import { destructureAccount } from '../../src/utils';
import { unionBy } from 'lodash';

export const dataStore = new SSMDataStore();

let markedAccounts: MarkedAccount[] = [];

const getMarkedAccountSpy = jest.spyOn(dataStore, 'getMarkedAccounts');

getMarkedAccountSpy.mockImplementation(async () => markedAccounts);

const markAccountsSpy = jest.spyOn(dataStore, 'markAccounts');

markAccountsSpy.mockImplementation(async (accounts: Account[]) => {
    const currentAccounts = await dataStore.getMarkedAccounts();
    let newAccounts = accounts.map(destructureAccount);
    markedAccounts = unionBy(currentAccounts, newAccounts, 'id');
});
