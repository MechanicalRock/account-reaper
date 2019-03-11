import fetch from 'node-fetch';
import { NotificationHandler, createNotifier, SlackNotification } from '../../src/SlackNotification';
import { NotificationMessageBuilder as MessageBuilder } from '../../src/utils/MessageBuilder';

export enum TestType {
  UNIT = 'unit',
  INTEGRATION = 'integration'
}

interface ChannelHistoryResponse {
  ok: boolean
  has_more: boolean
  messages: SlackMessage[];
}

async function getLatestMessage(): Promise<SlackMessage> {

  const { SLACK_ACCESS_TOKEN, SLACK_CHANNEL_ID } = process.env;
  const getHistoryUrl = `https://slack.com/api/channels.history?token=${SLACK_ACCESS_TOKEN}&channel=${SLACK_CHANNEL_ID}&count=1&pretty=1`;

  const fetchResponse = await fetch(getHistoryUrl);
  const { ok, messages: [message] }: ChannelHistoryResponse = await fetchResponse.json();

  if (ok && message) {
    return message;
  } else {
    throw 'Response not ok';
  }
}

class UnitNotification implements NotificationHandler {

  private messages: object[] = [];

  async getLatestMessage(): Promise<SlackMessage> {
    return this.messages[this.messages.length - 1] as SlackMessage;
  }

  postMarkedAccountsNotification(accounts: MarkedAccount[]): void {
    const formattedMessage = new MessageBuilder().formatMessage(accounts);
    const finalMessage = SlackNotification.createBotMessage(formattedMessage);
    this.messages.push(finalMessage);
  }

}

export function createNotificationStub(testType: TestType): NotificationHandler {

  switch (testType) {

    case TestType.INTEGRATION: {
      const slackNotification = createNotifier();
      slackNotification.getLatestMessage = getLatestMessage;
      return slackNotification;
    }

    case TestType.UNIT:
      return new UnitNotification();
  }
}
