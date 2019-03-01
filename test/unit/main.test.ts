import * as handler from "../../src/handler";
import { ScheduledEvent, Context } from "aws-lambda";
import * as Orgs from '../../src/Organizations';
import * as DataStore from '../../src/DataStore';
import { createDataStoreStub } from '../utils/DataStoreStub';
import { generateTestAccounts } from '../utils/AccountSetup';
import * as NotificationHandler from '../../src/SlackNotification';
import { TestType, createNotificationStub } from "../utils/SlackNotificationStub";

describe('lambda handler', () => {

  it('should invoke the mark accounts service without blowing up', async () => {

    const event = {} as ScheduledEvent,
      context = {
        functionName: 'account_reaper'
      } as Context,
      callback = () => { };

    jest.spyOn(handler, 'markAccounts');
    jest.spyOn(handler, 'accountMarker').mockImplementation();

    jest.spyOn(Orgs, 'listOrganisationAccounts').mockImplementation(async () => []);
    jest.spyOn(DataStore, 'createDataStore').mockReturnValue(createDataStoreStub());

    await handler.markAccounts(event, context, callback);

    expect(handler.markAccounts).not.toThrowError();
  });

  it('should invoke the notify service without blowing up', async () => {

    jest.spyOn(handler, 'notifySlack');
    jest.spyOn(handler, 'slackNotifier').mockImplementation();
    const mock = jest.spyOn(NotificationHandler, 'createNotifier').mockReturnValue(createNotificationStub(TestType.UNIT));

    const inputEvent = {
      markedAccounts: generateTestAccounts()
    } as NotifyEvent,
      context = {
        functionName: 'account_reaper'
      };

    await handler.notifySlack(inputEvent, context);

    expect(handler.notifySlack).not.toThrowError();
    expect(mock).toHaveBeenCalled();
  });
});
