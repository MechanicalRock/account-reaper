import { Account } from 'aws-sdk/clients/organizations';

const email = 'team@mechanicalrock.io';

export function createAccount(name: string, createdOn: Date): Account {
    const id = generateRandom12DigitNumber();
    const arn = `arn:aws:organizations::${id}`;

    return {
        Id: id,
        Arn: arn,
        Name: name,
        Email: email,
        Status: 'ACTIVE',
        JoinedMethod: 'CREATED',
        JoinedTimestamp: createdOn,
    };
}

function generateRandom12DigitNumber(): string {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}