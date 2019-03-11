import { App, Stack, Tag } from '@aws-cdk/cdk';
import { GithubNodePipeline } from 'cdk-constructs';

const app = new App();
const stack = new Stack(app, 'myAppStack');

stack.apply(new Tag('owner', 'rick.foxcroft@mechanicalrock.io'));
stack.apply(new Tag('project', 'https://github.com/MechanicalRock/account-reaper'));

new GithubNodePipeline(stack, 'AccountReaperPipeline', {
    githubOwner: 'MechanicalRock',
    repoName: 'account-reaper',
    ssmGithubTokenName: 'github-oauth-token',
    codeBuildRolePolicy: 'arn:aws:iam::aws:policy/AdministratorAccess'
});

app.run();