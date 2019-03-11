import { defineFeature, loadFeature } from 'jest-cucumber';
import { slackNotifier } from '../../src/handler';
import { NotificationHandler } from '../../src/SlackNotification';
import { createNotificationStub, TestType } from '../utils/SlackNotificationStub';
import { generateTestAccounts } from '../utils/AccountSetup';

const feature = loadFeature('./test/features/Notify.feature');

defineFeature(feature, test => {

  let inputAccounts: MarkedAccount[];
  let slackNotification: NotificationHandler;
  let accounts: AccountAttachment[];

  beforeAll(() => {
    slackNotification = createNotificationStub(TestType.UNIT);
    accounts = [];
  });

  test('I have a list of accounts marked for deletion', ({ given, and, when, then }) => {

    given(/^I have a list of marked accounts of length (.*)$/, (noOfAccounts) => {
      inputAccounts = generateTestAccounts();
      expect(inputAccounts).toHaveLength(parseInt(noOfAccounts));
    });

    and(/^I have set my slack channel to "(.*)"$/, (channel) => {
      expect(process.env.SLACK_CHANNEL_NAME).toBe(channel);
    });

    when('the notification service runs', async () => {
      await slackNotifier(inputAccounts, slackNotification);
    });

    then(
      /^I should see 1 notification mentioning (.*) accounts in the "(.*)" channel$/,
      async (noOfAccounts, channelName) => {
        const lastMessage = await slackNotification.getLatestMessage() as LastMessage;

        expect(lastMessage.channel).toBe(channelName);
        accounts = lastMessage.attachments;

        expect(accounts).toHaveLength(parseInt(noOfAccounts));
      });

    and('I should also see the account name and id for each account', () => {
      for (const account of accounts) {
        const { author_name: id, title: name } = account;
        expect(id).toBeTruthy();
        expect(name).toBeTruthy();
      }
    });
  });

});