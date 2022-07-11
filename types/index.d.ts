import { PriorityThrottler } from './PriorityThrottler';
import { Throttler } from './Throttler';

declare function generateRequests(throttler: PriorityThrottler | Throttler): any[];