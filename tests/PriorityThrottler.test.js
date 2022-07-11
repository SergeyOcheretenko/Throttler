'use strict';

const PriorityThrottler = require('../src/throttler/PriorityThrottler');

jest.setTimeout(60_000);

async function checkTime(requests, throttler) {
    performance.mark('Start');
    const resultPromises = [];
    for (let i = 0; i < requests; i++) {
        const request = throttler.acquire(1);
        resultPromises.push(request);
    }
    await Promise.all(resultPromises);
    performance.mark('End');
    const workingTime = performance.measure('throttler', 'Start', 'End');
    return workingTime.duration;
}

async function checkFIFO(requests, throttler) {
    const resultPromises = [];
    const answer = [];
    const result = [];
    for (let i = 0; i < requests; i++) {
        const request = throttler.acquire(1)
            .then(() => result.push(i));
        resultPromises.push(request);
        answer.push(i);
    }
    await Promise.all(resultPromises);
    expect(result).toEqual(answer);
}

async function checkPriorities(requests, throttler) {
    const resultPromises = [];
    const result = [];
    for (let i = 1; i <= requests; i++) {
        const request = throttler.acquire(1)
            .then(() => result.push(1));
        resultPromises.push(request);

        if (i % 3 == 0) {
            const request = throttler.acquire(2)
                .then(() => result.push(2));
            resultPromises.push(request);
        }

        if (i % 5 == 0) {
            const request = throttler.acquire(3)
                .then(() => result.push(3));
            resultPromises.push(request);
        }
        
    }
    await Promise.all(resultPromises);
    return result;
}

describe('PriorityThrottler FIFO', () => {
    test('100 requests, 10 per 100ms', async () => {
        const throttler = new PriorityThrottler({ ms: 100, requests: 10 });
        await checkFIFO(100, throttler);
    });

    test('1000 requests, 1 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 1 });
        await checkFIFO(100, throttler);
    });

    test('10 requests, 9 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 9 });
        await checkFIFO(10, throttler);
    });

    test('100 requests, 1 per 0ms', async () => {
        const throttler = new PriorityThrottler({ ms: 0, requests: 1 });
        await checkFIFO(100, throttler);
    });

    test('100 requests, 1 per 1ms', async () => {
        const throttler = new PriorityThrottler({ ms: 1, requests: 1 });
        await checkFIFO(1000, throttler);
    });
});

describe('PriorityThrottler priorities', () => {
    test('10 requests, 1 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 1 });
        const result = await checkPriorities(10, throttler);
        const answer = [
            1, 
            3, 3, 
            2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        expect(result).toEqual(answer);
    });

    test('12 requests, 5 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 5 });
        const result = await checkPriorities(12, throttler);
        const answer = [
            1, 1, 1, 2, 1, 
            3, 3, 
            2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1
        ];
        expect(result).toEqual(answer);
    });

    test('15 requests, 4 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 4 });
        const result = await checkPriorities(15, throttler);
        const answer = [
            1, 1, 1, 2, 
            3, 3, 3,
            2, 2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        expect(result).toEqual(answer);
    });

    test('20 requests, 10 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 10 });
        const result = await checkPriorities(20, throttler);
        const answer = [
            1, 1, 1, 2, 1, 1, 3, 1, 2, 1, 
            3, 3, 3,
            2, 2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        expect(result).toEqual(answer);
    });
});

describe('PriorityThrottler corner cases', () => {
    test('Config: 10 per 0ms ', async () => {
        const throttler = new PriorityThrottler({ ms: 0, requests: 10 });
        await checkFIFO(100, throttler);
    });

    test('Config: 0 per 0ms', async () => {
        try {
            const throttler = new PriorityThrottler({ ms: 0, requests: 0 });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unable to set a limit of 0 requests or less');
        }
    });

    test('Config: 10 per -1ms', async () => {
        try {
            const throttler = new PriorityThrottler({ ms: -1, requests: 10 });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unable to set the time less than 0ms');
        }
    });

    test('Config: -1 per 10ms', async () => {
        try {
            const throttler = new PriorityThrottler({ ms: 10, requests: -1 });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unable to set a limit of 0 requests or less');
        }
    });
})

describe('PriorityThrottler timing', () => {
    test('90 requests, 100 per 200ms', async () => {
        const throttler = new PriorityThrottler({ ms: 200, requests: 100 });
        const workingTime = await checkTime(50, throttler);
        expect(workingTime).toBeLessThan(200);
    });

    test('1000 requests, 1 per 10ms', async () => {
        const throttler = new PriorityThrottler({ ms: 10, requests: 1 });
        const workingTime = await checkTime(50, throttler);
        expect(workingTime).toBeGreaterThanOrEqual(489);
        expect(workingTime).toBeLessThan(530);
    });

    test('11 requests, 10 per 100ms', async () => {
        const throttler = new PriorityThrottler({ ms: 100, requests: 10 });
        const workingTime = await checkTime(11, throttler);
        expect(workingTime).toBeGreaterThanOrEqual(99);
        expect(workingTime).toBeLessThan(130);
    });

    test('5 requests, 1 per 100ms', async () => {
        const throttler = new PriorityThrottler({ ms: 100, requests: 1 });
        const workingTime = await checkTime(5, throttler);
        expect(workingTime).toBeGreaterThanOrEqual(399);
        expect(workingTime).toBeLessThan(430);
    });

    test('31 requests, 10 per 50ms', async () => {
        const throttler = new PriorityThrottler({ ms: 50, requests: 10 });
        const workingTime = await checkTime(31, throttler);
        expect(workingTime).toBeGreaterThanOrEqual(149);
        expect(workingTime).toBeLessThan(200);
    });

    test('100 requests, 1 per 2ms', async () => {
        const throttler = new PriorityThrottler({ ms: 2, requests: 1 });
        const workingTime = await checkTime(100, throttler);
        expect(workingTime).toBeGreaterThanOrEqual(197);
        expect(workingTime).toBeLessThan(250);
    });
});