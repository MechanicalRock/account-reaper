import { destructureAccount } from '../../src/utils';
import { createAccount } from "../utils/OrganizationAccount";
import { createNotificationStub, TestType } from "../utils/SlackNotificationStub";
import { setEnvironmentSecrets } from '../utils/ApplySecrets';

function testSuite(testType: TestType) {
  describe('Notification service', () => {

    beforeAll(async () => {
      const secrets = [
        'SLACK_ACCESS_TOKEN',
        'SLACK_HOOK'
      ];

      if (testType === TestType.INTEGRATION) {
        await setEnvironmentSecrets(secrets);
      }
    });

    it('should post a message to the channel', async () => {
      const accounts = [createAccount('foo', new Date()), createAccount('bar', new Date())];
      const markedAccounts = accounts.map(destructureAccount);

      const notificationService = createNotificationStub(testType);

      await notificationService.postMarkedAccountsNotification(markedAccounts);

      const message = await notificationService.getLatestMessage() as LastMessage;

      expect(message.text).toMatch(/scheduled for deletion/);
      expect(message.attachments).toHaveLength(markedAccounts.length);
    });
  });
}

testSuite(TestType.UNIT);
testSuite(TestType.INTEGRATION);
