import { SSM } from 'aws-sdk';
import { Account } from 'aws-sdk/clients/organizations';
import unionBy from 'lodash.unionby';
import { destructureAccount, logError } from './utils';
import stringify from 'fast-json-stable-stringify';
import AWSXray from 'aws-xray-sdk';

export const ssm = AWSXray.captureAWSClient(new SSM({ region: 'ap-southeast-2' }));

export class SSMDataStore {

  private readonly getParams = {
    Name: process.env.SSM_PARAM_NAME
  };

  private putParams: SSM.PutParameterRequest = {
    ...this.getParams,
    Type: 'String',
    Value: '',
    Overwrite: true
  };

  async markAccounts(accounts: Account[]): Promise<void> {
    const currentAccounts = await this.getMarkedAccounts();
    let newAccounts = accounts.map(destructureAccount);
    console.info('Newly marked accounts: ', newAccounts);
    newAccounts = unionBy(currentAccounts, newAccounts, 'id');
    await this.putMarkedAccounts(newAccounts);
  }

  async unmarkAccounts(): Promise<void> {
    // TODO
  }

  async getMarkedAccounts(): Promise<MarkedAccount[]> {
    let currentMarkedAccounts: MarkedAccount[] = [];
    const segment = AWSXray.getSegment().addNewSubsegment('getMarkedAccounts');

    try {
      console.info('SSM GetParameter: ', this.getParams);
      const { Parameter: markedAccounts } = await ssm.getParameter(this.getParams).promise();

      if (markedAccounts) {
        console.log('SSM GetParameter: ', markedAccounts);
        currentMarkedAccounts = JSON.parse(markedAccounts.Value || '[]');
      }
    } catch (error) {
      if (error.code !== 'ParameterNotFound') logError(segment, 'Get parameter error', error);
    } finally {
      segment.close();
      return currentMarkedAccounts;
    }
  }

  private async putMarkedAccounts(markedAccounts: MarkedAccount[]): Promise<void> {

    const segment = AWSXray.getSegment().addNewSubsegment('putMarkedAccounts');
    this.putParams.Value = stringify(markedAccounts);

    try {
      console.info('SSM PutParameter: ', this.putParams);
      const response = await ssm.putParameter(this.putParams).promise();
      console.log('SSM PutParameter: ', response);
    } catch (error) {
      logError(segment, 'Put parameter error', error);
    } finally {
      segment.close();
    }
  }

}
