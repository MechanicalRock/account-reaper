import { destructureAccount } from "../../src/utils";
import { createAccount } from "./OrganizationAccount";

const prefix = 'sandbox-',
    thirty1DaysAgo = new Date(Date.now().valueOf() - 86400000 * 31);

const newName = (suffix: string) => prefix + suffix;

export const generateTestAccounts = () =>
    [newName('foo'), newName('bar'), newName('baz'), newName('bryan')]
        .map(accountName => destructureAccount(createAccount(accountName, thirty1DaysAgo)));
