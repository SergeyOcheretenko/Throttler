'use strict';

const Throttler = require('../src/Throttler');

jest.setTimeout(60_000);

async function checkFIFO(requests, throttler) {
    const resultPromises = [];
    const answer = [];
    const result = [];
    for (let i = 0; i < requests; i++) {
        const request = throttler.acquire()
            .then(() => result.push(i));
        resultPromises.push(request);
        answer.push(i);
    }
    await Promise.all(resultPromises);
    expect(result).toEqual(answer);
}

describe('Throttler FIFO', () => {
    test('100 requests, 10 per 100ms ', async () => {
        const throttler = new Throttler({ ms: 100, requests: 10 });
        await checkFIFO(100, throttler);
    });

    test('1000 requests, 1 per 10ms ', async () => {
        const throttler = new Throttler({ ms: 10, requests: 1 });
        await checkFIFO(1000, throttler);
    });

    test('10 requests, 9 per 10ms ', async () => {
        const throttler = new Throttler({ ms: 10, requests: 9 });
        await checkFIFO(10, throttler);
    });

    test('100 requests, 1 per 0ms ', async () => {
        const throttler = new Throttler({ ms: 0, requests: 1 });
        await checkFIFO(100, throttler);
    });
});

describe('Throttler corner cases', () => {
    test('Config: 10 per 0ms ', async () => {
        const throttler = new Throttler({ ms: 0, requests: 10 });
        await checkFIFO(100, throttler);
    });

    test('Config: 0 per 0ms ', async () => {
        try {
            const throttler = new Throttler({ ms: 0, requests: 0 });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unable to set a limit of 0 requests or less');
        }
    });

    test('Config: 10 per -1ms ', async () => {
        try {
            const throttler = new Throttler({ ms: -1, requests: 10 });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unable to set the time less than 0ms');
        }
    });

    test('Config: -1 per 10ms ', async () => {
        try {
            const throttler = new Throttler({ ms: 10, requests: -1 });
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Unable to set a limit of 0 requests or less');
        }
    });
})

describe('Throttler timing', () => {
})