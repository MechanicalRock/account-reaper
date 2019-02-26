import { LinuxBuildImage, PipelineBuildAction, PipelineBuildActionProps, PipelineProject } from '@aws-cdk/aws-codebuild';
import { GitHubSourceAction, Pipeline } from '@aws-cdk/aws-codepipeline';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { SecretParameter, Stack, Tag } from '@aws-cdk/cdk';

export interface CodePipelineProps {
  stack: Stack;
  logicalName: string;
  pipelineName: string;
}

export class CodePipeline {
  private pipeline: Pipeline;
  private codeBuildRole: Role;

  constructor(private props: CodePipelineProps) {
    this.codeBuildRole = this.createCodeBuildRole();
    this.pipeline = this.createPipeline();
    this.createSourceStage();
    this.createDevStage();
  }

  private createPipeline(): Pipeline {
    const pipeline = new Pipeline(this.props.stack, this.props.logicalName, {
      pipelineName: this.props.pipelineName,
      restartExecutionOnUpdate: true
    });
    pipeline.apply(new Tag('owner', 'rick.foxcroft@mechanicalrock.io'));
    pipeline.apply(new Tag('project', 'https://github.com/MechanicalRock/account-reaper'));
    return pipeline;
  }

  private createCodeBuildRole(): Role {
    const codeBuildRole = new Role(this.props.stack, 'CodeBuildRole', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
    });
    codeBuildRole.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AdministratorAccess'
    );
    return codeBuildRole;
  }

  private createDevStage(): void {
    const stage = this.pipeline.addStage('DevStage');
    const project = this.createCodeBuildProject('BuildAndTest');

    this.createCodeBuildAction('BuildAndTestAction', {
      project,
      stage
    });
  }

  private createCodeBuildProject(logicalName: string): PipelineProject {
    return new PipelineProject(this.props.stack, logicalName, {
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0
      },
      role: this.codeBuildRole
    });
  }

  private createCodeBuildAction(actionName: string, props: PipelineBuildActionProps): void {
    new PipelineBuildAction(this.props.stack, actionName, props);
  }

  private createSourceStage(): void {
    const stage = this.pipeline.addStage('SourceStage');

    const { value: oauthToken } = new SecretParameter(
      this.props.stack,
      'GitHubOAuthToken',
      { ssmParameter: 'github-oauth-token' }
    );

    new GitHubSourceAction(this.props.stack, 'GitHub_Source', {
      stage,
      owner: 'MechanicalRock',
      repo: 'tech-radar',
      oauthToken
    });
  }
}
