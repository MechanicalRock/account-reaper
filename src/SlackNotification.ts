import stringify from 'fast-json-stable-stringify';
import fetch from 'node-fetch';
import { NotificationMessageBuilder as MessageBuilder } from './utils/MessageBuilder';

export interface NotificationHandler {
  getLatestMessage(): Promise<SlackMessage>;
  postMarkedAccountsNotification(accounts: MarkedAccount[]): void;
}

export class SlackNotification implements NotificationHandler {

  async getLatestMessage(): Promise<SlackMessage> {
    return {} as SlackMessage;
  }

  async postMarkedAccountsNotification(accounts: MarkedAccount[]) {
    const formattedMessage = new MessageBuilder().formatMessage(accounts);
    await this.postMessage(formattedMessage);
  }

  private async postMessage(message: object) {
    const botMessage = SlackNotification.createBotMessage(message);
    console.info('Posting notification to slack: ', botMessage);
    try {
      await fetch(process.env.SLACK_HOOK, {
        method: 'POST',
        body: stringify(botMessage)
      });
    } catch (error) {
      console.error('Error posting notification to slack: ', error);
    }
  }

  static createBotMessage(message: object) {
    return {
      channel: process.env.SLACK_CHANNEL_NAME,
      username: process.env.SLACK_BOT_NAME,
      icon_emoji: process.env.SLACK_BOT_EMOJI,
      ...message
    };
  }
}

export function createNotifier(): NotificationHandler {
  return new SlackNotification();
}
