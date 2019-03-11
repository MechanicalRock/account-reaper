import { SSM } from 'aws-sdk';

const project = 'account-reaper';

export async function setEnvironmentSecrets(secretNames: string[], projectName: string = project) {

    const ssm = new SSM({ region: 'ap-southeast-2' });
    let environment: Dict = {};

    try {
        for (const secret of secretNames) {
            const { Parameter } = await ssm.getParameter({
                Name: `/${projectName}/${process.env.NODE_ENV}/${secret}`,
                WithDecryption: true
            }).promise();
            environment[secret] = Parameter!.Value!;
        }
    } catch (error) {
        console.warn(error);
        throw 'Could not apply secrets to the environment!';
    }

    Object.assign(process.env, environment);
    console.warn('secret environment variables applied', secretNames);
}