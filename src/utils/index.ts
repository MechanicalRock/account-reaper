import { Account } from 'aws-sdk/clients/organizations';
import AWSXray from 'aws-xray-sdk';

export function getTimeNow(): number {
  return Date.now();
}

export function destructureAccount(account: Account): MarkedAccount {
  return {
    id: account.Id!,
    name: account.Name!,
    dateMarked: getTimeNow()
  };
}

type LogError = (segment: AWSXray.Segment, message: string, error: Error) => void;

export const logError: LogError = (segment, message, error) => {
  segment.addError(error);
  console.error(message, error);
}
