interface IThrottlerConfig {
    ms: number,
    requests: number
}

export class Throttler {
    ms: number;
    maxRequests: number;
    stackRequests: number;
    promiseStack: Function[];
    cleanerStarted: boolean;

    constructor(config: IThrottlerConfig);
    configValidation(): void;
    startCleaner(): void;
    tryToResolveImmediately(): void;
    acquire(): Promise<void>;
}