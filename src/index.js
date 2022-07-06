'use strict';

const Throttler = require('./Throttler');

const throttler = new Throttler({ ms: 100, requests: 8 });

async function throttledRequest(number) {
    await throttler.acquire(number);
    console.log(`${number} done`);
    return;
}

async function test() {
    for (let i = 1; i <= 14; i++) {
        setTimeout(() => throttledRequest(i), 10 * i);
    }
}

test();