'use strict';

const Throttler = require('./throttler/Throttler');
const PriorityThrottler = require('./throttler/PriorityThrottler');

const throttler = new PriorityThrottler({ ms: 100, requests: 10 });

async function generateRequests(throttler) {
    const result = [];
    const resultPromises = [];
    
    for (let i = 1; i <= 50; i++) {
        const request = throttler.acquire(1)
            .then(() => result.push(i));
        resultPromises.push(request);

        if (i % 3 === 0) {
            const request = throttler.acquire(3)
                .then(() => result.push(`Priority 3`));
            resultPromises.push(request);
        }

        if (i % 5 === 0) {
            const request = throttler.acquire(2)
                .then(() => result.push(`Priority 2`));
            resultPromises.push(request);
        }
    }
    await Promise.all(resultPromises);
    return result;
}

(async (throttler) => {
    const data = await generateRequests(throttler);
    console.log(data);
})(throttler);