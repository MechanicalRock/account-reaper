import { listOrganisationAccounts } from '../../src/Organizations';

describe('Organizations', (): void => {

  it('should list the accounts', async () => {
    const accounts = await listOrganisationAccounts();

    expect(accounts).toBeDefined();
    expect(accounts.length).toBeGreaterThan(1);

    const firstAccount = accounts[0];
    expect('Name' in firstAccount).toBe(true);
    expect('Id' in firstAccount).toBe(true);
  });
});
