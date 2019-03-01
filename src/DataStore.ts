import { SSM } from 'aws-sdk';
import { Account } from 'aws-sdk/clients/organizations';
import AWSXray from 'aws-xray-sdk';
import stringify from 'fast-json-stable-stringify';
import unionBy from 'lodash.unionby';
import { destructureAccount, logError } from './utils';

export const ssm = AWSXray.captureAWSClient(new SSM({ region: 'ap-southeast-2' }));

export interface DataStore {
  markAccounts(accounts: Account[]): void;
  unmarkAccount(account: MarkedAccount): void;
  getMarkedAccounts(): Promise<MarkedAccount[]>;
}

export class SSMDataStore implements DataStore {

  private readonly getParams = {
    Name: process.env.SSM_PARAM_NAME
  };

  private putParams: SSM.PutParameterRequest = {
    ...this.getParams,
    Type: 'String',
    Value: '',
    Overwrite: true
  };

  async markAccounts(accounts: Account[]): Promise<MarkedAccount[]> {
    const currentAccounts = await this.getMarkedAccounts();
    const newAccounts = SSMDataStore.reconcileMarkedAccounts(currentAccounts, accounts);
    await this.putMarkedAccounts(newAccounts);
    return newAccounts;
  }

  async unmarkAccount(account: MarkedAccount): Promise<void> {
    // TODO
  }

  async getMarkedAccounts(): Promise<MarkedAccount[]> {
    let currentMarkedAccounts: MarkedAccount[] = [];
    const segment = AWSXray.getSegment().addNewSubsegment('getMarkedAccounts');

    try {
      console.info('SSM GetParameter: ', this.getParams);
      const { Parameter: markedAccounts } = await ssm.getParameter(this.getParams).promise();

      if (markedAccounts) {
        console.log('SSM GetParameter response: ', markedAccounts);
        currentMarkedAccounts = JSON.parse(markedAccounts.Value || '[]');
      }
    } catch (error) {
      if (error.code !== 'ParameterNotFound') logError(segment, 'Get parameter error', error);
    } finally {
      segment.close();
      return currentMarkedAccounts;
    }
  }

  static reconcileMarkedAccounts(currentAccounts: MarkedAccount[], incomingAccounts: Account[]): MarkedAccount[] {
    const newAccounts = incomingAccounts.map(destructureAccount);
    console.info('Reconciled accounts: ', newAccounts);
    return unionBy(currentAccounts, newAccounts, 'id');
  }

  private async putMarkedAccounts(markedAccounts: MarkedAccount[]): Promise<void> {

    const segment = AWSXray.getSegment().addNewSubsegment('putMarkedAccounts');
    this.putParams.Value = stringify(markedAccounts);

    try {
      console.info('SSM PutParameter: ', this.putParams);
      const response = await ssm.putParameter(this.putParams).promise();
      console.log('SSM PutParameter response: ', response);
    } catch (error) {
      logError(segment, 'Put parameter error', error);
    } finally {
      segment.close();
    }
  }

}

export function createDataStore(): DataStore {
  return new SSMDataStore();
}
