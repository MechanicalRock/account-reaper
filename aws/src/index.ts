import { App } from '@aws-cdk/cdk';
import { DevToolsStack } from './dev-tools/DevToolsStack';

const app = new App();
new DevToolsStack(app, `AccountReaperPipeline`);

app.run();