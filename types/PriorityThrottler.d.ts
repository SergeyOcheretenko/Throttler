import { ResolveController } from "./ResolveController";
import { IThrottlerConfig } from "./Throttler";

export class PriorityThrottler {
    resolveController: ResolveController;
    ms: number;
    maxRequests: number;
    completedRequests: number;
    cleanerStarted: boolean;

    constructor(config: IThrottlerConfig);
    configValidation(ms: number, requests: number): void;
    tryToResolve(): void;
    stopCleaner(): void;
    startCleaner(): void;
    acquire(): Promise<void>;
}