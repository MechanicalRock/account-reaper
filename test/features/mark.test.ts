import { defineFeature, DefineStepFunction, loadFeature } from 'jest-cucumber';
import { accountMarker } from '../../src/handler';
import { createAccount } from '../utils/OrganizationAccount';
import * as DataStore from '../utils/DataStoreStub';
import { Account } from 'aws-sdk/clients/organizations';
import * as utils from '../../src/utils';

const feature = loadFeature('./test/features/Mark.feature');

defineFeature(feature, test => {

  let inputAccounts: Account[];

  beforeEach(() => {
    inputAccounts = [];
  });

  test('Marking an old sandbox account', ({ given, and, when, then }) => {

    givenAccountPreviouslyCreated(given);

    andTodayIs(and);

    whenAccountReaperRuns(when);

    thenAccountShouldBeMarked(then);
  });

  test('A persistent account', ({ given, and, when, then }) => {

    givenAccountPreviouslyCreated(given);

    andTodayIs(and);

    whenAccountReaperRuns(when);

    thenAccountShouldNotBeMarked(then);
  });

  test('Sandbox account misnamed', ({ given, and, when, then }) => {

    givenAccountPreviouslyCreated(given);

    andTodayIs(and);

    whenAccountReaperRuns(when);

    thenAccountShouldBeMarked(then);
  });

  test('Sandbox account is less than 30 days old', ({ given, and, when, then }) => {

    givenAccountPreviouslyCreated(given);

    andTodayIs(and);

    whenAccountReaperRuns(when);

    thenAccountShouldNotBeMarked(then);
  });

  /**
  test('Marking a non-sandbox account for deletion', ({ given, when, then, and }) => {
      given(/^I have an account (.*)$/, (arg0) => {

      });

      when(/^I mark (.*) for deletion$/, (arg0) => {

      });

      then(/^I should see a notification indicating that (.*) has been marked for deletion$/, (arg0) => {

      });

      and('I should see the date it will be deleted on', () => {

      });
  });

  test('I want to mark an account for deletion that doesn\'t exist', ({ given, when, then }) => {
      given(/^I have an account (.*)$/, (arg0) => {

      });

      when(/^I mark (.*) for deletion$/, (arg0) => {

      });

      then('I should receive an error message stating the specified account does not exist', () => {

      });
  });
   */

  function givenAccountPreviouslyCreated(given: DefineStepFunction) {
    given(/^account "(.*)" was created on "(.*)"$/, (accountName: string, dateCreated: string) => {
      let testAccount = createAccount(accountName, new Date(dateCreated));
      inputAccounts.push(testAccount);
    });
  }

  function andTodayIs(and: DefineStepFunction) {
    and(/^today is "(.*)"$/, (dateToday: string) => {
      const timeSpy = jest.spyOn(utils, 'getTimeNow');
      const mockDate = new Date(dateToday).getTime();
      timeSpy.mockReturnValue(mockDate);
    });
  }

  function whenAccountReaperRuns(when: DefineStepFunction) {
    when('Account Reaper runs', async () => {
      await accountMarker(inputAccounts, DataStore.dataStore);
    });
  }

  function thenAccountShouldBeMarked(then: DefineStepFunction) {
    then(/^account "(.*)" should be marked for deletion$/, async (accountName: string) => {
      expect(await isAccountMarked(accountName)).toBe(true);
    });
  }

  function thenAccountShouldNotBeMarked(then: DefineStepFunction) {
    then(/^account "(.*)" should not be marked for deletion$/, async (accountName: string) => {
      expect(await isAccountMarked(accountName)).toBe(false);
    });
  }

  async function isAccountMarked(accountName: string) {
    const markedAccounts = await DataStore.dataStore.getMarkedAccounts();
    return markedAccounts.some(({ name }) => name === accountName);
  }
});