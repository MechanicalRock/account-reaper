/// <reference types="aws-lambda" />

declare module 'serverless-secrets/client';

declare module 'aws-xray-sdk' {
  export function captureAWSClient<T>(client: T): T;
  export function getSegment(): Segment;

  export class Segment {
    constructor(name: string)
    addNewSubsegment(name: string): Segment;
    addError(err: Error): void;
    close(): void;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'dev' | 'prod' | 'test'
    SLACK_HOOK: string
    SLACK_ACCESS_TOKEN: string
    SLACK_CHANNEL_NAME: string
    SLACK_CHANNEL_ID: string
    SLACK_BOT_NAME: string
    SLACK_BOT_EMOJI: string
    SSM_PARAM_NAME: string
  }
}

declare interface MarkedAccount {
  id: string;
  name: string;
  dateMarked: number;
}

declare interface NotifyEvent extends ScheduledEvent {
  markedAccounts: MarkedAccount[];
}

declare type StepFuncHandler = (event: NotifyEvent, context: Context) => void;

declare interface AccountAttachment {
  title: string
  author_name: string
}

declare interface SlackMessage {
  type: string
  subtype: string
  text: string
  ts: string
  username: string
  bot_id: string
  icons: {
    emoji: string
    image_64: string
  }
}

declare interface LastMessage extends SlackMessage {
  text: string;
  channel: string
  attachments: AccountAttachment[]
}

interface Dict {
  [key: string]: string;
}