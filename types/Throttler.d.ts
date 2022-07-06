interface IThrottlerConfig {
    ms: number,
    requests: number
}

export class Throttler {
    ms: number;
    requests: number;
    stack: number;
    startTracking: Date;

    constructor(config: IThrottlerConfig);
    checkTime(): void
    acquire(): Promise<void>;
}