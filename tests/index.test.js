'use strict';

const Throttler = require('../src/Throttler');
const { test1, test2, test3 } = require('./functions');

jest.setTimeout(60_000);

describe('Throttler FIFO', () => {
    test('100 requests, 10 per 100ms ', async () => {
        const throttler = new Throttler({ms: 100, requests: 10});
        await checkFIFO(100, throttler);
    });

    test('1000 requests, 1 per 10ms ', async () => {
        const throttler = new Throttler({ms: 10, requests: 1});
        await checkFIFO(1000, throttler);
    });

    test('10 requests, 9 per 10ms ', async () => {
        const throttler = new Throttler({ms: 10, requests: 9});
        await checkFIFO(10, throttler);
    });

    test('100 requests, 1 per 0ms ', async () => {
        const throttler = new Throttler({ms: 0, requests: 1});
        await checkFIFO(100, throttler);
    });
});

describe('Throttler corner cases', () => {
    test('100 requests 10 per 0ms ', async () => {
        const throttler = new Throttler({ms: 0, requests: 10});
    });

    test('100 requests 0 per 0ms ', async () => {
        const throttler = new Throttler({ms: 0, requests: 0});
    });

    test('100 requests 10 per -1ms ', async () => {
        const throttler = new Throttler({ms: -1, requests: 10});
    });

    test('100 requests -1 per 10ms ', async () => {
        const throttler = new Throttler({ms: 10, requests: -1});
    });
})

describe('Throttler timing', () => {
})

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