declare module 'aws-xray-sdk' {
    export function captureAWSClient<T>(client: T): T;
    export function getSegment(): Segment;

    export class Segment {
        constructor(name: string)
        addNewSubsegment(name: string): Segment;
        addError(err: Error): void;
        close(): void;
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'dev' | 'prod' | 'test'
        SLACK_HOOK: string
        SSM_PARAM_NAME: string
    }
}

declare interface MarkedAccount {
    id: string;
    name: string;
    dateMarked: number;
}