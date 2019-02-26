import { Organizations } from 'aws-sdk';
import { Account } from 'aws-sdk/clients/organizations';
import AWSXray from 'aws-xray-sdk';
import { logError } from './utils';

export async function listOrganisationAccounts(): Promise<Account[]> {

  const orgs = AWSXray.captureAWSClient(new Organizations({ region: 'us-east-1' }));
  const subSegment = AWSXray.getSegment().addNewSubsegment('listOrganisationAccounts');
  let accounts: Account[] = [];

  try {
    console.info('Listing organization accounts');

    let { Accounts } = await orgs.listAccounts({}).promise();
    if (Accounts) accounts = Accounts;

    console.log('organization accounts: ', accounts);
  } catch (error) {
    logError(subSegment, 'Failed to retrieve accounts: ', error);
  } finally {
    subSegment.close();
    return accounts;
  }
}