import { ScheduledHandler } from 'aws-lambda';
import { Account } from 'aws-sdk/clients/organizations';
import AWSXray from 'aws-xray-sdk';
import bluebird from 'bluebird';
import { SSMDataStore } from './DataStore';
import { Marker } from './Marker';
import { listOrganisationAccounts } from './Organizations';
import { logError } from './utils';

global.Promise = bluebird;
const segment = new AWSXray.Segment('Account_Reaper');

export const main: ScheduledHandler = async (event, context) => {
  try {
    const accounts = await listOrganisationAccounts();
    await accountMarker(accounts, new SSMDataStore());
  } catch (error) {
    logError(segment, 'Error in handler: ', error);
  } finally {
    segment.close();
  }
}

export async function accountMarker(accounts: Account[], datastore: SSMDataStore) {
  const newMarkedAccounts = new Marker().deriveAccountsToMark(accounts);
  await datastore.markAccounts(newMarkedAccounts);
}
