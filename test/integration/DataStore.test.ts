import { ssm, SSMDataStore } from "../../src/DataStore";
import { dataStore as DataStoreStub } from '../utils/DataStoreStub';
import { createAccount } from '../utils/OrganizationAccount';

function suite(datastore: SSMDataStore) {

  afterAll(async () => {
    try {
      await ssm.deleteParameter({ Name: process.env.SSM_PARAM_NAME }).promise();
    } catch (error) {
      if (error.code !== 'ParameterNotFound') console.log(error);
    }
  });

  describe('DataStore', (): void => {

    const testAccount = createAccount('foo', new Date('August 14, 2017'));

    it('should start empty', async () => {
      expect(await datastore.getMarkedAccounts()).toEqual([]);
    });

    it('should mark an account', async () => {
      await datastore.markAccounts([testAccount]);
      const [account] = await datastore.getMarkedAccounts();
      expect(account.name).toBe('foo');
    });

    it('should mark multiple accounts', async () => {
      await datastore.markAccounts([testAccount]);

      const newAccount = createAccount('bar', new Date('March 21, 1991'));
      await datastore.markAccounts([newAccount]);

      expect(await datastore.getMarkedAccounts()).toHaveLength(2);
    });

    xit('should unmark accounts', () => {
      expect(datastore.getMarkedAccounts()).toEqual(['12345678']);
    });
  });
}

suite(DataStoreStub);
suite(new SSMDataStore());