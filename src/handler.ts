import { ScheduledHandler } from 'aws-lambda';
import { Account } from 'aws-sdk/clients/organizations';
import AWSXray from 'aws-xray-sdk';
import bluebird from 'bluebird';
import { createDataStore, DataStore } from './DataStore';
import { Marker } from './Marker';
import { listOrganisationAccounts } from './Organizations';
import { createNotifier, NotificationHandler } from './SlackNotification';
import { logError } from './utils';
import { load } from 'serverless-secrets/client';

global.Promise = bluebird;

export const markAccounts: ScheduledHandler = async (event, context) => {
  const segment = AWSXray.getSegment();
  try {
    const accounts = await listOrganisationAccounts();
    return await accountMarker(accounts, createDataStore());
  } catch (error) {
    logError(segment, 'Error in handler: ', error);
  } finally {
    segment.close();
  }
}

export const notifySlack: StepFuncHandler = async (event, context) => {
  const segment = AWSXray.getSegment();
  try {
    await load();
    await slackNotifier(event.markedAccounts, createNotifier());
  } catch (error) {
    logError(segment, 'Error in handler: ', error);
  } finally {
    segment.close();
  }
}

export async function accountMarker(accounts: Account[], datastore: DataStore) {
  const newMarkedAccounts = new Marker().deriveAccountsToMark(accounts);
  await datastore.markAccounts(newMarkedAccounts);
}

export async function slackNotifier(accounts: MarkedAccount[], notifier: NotificationHandler) {
  if (accounts.length) {
    await notifier.postMarkedAccountsNotification(accounts);
  }
}
